import { Hero } from "@/components/sections/Hero";
import { ApartmentsShowcase } from "@/components/sections/ApartmentsShowcase";
import { FloatingSauna } from "@/components/sections/FloatingSauna";
import { Surroundings } from "@/components/sections/Surroundings";
import { SchwarzwaldFact } from "@/components/sections/SchwarzwaldFact";
import { FactDecor } from "@/components/sections/FactDecor";
import { GiftVoucher } from "@/components/sections/GiftVoucher";
import { ApartmentsPreview } from "@/components/sections/ApartmentsPreview";
import { RegionMap } from "@/components/sections/RegionMap";
import { ContactForm } from "@/components/sections/ContactForm";
import { PromoBanner } from "@/components/sections/PromoBanner";
import type { Metadata } from "next";
import { getLocale, getStrings } from "@/lib/i18n/server";
import { getRetreatCards } from "@/lib/retreats/db";
import { getPromoBannerData } from "@/lib/booking/promoBanner";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  organizationSchema,
  websiteSchema,
  touristDestinationSchema,
} from "@/lib/seo/schema";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getStrings();
  return buildMetadata({
    path: "/",
    locale,
    title: t.hero.title,
    description: t.hero.subtitle,
  });
}

export default async function HomePage() {
  const t = await getStrings();
  const retreats = await getRetreatCards(t);
  const promo = await getPromoBannerData();

  const schema = [
    organizationSchema(),
    websiteSchema(),
    touristDestinationSchema(
      t.hero.eyebrow,
      t.hero.subtitle,
      ["Nationalpark Schwarzwald", "Baumwipfelpfad Bad Wildbad", "Palais Thermal", "Schloss Neuenbürg", "Enztal"],
    ),
  ];

  return (
    <>
      <JsonLd data={schema} />
      {/* Screenreader/SEO-H1: der Hero zeigt nur ein Video, ohne diese Zeile
          hätte die wichtigste Seite kein H1. Visuell nicht sichtbar. */}
      <h1 className="sr-only">{t.hero.title}</h1>
      {promo && <PromoBanner code={promo.code} percent={promo.percent} />}
      <Hero />
      <ApartmentsShowcase retreats={retreats} />
      <FloatingSauna />
      <Surroundings />
      <SchwarzwaldFact
        factKey="fact1"
        showEyebrow
        tone="light"
        decor={<FactDecor variant="hutUhr" />}
      />
      <GiftVoucher />
      <ApartmentsPreview />
      <SchwarzwaldFact factKey="fact2" bgImage="/images/elemente/mischwald.jpg" nowrapFirst />
      <ContactForm />
      <RegionMap />
    </>
  );
}
