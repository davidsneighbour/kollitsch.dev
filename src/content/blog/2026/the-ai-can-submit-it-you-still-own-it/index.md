---
fmContentType: blog
title: "The AI can submit it. You still own it."
description: "Why I kept one project-specific AI contribution policy, what changed after comparing it with ai-policy.dev, and why responsibility still belongs to a person."
summary: "I compared my AI contribution guidelines with the ready-made policies on ai-policy.dev. The closest option shared the principle but omitted too many practical rules, while the stricter option prohibited things I permit. The result is one revised policy: AI may help, generate, and submit, but a person must understand, verify, own, and defend the contribution."
tags:
  - ai
  - llm
  - open-source
cover:
  src: postimages/postimage-for-ai-contributions-series.jpg
  type: image
  title: Just an AI.
date: 2026-10-20T00:00:00.000+07:00
---

In March I published my [policy and guidelines for AI-based contributions](/blog/2026/ai-in-contributions/). The basic rule was simple: use whatever tools help you, but do not hand your responsibility to them.

Since then I found [ai-policy.dev](https://ai-policy.dev/), a project offering ready-made AI contribution policies. This sounded useful. Shared policies can save every maintainer from writing the same document with slightly different punctuation. There is no prize for independently inventing another licence, code of conduct, or policy if a suitable one already exists.

So I compared its policies with mine. The result was slightly inconvenient: the nearest match was close enough to look promising, but not close enough to replace what I already had.

## The closest match

The [Human Voice policy](https://ai-policy.dev/policies/human-voice/1.0.0) has two memorable rules: never let an LLM speak for you, and never let one think for you. It permits AI-generated code, requires human authorship and full ownership, and rejects unreviewed AI output.

That is very close to what I mean. Generated code is not automatically bad code. Generated prose is not automatically bad prose. The problem starts when somebody submits either without understanding it and expects maintainers to sort out the result.

Human Voice also contains wording worth keeping. Contributions should be in your own voice. You should fully understand and be able to explain them. Clear human communication matters more than polished language. Personal responsibility remains with the contributor.

The policy becomes less useful where those ideas need to turn into reviewable behaviour. It does not say much about checking assumptions against the repository, protecting existing tests, verifying sources, keeping commits coherent, checking provenance, handling sensitive information, or staying involved during review. Its published metadata mentions testing and full ownership, but the policy itself leaves much of that implicit.

An implicit principle is useful until somebody needs to apply it.

## The stricter match that was not a match

The [Human Responsible policy](https://ai-policy.dev/policies/human-responsible/1.0.0) is more explicit, but it solves a different problem. It rejects automated accounts, bots, and agents. It forbids AI disclosure notes. It permits maintainers to close a contribution based on suspicion alone, without explaining or debating the decision. It also rejects reports or fixes for problems the contributor has not reproduced personally.

Those rules are coherent, but they are not mine.

I am fine with an AI agent preparing or submitting a contribution. I care whether an identifiable person takes responsibility for it. The route from keyboard to pull request is secondary. Understanding, verification, and accountability are not.

The stricter policy would therefore trade a useful distinction for a blanket restriction. It would regulate the tool when I want to regulate the contribution and the person standing behind it.

## Why I did not add an addendum

The obvious compromise was to adopt Human Voice and place my additional requirements underneath it. That would avoid some duplication, but contributors would then need to read an upstream policy, understand which version applies, and continue into a local addendum containing many of the rules that affect actual review.

A policy that needs another policy to explain what it means is not much of a shortcut.

The better option was to keep one local document, borrow the useful language, remove weak or contradictory wording, and add the missing boundaries. This is not reinvention for its own sake. It is consolidation: one policy, one place to read it, and one accountable interpretation.

## What changed

The original said that every contribution must be "authored, understood, and defended" by the person submitting it. "Authored" was the wrong word in a policy that explicitly permits generated work. The important requirements are that a person understands, verifies, owns, and can defend the contribution.

The old heading "No AI-only communication" had a similar problem. Maintainers cannot reliably determine which words began inside a model, a grammar checker, a translation system, or a contributor's head. The observable requirement is that the text communicates the contributor's own understanding and judgement. "Speak for yourself" says that more clearly.

Translations no longer receive a special rule. A translated string is contribution material like code, documentation, configuration, or data. It must be checked for correctness and intended meaning. The label attached to the tool does not change that responsibility.

The revised policy also covers subjects that the original missed:

* provenance and the right to contribute generated material
* secrets, personal data, private repository content, and security reports sent to external services
* automated and agent-submitted contributions
* relevant automated checks and manual verification where applicable
* disclosure as review context rather than confession

Routine disclosure is not required. Naming a model neither proves quality nor excuses bad work. Maintainers may still ask how something was produced or verified when the answer matters to the review.

The final principle is shorter than the route used to reach it:

> The AI can help. It can generate the change. It can even submit the change. It cannot be responsible for the change. A person must do that.

## The revised policy

The following is the policy I will use in my projects.

---

> ### AI guidelines
>
> This policy is informed by the AI guidelines introduced in [Node.js PR #62105](https://github.com/nodejs/node/pull/62105) and the [Human Voice policy, version 1.0.0](https://ai-policy.dev/policies/human-voice/1.0.0). It is a project-specific policy and applies to this repository.
>
> #### Core principle
>
> **Contributions are owned by people, not tools.**
>
> AI may be used for any part of the contribution workflow, including exploring the project, producing code or other material, and submitting contributions. However, responsibility cannot be delegated.
>
> When you submit or assume responsibility for a contribution, it becomes your work and your responsibility. An AI tool is not a reviewer, an authoritative source, or an excuse for an incorrect change.
>
> Every contribution must be understood, verified, and owned by the person responsible for it. That person must be able to explain what changed, how it works, and why it improves the project.
>
> The answer to "Why is this an improvement?" must never be "I'm not sure, the AI did it."
>
> A contribution that the responsible person does not understand or cannot defend may be closed without further review.
>
> #### Using AI for contributions
>
> AI may assist, but it must not replace judgement, understanding, or ownership.
>
> When using AI as part of a contribution:
>
> * **Understand the project first.** Do not skip familiarisation with the relevant parts of the project. Treat generated analysis as a hypothesis, not a fact, and verify it against the actual repository.
> * **Own everything you submit.** You are responsible for every material part of the contribution, regardless of how it was produced. Do not include something that you do not understand.
> * **Do not submit blind generation.** Review generated code, tests, documentation, configuration, data, translations, images, and other material critically. Remove anything unnecessary, incorrect, or unsupported.
> * **Explain the improvement.** You must be able to explain the problem, the reasoning behind the proposed solution, and why the result is appropriate for this project.
> * **Keep logical commits.** Structure commits clearly and coherently. Do not place unrelated generated changes into one commit. Follow the repository's commit-message and contribution guidelines.
> * **Test thoroughly.** Run the relevant automated checks and personally verify the affected behaviour where manual verification is applicable. Do not assume that an output is correct because a tool produced it.
> * **Protect existing tests.** Do not remove or alter tests without understanding what they verify and why the change is necessary. Check that generated tests validate the intended behaviour rather than merely reproduce the current implementation.
> * **Verify claims and sources.** Check factual claims against the repository or relevant authoritative sources. Confirm that links exist and support the statements for which they are cited. An AI response is not an authoritative source.
> * **Check provenance and licensing.** Do not submit generated material if you cannot reasonably establish that you have the right to contribute it. Investigate output that appears copied, unusually specific, or inconsistent with the surrounding work.
> * **Protect sensitive information.** Do not provide secrets, personal data, private repository content, security reports, or other confidential information to an external tool unless the project and the applicable service explicitly permit it.
> * **Stay accountable.** If you take responsibility for a contribution, you are expected to follow through. Respond to feedback using your own judgement, iterate as necessary, and either complete or close the contribution yourself.
>
> Automated and agent-submitted contributions are permitted. Each such contribution must have an identifiable person who assumes responsibility for it and satisfies this policy. Automation does not transfer responsibility from that person to the tool.
>
> #### Speak for yourself
>
> Communication must represent your own understanding and judgement.
>
> AI may assist with drafting, editing, spelling, grammar, or translation. However, comments, issues, pull request descriptions, commit messages, and review replies must communicate what you understand and intend to say.
>
> When using AI for communication:
>
> * **Use your own voice.** Check, edit, and adopt the text as your own before submitting it. Clear and imperfect human communication is preferable to polished text that does not reflect the contributor's understanding.
> * **Do not outsource your judgement.** Do not ask a tool to decide what you think or to conduct a discussion on your behalf.
> * **Be concise and accurate.** Generated summaries are often verbose, repetitive, or incorrect. Keep only what is necessary and verified.
> * **Complete templates properly.** Provide the information requested by issue and pull request templates. A generated summary is not a substitute for actual evidence and reasoning.
> * **Respond to review yourself.** Base responses on your own understanding and judgement. Do not quote an AI as an authority or use it to avoid answering a reviewer's question.
>
> #### Disclosure
>
> Routine disclosure of AI assistance is not required. The tools used do not reduce or transfer the contributor's responsibility.
>
> Maintainers may ask how a result was produced, checked, or verified when that information is relevant to reviewing the contribution. The responsible contributor must answer such questions accurately.
>
> Disclosure does not excuse a failure to understand, test, verify, or take responsibility for a contribution.
>
> #### Final note
>
> AI can help explore options, produce material, and reduce friction. It does not replace responsibility, judgement, or human communication.
>
> If your name is on a contribution, or you have assumed responsibility for it, you must understand it, verify it, and be prepared to defend it.

---

That is longer than "use common sense", because common sense tends to become uncommon precisely when a pull request needs review. It is still one policy, though. More importantly, it puts the failure in the correct place.

The knife did not ruin the fish. The chef did.
