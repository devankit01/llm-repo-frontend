# LLM Repo: Health & Security Evals

An open leaderboard of open-source language models, scored on healthcare tasks using openly licensed datasets. Security evals are planned.

Every score on the site comes from a results file in this repo, produced by a script anyone can run on their own machine with [Ollama](https://ollama.com). To add a model, you open a pull request.

> **Not medical advice, and not clinical validation.** A high score here does not make a model safe to use in patient care.

## What is measured

Seven scored health evals, plus speed:

| Eval | What it measures | Data | Metric |
|---|---|---|---|
| Medical knowledge | Recall of medical facts, as multiple-choice questions | MedMCQA | Accuracy |
| Clinical reasoning | Patient vignette to diagnosis or next step | MedQA (USMLE, 4 options) | Accuracy |
| Evidence reasoning | Does a research abstract support yes, no or maybe | PubMedQA (expert-labelled) | Accuracy |
| Health claim verification | Is a public health claim true, false, mixture or unproven | PubHealth | Accuracy |
| Disease extraction | Finding every disease mention in a passage | NCBI Disease | F1 |
| Structured output reliability | How often the reply is valid JSON in the requested shape | Extraction replies | Valid replies (%) |
| Answer consistency | Same answer when the options are shuffled | MedMCQA questions | Consistent answers (%) |
| Speed (not in the rating) | Generated tokens per second | All prompts | Tokens per second |

The **health rating** is the unweighted mean of the seven scored evals. [docs/METHODOLOGY.md](docs/METHODOLOGY.md) has the details and the known limits.

## Add a model

Short version:

```bash
# 1. Describe the model
cp data/models/mistral-7b.json data/models/my-model-7b.json   # then edit it

# 2. Run the evals
pip install -r evals/requirements.txt
ollama pull my-model:7b
python evals/run_eval.py --model my-model-7b --hardware "M2 Pro, 16 GB" --submitted-by your-handle

# 3. Check, then open a pull request
npm run check
```

The full walkthrough is in [docs/ADDING_A_MODEL.md](docs/ADDING_A_MODEL.md).

## Run the site locally

You need Node 18 or newer. There are no dependencies to install.

```bash
npm start
```

This validates the data, writes the site to `build/`, and serves it at http://localhost:4173.

## How the repo is laid out

```
data/evals.json        the eval definitions and the examples shown on the site
data/models/*.json     one file per model
data/results/*.json    one file per model with scores, written by the eval runner
evals/run_eval.py      the eval runner
site/                  the frontend: plain HTML, CSS and JavaScript
scripts/build.mjs      validates the data and writes build/
docs/                  guides
```

## Status

The eval runner's parsing and scoring are covered by tests, and `--dry-run` exercises the whole pipeline offline. No model has been scored yet, so the leaderboard starts empty. The first real run against the live datasets will also confirm the dataset field mappings in `evals/run_eval.py`; `--inspect` is there to help if a dataset's layout has changed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Model submissions, new evals with openly licensed data, and fixes are all welcome.

## Licence

Code and site: [MIT](LICENSE). The datasets keep their own licences and are downloaded at run time; none of their rows are stored in this repo.
