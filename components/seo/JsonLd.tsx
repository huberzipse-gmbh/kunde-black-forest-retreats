/**
 * Rendert ein oder mehrere JSON-LD-Objekte als <script type="application/ld+json">.
 *
 * Server-Komponente ohne sichtbare Ausgabe: das Markup landet im initialen HTML,
 * damit auch Crawler ohne JavaScript-Ausführung (die meisten KI-Bots) es lesen.
 */
type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json | Json[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Inhalt ist serverseitig erzeugt (keine Nutzereingabe) → unbedenklich.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
