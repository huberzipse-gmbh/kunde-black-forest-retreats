/** Rechnungs-Domäne: eingefrorene, GoBD-unveränderliche Datensätze. */

export interface InvoiceIssuer {
  name: string;
  address: string; // mehrzeilig (\n)
  phone: string;
  email: string;
  vatId: string;
  register: string;
  managingDirector: string;
}

export interface InvoiceLineItem {
  label: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  bookingNumber?: string;
  kind: 'invoice' | 'storno';
  referencesInvoiceNumber?: string;
  issuedAt: string;
  issuer: InvoiceIssuer;
  recipient: { name: string; email: string };
  lineItems: InvoiceLineItem[];
  netCents: number;
  vatRate: number;
  vatCents: number;
  grossCents: number;
  serviceFrom?: string | null;
  serviceTo?: string | null;
  pdfPath?: string;
  voided: boolean;
}
