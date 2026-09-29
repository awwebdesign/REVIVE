# Actuele oplevering

Op verzoek van Axel zijn alleen de FAQ en “Jouw eerste afspraak” behouden. De overige toevoegingen uit de SEO-implementatie zijn teruggedraaid, inclusief de hero-kop, introductie, langere behandelteksten en uitgebreide metadata/schema. De FAQ heeft grotere, helderdere tekst en gouden accenten. De onderstaande audit en eerdere implementatiestatus zijn historische notities.

---

# Implementatiestatus — 29 september 2026

De homepage is bijgewerkt met een zichtbare lokale H1, natuurlijke massage- en hersteltermen, uitgebreidere behandelteksten, een eerste-afspraak-uitleg, zes FAQ-antwoorden, complete social metadata en een gekoppelde LocalBusiness/Person/Service/WebSite/WebPage-graph. Op verzoek van Axel blijft alles over behandelingen op de homepage; aparte behandelingspagina’s zijn niet toegevoegd. Bestaande boekingslinks en automatische reviews blijven behouden. Onderstaand rapport is de oorspronkelijke audit vóór implementatie; de scores zijn geen nieuwe meting. Zie `HANDOVER.md` en `qa/results.txt` voor oplevering en verificatie.

---

# Revive: SEO audit and proposed additions

Audited 29 September 2026. Scope: the finished local homepage in `index.html`, its delivered assets, metadata, sitemap, robots.txt and existing structured data. The public domain still shows the old website. Search observations therefore describe the existing public presence, not rankings earned by the new design. No production code was changed during this audit.

## Assessment

The technical foundation is good. The biggest opportunity is useful, locally specific treatment information. The homepage has approximately **204 words of introductory/treatment/about copy**, excluding reviews and the hidden H1. Each treatment description has just **16, 13 or 15 words**. There are no dedicated treatment pages; all three cards lead to Optios.

The recommendation is a locally focused homepage plus three substantive treatment pages, supported by an accurate Google Business Profile. Target real appointments in Sint-Katelijne-Waver first. Mechelen is a proposed secondary catchment area, not a second practice location.

### Page scorecard

These are editorial opportunity/readiness scores, not Google scores, measured rankings, Lighthouse results or forecasts. Overall is the equal-weight average of the five categories. Unknown production performance is excluded.

| Category | Assessment /100 | Basis |
|---|---:|---|
| On-page SEO | 60 | Relevant description; title lacks town; H1 is screen-reader-only; treatment names are spans; no treatment information pages |
| Content quality | 40 | Real biography, photographs and reviews; little treatment explanation; no durations, prices, qualifications or first-visit guidance |
| Technical foundations | 90 | Static HTML, index/follow, canonical, sitemap, robots, deferred scripts and local assets; live deployment still unverified |
| Structured data | 65 | Existing LocalBusiness identifies the practice; practitioner and services are not connected as entities |
| Images | 85 | Modern formats, alt attributes, dimensions and appropriate native lazy loading; hero logo can be smaller |
| **Overall** | **68** | Primary investment should be content and local relevance |

### What already works

- `lang="nl-BE"`, one H1, and a coherent overall heading hierarchy.
- Meta description includes sportmassage, deep tissue, cupping and Sint-Katelijne-Waver.
- Production canonical, index/follow, XML sitemap and permissive robots.txt are present.
- Primary content, original reviews and business facts are in the HTML; JavaScript is not required to read them.
- Real practitioner/treatment images, contact email, practice address and business number.
- Existing LocalBusiness JSON-LD; no inappropriate self-review AggregateRating markup.
- Local fonts/scripts, deferred JavaScript, AVIF treatment photos and WebP brand assets.
- Existing responsive browser checks are available in `qa/results.txt`.

## Priority findings

| Priority | Finding | Proposed change | Expected benefit |
|---|---|---|---|
| Launch dependency | The finished site is only local | Publish on the existing domain, verify final HTTP responses, redirects, canonical and indexing in Search Console | Makes the new content available for discovery |
| High | Three very short service descriptions; no dedicated pages | Add `/sportmassage/`, `/deep-tissue-massage/`, `/cupping/` with substantive, distinct content | More useful landing pages for treatment-specific searches |
| High | Title omits the practice location; the visual hero is largely an image | Revise title and display a concise service/location H1 | Clearer identification for visitors and search systems |
| High | Booking facts and qualifications are missing | Add confirmed durations, prices, practitioner training and practical visit information | Helps people compare, trust and book |
| High, outside the site | Business Profile was not authenticated/audited | Verify and complete the existing Google Business Profile, with matching practice details | Supports local Maps/Search visibility |
| Medium | Service labels are `<span>` elements | Use H3s under the treatment H2, preserving their appearance | Clearer document structure |
| Medium | All treatment links leave the domain | Add descriptive internal service links and retain prominent booking actions | Allows people and crawlers to explore Revive's own information |
| Medium | Reviews link to a general Google search | Replace with a verified direct business/reviews link | More reliable route to the correct practice |
| Medium | Hero lockup is 318,604 bytes (about 311 KiB) | Export visually checked responsive logo sizes and use `srcset` | Potential mobile loading improvement; measure after deployment |
| Low | Twitter title/description omitted | Supply them alongside the existing card and Open Graph metadata | More predictable shared previews; not a ranking lever |

No critical on-page crawl blocker was found in the local files. Production server access, Search Console history, backlinks, Google Maps position and field Core Web Vitals have not been measured.

## Search intent and page ownership

These are suggested query groups based on the services and location, not paid keyword-volume data or verified Google positions. Synonyms belong together; avoid one page per spelling variation.

| Destination | Primary query group | Secondary intent |
|---|---|---|
| Homepage `/` | massage Sint-Katelijne-Waver; masseur Sint-Katelijne-Waver | massagepraktijk, sportmasseur in de buurt, Revive, Glenn Versteeven |
| `/sportmassage/` | sportmassage Sint-Katelijne-Waver; sportmasseur Sint-Katelijne-Waver | massage na sporten; recovery massage; training and recovery questions |
| `/deep-tissue-massage/` | deep tissue massage Sint-Katelijne-Waver | diepe spiermassage; spierspanning; rug/nek/schouders only where Glenn confirms his scope |
| `/cupping/` | cupping Sint-Katelijne-Waver; cupping massage | what a session involves, suitability, combination with massage |
| Later: useful advice pages | sportmassage of deep tissue; sporten na massage; eerste sportmassage | Original answers from Glenn linked to the relevant treatment |

Use Mechelen naturally as a nearby area served if Glenn wants to target clients there. Do not claim an address in Mechelen. No separate Mechelen page is proposed initially. Broad “massage” queries have diverse and local intent; nationwide first place is not a useful promise for a single local practice.

Do not add pages for treatments not offered, such as pregnancy massage, lymphatic drainage, physiotherapy or rehabilitation. Confirm the actual service before expanding beyond the three listed treatments.

## How additions fit the approved design

Keep the black-and-gold palette, logo-led hero, photography, treatment cards, biography, automatic reviews and strong footer. The removed review controls and review captions stay removed.

1. **Inside the existing hero, below the logo:** make the single H1 visible as two restrained lines: “Massage en sportmassage” / “in Sint-Katelijne-Waver”. Keep the book button. This replaces the existing long screen-reader-only H1; it does not add a second H1. The current accessible H1 is not itself an SEO violation—the opportunity is clearer visible information.
2. **Under the existing introductory strip:** add a short, readable practice introduction. Keep “Voor de sporter. De harde werker.” as the brand statement.
3. **Existing treatment cards:** retain photos and typography; give each service a real H3, a concise explanation, and a “Meer over sportmassage” type link. Use separate sibling links for information and booking, avoiding nested anchors. Main navigation can continue pointing to the treatment overview.
4. **Immediately below the cards:** add a compact “Jouw eerste afspraak” section explaining the actual intake, selection of treatment and what visitors should bring. Add duration/price facts once confirmed. This should be three short steps, not a wall of SEO copy.
5. **Within the existing Glenn section:** add a short qualifications/experience line based on evidence supplied by Glenn. Keep the photo and current personal story.
6. **After reviews, before the gold footer:** add “Veelgestelde vragen over massage” as a quiet, full-width accordion with five or six useful questions. Answers must be in the delivered HTML. This adds practical content without making the homepage visually busy.
7. **Inside the existing footer contact area:** add confirmed opening/appointment information and useful parking/access details. Add telephone only if Glenn wants it published. Keep Lemanstraat 16 as the actual location.
8. **Treatment detail pages:** reuse the same header, colors, photos, buttons and legal footer. Use a comfortable reading width, visible location, service explanation, suitability, first-visit details, confirmed prices/durations, related treatment links and clear booking CTA.

### Proposed homepage copy

**Search title:** `Massage & sportmassage Sint-Katelijne-Waver | Revive`

**Meta description:** `Sportmassage, deep tissue en cupping bij sportmasseur Glenn in Sint-Katelijne-Waver. Ontdek de behandelingen en boek je massage bij Revive.`

**Visible H1:** `Massage en sportmassage in Sint-Katelijne-Waver`

**Introductory paragraph:**

> Bij Revive Massage & Coaching in Sint-Katelijne-Waver kan je terecht voor sportmassage, deep tissue massage en cupping. Sportmasseur Glenn Versteeven stemt de behandeling af op jouw verhaal en belasting: van training en fysiek werk tot vastzittende spieren na een drukke week. Je vindt de praktijk aan de Lemanstraat 16. Een afspraak boek je eenvoudig online.

This paragraph uses facts already present in the site. Any stronger recovery, pain-relief or clinical claims need appropriate evidence and Glenn's review.

**FAQ topics to answer with Glenn:**

- Welke massage past bij mij: sportmassage, deep tissue of cupping?
- Is sportmassage ook geschikt als ik niet sport?
- Hoe verloopt mijn eerste afspraak bij Revive?
- Hoe lang duurt een behandeling en wat kost ze?
- Kan ik sporten na een massage?
- Waar ligt de praktijk en hoe kan ik er parkeren?

The safety/timing answer needs Glenn's professional input, rather than a generic recommendation for everyone. The parking answer must describe real facilities. FAQ content is recommended for usefulness, not promised FAQ rich results.

### Content depth and readability

Use short paragraphs and familiar Dutch. Explain terms such as deep tissue and cupping before describing Revive's approach. No English Flesch grade is assigned to Dutch copy. Word counts above show the current information gap; they are not ranking thresholds. Write until the visitor's real questions are answered. Google explicitly says it has no preferred word count. [Google's helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Local search work beyond the website

Verify the existing Google Business Profile instead of creating a duplicate. Check business name, actual category, practice address, hours, website and appointment link. List the real treatments, add current photos and seek genuine reviews without incentives or scripted keywords. Confirm a direct profile link before changing the website links.

Google identifies relevance, distance and prominence as local ranking factors. Site copy cannot remove the effect of distance. [Google's local ranking guidance](https://support.google.com/business/answer/7091).

Local context found in this audit:

- [Sportmasseur Sander](https://www.sportmasseursander.be/) has individual service links, treatment durations and specific professional experience.
- [Efluo's massage page](https://efluo.be/massage-mechelen) exposes treatment details, durations and prices. These are useful information patterns, not medical claims to copy.
- A [local merchant list](https://skwinkel.be/wp-content/uploads/2026/04/Lijst-deelnemende-handelaars_17032026.pdf) already associates Revive with Lemanstraat 16. This is a useful existing local reference; it is not proof of a backlink or measured ranking benefit.

These were observed pages in a limited search sample, not a localized Google Maps ranking report. Search-volume and position estimates are unavailable. Where there are real relationships, pursue accurate listings/links from local sports clubs, gyms and business organizations; do not fabricate partnerships or buy mentions.

## Structured data proposal

Keep the valid existing LocalBusiness entity. Add a Person entity for Glenn and three Service entities referencing that business, using facts already displayed. A ready-to-review graph is in `SEO-SCHEMA-PROPOSAL.jsonld`; it is not installed. It preserves the business's current identifier, address and booking action. It deliberately omits unverified prices, phone, hours, credentials and geographic coordinates. Add those only after confirmation and show them in visible content too.

When treatment pages exist, give their Service nodes those real URLs and add appropriate page/breadcrumb markup. Service and Person markup clarify relationships; they do not create a guaranteed Google rich result or AI citation. [Google LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Schema.org Service](https://schema.org/Service).

Do not attach the imported Google rating to Revive as self-serving review markup to pursue organic stars. [Google's review snippet guidelines](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).

## Image and performance notes

Used content images have alt attributes and explicit dimensions. The decorative hero photograph correctly uses empty alt text within an aria-hidden container. Treatment images, Glenn's photograph and the footer wordmark use **native** `loading="lazy"`; the hero image and lockup correctly load eagerly. No JS lazy-loader is required.

The 311 KiB hero lockup is the only used page image above this audit's 200 KB warning threshold; none exceed 500 KB. The homepage still carries legacy CSS. Consider removing unused selectors only after visual regression checks. Neither file size nor prior functional browser tests establish real-user Core Web Vitals. Run PageSpeed Insights and inspect field data after the new site is public; measure LCP, INP and CLS rather than asserting a pass from source inspection.

## Implementation order and measurement

1. Confirm business facts; update homepage title, visible H1, treatment headings, intro and entity markup.
2. Build the three service pages and descriptive internal links; include confirmed treatment facts.
3. Add the first-visit section, FAQ and qualifications. Publish the new version on the existing domain with retained legal URLs.
4. Verify production crawlability, redirects and sitemap in Google Search Console and Bing Webmaster Tools. Complete the existing Google Business Profile.
5. Establish query/page baselines. Review local service impressions, clicks, position trends, profile interactions and actual appointment enquiries. Check after roughly four weeks for discovery and after eight to twelve weeks for direction, without promising a ranking deadline.
6. Add a small number of original advice articles based on actual client questions and search demand. Keep prices, availability and professional information accurate.

For measurement, start with Search Console, Business Profile and booking/enquiry reporting. Website-side outbound clicks are not confirmed appointments. Optios conversion visibility depends on the booking provider's reporting. Introducing analytics is a separate decision and would require revisiting the current no-tracking implementation and cookie policy.

## Facts needed for implementation

Glenn's exact qualifications and relevant training; actual treatment durations and prices; opening/appointment hours; whether cupping is standalone or combined; practical parking/access details; preferred public phone number if any; direct Google Business Profile URL; and priority catchment areas beyond Sint-Katelijne-Waver. None should be invented for SEO.
