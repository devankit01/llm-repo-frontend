# Contributing

Thanks for helping. There are three common ways to contribute.

## Add or re-run a model

Follow [docs/ADDING_A_MODEL.md](docs/ADDING_A_MODEL.md). A submission is one model file and one results file.

## Propose an eval

Open an issue before writing code. An eval needs an openly licensed dataset that downloads without an access request, and a metric that can be computed without a judge model. The checklist is at the end of [docs/ADDING_A_MODEL.md](docs/ADDING_A_MODEL.md).

## Fix or improve something

Small fixes can go straight to a pull request. For larger changes to scoring or to the rating, open an issue first, because they change every model's numbers.

## Before you open a pull request

```bash
npm run check
```

```bash
python -m unittest discover evals
```

Both run automatically on every pull request.

## Ground rules

- **Open models and open data only.** No closed models, and no datasets that need a signed agreement.
- **No dataset rows in the repo.** Datasets are downloaded at run time. Examples on the site are written for the site.
- **No hand-edited scores.** Results files come from `evals/run_eval.py`.
- **No patient data, ever.** Do not use real clinical text in issues, examples or tests.
- **Changes to scoring need tests.** Add a case to `evals/test_run_eval.py`.

## Code style

The site is plain HTML, CSS and JavaScript with no build tools, and the scripts use only the Node and Python standard libraries (plus `datasets` for downloads). Please keep it that way, so a contributor needs nothing beyond Node, Python and Ollama.
