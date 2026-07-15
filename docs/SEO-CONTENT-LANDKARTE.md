# SEO/GEO Content-Landkarte

Diese Datei beschreibt Inhalte, die noch NICHT gebaut sind, aber für ein
Goldstandard-Ranking empfohlen werden. Sie ergänzt die bereits umgesetzte
technische Basis (Sprach-URLs, hreflang, Sitemap, robots, JSON-LD, Metadata).

Grundregel aus der Keyword-Recherche: Die Head-Terms ("Ferienwohnung
Schwarzwald", "Wellness Schwarzwald") gehören Booking, Airbnb und FeWo-direkt
und sind für eine kleine Direktanbieter-Seite nicht gewinnbar. Gewonnen wird
über **Ort + Attribut + Anlass** und über die KI-Suchen.

## Priorität 1: Ort-Landingpages (beste Gewinnchance, schwacher Wettbewerb)

Eigene, indexierbare Seiten mit echtem Inhalt (nicht nur Weiterleitung):

**Bereits gebaut (deutsch, im Marken-Design, mit FAQ + JSON-LD):**
- `/ferienwohnung-neuenbuerg` (ferienwohnung/unterkunft/übernachtung neuenbürg)
- `/urlaub-enztal` (urlaub enztal, nachbarorte Birkenfeld/Straubenhardt/Höfen)
- `/ferienwohnung-bad-wildbad` (nähe bad wildbad, baumwipfelpfad, palais thermal)
- `/anreise` (anreise neuenbürg, ohne auto, enztalbahn, entfernungen)

**Noch offen / sinnvoll ergänzbar:**

| Seite | Ziel-Suchbegriffe |
|---|---|
| Raum Pforzheim | ferienwohnung pforzheim umgebung, unterkunft nordschwarzwald pforzheim |
| Eyachtal (eigene Seite, falls Nachfrage) | ferienwohnung eyachtal, wandern eyachtal |

Wichtig für die neuen Seiten: sie sind rein deutsch (canonical + hreflang nur `de` +
`x-default`), weil lokale Ortssuchen deutschsprachig sind. Interne Verlinkung von der
Startseite/Umgebung auf diese Seiten erhöht ihre Relevanz und hilft den Sitelinks.

## Priorität 2: Anlass-Landingpages (konvertieren stark)

| Seite | Ziel-Suchbegriffe |
|---|---|
| Paare / Romantik | romantisches wochenende schwarzwald, ferienwohnung schwarzwald paare, hochzeitstag schwarzwald |
| Mit Hund | hundefreundliche ferienwohnung nordschwarzwald, ferienwohnung mit hund schwarzwald |
| Workation | workation schwarzwald, ferienwohnung mit arbeitsplatz wlan schwarzwald |
| Alle 5 exklusiv (Gruppe/Retreat) | ferienwohnung gruppe schwarzwald, familienfeier schwarzwald unterkunft, team-offsite schwarzwald. **Alleinstellung** - Portale bilden Komplettbuchung kaum ab. |
| Wellness / Therme | wellness ferienwohnung schwarzwald, ferienwohnung mit sauna schwarzwald, palais thermal übernachtung |

## Priorität 3: Erlebnis-Guides (Top-of-Funnel, KI-Futter)

Faktendichte Ratgeber, die LLMs gern zitieren. Baumwipfelpfad + Wildline,
Nationalpark Nordschwarzwald, Wandern Eyachtal/Monbachtal, Schloss Neuenbürg,
Enztalradweg, "Schwarzwald ohne Auto" (KONUS-Gästekarte), "3 Tage
Nordschwarzwald".

## Priorität 4: FAQ-Seite (KI-Sichtbarkeit)

Frage-Antwort-Blöcke à 40-60 Wörter, jeweils eigenständig zitierbar, plus
`FAQPage`-JSON-LD (Hinweis: liefert seit Mai 2026 kein Google-Rich-Result mehr,
bleibt aber für LLM-Verständnis wertvoll). Beispiele:
- Wie weit ist Neuenbürg von Pforzheim / Stuttgart entfernt?
- Wo übernachten für den Baumwipfelpfad Bad Wildbad?
- Ist der Nordschwarzwald ohne Auto machbar? (KONUS)
- Welche Therme im Nordschwarzwald lohnt sich?

## Sprachen

- **Deutsch, Englisch, Arabisch** voll ausbauen. Arabisch mit Fokus auf
  Großfamilie, eigene Küche, Nähe Baden-Baden/Stuttgart, Thermen, Halal-Hinweise
  (Golf-Reisende sind eine reale, kaufkräftige Zielgruppe für den Schwarzwald).
- **Chinesisch (zh-Hans):** eine schlanke Übersichtsseite genügt, ausgerichtet
  auf Google-Nutzer außerhalb Festlandchinas (Taiwan, Singapur, Chinesen in
  Europa). **Kein Baidu-SEO** - braucht ICP-Lizenz/China-Hosting, Zielgruppe
  bucht über Ctrip, wirtschaftlich nicht sinnvoll.

## Bewusst NICHT tun

- Kein Budget auf Head-Terms ("Ferienwohnung Schwarzwald") - nicht gewinnbar.
- Kein Baidu-SEO.
- Kein `llms.txt` als SEO-Maßnahme - von keinem Anbieter als Signal genutzt.
- Keine selbst vergebenen Sterne/Bewertungen im Schema - Google ignoriert sie.
