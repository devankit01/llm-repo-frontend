# Methodology

This page says how scores are produced and what they do not tell you.

## How a run works

For each eval, `evals/run_eval.py`:

1. downloads the dataset split from Hugging Face
2. shuffles the rows with a fixed seed (42) and takes the first 100 usable ones
3. asks the model each question once through Ollama, at temperature 0 and with the same seed
4. scores the replies with fixed rules, with no judge model involved

Every model on the board answers the same questions, as long as contributors keep the default sample count and seed.

## The evals

| Eval | Dataset on Hugging Face | Split | Licence on the dataset card | Metric |
|---|---|---|---|---|
| Medical knowledge | `openlifescienceai/medmcqa` | validation | Apache-2.0 | Accuracy |
| Clinical reasoning | `GBaker/MedQA-USMLE-4-options` | test | CC BY 4.0 | Accuracy |
| Evidence reasoning | `qiaojin/PubMedQA` (`pqa_labeled`) | train | MIT | Accuracy |
| Health claim verification | `ImperialCollegeLondon/health_fact` | test | MIT | Accuracy |
| Disease extraction | `ncbi/ncbi_disease` | test | CC0-1.0 | F1 |
| Structured output reliability | none, uses the extraction replies | | | Valid replies (%) |
| Answer consistency | none, re-asks the medical knowledge questions | | | Consistent answers (%) |
| Speed | none, measured over the whole run | | | Tokens per second |

Licences are as listed on each dataset card when this page was written. Check the card yourself before reusing a dataset. No dataset rows are stored in this repo.

### Scoring rules

- **Multiple choice** (medical knowledge, clinical reasoning): the model is told to answer with one letter. A reply counts only if it clearly names one option, such as `C`, `C.`, `(C)` or `The answer is C`. Anything unclear is wrong.
- **Evidence reasoning:** the first of `yes`, `no` or `maybe` in the reply is taken as the answer.
- **Health claim verification:** the first of `true`, `false`, `mixture` or `unproven` in the reply is taken as the answer. Rows with a missing label are skipped.
- **Disease extraction:** the model returns `{"diseases": [...]}`. Predicted and gold mentions are lower-cased, spacing around punctuation is normalised, and they are compared as sets for each passage. True positives, predictions and gold mentions are pooled over all passages to give precision, recall and F1. A mention must match exactly; a partial match is a miss.
- **Structured output reliability:** a reply passes only if the whole reply parses as JSON with a `diseases` key holding a list of strings. A markdown code fence around it is allowed; any other text is a fail. Replies that fail here can still earn extraction credit if a JSON object can be recovered from them.
- **Answer consistency:** each medical knowledge question is asked a second time with the options in a different order. It is consistent when both replies pick the same underlying option, right or wrong. An unclear reply on either ask is inconsistent.
- **Speed:** total generated tokens divided by total generation time, both as reported by Ollama.

## The health rating

The rating is the unweighted mean of the seven scored evals, each from 0 to 100. It is shown only when all seven have been run. Speed is not part of it.

| Grade | Rating |
|---|---|
| A | 85 and above |
| B | 70 to 84.9 |
| C | 55 to 69.9 |
| D | 40 to 54.9 |
| E | below 40 |

The equal weights and the grade bands are a starting choice, not a finding. They are defined in `data/evals.json` and are open to change by pull request.

## What the scores do not tell you

- **They are not clinical validation.** Exam questions and abstracts are not patient care. Do not use a score to decide whether a model is safe for clinical use.
- **Samples are small.** With 100 questions, an accuracy of 70 has a 95% margin of roughly plus or minus 9 points. Models a few points apart are not meaningfully different.
- **Models may have seen the data.** These are public datasets, and some models were probably trained on them. This inflates scores, most likely for medically tuned models.
- **Strict parsing punishes chatty models.** A model that explains before answering can lose points on format, not knowledge. That is deliberate, since pipelines need predictable output, but it is a choice.
- **Exact-match extraction is harsh.** "diabetes" for "type 2 diabetes" is scored as wrong.
- **Quantisation matters.** Ollama tags are usually quantised. A score is for that tag, not for the full-precision model.
- **Speed is only comparable on the same hardware.** Each result records what it was run on.
- **Results are submitted by contributors** and are not independently re-run before merging.

## Planned

- Security evals: prompt injection resistance, secure code generation, vulnerability knowledge, personal data leakage, and harmful request refusal. Each needs an openly licensed dataset first.
- A safety eval for health. This needs a way to score replies without a judge model, or an agreed open judge.
