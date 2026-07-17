import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalLayout } from "@/components/sections/legal/LegalLayout";
import { getLocale } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/i18n/config";

/**
 * Widerrufsbelehrung, mehrsprachig. Die DEUTSCHE Fassung ist rechtlich
 * maßgeblich; die Übersetzungen (EN/ZH/AR) sind eine unverbindliche Lesehilfe
 * (Hinweis am Seitenkopf). Gesetzesverweise (§ BGB) und die Anbieterdaten
 * bleiben in allen Sprachen unverändert.
 *
 * Zwei Fälle, die auseinandergehalten werden müssen:
 * - Beherbergung zu einem bestimmten Zeitraum → kein Widerrufsrecht
 *   (§ 312g Abs. 2 Nr. 9 BGB). Es gelten die Stornobedingungen der AGB.
 * - Gutscheinkauf → die Bereichsausnahme greift NICHT, hier besteht das
 *   gesetzliche 14-tägige Widerrufsrecht.
 */

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = META[locale] ?? META.de;
  return buildMetadata({
    path: "/widerruf",
    locale,
    title: m.title,
    description: m.description,
  });
}

const META: Record<Locale, { title: string; description: string }> = {
  de: {
    title: "Widerrufsbelehrung",
    description:
      "Widerrufsrecht beim Kauf von Gutscheinen sowie Hinweise zum Ausschluss des Widerrufsrechts bei Beherbergungsleistungen.",
  },
  en: {
    title: "Right of Withdrawal",
    description:
      "Right of withdrawal for the purchase of gift cards and notes on the exclusion of the right of withdrawal for accommodation services.",
  },
  zh: {
    title: "撤回权说明",
    description: "购买礼券的撤回权，以及住宿服务不适用撤回权的说明。",
  },
  ar: {
    title: "التعليمات بشأن حق الانسحاب",
    description:
      "حق الانسحاب عند شراء بطاقات الهدايا، وملاحظات حول استثناء حق الانسحاب في خدمات الإقامة.",
  },
};

/** Anbieterdaten — identisch in allen Sprachen. */
const AddressBlock = () => (
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
    <a href="mailto:rentals@axiecentro.de">rentals@axiecentro.de</a>
  </p>
);

interface WiderrufContent {
  title: string;
  updated: string;
  back: string;
  eyebrow: string;
  updatedLabel: string;
  bindingNote: string;
  body: ReactNode;
}

const CONTENT: Record<Locale, WiderrufContent> = {
  de: {
    title: "Widerrufsbelehrung",
    updated: "Juli 2026",
    back: "Zur Startseite",
    eyebrow: "Rechtliches",
    updatedLabel: "Stand",
    bindingNote:
      "Diese Belehrung gilt für Verbraucher (§ 13 BGB): jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.",
    body: (
      <>
        <h2>1. Kein Widerrufsrecht bei Buchung einer Unterkunft</h2>
        <p>
          Bei Verträgen über die Bereitstellung von Beherbergungsleistungen zu einem
          bestimmten Termin oder Zeitraum besteht nach § 312g Abs. 2 Nr. 9 BGB kein
          gesetzliches Widerrufsrecht. Für die Buchung einer unserer Unterkünfte gelten
          daher ausschließlich die in unseren Allgemeinen Geschäftsbedingungen
          vereinbarten Stornierungsbedingungen.
        </p>

        <h2>2. Widerrufsrecht beim Kauf von Gutscheinen</h2>
        <p>
          Für den Kauf von Gutscheinen über diese Website steht Ihnen ein gesetzliches
          Widerrufsrecht zu.
        </p>

        <h3>Widerrufsrecht</h3>
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen
          Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
          Vertragsschlusses.
        </p>
        <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
        <AddressBlock />
        <p>
          mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief
          oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
          informieren. Sie können dafür das unten stehende Muster-Widerrufsformular
          verwenden, das jedoch nicht vorgeschrieben ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
          Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
        </p>

        <h3>Folgen des Widerrufs</h3>
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von
          Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der
          zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der
          Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt
          haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
          zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei
          uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
          Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es
          sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall
          werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
        </p>

        <h3>Vorzeitiges Erlöschen des Widerrufsrechts</h3>
        <p>
          Das Widerrufsrecht erlischt vorzeitig, wenn der Gutschein bereits vollständig
          eingelöst wurde und Sie vor Beginn der Ausführung ausdrücklich zugestimmt
          haben, dass wir mit der Ausführung beginnen, und Sie Ihre Kenntnis davon
          bestätigt haben, dass Sie durch die vollständige Vertragserfüllung Ihr
          Widerrufsrecht verlieren.
        </p>

        <h2>3. Muster-Widerrufsformular</h2>
        <p>
          Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und
          senden Sie es zurück.
        </p>
        <ul>
          <li>
            An: Axiecentro Germany GmbH, Hockenheimer Straße 6, 68723 Oftersheim,
            Deutschland, E-Mail: rentals@axiecentro.de
          </li>
          <li>
            Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über den
            Kauf des folgenden Gutscheins:
          </li>
          <li>Bestellt am / erhalten am:</li>
          <li>Name des/der Verbraucher(s):</li>
          <li>Anschrift des/der Verbraucher(s):</li>
          <li>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</li>
          <li>Datum:</li>
        </ul>
      </>
    ),
  },

  en: {
    title: "Right of Withdrawal",
    updated: "July 2026",
    back: "Back to home",
    eyebrow: "Legal",
    updatedLabel: "Last updated",
    bindingNote:
      "The German version of this document is the legally binding one; this English text is a non-binding translation for your convenience. This notice applies to consumers (§ 13 German Civil Code, BGB): any natural person who enters into a legal transaction for purposes that are predominantly outside their trade, business or profession.",
    body: (
      <>
        <h2>1. No right of withdrawal when booking accommodation</h2>
        <p>
          For contracts on the provision of accommodation services for a specific date or
          period, there is no statutory right of withdrawal under § 312g (2) no. 9 BGB.
          Booking one of our accommodations is therefore governed exclusively by the
          cancellation conditions agreed in our Terms and Conditions.
        </p>

        <h2>2. Right of withdrawal when purchasing gift cards</h2>
        <p>
          For the purchase of gift cards via this website, you have a statutory right of
          withdrawal.
        </p>

        <h3>Right of withdrawal</h3>
        <p>
          You have the right to withdraw from this contract within fourteen days without
          giving any reason. The withdrawal period is fourteen days from the day the
          contract was concluded.
        </p>
        <p>To exercise your right of withdrawal, you must inform us</p>
        <AddressBlock />
        <p>
          by means of a clear statement (e.g. a letter sent by post or an email) of your
          decision to withdraw from this contract. You may use the model withdrawal form
          below, but this is not mandatory.
        </p>
        <p>
          To meet the withdrawal deadline, it is sufficient for you to send your
          notification of exercising the right of withdrawal before the withdrawal period
          expires.
        </p>

        <h3>Consequences of withdrawal</h3>
        <p>
          If you withdraw from this contract, we will reimburse all payments received from
          you, including delivery costs (with the exception of additional costs resulting
          from your choice of a type of delivery other than the cheapest standard delivery
          offered by us), without undue delay and no later than fourteen days from the day
          on which we received notification of your withdrawal from this contract. For this
          repayment we will use the same means of payment that you used for the original
          transaction, unless expressly agreed otherwise with you; in no case will you be
          charged any fees for this repayment.
        </p>

        <h3>Early expiry of the right of withdrawal</h3>
        <p>
          The right of withdrawal expires early if the gift card has already been fully
          redeemed and you expressly agreed, before performance began, that we should begin
          performance, and you confirmed your awareness that you lose your right of
          withdrawal upon full performance of the contract.
        </p>

        <h2>3. Model withdrawal form</h2>
        <p>
          If you wish to withdraw from the contract, please complete this form and return
          it.
        </p>
        <ul>
          <li>
            To: Axiecentro Germany GmbH, Hockenheimer Straße 6, 68723 Oftersheim, Germany,
            email: rentals@axiecentro.de
          </li>
          <li>
            I/we hereby withdraw from the contract concluded by me/us for the purchase of
            the following gift card:
          </li>
          <li>Ordered on / received on:</li>
          <li>Name of consumer(s):</li>
          <li>Address of consumer(s):</li>
          <li>Signature of consumer(s) (only for notification on paper):</li>
          <li>Date:</li>
        </ul>
      </>
    ),
  },

  zh: {
    title: "撤回权说明",
    updated: "2026 年 7 月",
    back: "返回首页",
    eyebrow: "法律信息",
    updatedLabel: "更新于",
    bindingNote:
      "本文件以德文版本为法律依据；此中文文本仅为方便阅读的非约束性译文。本说明适用于消费者（德国民法典 BGB 第 13 条）：即为主要不属于其营业、商业或职业活动目的而订立法律行为的任何自然人。",
    body: (
      <>
        <h2>1. 预订住宿时不享有撤回权</h2>
        <p>
          根据德国民法典（BGB）第 312g 条第 2 款第 9 项，对于在特定日期或期间提供住宿服务的合同，不存在法定撤回权。因此，预订我们的住宿仅适用我们《条款与条件》中约定的取消条件。
        </p>

        <h2>2. 购买礼券时享有撤回权</h2>
        <p>通过本网站购买礼券时，您享有法定撤回权。</p>

        <h3>撤回权</h3>
        <p>
          您有权在十四天内无需说明理由撤回本合同。撤回期限自合同订立之日起计算，为十四天。
        </p>
        <p>如需行使撤回权，您必须通过明确的声明通知我们</p>
        <AddressBlock />
        <p>
          （例如通过邮寄的信函或电子邮件），说明您撤回本合同的决定。您可以使用下方的示范撤回表格，但这并非强制要求。
        </p>
        <p>为遵守撤回期限，您只需在撤回期限届满前寄出行使撤回权的通知即可。</p>

        <h3>撤回的后果</h3>
        <p>
          如果您撤回本合同，我们将立即、并至迟自收到您撤回本合同通知之日起十四天内，退还我们已从您处收到的所有款项，包括交付费用（因您选择我们所提供最便宜标准交付以外的交付方式而产生的额外费用除外）。除非与您另有明确约定，我们将使用您在原交易中所用的同一支付方式进行退款；在任何情况下都不会因此退款向您收取费用。
        </p>

        <h3>撤回权的提前终止</h3>
        <p>
          如果礼券已被完全兑换，且您在履行开始前已明确同意我们开始履行，并确认知悉您将因合同完全履行而丧失撤回权，则撤回权提前终止。
        </p>

        <h2>3. 示范撤回表格</h2>
        <p>如果您希望撤回合同，请填写此表格并寄回。</p>
        <ul>
          <li>
            致：Axiecentro Germany GmbH，Hockenheimer Straße 6, 68723 Oftersheim, 德国，电子邮件：rentals@axiecentro.de
          </li>
          <li>本人/我们特此撤回本人/我们就购买以下礼券所订立的合同：</li>
          <li>订购日期 / 收到日期：</li>
          <li>消费者姓名：</li>
          <li>消费者地址：</li>
          <li>消费者签名（仅纸质通知时需要）：</li>
          <li>日期：</li>
        </ul>
      </>
    ),
  },

  ar: {
    title: "التعليمات بشأن حق الانسحاب",
    updated: "يوليو 2026",
    back: "العودة إلى الصفحة الرئيسية",
    eyebrow: "معلومات قانونية",
    updatedLabel: "آخر تحديث",
    bindingNote:
      "النسخة الألمانية من هذا المستند هي المُلزِمة قانونًا؛ وهذا النص العربي ترجمة غير مُلزِمة لتيسير القراءة. تنطبق هذه التعليمات على المستهلكين (المادة 13 من القانون المدني الألماني BGB): أي شخص طبيعي يُبرم تصرفًا قانونيًا لأغراض لا تُنسب في الغالب إلى نشاطه التجاري أو المهني المستقل.",
    body: (
      <>
        <h2>1. لا يوجد حق انسحاب عند حجز مكان إقامة</h2>
        <p>
          بالنسبة إلى العقود المتعلقة بتقديم خدمات الإقامة في تاريخ أو فترة محددة، لا يوجد حق انسحاب قانوني وفقًا للمادة 312g الفقرة 2 البند 9 من القانون المدني الألماني (BGB). لذلك، يخضع حجز أحد أماكن إقامتنا حصريًا لشروط الإلغاء المتفق عليها في شروطنا وأحكامنا.
        </p>

        <h2>2. حق الانسحاب عند شراء بطاقات الهدايا</h2>
        <p>عند شراء بطاقات الهدايا عبر هذا الموقع، يحق لك التمتع بحق انسحاب قانوني.</p>

        <h3>حق الانسحاب</h3>
        <p>
          يحق لك الانسحاب من هذا العقد خلال أربعة عشر يومًا دون إبداء أي سبب. تبدأ مدة الانسحاب البالغة أربعة عشر يومًا من يوم إبرام العقد.
        </p>
        <p>لممارسة حق الانسحاب، يجب عليك إبلاغنا</p>
        <AddressBlock />
        <p>
          عبر إفادة واضحة (مثل رسالة تُرسَل بالبريد أو بريد إلكتروني) بقرارك الانسحاب من هذا العقد. يمكنك استخدام نموذج الانسحاب أدناه، غير أنه ليس إلزاميًا.
        </p>
        <p>
          للالتزام بمهلة الانسحاب، يكفي أن ترسل إشعار ممارسة حق الانسحاب قبل انقضاء مدة الانسحاب.
        </p>

        <h3>آثار الانسحاب</h3>
        <p>
          إذا انسحبت من هذا العقد، فسنعيد إليك جميع المبالغ التي استلمناها منك، بما في ذلك تكاليف التسليم (باستثناء التكاليف الإضافية الناتجة عن اختيارك نوع تسليم غير التسليم القياسي الأرخص الذي نعرضه)، دون تأخير لا مبرر له وفي موعد أقصاه أربعة عشر يومًا من اليوم الذي يصلنا فيه إشعار انسحابك من هذا العقد. ولهذا الاسترداد نستخدم وسيلة الدفع نفسها التي استخدمتها في المعاملة الأصلية، ما لم يُتفق معك صراحةً على خلاف ذلك؛ ولن تُفرض عليك في أي حال أي رسوم مقابل هذا الاسترداد.
        </p>

        <h3>الانقضاء المبكر لحق الانسحاب</h3>
        <p>
          ينقضي حق الانسحاب مبكرًا إذا كانت بطاقة الهدية قد استُخدمت بالكامل، وكنت قد وافقت صراحةً قبل بدء التنفيذ على أن نبدأ التنفيذ، وأكدت علمك بأنك تفقد حق الانسحاب بمجرد التنفيذ الكامل للعقد.
        </p>

        <h2>3. نموذج الانسحاب</h2>
        <p>إذا رغبت في الانسحاب من العقد، يُرجى تعبئة هذا النموذج وإعادته إلينا.</p>
        <ul>
          <li>
            إلى: Axiecentro Germany GmbH، Hockenheimer Straße 6, 68723 Oftersheim، ألمانيا، البريد الإلكتروني: rentals@axiecentro.de
          </li>
          <li>
            أُلغي/نُلغي بموجب هذا العقد الذي أبرمته/أبرمناه بشأن شراء بطاقة الهدية التالية:
          </li>
          <li>تاريخ الطلب / تاريخ الاستلام:</li>
          <li>اسم المستهلك (المستهلكين):</li>
          <li>عنوان المستهلك (المستهلكين):</li>
          <li>توقيع المستهلك (المستهلكين) (فقط في حال الإبلاغ الورقي):</li>
          <li>التاريخ:</li>
        </ul>
      </>
    ),
  },
};

export default async function WiderrufPage() {
  const locale = await getLocale();
  const c = CONTENT[locale] ?? CONTENT.de;

  return (
    <LegalLayout
      title={c.title}
      updated={c.updated}
      backLabel={c.back}
      eyebrow={c.eyebrow}
      updatedLabel={c.updatedLabel}
    >
      <p>{c.bindingNote}</p>
      {c.body}
    </LegalLayout>
  );
}
