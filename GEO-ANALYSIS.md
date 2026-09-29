# Actuele oplevering

Op verzoek van Axel zijn alleen de FAQ en “Jouw eerste afspraak” behouden. De overige toevoegingen uit de SEO-implementatie zijn teruggedraaid, inclusief de hero-kop, introductie, langere behandelteksten en uitgebreide metadata/schema. De FAQ heeft grotere, helderdere tekst en gouden accenten. De onderstaande audit en eerdere implementatiestatus zijn historische notities.

---

# Implementatiestatus — 29 september 2026

De aanbevolen feitelijke homepage-informatie, FAQ-antwoorden, lokale zichtbare kop en gekoppelde structured data zijn toegevoegd. De gebruiker heeft gekozen voor één homepage zonder aparte behandelingspagina’s. Onderstaand rapport en de scores beschrijven de eerdere situatie. AI-vermeldingen zijn niet gemeten; er zijn geen externe profielen of crawlerinstellingen op de productiehost gewijzigd.

---

# Revive: AI-search / GEO readiness

29 September 2026. Assessment of the finished local website. Recommendations only; no website changes made. Search-engine and AI-answer visibility of this unpublished version cannot yet be measured.

## Readiness score

**60/100, editorial on-site readiness.** This is not a citation probability or a score provided by Google, OpenAI or Perplexity. It reflects good technical accessibility and identifiable business facts, limited treatment answers, and incomplete practitioner/practical information.

| Platform | Shared on-site readiness | Actual visibility |
|---|---:|---|
| Google AI Overviews / AI Mode | 60/100 | Not measured for the finished site |
| ChatGPT search | 60/100 | Not measured |
| Perplexity | 60/100 | Not measured |

The scores are deliberately identical: there is no platform-specific citation dataset here to justify finer distinctions. No proprietary AI mention tools were available.

## What supports discovery already

The first HTML response contains treatment text, Glenn's biography, reviews, address, contact email and LocalBusiness markup. Fonts and images are local. JavaScript only enhances navigation/animation; it is not needed to obtain the main content. There are no login or consent overlays in the delivered site.

Robots.txt uses `User-agent: *` and `Allow: /`. Therefore Googlebot, OAI-SearchBot and PerplexityBot are allowed by the **local file**. GPTBot is also allowed. This does not verify access through future hosting/CDN controls or prove that any crawler has fetched the finished site.

For ChatGPT visibility, OAI-SearchBot is the relevant search crawler. GPTBot is a separate training control and is not required for search inclusion. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots).

PerplexityBot is the relevant Perplexity search crawler. Check legitimate crawler access after deployment, including any host-level filtering. [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).

## Main content limitations

| Passage | Current strength | Useful improvement |
|---|---|---|
| Hero | Brand is distinctive; long H1 is screen-reader-only | Visible service/location heading and a straightforward practice introduction |
| Treatment cards | Correct service names, but only 13–16 words of explanation each | Brief useful summaries linked to deeper treatment pages |
| Glenn biography | Identifies a real person and sporting background | Confirmed qualifications, actual training and his approach to a first visit |
| Reviews | Firsthand customer accounts in HTML | Keep them as testimonials; do not turn individual medical outcomes into business guarantees |
| Contact | Address and email are clear | Confirmed appointment hours, access, treatment duration and price information |

There are currently few passages that answer a prospective client's complete question. That is a usability/content finding, not a reason to engineer blocks of a prescribed word length. Definitions and concise answers help readers; there is no universal passage length that earns AI citations.

## Five highest-value additions

1. A visible, factual introduction connecting **Revive → Glenn Versteeven → massage services → Lemanstraat 16 → Sint-Katelijne-Waver**.
2. Three substantive service pages covering what is offered, who it is intended for, the actual appointment process, confirmed duration/pricing and relevant limits.
3. Glenn's verified professional background and first-person explanations of his practice, supported by real photographs.
4. A concise FAQ answering actual booking and treatment-selection questions, with answers included in HTML.
5. Consistent business facts on the website, Google Business Profile and legitimate local references; useful internal links between the homepage and service pages.

Use the exact placement plan and proposed Dutch copy in `SEO-AUDIT.md`. The three service pages would allow useful answers to queries such as “Waar kan ik sportmassage boeken in Sint-Katelijne-Waver?” and “Wat is het verschil tussen de behandelingen bij Revive?” without relying on generic promotional statements.

## Existing external entity signals

The current public Revive website identifies Glenn and the same practice address. The local [Skwinkel merchant list](https://skwinkel.be/wp-content/uploads/2026/04/Lijst-deelnemende-handelaars_17032026.pdf) lists Revive at Lemanstraat 16. The finished homepage links to the business's Instagram account; that account's content was not independently audited.

A limited search for the exact brand/person combination did not establish relevant Wikipedia, Reddit, YouTube or LinkedIn coverage. This means **unverified**, not absent. Do not create a Wikipedia page or manufacture forum mentions as an SEO tactic. Accurate local business references and genuine sports-community relationships are a better fit for this practice.

## Schema and optional AI files

The proposed LocalBusiness / Person / Service graph in `SEO-SCHEMA-PROPOSAL.jsonld` describes existing facts and relationships. Do not add invented certifications, medical specialties or treatment promises. It is not a special “GEO schema”.

`llms.txt` is absent and is **not a scored defect**. I do not propose adding it for this project. Google explicitly says special AI files, fixed content chunking and keyword variants written for AI are unnecessary for its generative Search features. Useful, original content remains the priority. [Google's AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

Google also requires a page to be indexed and eligible for a search snippet before it can serve as a supporting link in its AI features. Good implementation does not guarantee inclusion. [Google's AI-feature eligibility guidance](https://developers.google.com/search/docs/appearance/ai-features).

## Verification after publication

Check indexed URLs, final robots rules and host-level access. Use the Search Console search/AI reporting actually available in the verified property; no account was accessed here. Google's current documents describe reporting differently, so confirm the available interface before promising a separate AI report. Track AI referrals where measurable, enquiry source and a small repeatable set of local questions. Record dates and exact prompts; spot checks are observations, not stable rankings.

No AI crawler access rules, analytics, review controls, live content or deployment settings were changed by this audit.
