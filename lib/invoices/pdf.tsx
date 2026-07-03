import 'server-only';

/**
 * Rechnungs-PDF via @react-pdf/renderer (pure JS, kein Headless-Browser —
 * läuft schlank im Node-Runtime auf Coolify). Gestaltung in Markenfarben,
 * Standard-Schriften (Helvetica/Times) für maximale Robustheit.
 */
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import type { InvoiceRecord } from './types';

const C = {
  night: '#0f1813',
  forest: '#1b2a21',
  bark: '#6f513a',
  cream: '#faf7f1',
  brass: '#a6863f',
  line: '#ddd2c0',
};

const s = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 72,
    paddingHorizontal: 56,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: C.forest,
  },
  brand: { fontSize: 18, fontFamily: 'Times-Roman', color: C.night },
  brandSub: { fontSize: 8, letterSpacing: 2, color: C.brass, marginTop: 3, textTransform: 'uppercase' },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 36 },
  issuerBlock: { textAlign: 'right', fontSize: 9, lineHeight: 1.5, color: C.bark },
  senderLine: { fontSize: 7, color: C.bark, marginBottom: 6, textDecoration: 'underline' },
  recipient: { fontSize: 10, lineHeight: 1.5 },
  title: { fontSize: 16, fontFamily: 'Times-Roman', color: C.night, marginTop: 28 },
  metaRow: { flexDirection: 'row', gap: 24, marginTop: 10, marginBottom: 24 },
  metaLabel: { fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', color: C.bark },
  metaValue: { fontSize: 10, marginTop: 2 },
  th: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.night,
    paddingBottom: 6,
    marginBottom: 2,
  },
  thText: { fontSize: 7, letterSpacing: 1, textTransform: 'uppercase', color: C.bark },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: C.line,
    paddingVertical: 8,
  },
  colDesc: { flex: 1 },
  colQty: { width: 60, textAlign: 'right' },
  colUnit: { width: 80, textAlign: 'right' },
  colTotal: { width: 80, textAlign: 'right' },
  sumBlock: { marginTop: 14, marginLeft: 'auto', width: 240 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  sumTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: C.night,
    marginTop: 6,
    paddingTop: 6,
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  note: { marginTop: 28, fontSize: 8.5, lineHeight: 1.6, color: C.bark },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 56,
    right: 56,
    borderTopWidth: 0.5,
    borderTopColor: C.line,
    paddingTop: 8,
    fontSize: 7,
    color: C.bark,
    textAlign: 'center',
    lineHeight: 1.6,
  },
});

const eur = (cents: number) =>
  `${(cents / 100).toFixed(2).replace('.', ',')} €`;

const dateDe = (iso: string) =>
  new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

function InvoiceDoc({ invoice }: { invoice: InvoiceRecord }) {
  const issuerAddressOneLine = invoice.issuer.address.replace(/\n/g, ', ');
  const isStorno = invoice.kind === 'storno';

  return (
    <Document
      title={`${isStorno ? 'Stornorechnung' : 'Rechnung'} ${invoice.invoiceNumber}`}
      author={invoice.issuer.name}
    >
      <Page size="A4" style={s.page}>
        {/* Kopf: Marke links, Aussteller rechts */}
        <View style={s.headRow}>
          <View>
            <Text style={s.brand}>Black Forest Retreats</Text>
            <Text style={s.brandSub}>Neuenbürg · Schwarzwald</Text>
          </View>
          <View style={s.issuerBlock}>
            <Text>{invoice.issuer.name}</Text>
            {invoice.issuer.address.split('\n').map((line, i) => (
              <Text key={i}>{line}</Text>
            ))}
            {invoice.issuer.phone ? <Text>Tel. {invoice.issuer.phone}</Text> : null}
            {invoice.issuer.email ? <Text>{invoice.issuer.email}</Text> : null}
          </View>
        </View>

        {/* Empfänger */}
        <Text style={s.senderLine}>
          {invoice.issuer.name}, {issuerAddressOneLine}
        </Text>
        <View style={s.recipient}>
          <Text>{invoice.recipient.name}</Text>
          <Text>{invoice.recipient.email}</Text>
        </View>

        {/* Titel + Metadaten */}
        <Text style={s.title}>
          {isStorno ? 'Stornorechnung' : 'Rechnung'} {invoice.invoiceNumber}
        </Text>
        <View style={s.metaRow}>
          <View>
            <Text style={s.metaLabel}>Rechnungsdatum</Text>
            <Text style={s.metaValue}>{dateDe(invoice.issuedAt)}</Text>
          </View>
          {invoice.serviceFrom && invoice.serviceTo ? (
            <View>
              <Text style={s.metaLabel}>Leistungszeitraum</Text>
              <Text style={s.metaValue}>
                {dateDe(invoice.serviceFrom)} bis {dateDe(invoice.serviceTo)}
              </Text>
            </View>
          ) : null}
          {invoice.bookingNumber ? (
            <View>
              <Text style={s.metaLabel}>Buchungsnummer</Text>
              <Text style={s.metaValue}>{invoice.bookingNumber}</Text>
            </View>
          ) : null}
          {isStorno && invoice.referencesInvoiceNumber ? (
            <View>
              <Text style={s.metaLabel}>Zu Rechnung</Text>
              <Text style={s.metaValue}>{invoice.referencesInvoiceNumber}</Text>
            </View>
          ) : null}
        </View>

        {/* Positionen */}
        <View style={s.th}>
          <Text style={[s.thText, s.colDesc]}>Leistung</Text>
          <Text style={[s.thText, s.colQty]}>Menge</Text>
          <Text style={[s.thText, s.colUnit]}>Einzelpreis</Text>
          <Text style={[s.thText, s.colTotal]}>Gesamt</Text>
        </View>
        {invoice.lineItems.map((item, i) => (
          <View key={i} style={s.tr}>
            <Text style={s.colDesc}>{item.label}</Text>
            <Text style={s.colQty}>{item.quantity}</Text>
            <Text style={s.colUnit}>{eur(item.unitCents)}</Text>
            <Text style={s.colTotal}>{eur(item.totalCents)}</Text>
          </View>
        ))}

        {/* Summen */}
        <View style={s.sumBlock}>
          <View style={s.sumRow}>
            <Text>Nettobetrag</Text>
            <Text>{eur(invoice.netCents)}</Text>
          </View>
          <View style={s.sumRow}>
            <Text>zzgl. {String(invoice.vatRate).replace('.', ',')} % USt.</Text>
            <Text>{eur(invoice.vatCents)}</Text>
          </View>
          <View style={s.sumTotal}>
            <Text>Rechnungsbetrag</Text>
            <Text>{eur(invoice.grossCents)}</Text>
          </View>
        </View>

        {/* Rechtlicher Hinweis */}
        <Text style={s.note}>
          Beherbergungsleistung, ermäßigter Umsatzsteuersatz gemäß § 12 Abs. 2 Nr. 11 UStG.
          {invoice.grossCents >= 0
            ? ' Der Rechnungsbetrag wurde bzw. wird gemäß der gewählten Zahlungsart beglichen.'
            : ' Der Betrag wird erstattet.'}
        </Text>

        {/* Fußzeile */}
        <View style={s.footer} fixed>
          <Text>
            {invoice.issuer.name} · {issuerAddressOneLine}
            {invoice.issuer.managingDirector ? ` · Geschäftsführer: ${invoice.issuer.managingDirector}` : ''}
          </Text>
          <Text>
            {invoice.issuer.register}
            {invoice.issuer.vatId ? ` · USt-IdNr.: ${invoice.issuer.vatId}` : ''}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(invoice: InvoiceRecord): Promise<Buffer> {
  return renderToBuffer(<InvoiceDoc invoice={invoice} />);
}
