import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/legal/LegalLayout";
import { getLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/datenschutz",
    locale: await getLocale(),
    title: "Datenschutzerklärung",
    description:
      "Informationen zur Verarbeitung personenbezogener Daten gemäß Art. 13 DSGVO.",
  });
}

// Kontaktdaten des Verantwortlichen sind identisch zum Impressum — beide Stellen
// bei einer Änderung gemeinsam pflegen.

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung" updated="Juli 2026">
      <p>
        Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen.
        Wir verarbeiten Ihre Daten ausschließlich auf Grundlage der gesetzlichen
        Bestimmungen (insbesondere der Datenschutz-Grundverordnung „DSGVO" sowie des
        Bundesdatenschutzgesetzes „BDSG"). In dieser Datenschutzerklärung
        informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im
        Rahmen unserer Website.
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne des
        Art. 4 Nr. 7 DSGVO ist:
      </p>
      <p>
        <strong>Axiecentro Germany GmbH</strong>
        <br />
        Hockenheimer Straße 6
        <br />
        68723 Oftersheim
        <br />
        Deutschland
        <br />
        Telefon: <a href="tel:+491603756052">+49 7082 944 39 73</a>
        <br />
        E-Mail:{" "}
        <a href="mailto:rentals@axiecentro.de">
          rentals@axiecentro.de
        </a>
      </p>
      <p>
        Eine gesetzliche Pflicht zur Benennung einer/eines Datenschutzbeauftragten
        besteht für unser Unternehmen nicht; eine/ein Datenschutzbeauftragte/r wurde
        nicht bestellt. Bei Fragen zum Datenschutz wenden Sie sich bitte direkt an
        die oben genannten Kontaktdaten.
      </p>

      <h2>2. Ihre Rechte als betroffene Person</h2>
      <p>
        Ihnen stehen hinsichtlich der Sie betreffenden personenbezogenen Daten
        folgende Rechte zu:
      </p>
      <ul>
        <li>Recht auf Auskunft (Art. 15 DSGVO),</li>
        <li>Recht auf Berichtigung (Art. 16 DSGVO),</li>
        <li>Recht auf Löschung (Art. 17 DSGVO),</li>
        <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).</li>
      </ul>
      <p>
        Haben Sie in die Verarbeitung eingewilligt, können Sie diese Einwilligung
        jederzeit mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der
        aufgrund der Einwilligung bis zum Widerruf erfolgten Verarbeitung bleibt
        davon unberührt.
      </p>
      <p>
        <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Soweit wir Ihre Daten auf
        Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO) verarbeiten,
        haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation
        ergeben, jederzeit Widerspruch gegen diese Verarbeitung einzulegen.
      </p>
      <p>
        Ihnen steht zudem ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde
        zu (Art. 77 DSGVO). Die für uns zuständige Aufsichtsbehörde ist:
      </p>
      <p>
        <strong>
          Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
          Baden-Württemberg
        </strong>
        <br />
        Lautenschlagerstraße 20
        <br />
        70173 Stuttgart
        <br />
        Website:{" "}
        <a
          href="https://www.baden-wuerttemberg.datenschutz.de"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.baden-wuerttemberg.datenschutz.de
        </a>
      </p>

      <h2>3. Rechtsgrundlagen der Verarbeitung</h2>
      <p>
        Wir verarbeiten personenbezogene Daten auf Grundlage der folgenden
        Rechtsgrundlagen: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), zur Erfüllung
        eines Vertrags oder zur Durchführung vorvertraglicher Maßnahmen (Art. 6 Abs.
        1 lit. b DSGVO), zur Erfüllung einer rechtlichen Verpflichtung (Art. 6 Abs.
        1 lit. c DSGVO) sowie zur Wahrung unserer berechtigten Interessen (Art. 6
        Abs. 1 lit. f DSGVO). Bei welcher Verarbeitung welche Rechtsgrundlage gilt,
        wird in den nachfolgenden Abschnitten konkretisiert.
      </p>

      <h2>4. Aufruf der Website und Server-Logfiles</h2>
      <p>
        Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum
        Einsatz kommenden Browser automatisch Informationen an den Server unserer
        Website gesendet und vorübergehend in sogenannten Logfiles gespeichert.
        Erfasst werden insbesondere: die IP-Adresse des anfragenden Endgeräts, Datum
        und Uhrzeit des Zugriffs, Name und URL der abgerufenen Datei, die Website,
        von der aus der Zugriff erfolgt (Referrer-URL), der verwendete Browser sowie
        gegebenenfalls das Betriebssystem Ihres Rechners.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse
        liegt in der Gewährleistung eines reibungslosen Verbindungsaufbaus und einer
        komfortablen Nutzung der Website, der Auswertung der Systemsicherheit und
        -stabilität sowie zu weiteren administrativen Zwecken. Die Logfile-Daten
        werden für die Dauer von höchstens 30 Tagen gespeichert und anschließend
        gelöscht, sofern sie nicht zu Beweiszwecken im Falle von Angriffen auf die
        Serverinfrastruktur ausnahmsweise länger aufbewahrt werden müssen.
      </p>

      <h3>Hosting</h3>
      <p>
        Der technische Betrieb und das Hosting unserer Website erfolgen durch die
        Huber &amp; Zipse GmbH. Die Website wird auf Servern in einem Rechenzentrum der
        Hetzner Online GmbH (Industriestr. 25, 91710 Gunzenhausen) am Standort Nürnberg,
        Deutschland, betrieben. Die auf dieser Website erfassten Daten werden auf diesen
        Servern gespeichert. Der Einsatz erfolgt zur ordnungsgemäßen, sicheren und
        effizienten Bereitstellung unseres Online-Angebots auf Grundlage von Art. 6 Abs.
        1 lit. f DSGVO. Mit den eingesetzten Dienstleistern bestehen Verträge über die
        Auftragsverarbeitung gemäß Art. 28 DSGVO.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Unsere Website verwendet ausschließlich technisch notwendige Cookies. Ein
        Cookie ist eine kleine Textdatei, die auf Ihrem Endgerät gespeichert wird.
        Wir setzen einen Cookie zur Speicherung Ihrer Spracheinstellung
        (Bezeichnung: „NEXT_LOCALE", Speicherdauer: bis zu 12 Monate). Dieser Cookie
        ist erforderlich, damit die Website in der von Ihnen gewählten Sprache
        angezeigt wird.
      </p>
      <p>
        Da es sich um unbedingt erforderliche Cookies handelt, ist die Speicherung
        nach § 25 Abs. 2 Nr. 2 TDDDG ohne Einwilligung zulässig; die nachfolgende
        Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses an einer
        funktionsfähigen, nutzerfreundlichen Website (Art. 6 Abs. 1 lit. f DSGVO).
        Einwilligungspflichtige Marketing- oder Analyse-Cookies setzen wir nicht ein.
        Sie können Cookies in den Einstellungen Ihres Browsers jederzeit löschen oder
        deren Speicherung unterbinden.
      </p>

      <h2>6. Kartendarstellung (OpenStreetMap)</h2>
      <p>
        Zur Darstellung von Karten nutzen wir den Kartendienst OpenStreetMap. Anbieter
        ist die OpenStreetMap Foundation, St John's Innovation Centre, Cowley Road,
        Cambridge, CB4 0WS, Vereinigtes Königreich. Beim Aufruf einer Seite mit
        Kartendarstellung werden Kartenkacheln von den Servern von OpenStreetMap
        geladen; dabei wird Ihre IP-Adresse an OpenStreetMap übermittelt, da diese
        für die Auslieferung der Karteninhalte technisch erforderlich ist.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse
        liegt in einer ansprechenden und funktionalen Darstellung unseres Standorts
        und der Umgebung. Für das Vereinigte Königreich liegt ein
        Angemessenheitsbeschluss der Europäischen Kommission vor, sodass ein
        angemessenes Datenschutzniveau gewährleistet ist. Weitere Informationen
        finden Sie in der Datenschutzerklärung von OpenStreetMap unter{" "}
        <a
          href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          wiki.osmfoundation.org/wiki/Privacy_Policy
        </a>
        .
      </p>

      <h2>7. Schriftarten</h2>
      <p>
        Zur einheitlichen Darstellung von Schriftarten verwenden wir Web Fonts, die
        lokal auf unserem Server eingebunden sind und beim Seitenaufruf von dort
        geladen werden. Eine Verbindung zu Servern Dritter (etwa Google Fonts) findet
        hierbei nicht statt; es werden insoweit keine personenbezogenen Daten an
        Dritte übermittelt.
      </p>

      <h2>8. Kontaktaufnahme und Kontaktformular</h2>
      <p>
        Wenn Sie mit uns per E-Mail oder Telefon Kontakt aufnehmen, werden Ihre
        Angaben (z. B. Name, E-Mail-Adresse, Telefonnummer sowie der Inhalt Ihrer
        Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens verarbeitet.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der
        Anbahnung oder Durchführung eines Vertrags zusammenhängt, im Übrigen Art. 6
        Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von
        Anfragen). Die Daten werden gelöscht, sobald Ihre Anfrage abschließend
        bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
      </p>
      <p>
        Über das Kontaktformular auf unserer Website übermittelte Angaben (Name,
        E-Mail-Adresse, optional Telefonnummer und Ihre Nachricht) werden per E-Mail
        an unser Postfach zugestellt und dort bearbeitet. Pflichtangaben sind Name,
        E-Mail-Adresse und Nachricht; ohne diese können wir Ihre Anfrage nicht
        beantworten.
      </p>
      <h3>E-Mail-Versanddienstleister</h3>
      <p>
        Für den Versand von E-Mails (Kontaktanfragen, Buchungsbestätigungen,
        Newsletter) setzen wir den Dienst Resend ein (Resend, Inc., 2261 Market
        Street, San Francisco, CA 94114, USA). Dabei werden die für den Versand
        erforderlichen Daten (insbesondere E-Mail-Adresse und Inhalt der Nachricht)
        an Resend übermittelt und dort verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1
        lit. b DSGVO beziehungsweise Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse an einem zuverlässigen E-Mail-Versand), beim Newsletter Art. 6 Abs.
        1 lit. a DSGVO. Mit Resend besteht ein Vertrag über die Auftragsverarbeitung
        nach Art. 28 DSGVO; die Übermittlung in die USA ist durch
        Standardvertragsklauseln abgesichert.
      </p>

      <h2>9. Newsletter</h2>
      <p>
        Für die Anmeldung zu unserem Newsletter benötigen wir Ihre E-Mail-Adresse.
        Die Anmeldung erfolgt im Double-Opt-in-Verfahren: Nach Eingabe Ihrer Adresse
        senden wir Ihnen eine E-Mail mit einem Bestätigungslink. Erst wenn Sie diesen
        Link anklicken, ist Ihre Anmeldung wirksam und Sie erhalten den Newsletter.
        Bestätigen Sie nicht, versenden wir keine Newsletter an Sie.
      </p>
      <p>
        Gespeichert werden Ihre E-Mail-Adresse, die gewählte Sprache, der Status Ihrer
        Anmeldung sowie der Zeitpunkt der Anmeldung und der Bestätigung. Die
        Speicherung der Bestätigung dient dem Nachweis der Einwilligung. Die
        Speicherung erfolgt in unserer Datenbank (siehe Abschnitt 10,
        Backend-Infrastruktur), der Versand über Resend (siehe Abschnitt 8).
      </p>
      <p>
        Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Sie
        können den Newsletter jederzeit abbestellen und Ihre Einwilligung mit Wirkung
        für die Zukunft widerrufen, etwa über den Abmeldelink in jeder
        Newsletter-E-Mail. Nach der Abmeldung wird Ihre Adresse gelöscht oder,
        soweit zum Nachweis der ursprünglichen Einwilligung erforderlich, gesperrt.
      </p>

      <h2>10. Buchung und Zahlungsabwicklung</h2>
      <p>
        Sofern Sie eine Unterkunft über unsere Website direkt buchen, verarbeiten wir
        die zur Vertragsabwicklung erforderlichen Daten, insbesondere Vor- und
        Nachname, Anschrift, E-Mail-Adresse, Telefonnummer, Reisezeitraum, Anzahl der
        Gäste sowie Zahlungsinformationen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b
        DSGVO (Vertragserfüllung). Soweit gesetzliche Aufbewahrungspflichten bestehen,
        verarbeiten wir die Daten zusätzlich auf Grundlage von Art. 6 Abs. 1 lit. c
        DSGVO.
      </p>
      <h3>Zahlungsdienstleister</h3>
      <p>
        Für die Abwicklung von Zahlungen im Rahmen einer Direktbuchung setzen wir
        gegebenenfalls den Zahlungsdienstleister Stripe ein (Stripe Payments Europe,
        Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland). Die im
        Rahmen des Zahlungsvorgangs eingegebenen Zahlungsdaten werden unmittelbar von
        Stripe verarbeitet; wir selbst erhalten keine vollständigen Kartendaten.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Eine Übermittlung in die USA
        kann erfolgen; diese ist durch geeignete Garantien (Standardvertragsklauseln
        bzw. eine Zertifizierung nach dem EU-US Data Privacy Framework) abgesichert.
        Einzelheiten finden Sie unter{" "}
        <a
          href="https://stripe.com/de/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          stripe.com/de/privacy
        </a>
        .
      </p>
      <h3>Backend- und Datenbankinfrastruktur</h3>
      <p>
        Zur Speicherung und Verwaltung von Buchungs- und gegebenenfalls Kontodaten
        nutzen wir eine Datenbank- und Backend-Infrastruktur (Supabase), die wir auf
        Grundlage eines Auftragsverarbeitungsvertrags gemäß Art. 28 DSGVO einsetzen.
        Die Daten werden ausschließlich zur Bereitstellung der vorgenannten Funktionen
        verarbeitet.
      </p>

      <h2>11. Buchung über Airbnb</h2>
      <p>
        Soweit Sie eine Unterkunft über die Plattform Airbnb buchen, erfolgt die
        Datenverarbeitung im Rahmen dieser Buchung über Airbnb und unterliegt der
        Datenschutzerklärung des jeweiligen Airbnb-Anbieters. Bitte informieren Sie
        sich hierzu unmittelbar bei Airbnb.
      </p>

      <h2>12. Speicherdauer und gesetzliche Aufbewahrungsfristen</h2>
      <p>
        Wir speichern personenbezogene Daten nur so lange, wie dies zur Erreichung
        des jeweiligen Verarbeitungszwecks erforderlich ist oder gesetzliche
        Aufbewahrungsfristen dies vorschreiben. Insbesondere unterliegen
        steuer- und handelsrechtlich relevante Unterlagen den
        Aufbewahrungspflichten nach § 257 HGB und § 147 AO (in der Regel sechs bzw.
        zehn Jahre). Nach Ablauf der Fristen werden die Daten gelöscht.
      </p>

      <h2>13. Datensicherheit</h2>
      <p>
        Wir verwenden innerhalb des Website-Besuchs das verbreitete
        TLS-Verschlüsselungsverfahren (erkennbar an „https://" und dem
        Schloss-Symbol in Ihrer Browserzeile), um die durch Sie übermittelten Daten
        zu schützen. Darüber hinaus treffen wir geeignete technische und
        organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder
        vorsätzliche Manipulationen, Verlust, Zerstörung oder den unberechtigten
        Zugriff Dritter zu schützen.
      </p>

      <h2>14. Aktualität und Änderung dieser Datenschutzerklärung</h2>
      <p>
        Diese Datenschutzerklärung hat den oben angegebenen Stand. Durch die
        Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter
        gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden,
        diese Datenschutzerklärung anzupassen. Die jeweils aktuelle Fassung kann
        jederzeit auf dieser Seite abgerufen werden.
      </p>
    </LegalLayout>
  );
}
