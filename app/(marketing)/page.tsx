import { Hero } from "@/components/sections/Hero";
import { ApartmentsShowcase } from "@/components/sections/ApartmentsShowcase";
import { FloatingSauna } from "@/components/sections/FloatingSauna";
import { Surroundings } from "@/components/sections/Surroundings";
import { SchwarzwaldFact } from "@/components/sections/SchwarzwaldFact";
import { FactDecor } from "@/components/sections/FactDecor";
import { GiftVoucher } from "@/components/sections/GiftVoucher";
import { ApartmentsPreview } from "@/components/sections/ApartmentsPreview";
import { RegionMap } from "@/components/sections/RegionMap";
import { getStrings } from "@/lib/i18n/server";
import { getRetreatCards } from "@/lib/retreats/db";

export default async function HomePage() {
  const t = await getStrings();
  const retreats = await getRetreatCards(t);

  return (
    <>
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
      <RegionMap />
    </>
  );
}
