"""Tests for reply parsing and scoring. Run: python -m unittest discover evals"""
import unittest

import run_eval as r


class ParseLetter(unittest.TestCase):
    def test_clear_answers(self):
        for reply, want in [("C", "C"), ("c", "C"), ("(B)", "B"), ("C.", "C"), ("C. Vitamin C", "C"),
                            ("D) Vitamin D", "D"), ("**A**", "A"), ("The answer is B.", "B"), ("Answer: D", "D")]:
            self.assertEqual(r.parse_letter(reply), want, reply)

    def test_unclear_answers(self):
        for reply in ["", "A patient with scurvy needs vitamin C", "I am not sure", "Either B or C could be right"]:
            self.assertIsNone(r.parse_letter(reply), reply)


class ParseChoice(unittest.TestCase):
    def test_first_whole_word(self):
        self.assertEqual(r.parse_choice("Yes.", ["yes", "no", "maybe"]), "yes")
        self.assertEqual(r.parse_choice("It is not clear, so maybe.", ["yes", "no", "maybe"]), "maybe")
        self.assertEqual(r.parse_choice("This claim is FALSE", r.CLAIM_LABELS), "false")
        self.assertIsNone(r.parse_choice("I cannot tell", ["yes", "no", "maybe"]))


class ParseDiseases(unittest.TestCase):
    def test_strict_json(self):
        self.assertEqual(r.parse_diseases('{"diseases": ["asthma"]}'), (["asthma"], True))
        self.assertEqual(r.parse_diseases('```json\n{"diseases": []}\n```'), ([], True))

    def test_recovered_but_not_valid(self):
        self.assertEqual(r.parse_diseases('Sure! {"diseases": ["asthma"]} Hope that helps.'), (["asthma"], False))

    def test_unusable(self):
        self.assertEqual(r.parse_diseases("The diseases are: asthma"), ([], False))
        self.assertEqual(r.parse_diseases('{"diseases": "asthma"}'), ([], False))
        self.assertEqual(r.parse_diseases('["asthma"]'), ([], False))


class Scoring(unittest.TestCase):
    def test_bio_mentions(self):
        tokens = ["History", "of", "type", "2", "diabetes", "and", "Asthma", "."]
        tags = [0, 0, 1, 2, 2, 0, 1, 0]
        self.assertEqual(r.bio_mentions(tokens, tags), {"type 2 diabetes", "asthma"})

    def test_normalise_matches_tokenised_and_plain_text(self):
        self.assertEqual(r.normalise("Community - acquired  Pneumonia"), r.normalise("community-acquired pneumonia"))

    def test_micro_f1(self):
        self.assertEqual(r.micro_f1([{"a", "b"}], [{"a", "b"}]), 1.0)
        self.assertEqual(r.micro_f1([{"a"}], [set()]), 0.0)
        self.assertAlmostEqual(r.micro_f1([{"a", "b"}], [{"a", "c"}]), 0.5)


class Pipeline(unittest.TestCase):
    def test_dry_run_scores_every_eval(self):
        scores = r.run_all(r.FakeModel(), r.RATED, n=5, seed=42, dry_run=True)
        self.assertEqual(list(scores), r.RATED)
        self.assertEqual(scores["med-knowledge"], {"score": 100.0, "n": 2})
        self.assertEqual(scores["consistency"], {"score": 100.0, "n": 2})
        self.assertEqual(scores["evidence-reasoning"]["score"], 100.0)
        self.assertEqual(scores["claim-verification"]["score"], 100.0)
        # The fake model answers one passage with valid JSON and one with prose.
        self.assertEqual(scores["json-reliability"], {"score": 50.0, "n": 2})
        self.assertAlmostEqual(scores["entity-extraction"]["score"], 66.7)

    def test_only_requested_evals_are_returned(self):
        scores = r.run_all(r.FakeModel(), ["consistency"], n=5, seed=42, dry_run=True)
        self.assertEqual(list(scores), ["consistency"])

    def test_dataset_rows_map_to_items(self):
        self.assertEqual(r._mcq_medmcqa({"question": "q", "opa": "1", "opb": "2", "opc": "3", "opd": "4", "cop": 2})["answer"], 2)
        self.assertIsNone(r._mcq_medmcqa({"question": "q", "opa": "1", "opb": "2", "opc": "3", "opd": "4", "cop": -1}))
        row = {"question": "q", "options": {"A": "w", "B": "x", "C": "y", "D": "z"}, "answer_idx": "D"}
        self.assertEqual(r._mcq_medqa(row), {"question": "q", "options": ["w", "x", "y", "z"], "answer": 3})
        self.assertEqual(r._pubhealth({"claim": "c", "label": 2})["answer"], "true")
        self.assertIsNone(r._pubhealth({"claim": "c", "label": -1}))
        self.assertEqual(r._pubmedqa({"question": "q", "context": {"contexts": ["a", "b"]}, "final_decision": "No"})["answer"], "no")


if __name__ == "__main__":
    unittest.main()
