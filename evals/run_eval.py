#!/usr/bin/env python3
"""Run the health evals against a model served by Ollama.

Writes data/results/<model-id>.json, which the site reads.

    python evals/run_eval.py --model llama3.1-8b --hardware "M2 Pro, 16 GB" --submitted-by your-handle

See docs/ADDING_A_MODEL.md for the full walkthrough.
"""
from __future__ import annotations

import argparse
import datetime
import json
import random
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LETTERS = "ABCD"
CLAIM_LABELS = ["false", "mixture", "true", "unproven"]  # label order used by the PubHealth dataset
RATED = [
    "med-knowledge",
    "clinical-reasoning",
    "evidence-reasoning",
    "claim-verification",
    "entity-extraction",
    "json-reliability",
    "consistency",
]

# --------------------------------------------------------------------------
# Reading model replies
# --------------------------------------------------------------------------


def parse_letter(text: str) -> str | None:
    """Return the option letter a reply chose, or None if it is not clear."""
    t = text.strip().replace("*", "")
    m = re.fullmatch(r"\(?([A-Da-d])\)?[.:)]?", t)
    if m:
        return m.group(1).upper()
    m = re.match(r"\(?([A-D])\)?[.:)]", t)  # "C. Vitamin C" or "C) ..."
    if m:
        return m.group(1)
    m = re.search(r"(?i:\banswer\b)(?i:\s+is)?\s*[:\-]?\s*\(?([A-D])\)?(?![A-Za-z])", t)
    if m:
        return m.group(1)
    return None


def parse_choice(text: str, choices: list[str]) -> str | None:
    """Return the first of `choices` that appears as a whole word in the reply."""
    m = re.search(r"\b(" + "|".join(map(re.escape, choices)) + r")\b", text.lower())
    return m.group(1) if m else None


def parse_diseases(text: str) -> tuple[list[str], bool]:
    """Read a {"diseases": [...]} reply.

    Returns (mentions, strictly_valid). `strictly_valid` is True only when the
    whole reply is the JSON object, apart from an optional markdown code fence.
    When it is not, we still try to recover a list so extraction can be scored.
    """
    t = text.strip()
    fenced = re.fullmatch(r"```(?:json)?\s*(.*?)\s*```", t, flags=re.S)
    if fenced:
        t = fenced.group(1)

    def read(candidate: str) -> list[str] | None:
        try:
            obj = json.loads(candidate)
        except ValueError:
            return None
        items = obj.get("diseases") if isinstance(obj, dict) else None
        if isinstance(items, list) and all(isinstance(x, str) for x in items):
            return items
        return None

    items = read(t)
    if items is not None:
        return items, True
    m = re.search(r"\{.*\}", text, flags=re.S)
    items = read(m.group(0)) if m else None
    return (items or []), False


# --------------------------------------------------------------------------
# Scoring helpers
# --------------------------------------------------------------------------


def bio_mentions(tokens: list[str], tags: list[int]) -> set[str]:
    """Turn B/I tags (1 = begin, 2 = inside) into a set of lower-cased mentions."""
    mentions, current = set(), []
    for token, tag in zip(tokens, tags):
        if tag == 1:
            if current:
                mentions.add(" ".join(current))
            current = [token]
        elif tag == 2 and current:
            current.append(token)
        else:
            if current:
                mentions.add(" ".join(current))
            current = []
    if current:
        mentions.add(" ".join(current))
    return {normalise(m) for m in mentions}


def normalise(mention: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"\s*([-/(),'])\s*", r"\1", mention.lower())).strip()


def micro_f1(gold: list[set[str]], pred: list[set[str]]) -> float:
    tp = sum(len(g & p) for g, p in zip(gold, pred))
    n_pred = sum(len(p) for p in pred)
    n_gold = sum(len(g) for g in gold)
    if tp == 0 or n_pred == 0 or n_gold == 0:
        return 0.0
    precision, recall = tp / n_pred, tp / n_gold
    return 2 * precision * recall / (precision + recall)


def pct(part: int, whole: int) -> float:
    return round(100 * part / whole, 1) if whole else 0.0


# --------------------------------------------------------------------------
# Datasets: each loader turns raw rows into a small, uniform item
# --------------------------------------------------------------------------


def _mcq_medmcqa(row):
    if row.get("cop") not in (0, 1, 2, 3):
        return None
    return {"question": row["question"], "options": [row["opa"], row["opb"], row["opc"], row["opd"]], "answer": row["cop"]}


def _mcq_medqa(row):
    options = row["options"]
    if isinstance(options, dict):
        options = [options[k] for k in LETTERS if k in options]
    elif options and isinstance(options[0], dict):
        options = [o["value"] for o in options]
    answer = row.get("answer_idx")
    if isinstance(answer, str):
        answer = LETTERS.find(answer.strip().upper())
    if len(options) != 4 or answer not in (0, 1, 2, 3):
        return None
    return {"question": row["question"], "options": list(options), "answer": answer}


def _pubmedqa(row):
    context = row["context"]
    passages = context["contexts"] if isinstance(context, dict) else context
    answer = str(row["final_decision"]).lower()
    if answer not in ("yes", "no", "maybe"):
        return None
    return {"abstract": " ".join(passages), "question": row["question"], "answer": answer}


def _pubhealth(row):
    label = row["label"]
    if isinstance(label, int):
        if not 0 <= label < len(CLAIM_LABELS):
            return None  # the dataset marks missing labels as -1
        label = CLAIM_LABELS[label]
    label = str(label).lower()
    if label not in CLAIM_LABELS or not row.get("claim"):
        return None
    return {"claim": row["claim"], "answer": label}


def _ncbi(row):
    return {"text": " ".join(row["tokens"]), "gold": bio_mentions(row["tokens"], row["ner_tags"])}


DATASETS = {
    "med-knowledge": {"hf": "openlifescienceai/medmcqa", "config": None, "split": "validation", "to_item": _mcq_medmcqa},
    "clinical-reasoning": {"hf": "GBaker/MedQA-USMLE-4-options", "config": None, "split": "test", "to_item": _mcq_medqa},
    "evidence-reasoning": {"hf": "qiaojin/PubMedQA", "config": "pqa_labeled", "split": "train", "to_item": _pubmedqa},
    "claim-verification": {"hf": "ImperialCollegeLondon/health_fact", "config": None, "split": "test", "to_item": _pubhealth},
    "entity-extraction": {"hf": "ncbi/ncbi_disease", "config": None, "split": "test", "to_item": _ncbi},
}

# Tiny built-in items so `--dry-run` can exercise the whole pipeline offline.
FIXTURES = {
    "med-knowledge": [
        {"question": "Which vitamin deficiency causes scurvy?", "options": ["Vitamin C", "Vitamin B12", "Vitamin A", "Vitamin D"], "answer": 0},
        {"question": "Which organ produces insulin?", "options": ["Liver", "Pancreas", "Kidney", "Spleen"], "answer": 1},
    ],
    "clinical-reasoning": [
        {"question": "ST elevation in leads II, III and aVF most often means occlusion of which artery?", "options": ["Right coronary", "Left anterior descending", "Left circumflex", "Left main"], "answer": 0},
    ],
    "evidence-reasoning": [
        {"abstract": "Walking lowered systolic pressure by 6 mmHg versus 1 mmHg in controls (p < 0.001).", "question": "Does brisk walking lower systolic blood pressure?", "answer": "yes"},
    ],
    "claim-verification": [{"claim": "Antibiotics are effective against the common cold.", "answer": "false"}],
    "entity-extraction": [
        {"text": "She uses an inhaler for asthma .", "gold": {"asthma"}},
        {"text": "History of type 2 diabetes mellitus .", "gold": {"type 2 diabetes mellitus"}},
    ],
}


def load_items(eval_id: str, n: int, seed: int, dry_run: bool) -> list[dict]:
    if dry_run:
        return FIXTURES[eval_id]
    try:
        from datasets import load_dataset
    except ImportError:
        sys.exit("The `datasets` package is missing. Run: pip install -r evals/requirements.txt")
    spec = DATASETS[eval_id]
    rows = load_dataset(spec["hf"], spec["config"], split=spec["split"])
    order = list(range(len(rows)))
    random.Random(seed).shuffle(order)
    items = []
    for i in order:
        item = spec["to_item"](rows[i])
        if item is not None:
            items.append(item)
        if len(items) == n:
            break
    if not items:
        sys.exit(f"No usable rows in {spec['hf']}. Run with --inspect {eval_id} to see what a row looks like.")
    return items


# --------------------------------------------------------------------------
# Models
# --------------------------------------------------------------------------


class Ollama:
    def __init__(self, tag: str, host: str, seed: int):
        self.tag, self.host, self.seed = tag, host.rstrip("/"), seed
        self.tokens, self.nanoseconds = 0, 0

    def ask(self, prompt: str) -> str:
        body = json.dumps(
            {"model": self.tag, "prompt": prompt, "stream": False, "options": {"temperature": 0, "seed": self.seed}}
        ).encode()
        request = urllib.request.Request(self.host + "/api/generate", body, {"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(request, timeout=600) as response:
                data = json.load(response)
        except urllib.error.HTTPError as e:
            sys.exit(f"Ollama returned HTTP {e.code} for '{self.tag}'. Have you run `ollama pull {self.tag}`?")
        except urllib.error.URLError as e:
            sys.exit(f"Could not reach Ollama at {self.host} ({e.reason}). Is `ollama serve` running?")
        self.tokens += data.get("eval_count", 0)
        self.nanoseconds += data.get("eval_duration", 0)
        return data.get("response", "")

    def tokens_per_second(self) -> float | None:
        return round(self.tokens / (self.nanoseconds / 1e9), 1) if self.nanoseconds else None


class FakeModel:
    """Stands in for Ollama in --dry-run and the tests. It is not a real model."""

    def ask(self, prompt: str) -> str:
        if '{"diseases"' in prompt:
            return '{"diseases": ["asthma"]}' if "asthma" in prompt else "The disease is diabetes."
        if "yes, no or maybe" in prompt:
            return "Yes."
        if "true, false, mixture or unproven" in prompt:
            return "false"
        m = re.search(r"^([A-D])\. (Vitamin C|Pancreas|Right coronary)$", prompt, flags=re.M)
        return f"{m.group(1)}." if m else "A"

    def tokens_per_second(self) -> None:
        return None


# --------------------------------------------------------------------------
# The evals
# --------------------------------------------------------------------------


def mcq_prompt(question: str, options: list[str]) -> str:
    lines = [f"{LETTERS[i]}. {option}" for i, option in enumerate(options)]
    return f"{question}\n" + "\n".join(lines) + "\n\nAnswer with one letter (A, B, C or D) and nothing else."


def ask_mcq(model, item: dict, order: list[int]) -> int | None:
    """Ask with options in `order`; return the chosen option's original index."""
    reply = model.ask(mcq_prompt(item["question"], [item["options"][i] for i in order]))
    letter = parse_letter(reply)
    return order[LETTERS.index(letter)] if letter else None


def run_mcq(model, items: list[dict]) -> tuple[dict, list[int | None]]:
    chosen = [ask_mcq(model, item, [0, 1, 2, 3]) for item in progress(items)]
    correct = sum(c == item["answer"] for c, item in zip(chosen, items))
    return {"score": pct(correct, len(items)), "n": len(items)}, chosen


def run_consistency(model, items: list[dict], first: list[int | None], seed: int) -> dict:
    rng = random.Random(seed + 1)
    same = 0
    for item, before in zip(progress(items), first):
        order = [0, 1, 2, 3]
        while order == [0, 1, 2, 3]:
            rng.shuffle(order)
        after = ask_mcq(model, item, order)
        same += before is not None and before == after
    return {"score": pct(same, len(items)), "n": len(items)}


def run_choice(model, items: list[dict], make_prompt, choices: list[str]) -> dict:
    correct = sum(parse_choice(model.ask(make_prompt(item)), choices) == item["answer"] for item in progress(items))
    return {"score": pct(correct, len(items)), "n": len(items)}


def evidence_prompt(item: dict) -> str:
    return f"Abstract: {item['abstract']}\n\nQuestion: {item['question']}\n\nAnswer yes, no or maybe, and nothing else."


def claim_prompt(item: dict) -> str:
    return f"Claim: {item['claim']}\n\nIs this claim true, false, mixture or unproven? Answer with one word."


def extraction_prompt(item: dict) -> str:
    return (
        'List every disease mentioned in the text as JSON in the form {"diseases": ["..."]}. '
        "Copy each mention exactly as written. Reply with the JSON only.\n\n"
        f"Text: {item['text']}"
    )


def run_extraction(model, items: list[dict]) -> tuple[dict, dict]:
    predicted, valid = [], 0
    for item in progress(items):
        mentions, ok = parse_diseases(model.ask(extraction_prompt(item)))
        predicted.append({normalise(m) for m in mentions})
        valid += ok
    f1 = micro_f1([item["gold"] for item in items], predicted)
    n = len(items)
    return {"score": round(100 * f1, 1), "n": n}, {"score": pct(valid, n), "n": n}


def progress(items: list):
    total = len(items)
    for i, item in enumerate(items, 1):
        if sys.stderr.isatty():
            print(f"\r    {i}/{total}", end="", file=sys.stderr, flush=True)
        yield item
    if sys.stderr.isatty():
        print("\r" + " " * 20 + "\r", end="", file=sys.stderr)


def run_all(model, wanted: list[str], n: int, seed: int, dry_run: bool = False) -> dict:
    """Run the requested evals and return {eval_id: {"score", "n"}}."""
    scores: dict[str, dict] = {}

    def items(eval_id: str) -> list[dict]:
        print(f"  {eval_id}", file=sys.stderr)
        return load_items(eval_id, n, seed, dry_run)

    if "med-knowledge" in wanted or "consistency" in wanted:
        questions = items("med-knowledge")
        result, chosen = run_mcq(model, questions)
        if "med-knowledge" in wanted:
            scores["med-knowledge"] = result
        if "consistency" in wanted:
            print("  consistency", file=sys.stderr)
            scores["consistency"] = run_consistency(model, questions, chosen, seed)
    if "clinical-reasoning" in wanted:
        scores["clinical-reasoning"], _ = run_mcq(model, items("clinical-reasoning"))
    if "evidence-reasoning" in wanted:
        scores["evidence-reasoning"] = run_choice(model, items("evidence-reasoning"), evidence_prompt, ["yes", "no", "maybe"])
    if "claim-verification" in wanted:
        scores["claim-verification"] = run_choice(model, items("claim-verification"), claim_prompt, CLAIM_LABELS)
    if "entity-extraction" in wanted or "json-reliability" in wanted:
        extraction, reliability = run_extraction(model, items("entity-extraction"))
        if "entity-extraction" in wanted:
            scores["entity-extraction"] = extraction
        if "json-reliability" in wanted:
            scores["json-reliability"] = reliability
    return {k: scores[k] for k in RATED if k in scores}


# --------------------------------------------------------------------------
# Command line
# --------------------------------------------------------------------------


def inspect(eval_id: str) -> None:
    if eval_id not in DATASETS:
        sys.exit(f"--inspect takes one of: {', '.join(DATASETS)}")
    from datasets import load_dataset

    spec = DATASETS[eval_id]
    row = load_dataset(spec["hf"], spec["config"], split=spec["split"])[0]
    print("Raw row:\n", json.dumps(row, indent=2, default=str))
    print("\nAs used by the eval:\n", json.dumps(spec["to_item"](row), indent=2, default=sorted))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--model", help="model id: the file name in data/models/ without .json")
    parser.add_argument("--samples", type=int, default=100, help="questions per eval (default 100)")
    parser.add_argument("--seed", type=int, default=42, help="sampling seed (default 42; keep it for the leaderboard)")
    parser.add_argument("--evals", nargs="+", choices=RATED, default=RATED, help="run only these evals")
    parser.add_argument("--host", default="http://localhost:11434", help="Ollama address")
    parser.add_argument("--hardware", help='what the run was made on, e.g. "M2 Pro, 16 GB"')
    parser.add_argument("--submitted-by", help="your GitHub handle")
    parser.add_argument("--dry-run", action="store_true", help="use a fake model and built-in questions; writes nothing")
    parser.add_argument("--inspect", metavar="EVAL", help="print the first dataset row for an eval and exit")
    args = parser.parse_args()

    if args.inspect:
        return inspect(args.inspect)

    if args.dry_run:
        print("Dry run: fake model, built-in questions. These numbers mean nothing.", file=sys.stderr)
        print(json.dumps(run_all(FakeModel(), args.evals, args.samples, args.seed, dry_run=True), indent=2))
        return

    if not args.model:
        parser.error("--model is required")
    model_file = ROOT / "data" / "models" / f"{args.model}.json"
    if not model_file.exists():
        sys.exit(f"No {model_file.relative_to(ROOT)}. Add the model file first (see docs/ADDING_A_MODEL.md).")
    if not args.hardware or not args.submitted_by:
        parser.error("--hardware and --submitted-by are required so the result can be traced")

    tag = json.loads(model_file.read_text())["ollama"]
    model = Ollama(tag, args.host, args.seed)
    print(f"Running {len(args.evals)} eval(s) on {tag}, {args.samples} samples each", file=sys.stderr)
    scores = run_all(model, args.evals, args.samples, args.seed)

    result = {
        "model": args.model,
        "run_date": datetime.date.today().isoformat(),
        "samples_per_eval": args.samples,
        "seed": args.seed,
        "hardware": args.hardware,
        "submitted_by": args.submitted_by,
        "scores": scores,
    }
    speed = model.tokens_per_second()
    if speed:
        result["speed"] = {"tokens_per_second": speed}

    out = ROOT / "data" / "results" / f"{args.model}.json"
    out.write_text(json.dumps(result, indent=2) + "\n")
    print(f"\nWrote {out.relative_to(ROOT)}", file=sys.stderr)
    for eval_id, s in scores.items():
        print(f"  {eval_id:<20} {s['score']:>5}  (n={s['n']})", file=sys.stderr)
    missing = [e for e in RATED if e not in scores]
    if missing:
        print(f"Not run: {', '.join(missing)}. The health rating needs all seven.", file=sys.stderr)


if __name__ == "__main__":
    main()
