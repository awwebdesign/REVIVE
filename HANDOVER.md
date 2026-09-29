# Revive — overdracht website

De goedgekeurde vormgeving is behouden. De website bestaat uit gewone HTML, CSS, JavaScript en lokale bestanden; er is geen database, CMS of installatie op de webserver nodig.

## Uploaden

Gebruik **revive-upload.zip** of de inhoud van **dist/**. Pak de ZIP rechtstreeks uit in de publieke webmap van het domein, bijvoorbeeld `public_html`. De homepage `index.html` moet direct in die map staan, niet in een extra `dist`-map. Upload de bronmap met `scripts`, `content`, `qa` en dit document niet.

De productie-URL staat ingesteld op **https://www.revive-massagetherapie.be/**. Laat de hostingprovider HTTPS inschakelen en HTTP en het domein zonder `www` naar deze URL doorsturen. Wijzig bij een ander domein ook de canonical-links, social metadata, structured data, sitemap en robots.txt. De site verwacht installatie op de hoofddirectory van het domein.

De ZIP bevat `.htaccess` voor Apache en `_headers` voor hosts die dit formaat ondersteunen. Zorg dat `.htaccess` wordt meegeüpload. Ze bevatten beveiligingsheaders; Apache krijgt ook compressie, caching en een eigen 404-pagina. Bij andere hosting moet de provider deze instellingen en de 404-pagina overnemen. De website heeft echte mappen voor de juridische pagina’s en heeft geen SPA-rewrite nodig.

Maak vóór vervanging een backup van de bestaande website. Behoud de DNS-records voor e-mail, waaronder MX, SPF, DKIM en DMARC. Controleer na plaatsing de homepage, afbeeldingen, afspraaklinks en alle juridische pagina’s via het echte domein. De oorspronkelijke URL `/algemene-voorwaarden` blijft werken via de map `algemene-voorwaarden/`.

## Pagina’s en inhoud

- `/`: goedgekeurde homepage, met alle drie de juridische links in de footer.
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
- `style.js` regelt navigatie, animaties en de reviewcarrousel.
- Voer na wijzigingen `node scripts/build.mjs` uit. Dit genereert de juridische pagina’s, sitemap en `dist/` opnieuw. Zorg dat adreswijzigingen ook in de gezamenlijke footer in `scripts/build.mjs` en structured data worden doorgevoerd.
- Start een lokale preview met `node scripts/serve.mjs` en open http://127.0.0.1:8392.
- Het copyrightjaar wordt automatisch bijgewerkt. Reviewaantal en gemiddelde zijn een vaste selectie en moeten handmatig worden bijgewerkt.
- De reviews schuiven automatisch (44 px/s; 20 px/s bij verminderde beweging, zoals in het goedgekeurde ontwerp). Hover vertraagt naar 6 px/s; toetsenbordfocus stopt de beweging. De pauzeknop en de begeleidende tekst onder de reviews zijn op verzoek verwijderd.
- `assets/fonts/` en `assets/vendor/` bevatten de licenties van de lokaal gehoste bibliotheek en lettertypes. Behoud deze bij uploaden.

## Uitgevoerde controles

Browsercontroles staan in `qa/results.txt`; toegankelijkheidsresultaten in `qa/accessibility.json`. Er zijn controles uitgevoerd op 320, 390, 768, 1024 en 1440 pixels breed, interne links, afbeeldingen, menufocus, Escape, wisselen van schermbreedte, pauzeren van reviews, verminderde beweging, browsen zonder JavaScript, opslag en verzoeken naar externe domeinen. Browser: Microsoft Edge/Chromium. Er is geen test op fysieke iOS/Android-apparaten uitgevoerd.

De technische oplevering is voorbereid voor upload. Er is nog niets gepubliceerd en de productiehost/DNS/HTTPS-configuratie is niet gewijzigd of getest.
