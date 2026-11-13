# Adding a model

Any open model that runs in [Ollama](https://ollama.com) can be listed. A submission is two JSON files in one pull request: one describing the model, one holding its scores.

## Before you start

You need:

- Python 3.10 or newer
- Ollama, installed and running
- Node 18 or newer (only for checking your files)
- Enough memory for the model; a 7B model at default quantisation needs roughly 8 GB

Fork the repo and clone your fork.

## 1. Describe the model

Create `data/models/<id>.json`. The id is the file name: lowercase letters, digits, dots and hyphens.

```json
{
  "id": "my-model-7b",
  "name": "My Model 7B",
  "developer": "Who released it",
  "params_b": 7,
  "license": "Apache-2.0",
  "license_type": "open-source",
  "ollama": "my-model:7b",
  "hf": "org/my-model-7b",
  "medical_tuned": false
}
```

| Field | Meaning |
|---|---|
| `id` | Must match the file name. |
| `name` | Display name. |
| `developer` | The organisation or person that released the model. |
| `params_b` | Parameter count in billions. |
| `license` | The licence name as the developer states it. |
| `license_type` | `open-source` for OSI-style licences such as Apache-2.0 or MIT. `open-weights` for licences with usage terms, such as the Llama and Gemma licences. |
| `ollama` | The exact tag you pass to `ollama pull`. Include the size tag so the run can be repeated. |
| `hf` | The Hugging Face repo id of the model card, or `null`. |
| `medical_tuned` | `true` if the model was trained or fine-tuned for medicine. |

Closed models and models you can only reach through a paid API are out of scope.

## 2. Run the evals

```bash
pip install -r evals/requirements.txt
```

```bash
ollama pull my-model:7b
```

```bash
python evals/run_eval.py --model my-model-7b --hardware "M2 Pro, 16 GB" --submitted-by your-handle
```

The script downloads the datasets from Hugging Face, asks 100 questions per eval at temperature 0, and writes `data/results/my-model-7b.json`. A 7B model takes very roughly 20 to 60 minutes, depending on your hardware.

Rules for a leaderboard submission:

- **Keep the defaults.** Use 100 samples and seed 42, so every model answers the same questions.
- **Run all seven evals.** The health rating is only shown when all seven are present.
- **Do not edit the results file by hand.** If a score looks wrong, open an issue instead.
- **Say what you ran it on.** `--hardware` is required because speed depends on it.

Useful options:

| Option | What it does |
|---|---|
| `--dry-run` | Uses a fake model and built-in questions to check your setup. Writes nothing. |
| `--evals med-knowledge consistency` | Runs only the evals you name. |
| `--samples 20` | A quick trial run. Do not submit results from it. |
| `--host http://other-machine:11434` | Uses an Ollama server on another machine. |
| `--inspect med-knowledge` | Prints the first dataset row for an eval, raw and as the eval uses it. |

## 3. Check your files

```bash
npm run check
```

This validates every data file and tells you which field is wrong if one is. To see your model on the site:

```bash
npm start
```

## 4. Open a pull request

Commit both files:

```
data/models/my-model-7b.json
data/results/my-model-7b.json
```

In the pull request, say which Ollama version you used. The checks run automatically; a maintainer reviews and merges.

## Listing a model without scores

You can submit only the model file. The model then appears on the board as "not run yet", and anyone can add the results later.

## Re-running a model

Run the script again and commit the new results file. It replaces the old one. Mention in the pull request why you re-ran it, for example a new Ollama release or different hardware.

## If the script fails

| Message | What to do |
|---|---|
| `Could not reach Ollama` | Start Ollama with `ollama serve`, or pass `--host`. |
| `Ollama returned HTTP 404` | Pull the model first with `ollama pull <tag>`, and check the tag in the model file. |
| `The datasets package is missing` | Run `pip install -r evals/requirements.txt`. |
| `No usable rows in ...` or a `KeyError` on a field name | The dataset's layout may have changed. Run `--inspect <eval>` to see a row, then open an issue with the output. |

## Proposing a new eval

Open an issue first. A new eval needs:

- a dataset with a clear open licence that can be downloaded without an access request
- a metric that can be computed automatically, without a judge model
- an entry in `data/evals.json` with an example written for the site, not copied from the dataset
- a loader and scorer in `evals/run_eval.py`, with tests

Security evals are the current priority; see the Security tab on the site for the ones being drafted.
