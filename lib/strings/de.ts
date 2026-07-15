/**
 * Black Forest Retreats — Quell-Strings (Deutsch = Quellsprache).
 * Konvention: Alle nutzersichtbaren Texte hier ablegen, Zugriff nur über
 * useStrings(). Key-Schema: feature.section.element (camelCase-Blätter).
 * Übersetzen = diese Datei nach en.ts spiegeln.
 *
 * Ton: klar, direkt, hochwertig, persönlich — Gastgeber-Stimme (wir → du),
 * keine Floskeln. (Wording v1, wird noch überarbeitet.)
 */

export const de = {
  brand: {
    name: 'Black Forest Retreats',
    location: 'Neuenbürg',
    tagline: 'Der Schwarzwald, aber privat.',
  },
  // Locale-Formate (z. B. Dezimaltrennzeichen für Bewertungen wie „4,91").
  formats: { decimal: ',' },
  nav: {
    home: 'Startseite',
    retreats: 'Unterkünfte',
    surroundings: 'Umgebung',
    gift: 'Gutschein',
    about: 'Über uns',
    contact: 'Kontakt',
    book: 'Buchen',
    menu: 'Menü',
    close: 'Schließen',
  },
  booking: {
    cta: 'Direkt buchen',
    directBenefit: 'Direkt buchen & sparen',
    bookStay: 'Buche deinen Aufenthalt',
  },

  hero: {
    eyebrow: 'Schwarzwald · Neuenbürg',
    title: 'Erholung im Schwarzwald',
    subtitle:
      'Der Schwarzwald, aber privat. Ferienwohnungen in Neuenbürg.',
    scrollCue: 'Ansehen',
  },

  intro: {
    eyebrow: 'Über uns',
    title: 'Lieber direkt, lieber persönlich',
    text: 'Wir vermieten unsere Ferienwohnungen in Neuenbürg selbst, ohne Portal dazwischen. Das heißt für dich: bester Preis, ein echter Ansprechpartner und Tipps aus erster Hand.',
    features: [
      {
        title: 'Direkt buchen',
        text: 'Ohne Portal-Gebühren. Bei uns bist du immer am günstigsten.',
      },
      {
        title: 'Persönlich',
        text: 'Kein anonymes Hotel, sondern ein Gastgeber, der den Ort wirklich kennt.',
      },
      {
        title: 'Mitten im Wald',
        text: 'Tannen, Tal und Schloss Neuenbürg liegen direkt vor der Tür.',
      },
    ],
  },

  apartments: {
    eyebrow: 'Unterkünfte',
    title: 'Unsere Retreats',
    text: 'Jede Wohnung ist anders: mit Schlossblick, mit Blick auf den Fluss, immer mit einem Stück Schwarzwald. Schau, welche zu dir passt.',
    cta: 'Mehr ansehen',
    prev: 'Zurück',
    next: 'Weiter',
    exclusive: 'Exklusiv',
    heritage: 'Denkmalgeschützt',
    oldTown: 'Historische Altstadt',
    comingSoon: 'Bald verfügbar',
    soldOut: {
      badge: 'Ausgebucht',
      until: (year: string) => `Ausgebucht bis ${year}`,
      featured: 'Sehr gefragt',
      detailTitle: 'Bis auf Weiteres ausgebucht',
      detailText: (year: string) =>
        `Diese Unterkunft ist bis ${year} vollständig ausgebucht. Schau dir gern unsere verfügbaren Wohnungen an.`,
      detailCta: 'Verfügbare Unterkünfte',
    },
    facts: {
      bedrooms: 'Schlafzimmer',
      beds: 'Betten',
      guests: 'Gäste',
      bathrooms: 'Bad',
    },
    detail: {
      back: 'Alle Unterkünfte',
      built: 'Erbaut um',
      overview: 'Im Überblick',
      highlights: 'Das macht es besonders',
      about: 'Die Unterkunft',
      amenities: 'Ausstattung',
      gallery: 'Fotos',
      showAllPhotos: 'Alle Fotos ansehen',
      showAllAmenities: 'Gesamte Ausstattung anzeigen',
      showLess: 'Weniger anzeigen',
      openPhoto: 'Foto im Vollbild öffnen',
      prevPhoto: 'Vorheriges Foto',
      nextPhoto: 'Nächstes Foto',
      close: 'Schließen',
      reviewsTitle: 'Das sagen Gäste',
      reviewsCount: (n: number) => `${n} Bewertungen`,
      ratingLine: (rating: string, n: number) => `${rating} · ${n} Bewertungen`,
      guestFavorite: 'Gäste-Favorit',
      superhost: 'Superhost',
      bookTitle: 'Bereit für den Schwarzwald?',
      bookText: 'Sichere dir deine Tage in Neuenbürg, direkt und ohne Umweg.',
      book: 'Verfügbarkeit & Buchung',
      note: 'Buchung aktuell über Airbnb · Direktbuchung folgt',
    },
    // Meta-Vorlagen (Zahlen kommen aus data/retreats.ts)
    meta: (bedrooms: number, beds: number, guests: number) =>
      `${bedrooms} Schlafzimmer · ${beds} Betten · ${guests} Gäste`,
  },

  floatingSauna: {
    eyebrow: 'Neu auf der Enz',
    comingSoon: 'Coming Soon',
    title: 'Floating Sauna',
    text: 'Bald liegt unsere schwimmende Sauna direkt auf der Enz. Aufheizen, kurz ins kühle Wasser, der Wald ringsum und das Wasser unter dir. Ein neuer Platz zum Abschalten, mitten im Schwarzwald.',
    note: 'Auf der Enz · Eröffnung folgt',
  },

  surroundings: {
    eyebrow: 'Die Umgebung',
    title: 'Was vor der Tür liegt',
    text: 'Gutes Essen, Natur und ein paar echte Schwarzwald-Klassiker, das meiste erreichst du in wenigen Minuten.',
    categories: {
      restaurants: {
        title: 'Restaurants',
        text: 'Vom Wirtshaus ums Eck bis zur Sterneküche.',
      },
      experiences: {
        title: 'Erlebnisse',
        text: 'Mit Alpakas wandern, Kajak auf der Enz, raus ins Tal.',
      },
      nature: {
        title: 'Natur & Wandern',
        text: 'Das Eyachtal, die Wildline-Hängebrücke und der Nationalpark.',
      },
      culture: {
        title: 'Kultur & Sehenswürdigkeiten',
        text: 'Schloss und Bergwerk Neuenbürg, der Gasometer, die Museen in Stuttgart.',
      },
      wellness: {
        title: 'Wellness & Thermen',
        text: 'Thermen und Spas zum Abschalten, gleich um die Ecke.',
      },
      regional: {
        title: 'Genuss & Regionales',
        text: 'Frische Forellen vom Erzeuger und echte Schwarzwald-Spezialitäten.',
      },
    },
    all: 'Alles entdecken',
    discover: 'Entdecken',
    hub: {
      eyebrow: 'Die Umgebung',
      title: 'Was vor der Tür liegt',
      text: 'Von der Sterneküche bis zum stillen Flusstal. Sechs Welten rund um Neuenbürg, das meiste in wenigen Minuten erreichbar.',
      highlights: 'Beliebt bei unseren Gästen',
      highlightsText: 'Was unsere Gäste am liebsten mögen. Pro Kategorie unsere klare Empfehlung.',
      categories: 'Alle Kategorien',
      categoriesText: 'Klapp auf, was dich interessiert, und stöbere in Ruhe.',
    },
    detail: {
      back: 'Zurück zur Umgebung',
      kicker: 'Umgebung',
    },
    accordion: {
      open: 'Aufklappen',
      close: 'Zuklappen',
      viewAll: (title: string) => `Alle ${title} ansehen`,
    },
    card: {
      michelin: 'Michelin',
      dayTrip: 'Tagesausflug',
      recommended: 'Unsere Empfehlung',
      soon: 'Infos folgen in Kürze',
      photo: 'Foto:',
    },
    filter: {
      aria: 'Nach Entfernung filtern',
      near: 'In der Nähe',
      mid: 'Etwas weiter',
      day: 'Tagesausflug',
      empty: 'Für diese Auswahl ist nichts dabei. Aktiviere einen weiteren Bereich.',
    },
  },

  facts: {
    eyebrow: 'Schwarzwald',
    fact1: {
      quote:
        'Die Römer nannten ihn „Silva Nigra": So dicht standen die Tannen, dass kaum Licht den Waldboden erreichte.\n\nDaher der Name: Schwarzwald.',
      source: 'Woher der Name kommt',
    },
    fact2: {
      quote:
        'Kuckucksuhr, Bollenhut, Kirschtorte:\n\nDer Schwarzwald hat ein Faible für Dinge, die Zeit und Handwerk brauchen.\n\nGut, dass du Zeit mitbringst.',
      source: 'Schwarzwald-Gefühl',
    },
  },

  gift: {
    eyebrow: 'Verschenken',
    title: 'Schwarzwald verschenken',
    text: 'Ein Gutschein für ein paar Tage im Schwarzwald. Frei wählbarer Wert, einlösbar für jede Wohnung, das ganze Jahr.',
    cta: 'Gutschein kaufen',
    trust: 'Sofort per E-Mail · 3 Jahre gültig · frei wählbarer Wert',
  },

  contact: {
    eyebrow: 'Schreib uns',
    title: 'Ein Wort genügt',
    text: 'Frag nach freien Terminen, sag uns, worauf du dich freust, oder bleib einfach hallo. Wir melden uns, meist noch am selben Tag.',
    form: {
      name: 'Name',
      namePlaceholder: 'Wie dürfen wir dich nennen?',
      email: 'E-Mail',
      emailPlaceholder: 'name@beispiel.de',
      phone: 'Telefon',
      phoneOptional: 'optional',
      phonePlaceholder: 'Für den kurzen Draht',
      message: 'Nachricht',
      messagePlaceholder: 'Erzähl uns, was dir vorschwebt.',
      submit: 'Nachricht senden',
      sending: 'Wird gesendet …',
    },
    success: {
      title: 'Angekommen.',
      text: 'Danke für deine Nachricht. Wir melden uns bald bei dir, meist noch am selben Tag.',
    },
    error: 'Das hat nicht geklappt. Versuch es gleich noch einmal oder schreib uns direkt eine E-Mail.',
    privacy: 'Mit dem Absenden stimmst du unserer',
    privacyLink: 'Datenschutzerklärung',
    privacyAfter: 'zu.',
  },

  apartmentsPreview: {
    eyebrow: 'Unterkünfte',
    title: 'Deine Wellness-Oase im Schwarzwald',
    text: 'Such dir deine Ferienwohnung in Neuenbürg: Schlossblick, Tannen vorm Fenster, Ruhe inklusive.',
    cta: 'Unterkünfte ansehen & buchen',
  },

  park: {
    home: 'Unser Zuhause',
    name: 'Nationalpark Nordschwarzwald',
    tagline: 'Der Schwarzwald, aber privat.',
  },

  map: {
    eyebrow: 'Hier sind wir',
    title: 'Mitten im Nordschwarzwald',
    subtitle: 'Nationalpark Nordschwarzwald',
    marker: 'Neuenbürg',
    consentText:
      'Die Karte wird von OpenStreetMap geladen. Dabei wird deine IP-Adresse an OpenStreetMap übermittelt.',
    consentCta: 'Karte laden',
  },

  footer: {
    tagline: 'Der Schwarzwald, aber privat. Ferienwohnungen in Neuenbürg.',
    discover: {
      title: 'Entdecken',
      links: ['Unterkünfte', 'Umgebung', 'Gutschein', 'Buchen'],
    },
    service: {
      title: 'Service',
      links: ['Anreise', 'Häufige Fragen', 'Stornierung', 'Kontakt'],
    },
    contact: {
      title: 'Kontakt',
      location: 'Neuenbürg · Nationalpark Nordschwarzwald',
      email: 'hallo@blackforestretreats.de',
      newsletterTitle: 'Newsletter',
      newsletterText: 'Ab und zu Post aus dem Schwarzwald: neue Wohnungen und leise Angebote. Nicht mehr.',
      newsletterPlaceholder: 'Deine E-Mail',
      newsletterCta: 'Abonnieren',
    },
    legal: ['Impressum', 'Datenschutz', 'AGB', 'Widerruf'],
    copyright: (year: number) => `© ${year} Black Forest Retreats`,
    credit: 'Website erstellt von',
  },

  newsletter: {
    sending: 'Moment',
    success:
      'Fast geschafft: Wir haben dir eine E-Mail geschickt. Bitte bestätige darin deine Anmeldung.',
    error: 'Das hat gerade nicht geklappt. Bitte versuche es später noch einmal.',
    privacy: 'Mit der Anmeldung stimmst du unserer',
    privacyLink: 'Datenschutzerklärung',
    privacyAfter: ' zu. Abmeldung jederzeit möglich.',
    mail: {
      subject: 'Bitte bestätige deine Newsletter-Anmeldung',
      intro:
        'Schön, dass du dabei sein möchtest. Bitte bestätige deine Anmeldung zum Newsletter mit einem Klick.',
      cta: 'Anmeldung bestätigen',
      note: 'Wenn du dich nicht angemeldet hast, ignoriere diese E-Mail einfach. Ohne Bestätigung schicken wir dir nichts.',
    },
    confirm: {
      title: 'Anmeldung bestätigt',
      text: 'Danke! Du stehst jetzt auf der Liste und bekommst ab und zu Post aus dem Schwarzwald.',
      invalidTitle: 'Link nicht gültig',
      invalidText:
        'Dieser Bestätigungslink ist ungültig oder nicht mehr aktuell. Melde dich einfach noch einmal an.',
      cta: 'Zur Startseite',
    },
    unsubscribe: {
      title: 'Abgemeldet',
      text: 'Du bekommst keine weiteren Newsletter von uns.',
      invalidTitle: 'Link nicht gültig',
      invalidText: 'Dieser Abmeldelink ist ungültig oder nicht mehr aktuell.',
      cta: 'Zur Startseite',
    },
  },

  langSwitcher: {
    label: 'Sprache',
  },

  cookie: {
    title: 'Cookie-Hinweis',
    text: 'Wir nutzen nur notwendige Cookies, kein Tracking. Externe Karten nur mit deiner Einwilligung.',
    link: 'Datenschutzerklärung',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
  },

  /**
   * Lokalisierbare Inhalte der Unterkünfte (Text raus aus data/retreats.ts).
   * Key = retreat.id. usps[] und reviews[] in DERSELBEN Reihenfolge wie im
   * data-File (Index-basiertes Mergen mit icon bzw. author).
   */
  retreatsContent: {
    'black-forest-penthouse': {
      name: 'Black Forest Penthouse',
      highlight: 'Penthouse · Blick aufs Schloss',
      tagline: 'Unser Beliebtestes',
      shortDescription:
        'Charaktervolles Penthouse unterm Dach mit Terrasse und Blick auf Schloss Neuenbürg.',
      description:
        'Hochwertig renoviertes Penthouse mit zwei Mezzanin-Schlafzimmern unter dem Dach, moderner Küche und großer Terrasse über der Enz. Sichtbare Holzbalken, rustikale Balkenbetten und feine Details: Siebträger-Maschine, Smart-TV mit Netflix und eine Marshall-Soundbox. Mitten im Schwarzwald, mit freiem Blick auf das Schloss Neuenbürg.',
      usps: [
        { title: 'Blick aufs Schloss', text: 'Vom Bett und der Terrasse direkt aufs Schloss Neuenbürg.' },
        { title: 'Check-in per Schlüsselbox', text: 'Komm an, wann du willst, ganz ohne Übergabe.' },
        { title: 'Kostenlose Parkplätze', text: 'Eine Seltenheit in der Gegend, bei uns inklusive.' },
        { title: 'Sehr sauber', text: 'Von Gästen immer wieder besonders gelobt.' },
      ],
      reviews: [
        { text: 'Der Blick aufs Schloss vom Bett aus ist unbezahlbar. Alles sehr sauber, der Check-in über die Schlüsselbox total unkompliziert.' },
        { text: 'Tom ist ein super Gastgeber, schnelle Antworten und tolle Tipps für die Gegend. Die Terrasse am Abend ein Traum.' },
        { text: 'Stilvoll eingerichtet, ruhig und trotzdem zentral. Parkplatz direkt da. Wir kommen wieder!' },
      ],
      amenities: [
        'Große Terrasse',
        'Blick aufs Schloss',
        'Voll ausgestattete Küche',
        'Siebträger-Maschine',
        'Smart-TV & Netflix',
        'Marshall-Soundbox',
        'Schnelles WLAN & Arbeitsplatz',
        'Kostenlose Parkplätze',
      ],
    },
    'fachwerk-apartment': {
      name: 'Fachwerk-Apartment',
      highlight: 'Fachwerk · Terrasse & Schlossblick',
      tagline: 'Perfekt für Paare',
      shortDescription:
        'Echtes Fachwerk, viel warmes Holz und eine Dachterrasse mit Blick aufs Schloss.',
      description:
        'Stilvolles Apartment im historischen Fachwerkhaus: sichtbares Gebälk, Natursteinwände und warmes Holz. Zwei Schlafzimmer, ein privates Badezimmer und eine Dachterrasse über den Dächern von Neuenbürg mit freiem Blick auf das Schloss. Der ruhige Rückzugsort für zwei bis vier Gäste.',
      usps: [
        { title: 'Dachterrasse mit Schlossblick', text: 'Über den Dächern von Neuenbürg, das Schloss im Blick.' },
        { title: 'Echtes Fachwerk', text: 'Sichtbares Gebälk, Natursteinwände, warmes Holz.' },
        { title: 'Privates Badezimmer', text: 'Ganz für dich, modern ausgestattet.' },
        { title: 'Schnelles WLAN', text: 'Auch zum Arbeiten oder Streamen bestens geeignet.' },
      ],
      reviews: [
        { text: 'Das Fachwerk mit den alten Balken hat so viel Charme. Dachterrasse mit Schlossblick, einfach Urlaub pur.' },
        { text: 'Liebevoll eingerichtet, super sauber und ruhig gelegen. Perfekt für ein Wochenende im Schwarzwald.' },
        { text: 'Sehr persönlicher Kontakt, alles hat reibungslos geklappt. Absolute Empfehlung.' },
      ],
      amenities: [
        'Dachterrasse',
        'Blick aufs Schloss',
        'Privates Badezimmer',
        'Voll ausgestattete Küche',
        'Sichtbares Fachwerk',
        'Kostenfreies WLAN',
      ],
    },
    riverhouse: {
      name: 'Riverhouse',
      highlight: 'Direkt am Fluss · Blick aufs Wasser',
      tagline: 'Für die ganze Familie',
      shortDescription:
        'Großzügiges Haus direkt an der Enz mit weitem Blick aufs Wasser.',
      description:
        'Ein weitläufiges Haus unmittelbar am Flussufer der Enz. Große Fensterfronten holen das Wasser ins Innere, dazu viel Platz für Familien und Gruppen. Eigener Zugang zum Ufer, ruhige Lage und der Klang des Flusses vor der Tür.',
      usps: [
        { title: 'Direkt am Fluss', text: 'Das Wasser rauscht vor der Tür, eigener Uferzugang inklusive.' },
        { title: 'Platz für 10 Gäste', text: 'Acht Schlafzimmer, ideal für Familien und Gruppen.' },
        { title: 'Großer Essbereich', text: 'Voll ausgestattete Küche und Tafel für alle.' },
        { title: 'Schnelles WLAN', text: 'Im ganzen Haus, auch fürs Homeoffice am See.' },
      ],
      reviews: [
        { text: 'Direkt am Wasser einzuschlafen war herrlich. Viel Platz für die ganze Familie.' },
        { text: 'Großzügig, hell und der Flussblick ist einmalig. Jederzeit wieder.' },
        { text: 'Morgens Kaffee auf der Terrasse, das Rauschen der Enz im Ohr. Die Kinder wollten gar nicht mehr aus dem Garten.' },
      ],
      amenities: [
        'Direkt am Fluss',
        'Blick aufs Wasser',
        'Eigener Uferzugang',
        'Voll ausgestattete Küche',
        'Großer Essbereich',
        'Schnelles WLAN',
      ],
    },
    'the-raccoon-house': {
      name: 'Country Club',
      highlight: 'Marktstraße 25 · Altstadt',
      tagline: 'Altstadt-Charme',
      shortDescription:
        'Charaktervolles Stadthaus in der Marktstraße 25, mitten in der Altstadt.',
      description:
        'Ein liebevoll hergerichtetes Stadthaus in der Marktstraße 25, direkt im historischen Kern von Neuenbürg. Knarrende Dielen, dicke Mauern und viel Charakter über mehrere Etagen. Cafés, Bäcker und das Schloss sind nur ein paar Schritte entfernt.',
      usps: [
        { title: 'Mitten in der Altstadt', text: 'Cafés, Bäcker und das Schloss sind nur ein paar Schritte weg.' },
        { title: 'Über mehrere Etagen', text: 'Viel Charakter und Raum in einem historischen Stadthaus.' },
        { title: 'Voll ausgestattete Küche', text: 'Zum Kochen wie zu Hause.' },
        { title: 'Kostenfreies WLAN', text: 'Schnell und stabil im ganzen Haus.' },
      ],
      reviews: [
        { text: 'Mitten in der Altstadt, charmantes Stadthaus über mehrere Etagen. Wir haben uns sofort wohlgefühlt.' },
        { text: 'Perfekte Lage, alles fußläufig erreichbar. Schön und mit Liebe eingerichtet.' },
        { text: 'Über drei Etagen viel Ruhe, und trotzdem steht man in zwei Minuten am Marktplatz. Check-in völlig unkompliziert.' },
      ],
      amenities: [
        'Mitten in der Altstadt',
        'Über mehrere Etagen',
        'Historisches Stadthaus',
        'Voll ausgestattete Küche',
        'Kostenfreies WLAN',
      ],
    },
    'the-postal-office': {
      name: 'The Postal Office',
      highlight: 'Das alte Postamt · Im Herzen von Neuenbürg',
      tagline: 'Unser Herzstück',
      shortDescription:
        'Das ehrwürdige alte Postamt, großzügig umgebaut für große Gruppen.',
      description:
        'Das historische Postamt von Neuenbürg, mit viel Liebe zu einem außergewöhnlichen Refugium umgebaut. Hohe Decken, weite Räume und Platz für große Gruppen oder Feiern. Ein besonderer Ort mit Geschichte, mitten im Herzen der Stadt.',
      usps: [
        { title: 'Historisches Postamt', text: 'Ein besonderer Ort mit Geschichte, mitten in Neuenbürg.' },
        { title: 'Bis zu 20 Gäste', text: 'Zehn Schlafzimmer für große Gruppen und Feiern.' },
        { title: 'Hohe Decken & weite Räume', text: 'Großzügig wie kaum eine andere Unterkunft.' },
        { title: 'Großer Gemeinschaftsbereich', text: 'Zum gemeinsamen Kochen, Essen und Beisammensein.' },
      ],
      reviews: [
        { text: 'Was für ein besonderes Haus! Hohe Decken, viel Platz, ideal für unsere große Gruppe.' },
        { text: 'Geschichte zum Anfassen und richtig viel Raum. Ein echtes Erlebnis.' },
        { text: 'Als alte Post hat das Haus richtig Charakter. Wir waren zu acht und jeder hatte trotzdem seine Ecke.' },
      ],
      amenities: [
        'Historisches Postamt',
        'Hohe Decken & weite Räume',
        'Ideal für große Gruppen',
        'Großer Gemeinschaftsbereich',
        'Voll ausgestattete Küche',
        'Schnelles WLAN',
      ],
    },
    'grey-fox': {
      name: 'Grey Fox',
      highlight: 'Le Renard Ivre · Altstadt',
      tagline: 'Altstadt-Charme',
      shortDescription:
        'Gemütliches Stadthaus in der historischen Altstadt, benannt nach „Le Renard Ivre", dem betrunkenen Fuchs.',
      description:
        'Ein charmantes Refugium in der historischen Altstadt von Neuenbürg, liebevoll „Le Renard Ivre" getauft, nach dem alten Sprichwort vom betrunkenen Fuchs. Warmes Holz, dicke Mauern und viel Charakter über mehrere Etagen. Cafés, Bäcker und das Schloss sind nur ein paar Schritte entfernt.',
      usps: [
        { title: 'Mitten in der historischen Altstadt', text: 'Cafés, Bäcker und das Schloss sind nur ein paar Schritte weg.' },
        { title: 'Viel Charakter', text: 'Warmes Holz und dicke Mauern in einem historischen Stadthaus.' },
        { title: 'Voll ausgestattete Küche', text: 'Zum Kochen wie zu Hause.' },
        { title: 'Kostenfreies WLAN', text: 'Schnell und stabil im ganzen Haus.' },
      ],
      reviews: [
        { text: 'Ein echtes Schmuckstück in der Altstadt. Der „betrunkene Fuchs" hat uns sofort verzaubert.' },
        { text: 'Charmant, ruhig und alles fußläufig erreichbar. Wir kommen wieder.' },
        { text: 'Klein, fein und mit viel Liebe zum Detail. Der Bäcker um die Ecke war jeden Morgen unser erster Weg.' },
      ],
      amenities: [
        'Mitten in der historischen Altstadt',
        'Über mehrere Etagen',
        'Historisches Stadthaus',
        'Voll ausgestattete Küche',
        'Kostenfreies WLAN',
      ],
    },
  } as Record<
    string,
    {
      name: string;
      highlight: string;
      tagline: string;
      shortDescription: string;
      description: string;
      usps: { title: string; text: string }[];
      reviews: { text: string }[];
      amenities: string[];
    }
  >,

  /**
   * Lokalisierbare Inhalte der Orte (Text raus aus data/surroundings.ts).
   * Key = place.id.
   */
  surroundingsContent: {
    'berlins-krone': {
      name: 'Berlins Krone',
      town: 'Bad Teinach',
      blurb:
        'Sternegekrönte Küche im Hotel Berlins KroneLamm. Der besondere Abend, wenn es etwas zu feiern gibt.',
      features: ['Michelin', 'Sterneküche', 'Fine Dining'],
    },
    'benders-birkenfeld': {
      name: 'Benders Birkenfeld',
      town: 'Birkenfeld',
      blurb:
        'Bodenständiger Familienbetrieb mit regionaler Küche, gleich um die Ecke.',
      features: ['Gutbürgerlich', 'Regional', 'Familienbetrieb'],
    },
    'arlinger-gaststaette': {
      name: 'Arlinger Gaststätte',
      town: 'Pforzheim',
      blurb: 'Bürgerliche Klassiker und eine schöne Terrasse für den Sommerabend.',
      features: ['Bürgerlich', 'Terrasse'],
    },
    'seehaus-pforzheim': {
      name: 'Seehaus',
      town: 'Pforzheim',
      blurb: 'Ausflugslokal am Wald, ideal nach einem Spaziergang.',
      features: ['Ausflugslokal', 'Am Wald'],
    },
    'foerstlich-weinbar': {
      name: 'Förstlich Weinbar',
      town: 'Langensteinbach',
      blurb: 'Weinbar mit Vesper und regionalen Tropfen für den entspannten Abend.',
      features: ['Weinbar', 'Vesper', 'Regionale Weine'],
    },
    'muellers-event-alm': {
      name: 'Müllers Eventalm',
      blurb: 'Deftige Alm-Stimmung mit großem Biergarten und Eventcharakter.',
      features: ['Alm', 'Biergarten', 'Event'],
    },
    'cafe-blaich': {
      name: 'Café Blaich',
      town: 'Höfen a.d. Enz',
      blurb:
        'Konditorei und Café seit 1954, hausgemachte Kuchen für den süßen Nachmittagsstopp.',
      features: ['Café', 'Konditorei', 'Seit 1954'],
    },
    gruenhuette: {
      name: 'Waldgaststätte Grünhütte',
      town: 'Bad Wildbad',
      blurb:
        'Legendäre Waldgaststätte am Sommerberg, berühmt für ihre Heidelbeerpfannkuchen.',
      features: ['Heidelbeerpfannkuchen', 'Nur zu Fuß/Rad', 'Schwarzwald-Küche'],
    },
    'alpaka-wanderung': {
      name: 'Alpaka-Wanderung',
      town: 'Pforzheim',
      blurb: 'Geführte Tour mit den ruhigen Tieren durch Wald und Wiesen.',
      features: ['Geführt', 'Familie', '≈ 2 Std'],
    },
    'wildpark-pforzheim': {
      name: 'Wildpark Pforzheim',
      town: 'Pforzheim',
      blurb: 'Heimische Tiere hautnah, ein ganzjähriger Ausflug für die ganze Familie.',
      features: ['Tiere', 'Familie', 'Ganzjährig'],
    },
    'kajak-enz': {
      name: 'Kajaktour auf der Enz',
      town: 'Enztal',
      blurb: 'Aktiv auf dem Wasser durchs Tal. Verleih und Touren im Sommer.',
      features: ['Aktiv', 'Sommer', 'Verleih'],
    },
    fliegenfischen: {
      name: 'Fliegenfischen',
      town: 'Eyachtal',
      blurb: 'Geführte Kurse am klaren Wasser, Ruhe und Konzentration in der Natur.',
      features: ['Geführt', 'Kurs', 'Natur'],
    },
    minigolf: {
      name: 'Minigolf Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'Der Klassiker für entspannte Stunden an der frischen Luft.',
      features: ['Familie', 'Draußen'],
    },
    freibad: {
      name: 'Freibad Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'Abkühlung an heißen Tagen, entspannt und familienfreundlich.',
      features: ['Sommer', 'Familie'],
    },
    'ziegen-wanderung': {
      name: 'Ziegen-Wanderung',
      town: 'Straubenhardt',
      blurb: 'Unterwegs mit neugierigen Ziegen, ein Erlebnis besonders für Kinder.',
      features: ['Geführt', 'Für Kinder'],
    },
    'nationalpark-schwarzwald': {
      name: 'Nationalpark Schwarzwald',
      town: 'Ruhestein',
      blurb:
        'Urwald von morgen: weite Wege, Hochmoore und Gipfelblicke. Ein lohnender Tagesausflug.',
      features: ['Wandern', 'Aussicht', 'Tagesausflug'],
    },
    eyachtal: {
      name: 'Eyachtal',
      town: 'Eyachtal',
      blurb: 'Stilles Flusstal zum Wandern und Durchatmen, gleich in der Nähe.',
      features: ['Wandern', 'Fluss', 'Ruhig'],
    },
    'wildline-haengebruecke': {
      name: 'Wildline-Hängebrücke',
      town: 'Bad Wildbad',
      blurb:
        'Schwankende Brücke hoch über dem Tal, dazu der Baumwipfelpfad, Aussicht für die ganze Familie.',
      features: ['Aussicht', 'Familie', 'Baumwipfelpfad'],
    },
    baumwipfelpfad: {
      name: 'Baumwipfelpfad Schwarzwald',
      town: 'Bad Wildbad',
      blurb:
        'Hoch über den Baumkronen am Sommerberg, mit Aussichtsturm und langer Tunnelrutsche.',
      features: ['Aussichtsturm', 'Rutsche', 'Barrierefrei'],
    },
    'gruenhuette-wandern': {
      name: 'Wanderung zur Grünhütte',
      town: 'Bad Wildbad',
      blurb:
        'Waldwanderung zur Grünhütte mit ihren berühmten Heidelbeerpfannkuchen am Ziel.',
      features: ['Wandern', '5 bis 7 km', 'Einkehr'],
    },
    'bergwerk-neuenburg': {
      name: 'Besucherbergwerk Frischglück',
      town: 'Neuenbürg',
      blurb:
        'Historisches Schaubergwerk samt Schloss Neuenbürg, mit Führungen und „Theater im Berg“, direkt vor der Haustür.',
      features: ['Historisch', 'Führung', 'Theater im Berg'],
    },
    'schloss-neuenbuerg': {
      name: 'Schloss Neuenbürg',
      town: 'Neuenbürg',
      blurb:
        'Das Wahrzeichen über der Stadt: Renaissance-Schloss hoch über der Enzschleife, mit Museum, Schlossgarten und weitem Blick. Vom Penthouse aus immer im Blick, zu Fuß schnell erreicht.',
      features: ['Wahrzeichen', 'Museum', 'Schlossgarten'],
    },
    'gasometer-pforzheim': {
      name: 'Gasometer Pforzheim',
      town: 'Pforzheim',
      blurb: 'Riesiges 360°-Panorama im alten Gasometer, ein Kunsterlebnis der besonderen Art.',
      features: ['Kunst', 'Panorama', 'Einzigartig'],
    },
    'porsche-museum': {
      name: 'Porsche Museum',
      town: 'Stuttgart',
      blurb: 'Sportwagen-Ikonen und kühne Architektur. Ein Tagesausflug für Technik-Fans.',
      features: ['Architektur', 'Tagesausflug'],
    },
    'mercedes-museum': {
      name: 'Mercedes-Benz Museum',
      town: 'Stuttgart',
      blurb: 'Über ein Jahrhundert Automobilgeschichte auf einer spiralförmigen Zeitreise.',
      features: ['Geschichte', 'Tagesausflug'],
    },
    wilhelma: {
      name: 'Wilhelma',
      town: 'Stuttgart',
      blurb: 'Zoologisch-botanischer Garten im maurischen Stil. Ein Tag für die ganze Familie.',
      features: ['Zoo & Botanik', 'Familie', 'Tagesausflug'],
    },
    'wildpark-pforzheim-sehenswuerdigkeit': {
      name: 'Wildpark Pforzheim',
      town: 'Pforzheim',
      blurb:
        'Über 400 Tiere in rund 70 Arten auf 16,5 Hektar, von Luchs und Elch bis zum Streichelzoo. Eintritt frei, einer der schönsten Wildparks in Baden-Württemberg.',
      features: ['Über 400 Tiere', 'Eintritt frei', 'Familie'],
    },
    'palais-thermal': {
      name: 'Palais Thermal',
      town: 'Bad Wildbad',
      blurb:
        'Historisches Thermalbad im maurischen Stil mit Saunalandschaft, der ruhige Tag ganz in der Nähe.',
      features: ['Historische Therme', 'Sauna'],
    },
    'siebentaeler-therme': {
      name: 'Siebentäler Therme',
      town: 'Bad Herrenalb',
      blurb: 'Warmes Thermalwasser und weite Saunalandschaft zum Loslassen.',
      features: ['Thermal', 'Sauna'],
    },
    'mineraltherme-teinach': {
      name: 'Mineraltherme',
      town: 'Bad Teinach',
      blurb: 'Heilwasser und Spa in ruhiger Lage, ideal zum Entschleunigen.',
      features: ['Heilwasser', 'Spa'],
    },
    'forellenzucht-zordel': {
      name: 'Forellenzucht Zordel',
      town: 'Eyachtal',
      blurb:
        'Frische Forellen direkt vom Erzeuger, geräuchert und zum Mitnehmen. Regional, wie es sein soll.',
      features: ['Frische Forellen', 'Räucherei', 'Verkauf'],
    },
  } as Record<
    string,
    { name: string; town?: string; blurb: string; features: string[] }
  >,

  /* ── Buchungsflow (Kalender → Prüfen → Zahlung → Bestätigung) ─────────── */
  bookingFlow: {
    alsoOnAirbnb: 'Auch auf Airbnb',
    steps: {
      dates: 'Zeitraum wählen',
      review: 'Prüfen',
      pay: 'Bezahlen',
    },
    calendar: {
      title: 'Wähle deine Nächte',
      checkIn: 'Anreise',
      checkOut: 'Abreise',
      selectCheckIn: 'Anreisetag wählen',
      selectCheckOut: 'Abreisetag wählen',
      nights: (n: number) => (n === 1 ? '1 Nacht' : `${n} Nächte`),
      minNights: (n: number) => `Mindestaufenthalt: ${n} Nächte`,
      blocked: 'Belegt',
      available: 'Frei',
      clear: 'Auswahl zurücksetzen',
      prevMonth: 'Voriger Monat',
      nextMonth: 'Nächster Monat',
    },
    guests: {
      title: 'Gäste',
      adults: 'Erwachsene',
      adultsHint: 'Ab 13 Jahren',
      children: 'Kinder',
      childrenHint: '2 bis 12 Jahre',
      infants: 'Kleinkinder',
      infantsHint: 'Unter 2 Jahren',
      max: (n: number) => `Maximal ${n} Gäste`,
      summary: (n: number) => (n === 1 ? '1 Gast' : `${n} Gäste`),
      infantsNote: 'Kleinkinder zählen nicht zur Gästezahl.',
    },
    price: {
      perNight: 'pro Nacht',
      nightsLine: (price: string, n: number) =>
        `${price} × ${n === 1 ? '1 Nacht' : `${n} Nächte`}`,
      cleaning: 'Reinigung',
      registered: 'Vorteil für registrierte Gäste',
      total: 'Gesamt',
      inclVat: (rate: string) => `inkl. ${rate} % MwSt.`,
      goodPrice: 'Guter Preis: Dein Zeitraum liegt im unteren Durchschnitt der letzten 60 Tage.',
      details: 'Preisaufschlüsselung',
      promoLine: (code: string) => `Rabattcode ${code}`,
      giftLine: (code: string) => `Gutschein ${code}`,
      giftRemainderNote: 'Restguthaben bleibt auf deinem Gutschein-Code.',
    },
    promo: {
      title: 'Rabatt- oder Gutscheincode',
      placeholder: 'Code eingeben',
      apply: 'Einlösen',
      giftApplied: (code: string, balance: string) =>
        `Gutschein ${code} aktiv · Guthaben ${balance}.`,
      applied: (code: string, pct: string) =>
        `Code ${code} aktiv: ${pct} % auf den Übernachtungspreis.`,
      invalid: 'Dieser Code ist leider nicht gültig.',
      remove: 'Entfernen',
      banner: (pct: string) =>
        `Schön, dass du direkt buchst: ${pct} % Rabatt auf den Übernachtungspreis sind für dich hinterlegt.`,
      bannerCta: 'Wohnung aussuchen',
      close: 'Schließen',
    },
    cta: {
      checkAvailability: 'Verfügbarkeit prüfen',
      continue: 'Weiter',
      back: 'Zurück',
      toPayment: 'Weiter zur Zahlung',
      confirmPay: 'Bestätigen und bezahlen',
      reserve: 'Verbindlich buchen',
    },
    review: {
      title: 'Deine Reise im Überblick',
      dates: 'Datum',
      guests: 'Gäste',
      edit: 'Ändern',
      cancellationTitle: 'Stornierung',
      cancellationFree: (days: number) =>
        `Kostenlos stornierbar bis ${days} Tage vor Anreise. Danach wird der volle Betrag fällig.`,
      paymentTimingTitle: 'Wann möchtest du zahlen?',
      payNow: 'Jetzt bezahlen',
      payNowHint: 'Alles erledigt. Du reist ganz entspannt an.',
      payLater: 'Später zahlen',
      payLaterHint: (days: number) =>
        `Karte jetzt hinterlegen, abgebucht wird erst ${days} Tage vor Anreise. Deine Buchung ist sofort verbindlich.`,
      payLaterUnavailable: 'Deine Anreise liegt zu nah. Es ist nur noch Sofortzahlung möglich.',
      contactTitle: 'Deine Daten',
      nameLabel: 'Vor- und Nachname',
      emailLabel: 'E-Mail-Adresse',
      emailHint: 'An diese Adresse schicken wir Bestätigung und Rechnung.',
      registerTeaser: (pct: string) =>
        `Mit Konto sparst du zusätzlich ${pct} % bei jeder Buchung.`,
      continueAsGuest: 'Als Gast buchen',
      loginTab: 'Anmelden',
      registerTab: 'Konto anlegen',
      passwordLabel: 'Passwort',
      loginButton: 'Anmelden',
      registerButton: 'Konto anlegen und sparen',
      loggedInAs: (email: string) => `Angemeldet als ${email}`,
      logout: 'Abmelden',
    },
    payment: {
      title: 'Zahlung',
      whenYouPay: 'Wann du zahlst',
      payNowSummary: 'Der Gesamtbetrag wird jetzt fällig.',
      payLaterSummary: (date: string) =>
        `Deine Karte wird am ${date} belastet. Bis dahin zahlst du nichts.`,
      methodsTitle: 'Zahlungsart wählen',
      demoBanner: 'Demo-Modus: Es wird keine echte Zahlung ausgeführt.',
      demoButton: 'Demo-Zahlung ausführen',
      demoCardNote: 'Die Zahlungsfelder sind in der Demo deaktiviert.',
      processing: 'Zahlung wird verarbeitet …',
      securityNote: 'Sichere Zahlung über Stripe. Deine Daten bleiben verschlüsselt.',
    },
    confirmation: {
      title: 'Buchung bestätigt',
      subtitle: 'Wir freuen uns auf dich im Schwarzwald.',
      numberLabel: 'Buchungsnummer',
      emailSent: (email: string) => `Deine Bestätigung ist unterwegs an ${email}.`,
      scheduledNote: (date: string) => `Abgebucht wird am ${date}.`,
      backHome: 'Zur Startseite',
      viewAccount: 'Zu deinen Buchungen',
    },
    account: {
      title: 'Dein Konto',
      subtitle: 'Buchungen einsehen, schneller buchen, dauerhaft sparen.',
      benefit: (pct: string) => `Als registrierter Gast sparst du ${pct} % bei jeder Buchung.`,
      login: 'Anmelden',
      register: 'Konto anlegen',
      logout: 'Abmelden',
      emailLabel: 'E-Mail-Adresse',
      passwordLabel: 'Passwort',
      myBookings: 'Deine Buchungen',
      noBookings: 'Noch keine Buchungen. Der Schwarzwald wartet.',
      statusConfirmed: 'Bestätigt',
      statusPending: 'Offen',
      statusCancelled: 'Storniert',
      checkEmail: 'Fast geschafft: Bitte bestätige deine E-Mail-Adresse über den Link in deinem Postfach.',
      working: 'Einen Moment …',
      passwordHint: 'Mindestens 6 Zeichen.',
      errInvalid: 'E-Mail oder Passwort stimmt nicht. Falls du noch kein Konto hast, lege oben eines an.',
      errNotConfirmed: 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link in deinem Postfach.',
      errExists: 'Für diese E-Mail gibt es schon ein Konto. Wechsle bitte auf „Anmelden“.',
      errPassword: 'Das Passwort muss mindestens 6 Zeichen haben.',
    },
    errors: {
      unavailable: 'Dieser Zeitraum ist leider schon belegt. Wähle bitte andere Daten.',
      minNights: (n: number) => `Bitte wähle mindestens ${n} Nächte.`,
      maxGuests: (n: number) => `In dieser Wohnung sind maximal ${n} Gäste möglich.`,
      invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse an.',
      missingName: 'Bitte gib deinen Namen an.',
      paymentFailed: 'Die Zahlung hat nicht geklappt. Bitte versuche es erneut.',
      generic: 'Da ist etwas schiefgelaufen. Bitte versuche es erneut.',
      notConfigured: 'Die Direktbuchung ist noch nicht freigeschaltet. Bitte versuche es später noch einmal.',
      authFailed: 'Anmeldung fehlgeschlagen. Bitte prüfe E-Mail und Passwort.',
    },
    email: {
      confirmSubject: (nr: string) => `Deine Buchung ${nr} ist bestätigt`,
      greeting: (name: string) => `Hallo ${name},`,
      confirmIntro: 'schön, dass du direkt bei uns buchst. Hier ist alles auf einen Blick:',
      datesLabel: 'Zeitraum',
      guestsLabel: 'Gäste',
      totalLabel: 'Gesamtbetrag',
      scheduledLine: (date: string) => `Deine Karte wird am ${date} belastet.`,
      invoiceSubject: (nr: string) => `Deine Rechnung zur Buchung ${nr}`,
      invoiceIntro: 'anbei findest du deine Rechnung als PDF. Danke für deine Buchung.',
      failedSubject: (nr: string) => `Zahlung zur Buchung ${nr} fehlgeschlagen`,
      failedIntro: 'die Abbuchung für deine Buchung hat leider nicht geklappt. Bitte melde dich bei uns, dann finden wir eine Lösung.',
      signoff: 'Herzliche Grüße aus dem Schwarzwald',
      teamName: 'Black Forest Retreats',
    },
  },

  giftFlow: {
    steps: {
      amount: 'Wert',
      personalize: 'Personalisieren',
      preview: 'Vorschau',
      pay: 'Bezahlen',
    },
    hero: {
      eyebrow: 'Gutschein',
      title: 'Schwarzwald verschenken',
      intro: 'Wert wählen, Widmung schreiben, fertig. Der Gutschein kommt sofort als PDF per E-Mail.',
    },
    amount: {
      title: 'Wähle den Wert',
      custom: 'Wunschbetrag',
      customPlaceholder: 'z. B. 75',
      customHint: (min: string, max: string) => `Frei wählbar zwischen ${min} und ${max}.`,
    },
    personalize: {
      title: 'Für wen ist er?',
      forLabel: 'Für',
      forPlaceholder: 'Name der beschenkten Person',
      fromLabel: 'Von',
      fromPlaceholder: 'Dein Name',
      messageLabel: 'Persönliche Nachricht (optional)',
      messagePlaceholder: 'Ein paar Zeilen für den Anlass …',
      emailLabel: 'Deine E-Mail-Adresse',
      emailHint: 'Dorthin schicken wir den Gutschein als PDF.',
      iconLabel: 'Motiv',
      icons: {
        hut: 'Bollenhut',
        uhr: 'Kuckucksuhr',
        kirschtorte: 'Kirschtorte',
        schinken: 'Schwarzwälder Schinken',
      },
    },
    preview: {
      title: 'So sieht dein Gutschein aus',
      note: 'Der Gutschein-Code erscheint nach der Zahlung auf der Karte und im PDF.',
    },
    card: {
      eyebrow: 'Gutschein',
      forLabel: 'Für',
      fromLabel: 'Von',
      codeLabel: 'Code',
      validity: '3 Jahre gültig',
      validUntil: (d: string) => `Gültig bis ${d}`,
      redeemHint: 'Einlösbar bei jeder Buchung auf blackforest-retreats.de',
    },
    payment: {
      title: 'Bezahlen',
      summaryLabel: 'Gutschein für',
      valueLabel: 'Wert',
    },
    success: {
      pendingTitle: 'Zahlung wird bestätigt …',
      pendingText: 'Einen Moment, wir warten auf die Bestätigung deiner Zahlung.',
      title: 'Danke! Dein Gutschein ist unterwegs.',
      mailInfo: (email: string) => `Wir haben den Gutschein als PDF an ${email} geschickt.`,
      codeLabel: 'Dein Gutschein-Code',
      downloadCta: 'PDF herunterladen & drucken',
      redeemHint: 'Einlösen: Code bei der Buchung ins Codefeld eingeben, der Wert wird direkt abgezogen. Restguthaben bleibt auf dem Code.',
    },
    cta: {
      back: 'Zurück',
      next: 'Weiter',
      toPayment: 'Weiter zur Zahlung',
    },
    errors: {
      invalid: 'Bitte prüfe deine Eingaben.',
      generic: 'Das hat leider nicht geklappt. Versuch es bitte gleich noch einmal.',
    },
    email: {
      subject: (code: string) => `Dein Gutschein ${code} · Black Forest Retreats`,
      greeting: (name: string) => `Hallo ${name},`,
      intro: (recipient: string) =>
        `dein Gutschein für ${recipient} ist bezahlt und hängt als PDF an dieser E-Mail. Ausdrucken, verschenken, freuen.`,
      issuedIntro: (recipient: string) =>
        `dein Gutschein für ${recipient} ist da und hängt als PDF an dieser E-Mail. Ausdrucken, verschenken, freuen.`,
      codeLabel: 'Code',
      valueLabel: 'Wert',
      validLabel: 'Gültig bis',
      redeemHint: 'Einlösen: Bei der Buchung auf blackforest-retreats.de den Code ins Codefeld eingeben. Restguthaben bleibt auf dem Code.',
      invoiceNote: 'Die Rechnung zu deinem Kauf liegt ebenfalls als PDF bei.',
    },
  },
};

export type Strings = typeof de;
