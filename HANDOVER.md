# Revive — overdracht website

De goedgekeurde vormgeving is behouden. De website bestaat uit gewone HTML, CSS, JavaScript en lokale bestanden; er is geen database, CMS of installatie op de webserver nodig.

## Uploaden

Gebruik **revive-upload.zip** of de inhoud van **dist/**. Pak de ZIP rechtstreeks uit in de publieke webmap van het domein, bijvoorbeeld `public_html`. De homepage `index.html` moet direct in die map staan, niet in een extra `dist`-map. Upload de bronmap met `scripts`, `content`, `qa` en dit document niet.

De productie-URL in de SEO-gegevens staat ingesteld op **https://www.revive-massagetherapie.be/**. Laat de hostingprovider HTTPS inschakelen en HTTP en het domein zonder `www` naar deze URL doorsturen. Wijzig bij een ander productiedomein ook de canonical-links, social metadata, structured data, sitemap en robots.txt. De homepage en juridische pagina’s gebruiken relatieve bestands- en navigatiepaden, zodat ze ook onder `/REVIVE/` werken.

### GitHub Pages

Voor **https://awwebdesign.github.io/REVIVE/**: upload de inhoud van `dist/` of de uitgepakte `revive-upload.zip` rechtstreeks naar de ingestelde publicatiemap. `index.html`, `style.css`, `launch.css`, `style.js`, de map `assets` en de juridische paginamappen horen naast elkaar te staan. Upload niet alleen de HTML of de ZIP als bestand.

`node scripts/build.mjs` behoudt de relatieve paden en maakt standaard een 404-pagina met `/REVIVE/`-paden. Bouw vóór plaatsing op het eigen domein met `node scripts/build.mjs --base-path=/` en maak de upload-ZIP opnieuw. Dit argument wijzigt de vaste paden van de 404-pagina; normale pagina’s werken op beide locaties. Er zijn geen GitHub-instellingen of bestanden online gewijzigd.

De ZIP bevat `.htaccess` voor Apache en `_headers` voor hosts die dit formaat ondersteunen. Zorg dat `.htaccess` wordt meegeüpload. Ze bevatten beveiligingsheaders; Apache krijgt ook compressie, caching en een eigen 404-pagina. Bij andere hosting moet de provider deze instellingen en de 404-pagina overnemen. De website heeft echte mappen voor de juridische pagina’s en heeft geen SPA-rewrite nodig.

Maak vóór vervanging een backup van de bestaande website. Behoud de DNS-records voor e-mail, waaronder MX, SPF, DKIM en DMARC. Controleer na plaatsing de homepage, afbeeldingen, afspraaklinks en alle juridische pagina’s via het echte domein. De oorspronkelijke URL `/algemene-voorwaarden` blijft werken via de map `algemene-voorwaarden/`.

## Pagina’s en inhoud

- `/`: goedgekeurde homepage, met drie oorspronkelijke behandelingen, eerste-afspraak-uitleg, veelgestelde vragen en alle drie de juridische links in de footer. Op verzoek zijn geen aparte behandelingspagina’s toegevoegd; de kaarten blijven naar de boekingsagenda linken.
- `/algemene-voorwaarden/`: de 17 bepalingen van de bestaande website.
- `/privacybeleid/`: bestaande privacytekst, opgesplitst in leesbare secties. Beide verwijzingen naar Bosbeekweg 9 zijn op aanwijzing van Axel vervangen door Lemanstraat 16. Het bestaande contact-e-mailadres is toegevoegd.
- `/cookiebeleid/`: nieuw beleid voor de concrete website zonder trackingcookies.
- `/404.html`: eigen foutpagina met link naar de homepage.

Bron van de overgenomen juridische tekst: https://www.revive-massagetherapie.be/algemene-voorwaarden (geraadpleegd 29 september 2026).

### Nog te bevestigen door de opdrachtgever vóór publicatie

De algemene voorwaarden zijn op verzoek inhoudelijk overgenomen, niet juridisch herschreven. Laat de opdrachtgever de volgende bestaande punten controleren:

1. Artikel 9 noemt zowel **14 kalenderdagen** als **zeven kalenderdagen** voor factuurklachten.
2. Artikel 10 voorziet automatische rente en een schadevergoeding zonder ingebrekestelling. De FOD Economie beschrijft voor consumentenschulden een gratis eerste herinnering, een wachttermijn van minstens 14 kalenderdagen en begrensde vergoedingen. Laat deze bepaling toetsen en de gewenste vervangende tekst aanleveren: https://economie.fgov.be/nl/themas/financiele-diensten/schuldenlast/algemene-regels-bij-niet.
3. De bestaande privacytekst noemt nieuwsbrieven, medische informatie, externe verwerkers en een kopie van het identiteitsbewijs bij inzageverzoeken. Laat Glenn bevestigen dat deze tekst zijn huidige werkwijze beschrijft. De hostingprovider en Optios-verwerking moeten bij die controle worden meegenomen.

Het adres **Lemanstraat 16, 2860 Sint-Katelijne-Waver** is door Axel bevestigd en consequent toegepast. De oorspronkelijke formulering “Contact betalen” in artikel 7 is behouden omdat om een kopie van de voorwaarden is gevraagd.

## Cookies en externe diensten

De opgeleverde website plaatst zelf geen cookies en gebruikt geen localStorage, sessionStorage, advertentiepixels of analytics. Lettertypes, afbeeldingen en Lenis worden lokaal geladen. Google-reviews zijn statische fragmenten; kaarten, Instagram en Optios zijn gewone uitgaande links. Er is daarom geen toestemmingsbanner toegevoegd.

Activeert de hostingprovider later analytics, tracking, beveiligingscookies of externe embeds, controleer dan het cookiebeleid opnieuw. Voor niet-noodzakelijke cookies is voorafgaande toestemming nodig; zulke scripts mogen niet alvast laden. Achtergrond: https://www.gegevensbeschermingsautoriteit.be/burger/thema-s/internet/cookies.

## Onderhoud

- Pas homepage, contactgegevens en reviewselectie aan in `index.html`.
- Bewerk juridische teksten in `content/algemene-voorwaarden.html`, `content/privacybeleid.html` en `content/cookiebeleid.html`.
- `style.css` bevat de bestaande vormgeving; `launch.css` de gerichte afwerking en juridische layouts.
- Op verzoek zijn alleen de FAQ en “Jouw eerste afspraak” als nieuwe inhoud behouden in `index.html`. De FAQ-stijlen staan bovenaan `launch.css`: grotere tekst, hoger contrast en gouden accenten. De oorspronkelijke hero, behandelteksten, metadata en LocalBusiness-schema zijn hersteld.
- `style.js` regelt navigatie, animaties en de reviewcarrousel.
- Voer na wijzigingen `node scripts/build.mjs` uit. Dit genereert de juridische pagina’s, sitemap en `dist/` opnieuw. Zorg dat adreswijzigingen ook in de gezamenlijke footer in `scripts/build.mjs` en structured data worden doorgevoerd.
- Start een lokale preview met `node scripts/serve.mjs` en open http://127.0.0.1:8392.
- Het copyrightjaar wordt automatisch bijgewerkt. Reviewaantal en gemiddelde zijn een vaste selectie en moeten handmatig worden bijgewerkt.
- De reviews schuiven automatisch (44 px/s; 20 px/s bij verminderde beweging, zoals in het goedgekeurde ontwerp). Hover vertraagt naar 6 px/s; toetsenbordfocus stopt de beweging. De pauzeknop en de begeleidende tekst onder de reviews zijn op verzoek verwijderd.
- `assets/fonts/` en `assets/vendor/` bevatten de licenties van de lokaal gehoste bibliotheek en lettertypes. Behoud deze bij uploaden.

## Uitgevoerde controles

Browsercontroles staan in `qa/results.txt`; toegankelijkheidsresultaten in `qa/accessibility.json`. Er zijn controles uitgevoerd op 320, 390, 768, 1024 en 1440 pixels breed, interne links, afbeeldingen, menufocus, Escape, wisselen van schermbreedte, pauzeren van reviews, verminderde beweging, browsen zonder JavaScript, opslag en verzoeken naar externe domeinen. Browser: Microsoft Edge/Chromium. Er is geen test op fysieke iOS/Android-apparaten uitgevoerd.

De technische oplevering is voorbereid voor upload. Er is nog niets gepubliceerd en de productiehost/DNS/HTTPS-configuratie is niet gewijzigd of getest.

## SEO en vindbaarheid na publicatie

De homepage behoudt de oorspronkelijke hero, behandelteksten en basis-SEO. De nieuwe FAQ en eerste-afspraak-uitleg staan in de HTML en werken zonder JavaScript. De oorspronkelijke LocalBusiness-markup is behouden. De uitgebreidere SEO-implementatie is op verzoek teruggedraaid. De sitemap bevat uitsluitend de homepage en de drie juridische pagina’s.

Na publicatie: verifieer het domein in Google Search Console en dien `https://www.revive-massagetherapie.be/sitemap.xml` in. Controleer met URL-inspectie of Google de homepage kan ophalen. Werk het bestaande Google Bedrijfsprofiel bij met dezelfde praktijknaam, het adres Lemanstraat 16, website, behandelingen en bevestigde uren. Deze externe accounts zijn niet gewijzigd.

Meet zoekopdrachten en klikgedrag na indexering; rankings en AI-vermeldingen zijn niet gegarandeerd door technische optimalisatie. Het oudere `SEO-AUDIT.md` en `GEO-ANALYSIS.md` beschrijven de situatie vóór deze aanpassingen. De oorspronkelijk voorgestelde behandelingspagina’s zijn vervallen op verzoek van Axel. Websitegegevens zijn bruikbaar voor zoekmachines en AI-zoekdiensten via dezelfde toegankelijke HTML en structured data; zie [Google over AI-zoekfuncties](https://developers.google.com/search/docs/appearance/ai-features).
