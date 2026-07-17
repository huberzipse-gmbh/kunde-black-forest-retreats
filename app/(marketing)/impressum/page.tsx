import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/legal/LegalLayout";
import { getLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/impressum",
    locale: await getLocale(),
    title: "Impressum",
    description:
      "Impressum und Anbieterkennzeichnung der Axiecentro Germany GmbH gemäß § 5 DDG.",
  });
}

// HINWEIS: Vor dem Live-Gang die mit [ ... ] markierten Pflichtangaben durch
// die echten Daten ersetzen (USt-IdNr, ggf. weitere Geschäftsführer).

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum" updated="Juni 2026">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <strong>Axiecentro Germany GmbH</strong>
        <br />
        Hockenheimer Straße 6
        <br />
        68723 Oftersheim
        <br />
        Deutschland
      </p>

      <h3>Vertreten durch</h3>
      <p>Geschäftsführer: Tom Thiel</p>

      <h3>Kontakt</h3>
      <p>
        Telefon: +49 7082 944 39 73
        <br />
        E-Mail: rentals@axiecentro.de
      </p>

      <h3>Registereintrag</h3>
      <p>
        Eintragung im Handelsregister.
        <br />
        Registergericht: Amtsgericht Mannheim
        <br />
        Registernummer: HRB 719866
      </p>

      <h3>Umsatzsteuer-Identifikationsnummer</h3>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
        <br />
        [BITTE USt-IdNr EINTRAGEN ODER DIESEN ABSCHNITT ENTFERNEN, FALLS NICHT
        VORHANDEN]
      </p>

      <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
      <p>
        Tom Thiel
        <br />
        Axiecentro Germany GmbH
        <br />
        Hockenheimer Straße 6
        <br />
        68723 Oftersheim
      </p>

      <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren
        vor einer Verbraucherschlichtungsstelle im Sinne des
        Verbraucherstreitbeilegungsgesetzes (VSBG) teilzunehmen.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf
        diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis
        10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte
        oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
        forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
      </p>
      <p>
        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen
        nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
        diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
        konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
        Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </p>

      <h2>Haftung für Links</h2>
      <p>
        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
        wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
        keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
        jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten
        Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
        überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
        erkennbar.
      </p>
      <p>
        Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
        konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
        Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
        entfernen.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiberin erstellten Inhalte und Werke auf diesen
        Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
        Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
        des Urheberrechts bedürfen der schriftlichen Zustimmung der jeweiligen
        Autorin bzw. Erstellerin. Downloads und Kopien dieser Seite sind nur für den
        privaten, nicht kommerziellen Gebrauch gestattet.
      </p>
      <p>
        Soweit die Inhalte auf dieser Seite nicht von der Betreiberin erstellt
        wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
        Inhalte Dritter als solche gekennzeichnet. Bildnachweise einzelner Fotos
        sind direkt am jeweiligen Bild bzw. in der jeweiligen Rubrik angegeben.
        Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
        bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
        Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
      </p>
    </LegalLayout>
  );
}
