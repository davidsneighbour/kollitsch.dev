---
title: "Hedging: Why we do it and how to be more direct"
description: "Hedging is a common writing habit that can weaken your message. Learn why we hedge, when it's appropriate, and how to write with more confidence."
date: 2025-10-27T00:55:34.592Z
draft: true
tags: [ technical-writing, communication, style-guide]
cover:
  src: "tycho-atsma-oDiU9WRz5CI-unsplash.jpg"
  title: "Photo by [Tycho Atsma](https://unsplash.com/@tychoa) on [Unsplash](https://unsplash.com/photos/man-walking-near-tall-trees-oDiU9WRz5CI)"
  type: image
---

<!-- vale DNB.Hedging = NO -->
<!-- vale DNB.Agentic = NO -->

*Hi, my name is Patrick Kollitsch and I am a recovering hedger.*

For years, I peppered my communication and documentation with phrases like "I think maybe we should…" or "It seems like this might…" instead of just getting to the point. Many of us learn **late in our writing lives** that this habit - known as **hedging** - can weaken our message. In this post, I will explore what hedging is with a couple of examples, why we tend to hedge, when it *does* make sense to hedge, and how to write more confidently when it doesn't. Along the way, we'll reference a few style guides and even a nifty tool (the [Vale linter](https://vale.sh)) that can help us break the habit.

## What is "Hedging" in writing?

Hedging is using cautious or non-committal language - little qualifiers that undermine the certainty or directness of a statement. In plainer terms, it's when we soften our statements by saying things like "I think," "maybe," "probably," or "it seems" instead of just stating the idea. By hedging, we leave ourselves an out, signaling that we're not *100%* sure or that we don't want to sound too bold.

For example, consider the difference:

* **Hedged:** "I feel like the server is probably down."  
* **Direct:** "The server is down."

The hedged version uses "feel like" and "probably," which make the statement less definitive. By contrast, a direct version would drop those qualifiers: "Let's do X," "Please do Y."

Common hedging words and phrases include:

* "Maybe" / "Perhaps"  
* "Probably" / "It's likely that…"  
* "I think…" / "I feel like…"  
* "Could" / "Might"  
* "It seems…" / "It appears…"  
* "In my opinion…" (when overused)  
* "Somewhat" / "A little bit" / "Kind of"

If you scan your writing, you'll likely find these sprinkled around whenever you're not totally confident in a statement (or trying not to sound too assertive). I was shocked when I first ran a linter on my drafts and saw just how often words like "just", "actually", and "I think" popped up. 😅

## Why Do We Hedge?

So, why do smart writers like us add these fuzzy qualifiers? It turns out there are **several reasons we hedge**, and not all are bad:

* **Politeness & Softening:** Hedging can make a suggestion or request sound more polite. Saying "I **think** we should review these numbers" may feel less bossy than "We should review these numbers." Especially when offering criticism or asking an uncomfortable question, **hedging softens the blow**. We might hedge to avoid sounding too direct or arrogant.

* **Uncertainty:** Sometimes *we genuinely aren't sure* about something, and hedging signals that uncertainty. If you're troubleshooting an issue and have a guess at the cause, you might say "It **seems** this is a backend bug," indicating it's a tentative diagnosis. In this case, hedging is a useful shorthand to communicate "I'm not 100% certain" without writing a paragraph about unknowns.

* **Academic or Scientific Convention:** In academic writing, hedging is not only common; it's often **expected**. Researchers use cautious language like "suggests," "may promote," or "is likely to" rather than making absolute claims. This avoids overstating conclusions and keeps the tone objective. In academia, writing "X may cause Y" is more appropriate (and credible) than "X causes Y" unless you have ironclad proof.

* **Habit or Confidence (or lack thereof):** Let's face it, some of us hedge because we've subconsciously trained ourselves to always leave wiggle room. Maybe we lack confidence in our knowledge, or we're afraid of being wrong, so we add a "maybe" to everything just in case. Over time, hedging can become a crutch.

In short, we hedge to be **careful, kind, or humble**. These are not terrible instincts! The goal isn't to **ban** hedging entirely. It's to understand when it's helping your communication and when it's hurting it.

## How Hedging Can Weaken Your Writing

The downside is that **excessive or unnecessary hedging can undermine your writing.** Those little phrases meant to be polite or careful can make you sound unsure, indirect, or lacking confidence. Especially in technical communication, this can be problematic:

* **Clarity Suffers:** Hedging adds extra words and ambiguity. The more you muddy a statement with "maybe/kind of/possibly", the less clear the core message becomes. Readers might finish a paragraph and wonder, "So… does the feature work or not?"

* **Loss of Confidence & Credibility:** Writing that is riddled with hedges can come across as *unconfident*. It's like you're apologizing for your own ideas. Readers (especially a technical audience) might start to doubt that you know what you're talking about if **every statement is couched in "possibly" and "it seems."**

* **Reader Trust:** In a blog post or an article, if every claim is *hedged to oblivion*, readers might start thinking "Do they even believe what they're saying?" A direct, confident tone builds trust. If you don't sound sure of your info, why should the reader trust it?

**Example:**

* *Hedged:* "This **basically** means the module *might* fail to load under certain conditions."  
* *Confident:* "This means the module fails to load under specific conditions."

The second version is clearer and more authoritative. It **projects confidence**, which in turn instills confidence in the reader.

## When (and where) hedging *is* appropriate

Hedging has its place. The trick is to use it **when the situation or audience calls for a cautious tone**, rather than as a default for every sentence. Here are some scenarios where hedging can be **beneficial or expected**:

* **Academic and Research Writing:** As mentioned earlier, in scientific papers, you *should* hedge to accurately represent uncertainty. It's better to write "The data **suggests** a correlation" than "The data proves X" if proof isn't established.

* **Diplomacy in Communication:** In professional settings (emails, code reviews, feedback), hedging can be a **polite strategy**. "I **wonder if** we should reconsider this approach?" is often better received than "This approach is wrong. Change it."

* **Unknown or Uncertain Situations:** If you're writing about future events or incomplete data, hedging is honest and fair. It manages expectations and indicates that the statement isn't set in stone.

* **Troubleshooting / Hypothesis Discussion:** In technical troubleshooting, you often don't have all the facts yet. Using tentative language ("it looks like this might be related") is fine until evidence confirms it.

* **Avoiding Absolutes:** Avoid sweeping claims like "This **always** works" or "That **never** happens." Sometimes, hedging is the safer and more accurate choice.

To sum up, consider **your audience and your purpose**. If you're writing documentation, clarity beats caution. If you're writing a reflective blog or discussing ideas, a little humility in your phrasing can feel natural and genuine. Hedge intentionally, not reflexively.

## Tips to write with confidence (and trim the hedges)

Assuming you've identified that you're hedging more than you'd like (I certainly was!), here's how to **write more directly** without losing necessary nuance:

1. **Spot the Hedge Words:** Look for common culprits ("maybe", "actually", "I think", etc.). Often, you can just **delete these words** and the sentence gets stronger.
   * "Basically, the app was sort of slow to respond."  
     → "The app was slow to respond."

2. **Write a Bold Draft:** Try writing a version of your sentence **without any hedges at all**. You can always reintroduce nuance later if needed.

3. **State Facts and Uncertainty Separately:** If part of your statement is a fact and part is a guess, separate them.
   * Instead of "It seems the connector is working," write:  
     "The connector filled in missing data for October. We'll verify if it handled November correctly."

4. **Use Confident Alternatives:**
   * "I **think** we should set up a meeting." → "Let's set up a meeting."
   * "It **would be great if** you could send the update by Friday." → "Please send the update by Friday."
   * "We **should be able to** finish this week." → "We can finish this week."

5. **Adjust Tone Without Hedging:** You can be confident *and* polite. For example, "Let's review this section to ensure it's clear" sounds assertive but still collaborative.

6. **Use Style Guides and Tools:**  
   Check out:
   * [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/)  
   * [Google Developer Style Guide](https://developers.google.com/style/tone)  
   Both promote concise, direct, confident writing.  
   For automation, use the [Vale linter](https://vale.sh) to flag hedging words automatically.

7. **Practice and Get Feedback:** Rewrite a paragraph twice - once hedged, once direct - and ask others which version they find clearer. You'll often be surprised that the direct one works better.

## Final thoughts

Learning to identify and dial back unnecessary hedging is one of those *"we should have learned this earlier"* moments for many writers (myself included). The goal is not to purge every "maybe" from your vocabulary, but to **make your words count**. Use hedging when it serves a purpose - to acknowledge uncertainty or to be tactful - but **don't hedge out of habit or fear**.

When you do make a statement, try making it with your full chest. You'll find that your writing can still be warm, humorous, and human without all the extra cushioning. In fact, it will likely be more engaging and authoritative as a result.

To recap:

* **Hedging** is a tool, not a default.  
* **Use it intentionally** when needed (uncertainty, tone, humility).  
* **Drop it** when it weakens your clarity or confidence.  
* Your readers will thank you for being clear and decisive.

And if you need backup, remember the style guides and tools at your disposal. The [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/welcome/), the [Google Developer Style Guide](https://developers.google.com/style/tone), and [Vale](https://vale.sh) are excellent companions.

Ultimately, writing with fewer hedges feels a little daring at first - like walking a tightrope without a "perhaps" safety net below. But trust me (notice I didn't say "I think you can trust me" 😉): over time, you'll find that saying what you mean *with confidence* is liberating. Your readers will thank you for it, and ironically, it might make you a **more credible and trustworthy writer** in their eyes.

So let's *not* hedge our bets: write boldly when boldness is called for, and save the "maybe"s for when you truly need them.
