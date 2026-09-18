# Official course map - learn-model-risk-with-phoebe

Built 2026-09-11. Hub bucket `ds` (Data Science), difficulty tier 3. Flips the hub's existing
`planned` entry live and changes its `audience` from `leader` to `both`. Two tracks:
leader 6 x 45 min, practitioner 10 x 45 min.

Running artifact: a **validation report you could defend to a supervisor** on one model - the
consumer-credit scorecard at **Brackwater**, a fictional lender. 4,000 development applications
and 2,000 from a later vintage, generated from a written model, so the validator's findings can be
checked against what is actually true.

---

## The seam - read this before writing a single page

**This course was re-scoped on 2026-09-11.** The hub's original blurb promised NIST AI RMF, EU AI
Act risk tiers, model cards, validation, fairness audits and sign-off. Three of those are already
taught in full by `learn-ai-governance-with-phoebe`, which is live. Rather than ship the estate's
first duplicate, this course teaches the thing nobody owns: **the validation function itself**.
`SR 11-7`, `effective challenge`, `conceptual soundness`, `challenger model` and `out-of-time`
returned **zero hits across the entire estate** before this build.

| Sibling | What it already owns, live | What this course does instead |
|---|---|---|
| `learn-ai-governance-with-phoebe` (gov, d3) | The EU AI Act end to end (a2 risk tiers, b1 classify, b2 high-risk obligations, b3 transparency, b4 GPAI, b7 FRIA and CE marking, a4 penalties); **b5 the whole NIST AI RMF**; **b6 ISO/IEC 42001**; MAS and FEAT across all 14 pages; IMDA's Model AI Governance Framework | **No framework is taught here.** The AI Act, the RMF, ISO 42001, MAS and FEAT are named once, in a clause that hands them to that course. This course teaches what a validator does to a model, which no framework specifies |
| `learn-model-evaluation-with-phoebe` (ds, d3) | Every metric: confusion matrix, thresholds, curves, calibration, cost matrices, LLM graders, operational metrics, drift detection, the eval scorecard | **No metric is defined here.** AUC, calibration and base rates appear only as evidence a validator weighs. Where a page needs "what is AUC", it points there |
| `learn-ml-strategy-with-phoebe` (ds, d3) | Error analysis, ceilings, bias/variance, what to fix next | Different question. That course asks how to make a model better; this one asks whether it should be allowed to run, and who says so |
| `learn-experimentation` / `learn-causal-inference` (ds) | Estimators, identification, the causal model | Untouched. Where a validator would ask "is this claim causal", the page names the course and stops |
| `learn-ai-finance-with-phoebe` (aiap) | Mentions model inventory and leakage in passing inside two governance sessions | Neither is taught there. This course owns both |

**What this course uniquely owns:** the SR 26-2 framework and what changed from SR 11-7;
materiality and model tiering; the model inventory; conceptual soundness review; target leakage as
a validation finding; replication; benchmarking and challenger models; outcomes analysis and
backtesting; out-of-time testing and population stability; ongoing monitoring thresholds; effective
challenge as an organisational design problem; findings, severity and conditions; validating
vendor and third-party models; and the sign-off decision, including the refusal.

---

## Verified facts (with their source tier)

**Tier 1, primary regulatory text, extracted from the PDFs themselves (not from summaries).**

- **SR 26-2, "Revised Guidance on Model Risk Management", dated 17 April 2026**, issued jointly by
  the Federal Reserve, the OCC and the FDIC. It **supersedes and replaces SR 11-7** (4 April 2011)
  and SR 21-8 (the 2021 BSA/AML model risk statement). Applicability: "expected to be most
  relevant to banking organizations with over $30 billion in total assets".
  Source: `federalreserve.gov/supervisionreg/srletters/SR2602.pdf`.
  **This matters: SR 11-7 is the document the whole industry quotes, and it was replaced five
  months ago. Any page quoting SR 11-7 as current guidance is wrong.**
- **Model, SR 26-2:** "Models are simplified representations of real-world relationships among
  observed characteristics, values, and events".
- **Model risk, SR 26-2:** "the potential for adverse financial consequences associated with
  models, which may result from decisions made based on model output". It is influenced by four
  things: **inherent risk, exposure, purpose, and use**.
- **Materiality, SR 26-2:** "Model purpose, together with model exposure, determines model
  materiality." Overall model risk = inherent risk in the context of materiality.
- **A sound model can still be high risk:** "even a fundamentally sound model producing accurate
  outputs consistent with the model's design objective can exhibit high model risk if it is
  misapplied or misused."
- **Aggregate risk, SR 26-2:** reflects "interactions and dependencies among models; reliance on
  common assumptions, data, or methodologies".
- **Effective challenge, SR 26-2:** "the critical analysis conducted by objective experts who
  evaluate model risk and effect appropriate changes throughout the model lifecycle". It requires
  three things: **appropriate expertise**, **sufficient independence** to maintain objectivity,
  and **organizational standing and influence to effect any change**.
- **The three components of validation, SR 26-2**, in its order: **Conceptual Soundness**,
  **Outcomes Analysis**, **Ongoing Model Monitoring**.
- **Conceptual soundness, SR 26-2:** "Validating conceptual soundness involves assessing and
  documenting model design (including key modeling choices, assumptions, qualitative judgments,
  and data selection), construction, and developmental testing." Sound practice "subjects modeling
  aspects to critical analysis by evaluating both the quality and extent of developmental
  evidence". For some models, evaluating theoretical construction matters; for others,
  "interpretability measures or benchmarking to other models" are more practical.
- **Outcomes analysis, SR 26-2:** it "compares model outputs to corresponding real-world outcomes
  to assess model performance relative to model objectives and business use". It can take many
  forms, including testing during development, ongoing monitoring reports, or standalone
  activities "such as back-testing or outlier analysis". Where a model "relies substantially on
  expert judgment, quantitative outcomes analysis helps to evaluate the quality of that judgment".
- **Ongoing monitoring, SR 26-2:** "an evaluation of the extent to which a model is performing as
  expected given potential changes in products, exposures, activities, clients, data relevance, or
  market conditions." A model no longer performing as expected may warrant overlays, adjustment or
  redevelopment.
- **The ongoing monitoring plan, SR 26-2:** "An effective ongoing monitoring plan may also
  include regularly assessing any model limitations at the development stage and over time, along
  with procedures for responding to any issues that may occur, before and after a model is
  approved for use." And: "The frequency and scope of monitoring reports will depend on the nature
  of the model, the availability of new data or modeling approaches, and model materiality."
- **The limits of validation, SR 26-2:** "Even with sound modeling practices and rigorous
  validation, material model risk can remain." Users of model output benefit from "understanding
  and communicating limitations, monitoring performance, periodically reviewing relevance, and
  supplementing model output with complementary analysis and information."
- **What validation is for, SR 26-2:** it "evaluates whether models perform as expected and
  includes an assessment of a model's reliability and its limitations"; sound validation
  "identifies model limitations and errors and clarifies appropriate use and whether corrective
  actions may be warranted". Nature and rigour "generally align with the model's approach, use,
  and materiality".
- **Benchmarking** is named in SR 26-2 only inside conceptual soundness, as one practical way to
  assess a model ("benchmarking to other models"). It is NOT a fourth component. Any page framing
  it as one is making an editorial claim, and should say so rather than attribute it.
- **Validation timing:** "Validation generally occurs prior to a model's first use", but an urgent
  business need may mean using it first, in which case sound practice is to inform stakeholders of
  the limitations and place controls on use (limits, closer monitoring).
- **Model development, SR 26-2:** an effective process "generally begins with a clear statement
  of purpose to maximize the likelihood that model development is aligned with the intended use".
  Development "is not purely a technical exercise": the "developer's judgment influences the
  model's conceptual design and soundness, inputs, assumptions, and methodology, all of which
  affect a model's inherent risk".
- **Model testing, SR 26-2:** "a core component of model development that evaluates whether a
  model performs as intended. Testing may include a range of activities, from out-of-sample and
  out-of-time testing, to a comparison of alternative assumptions and methodologies, to a critical
  assessment of data quality, relevance, and inputs." Rigour is "commensurate with model
  complexity and materiality", and for less material models "testing may be more limited in scope".
- **Model use, SR 26-2:** "Effective model use depends on a clear understanding of a model's
  limitations." "Using a model beyond its intended purpose introduces additional uncertainty and
  risk", and extending use calls for "considering additional analysis of the new usage and its
  limitations, along with review of existing controls to manage the resulting risk".
- **Model inventory, SR 26-2:** "It is common industry practice for banking organizations to
  maintain a comprehensive set of information for models under development or in use". Detail may
  vary with complexity and overall usage, and an effective inventory "includes sufficient
  information to understand model risks, so as to support effective model risk management at the
  individual and aggregate levels". **That last clause is what decides the columns**: an aggregate
  view is a cross-row question, and it can only be asked about fields somebody recorded.
- **Documentation, SR 26-2:** it helps "maximize the likelihood of continuity of operations,
  including supporting the tracking of recommendations, responses, and exceptions", and can be
  used "to more effectively help manage any model remediation efforts".
- **Internal audit, SR 26-2:** "internal audit would generally not duplicate model risk management
  activities such as model development or validation. Instead, internal audit's role is generally
  to evaluate whether the model risk management practices are rigorous and effective".
- **Vendor models, SR 26-2:** the principles still apply even when code, data or methodology are
  proprietary; sound practice covers the vendor model's conceptual soundness, design, development
  data and performance, plus ongoing monitoring and outcomes analysis, and customisations must be
  documented, justified and evaluated.
- **Generative and agentic AI are OUT OF SCOPE of SR 26-2** (footnote 3): they are "novel and
  rapidly evolving... not within the scope of this guidance". The principles do apply to
  "traditional statistical and quantitative models and non-generative, non-agentic AI models".
  This is the sharpest available seam line: the model-risk regime deliberately stops where
  `learn-ai-governance` begins.

**What changed from SR 11-7 (2011) to SR 26-2 (2026).** Both texts were extracted and compared
directly; this table is the spine of leader session 1 and nothing else in the estate has it.

| | SR 11-7 (2011) | SR 26-2 (2026) |
|---|---|---|
| Issuers | Federal Reserve + OCC | Federal Reserve + OCC + **FDIC** |
| Definition of model | "a quantitative method, system, or approach that applies statistical, economic, financial, or mathematical theories, techniques, and assumptions to process input data into quantitative estimates" | "simplified representations of real-world relationships among observed characteristics, values, and events" - shorter, less mechanical |
| Model risk | "potential for adverse consequences from decisions based on incorrect or misused model outputs"; **two primary causes** (fundamental errors; incorrect or inappropriate use) | "potential for adverse **financial** consequences"; decomposed into **inherent risk, exposure, purpose, use** |
| How risk scales | complexity, uncertainty about inputs, extent of use, potential impact | **inherent risk in the context of materiality**, where materiality = purpose + exposure |
| Effective challenge rests on | "**incentives, competence, and influence**" | "**expertise, sufficient independence, organizational standing and influence**" - incentives out, independence named |
| Independence | "Validation involves a degree of independence from model development and use. Generally, validation is done by staff who are not responsible for model development or use" | "The quality of validation process depends on the rigor and effectiveness of the review **rather than on organizational structure**" - a real softening, and the most contestable change in the document |
| Validation components | conceptual soundness, **ongoing monitoring**, **outcomes analysis** | conceptual soundness, **outcomes analysis**, **ongoing monitoring** (reordered) |
| AI | not addressed | generative and agentic AI **explicitly excluded**; non-generative AI included |
| Applicability | all supervised banking organisations, scaled to size | "most relevant to" organisations **over $30 billion** in assets |
| Also replaced | - | **SR 21-8** (BSA/AML model risk, 2021) |

**Teach the independence change as a disagreement, not a settled point.** SR 11-7 named
organisational separation; SR 26-2 says rigor matters more than structure. A validator who reports
to the head of modelling can be rigorous, and a separate team can rubber-stamp. Both readings are
defensible and the page should say so rather than pick a winner.

**Tier 2, named for orientation, never taught as a recipe.**

- **Model cards** (Mitchell et al., 2019) as a documentation format: intended use, out-of-scope
  use, training data, evaluation data, and performance **disaggregated by group**. Named in p9 as
  one way to satisfy SR 26-2's documentation expectation; the standard itself is not taught.
- **MAS FEAT**, the Veritas Initiative, the MAS AI Risk Management guidelines and Project
  MindForge: named once and handed to `learn-ai-governance`, which owns all Singapore AI
  governance material.

---

## Frozen canon - the Brackwater validation bench

Computed in node from `assets/mr-live.js` before any page quoted a number. Every figure below is a
real logistic regression and a real rank-based AUC on generated data, not a stated result. Any
page citing these must match exactly.

**The data.** Two vintages from one written model, fixed seeds. **Development: 4,000 applications**
(bad rate **0.292**). **Out of time: 2,000 applications** from the following year (bad rate
**0.324**). Between the vintages three things move: the thin-file share of the book, the strength
of the utilisation relationship, and an economy-wide shock nobody has a column for.

**The champion** is an 11-feature logistic scorecard. The model owner submits it with a
development AUC of **0.863**.

| What the validator runs | AUC | Reading |
|---|---|---|
| Champion as submitted, development | **0.863** | the number in the model document |
| `collections` **alone**, development | **0.748** | one field carries almost all of it |
| The four pure-noise features alone, development | 0.520 | the rest of the feature list is decoration |
| Champion refit without `collections`, development | **0.772** | the leak was worth **+0.091** |
| Champion refit without `collections`, out of time | **0.682** | a further **-0.090** |
| Three-feature challenger, development | 0.763 | |
| Three-feature challenger, out of time | **0.676** | |

**The finding that decides the report: the champion's real edge over a three-feature challenger is
0.006 AUC out of time.** Eleven features, a leak, and a validation cycle, for six thousandths.

**Why `collections` is a leak.** Collections contacts are logged **after** the outcome window
opens, so the field is a consequence of default, not a predictor of it. It is noisy (58 percent of
defaulters get a contact, 11 percent of non-defaulters), which is exactly why nobody caught it: it
does not look like a copy of the target. Its fitted coefficient is **2.214**, second only to
utilisation's 2.612.

**Outcomes analysis: the overall calibration is nearly perfect and every band is wrong.** Scored
out of time, the no-leak champion predicts a mean default rate of **0.330** against an actual
**0.324** - a gap of **-0.006**. By quintile of predicted risk:

| Quintile | Predicted | Actual | Gap |
|---|---|---|---|
| 1 (safest) | 0.086 | 0.147 | **+0.061** |
| 2 | 0.169 | 0.237 | **+0.068** |
| 3 | 0.270 | 0.305 | +0.035 |
| 4 | 0.432 | 0.378 | -0.054 |
| 5 (riskiest) | 0.694 | 0.552 | **-0.142** |

It under-predicts the safest borrowers and over-predicts the riskiest. **A single calibration
number would have passed this model.**

**Population stability.** Thin-file share **19.0 percent to 34.0 percent**; prior-delinquency
34.0 to 36.8 percent; mean utilisation 0.448 to 0.464. The book moved toward exactly the borrowers
the model knows least about.

**What it costs the business.** With the cutoff set on the development sample at the 75th
percentile of score: development approves **75.0 percent** with **19.5 percent** bad among
approved; out of time the same cutoff approves **69.3 percent** with **24.7 percent** bad among
approved. The challenger at its own equivalent cutoff approves **72.2 percent** with **25.3
percent** bad. **The champion buys 0.6 points of bad rate and gives up 2.9 points of volume.**

**A claim NOT to make.** Do not write that the champion is worthless or that the challenger is
better. On this data they are within noise of each other on discrimination, and each wins on a
different business axis. The defensible finding is that **the evidence submitted did not support
the claim made**, which is a statement about the model document, not about the model.

---

## Coverage per session

`✓` = taught to working depth. `◐` = named and handed to the session or course that owns it.

### Leader track

| Session | Covers | Depth |
|---|---|---|
| a1 What model risk actually is | SR 26-2's definition; inherent risk, exposure, purpose, use; materiality; a sound model can still be high risk; the 0.863-to-0.682 drop as the cost | ✓ |
| a2 Effective challenge | The three requirements; why challenge fails in practice; the independence change from 2011 and both sides of it | ✓ |
| a3 What a validator is checking | The three components in plain terms; the leak, the calibration bands, the challenger, without any metric being defined | ✓ |
| a4 Materiality and the inventory | Tiering by exposure and purpose; what to do with immaterial models; aggregate risk and common assumptions | ✓ |
| a5 Reading a validation report | Findings, severity, conditions; what "approve with conditions" buys; when to refuse | ✓ |
| a6 Signing it off | The questions to ask; what to require in writing; vendor models; who owns what, including internal audit's actual role | ✓ |
| The EU AI Act, NIST AI RMF, ISO 42001, MAS, FEAT | Named once, handed to `learn-ai-governance` | ◐ |

### Practitioner track

| Session | Covers | Depth |
|---|---|---|
| p1 The inventory and the tiering call | What an inventory holds; scoring a model's materiality; what tier buys you | ✓ |
| p2 Conceptual soundness | Reading the design before the numbers: purpose statement, assumptions, data selection, developmental evidence | ✓ |
| p3 The leak hunt | Post-outcome features; why a noisy leak survives review; `collections` at 0.748 alone | ✓ |
| p4 Replication | Reproducing the reported number; what a gap between document and re-run means | ✓ |
| p5 Benchmarking and challengers | Building the three-feature challenger; the 0.006 edge; when simpler wins | ✓ |
| p6 Outcomes analysis and backtesting | Predicted against actual by band; the perfect overall number hiding ±0.14 | ✓ |
| p7 Out-of-time and population stability | The later vintage; the 19-to-34 percent thin-file shift; a relationship that moved | ✓ |
| p8 Ongoing monitoring | Thresholds, triggers, what actually fires and who reads it | ✓ |
| p9 Writing findings | Severity, conditions, remediation, documentation; model cards named as one format | ✓ |
| p10 The validation bench | The full workflow, scored against what is true by construction | ✓ |
| Defining AUC, calibration, thresholds | Pointed at `learn-model-evaluation` | ◐ |

## Not covered, by design

- **Every governance framework.** The EU AI Act, NIST AI RMF, ISO/IEC 42001, MAS FEAT and the
  IMDA framework all live in `learn-ai-governance`, and this course points there by name.
- **Generative and agentic AI.** SR 26-2 excludes them explicitly; so does this course.
- **Metric definitions.** `learn-model-evaluation` owns them.
- **Fairness auditing as a discipline.** Disaggregated performance appears as a validation test
  and as a model-card field; the fairness literature and its impossibility results are not taught.
- **How to build a better scorecard.** `learn-ml-strategy` and the modelling courses own that.

## Re-verify before delivery

SR 26-2 is five months old and is the current text; SR 11-7 is superseded and must never be quoted
as current. The MAS AI Risk Management guidelines were at consultation stage as of early 2026 and
their final status was deliberately not relied on here - if a page ever needs them, check whether
they have been promulgated first. The bench is deterministic from fixed seeds: if `mr-live.js` is
edited, re-run the node harness and update every number in this file before touching a page.
