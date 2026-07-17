/**
 * English strings — mirror of de.ts with identical structure and keys.
 * Source of truth for structure: ./de. Translate values only, keep keys.
 *
 * Voice: clear, direct, warm host. We → you. No filler, no AI tells, no dashes.
 */
import type { Strings } from './de';

export const en: Strings = {
  brand: {
    name: 'Black Forest Retreats',
    location: 'Neuenbürg',
    tagline: 'The Black Forest, but private.',
  },
  formats: { decimal: '.' },
  nav: {
    home: 'Home',
    retreats: 'Stays',
    surroundings: 'Surroundings',
    gift: 'Gift card',
    about: 'About us',
    contact: 'Contact',
    book: 'Book',
    menu: 'Menu',
    close: 'Close',
  },
  booking: {
    cta: 'Book direct',
    directBenefit: 'Book direct & save',
    bookStay: 'Book your stay',
  },

  hero: {
    eyebrow: 'Black Forest · Neuenbürg',
    title: 'Time off in the Black Forest',
    subtitle:
      'The Black Forest, but private. Holiday apartments in Neuenbürg.',
    scrollCue: 'Take a look',
  },

  intro: {
    eyebrow: 'About us',
    title: 'Rather direct, rather personal',
    text: 'We rent out our holiday homes in Neuenbürg ourselves, with no platform in between. For you that means the best price, a real person to talk to, and tips straight from a local.',
    features: [
      {
        title: 'Book direct',
        text: 'No platform fees. With us you always pay the lowest price.',
      },
      {
        title: 'Personal',
        text: 'No anonymous hotel, just a host who truly knows the place.',
      },
      {
        title: 'Right in the woods',
        text: 'Fir trees, the valley and Schloss Neuenbürg are right outside the door.',
      },
    ],
  },

  apartments: {
    eyebrow: 'Stays',
    title: 'Our retreats',
    text: 'Every home is different: with a castle view, with a view of the river, always with a piece of the Black Forest. See which one suits you.',
    cta: 'See more',
    prev: 'Back',
    next: 'Next',
    exclusive: 'Exclusive',
    heritage: 'Heritage-listed',
    oldTown: 'Historic old town',
    comingSoon: 'Coming soon',
    soldOut: {
      badge: 'Booked out',
      until: (year: string) => `Booked out until ${year}`,
      featured: 'In high demand',
      detailTitle: 'Booked out until further notice',
      detailText: (year: string) =>
        `This stay is fully booked until ${year}. Take a look at our available homes instead.`,
      detailCta: 'Available stays',
    },
    facts: {
      bedrooms: 'Bedrooms',
      beds: 'Beds',
      guests: 'Guests',
      bathrooms: 'Bath',
    },
    detail: {
      back: 'All stays',
      built: 'Built around',
      overview: 'At a glance',
      highlights: 'What makes it special',
      about: 'The stay',
      amenities: 'Amenities',
      gallery: 'Photos',
      showAllPhotos: 'See all photos',
      showAllAmenities: 'Show all amenities',
      showLess: 'Show less',
      openPhoto: 'Open photo full screen',
      prevPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      close: 'Close',
      reviewsTitle: 'What guests say',
      reviewsCount: (n: number) => `${n} reviews`,
      ratingLine: (rating: string, n: number) => `${rating} · ${n} reviews`,
      guestFavorite: 'Guest favourite',
      superhost: 'Superhost',
      bookTitle: 'Ready for the Black Forest?',
      bookText: 'Secure your days in Neuenbürg, direct and without detour.',
      book: 'Availability & booking',
      note: 'Currently booked via Airbnb · direct booking coming soon',
    },
    // Meta templates (numbers come from data/retreats.ts)
    meta: (bedrooms: number, beds: number, guests: number) =>
      `${bedrooms} bedrooms · ${beds} beds · ${guests} guests`,
  },

  floatingSauna: {
    eyebrow: 'New on the Enz',
    comingSoon: 'Coming Soon',
    title: 'Floating Sauna',
    text: 'Soon our floating sauna will sit right on the Enz. Heat up, a quick dip in the cool water, the forest all around and the river beneath you. A new place to switch off, deep in the Black Forest.',
    note: 'On the Enz · Opening soon',
  },

  surroundings: {
    eyebrow: 'The surroundings',
    title: 'What lies outside the door',
    text: 'Good food, nature and a few real Black Forest classics, most of it just minutes away.',
    categories: {
      restaurants: {
        title: 'Restaurants',
        text: 'From the tavern round the corner to starred cuisine.',
      },
      experiences: {
        title: 'Experiences',
        text: 'Hike with alpacas, kayak the Enz, head out into the valley.',
      },
      nature: {
        title: 'Nature & hiking',
        text: 'The Eyachtal, the Wildline suspension bridge and the national park.',
      },
      culture: {
        title: 'Culture & sights',
        text: 'The castle and mine in Neuenbürg, the Gasometer, the museums in Stuttgart.',
      },
      wellness: {
        title: 'Wellness & spas',
        text: 'Thermal baths and spas to switch off, right around the corner.',
      },
      regional: {
        title: 'Food & local',
        text: 'Fresh trout straight from the farm and real Black Forest specialities.',
      },
    },
    all: 'Discover everything',
    discover: 'Discover',
    hub: {
      eyebrow: 'The surroundings',
      title: 'What lies outside the door',
      text: 'From starred cuisine to a quiet river valley. Six worlds around Neuenbürg, most of them just minutes away.',
      highlights: 'Loved by our guests',
      highlightsText: 'What our guests like best. One clear recommendation per category.',
      categories: 'All categories',
      categoriesText: 'Open up whatever catches your eye and browse at your own pace.',
    },
    detail: {
      back: 'Back to the surroundings',
      kicker: 'Surroundings',
    },
    accordion: {
      open: 'Open up',
      close: 'Close',
      viewAll: (title: string) => `See all ${title}`,
    },
    card: {
      michelin: 'Michelin',
      dayTrip: 'Day trip',
      recommended: 'Our pick',
      soon: 'More info coming soon',
      photo: 'Photo:',
    },
    filter: {
      aria: 'Filter by distance',
      near: 'Nearby',
      mid: 'A bit further',
      day: 'Day trip',
      empty: 'Nothing here for this selection. Switch on another area.',
    },
  },

  facts: {
    eyebrow: 'Black Forest',
    fact1: {
      quote:
        'The Romans called it "Silva Nigra": the firs stood so dense that barely any light reached the forest floor.\n\nHence the name: Black Forest.',
      source: 'Where the name comes from',
    },
    fact2: {
      quote:
        'Cuckoo clock, Bollenhut, cherry cake:\n\nthe Black Forest has a soft spot for things that take time and craft.\n\nGood thing you brought some time with you.',
      source: 'Black Forest feeling',
    },
  },

  gift: {
    eyebrow: 'Give a gift',
    title: 'Give the Black Forest',
    text: 'A gift card for a few days in the Black Forest. Choose the value freely, redeemable for any home, all year round.',
    cta: 'Buy a gift card',
    trust: 'Instant by email · valid for 3 years · free choice of value',
  },

  contact: {
    eyebrow: 'Say hello',
    title: 'One word is enough',
    text: 'Ask about open dates, tell us what you are looking forward to, or just say hello. We usually reply the same day.',
    form: {
      name: 'Name',
      namePlaceholder: 'What should we call you?',
      email: 'Email',
      emailPlaceholder: 'name@example.com',
      phone: 'Phone',
      phoneOptional: 'optional',
      phonePlaceholder: 'For a quick call',
      message: 'Message',
      messagePlaceholder: 'Tell us what you have in mind.',
      submit: 'Send message',
      sending: 'Sending …',
    },
    success: {
      title: 'Received.',
      text: 'Thank you for your message. We will get back to you soon, usually the same day.',
    },
    error: 'That did not go through. Please try again in a moment or email us directly.',
    privacy: 'By sending, you agree to our',
    privacyLink: 'privacy policy',
    privacyAfter: '.',
  },

  apartmentsPreview: {
    eyebrow: 'Stays',
    title: 'Your wellness oasis in the Black Forest',
    text: 'Find your holiday home in Neuenbürg: a castle view, fir trees at the window, quiet included.',
    cta: 'See stays & book',
  },

  park: {
    home: 'Our home',
    name: 'Nationalpark Nordschwarzwald',
    tagline: 'The Black Forest, but private.',
  },

  map: {
    eyebrow: "Here's where we are",
    title: 'Right in the Northern Black Forest',
    subtitle: 'Nationalpark Nordschwarzwald',
    marker: 'Neuenbürg',
    consentText:
      'The map is loaded from OpenStreetMap. Your IP address is transmitted to OpenStreetMap in the process.',
    consentCta: 'Load map',
  },

  footer: {
    tagline: 'The Black Forest, but private. Holiday homes in Neuenbürg.',
    discover: {
      title: 'Discover',
      links: ['Stays', 'Surroundings', 'Gift card', 'Book', 'Account'],
    },
    service: {
      title: 'Service',
      links: ['Getting here', 'FAQ', 'Cancellation', 'Contact'],
    },
    contact: {
      title: 'Contact',
      location: 'Neuenbürg · Nationalpark Nordschwarzwald',
      email: 'rentals@axiecentro.de',
      phone: '+49 7082 944 39 73',
      newsletterTitle: 'Newsletter',
      newsletterText: 'Now and then a note from the Black Forest: new homes and quiet offers. Nothing more.',
      newsletterPlaceholder: 'Your email',
      newsletterCta: 'Subscribe',
    },
    legal: ['Imprint', 'Privacy', 'Terms', 'Right of withdrawal'],
    copyright: (year: number) => `© ${year} Black Forest Retreats`,
    credit: 'Website created by',
  },

  newsletter: {
    sending: 'One moment',
    success:
      'Almost done: we have sent you an email. Please confirm your subscription in it.',
    error: 'That did not work just now. Please try again later.',
    privacy: 'By subscribing you agree to our',
    privacyLink: 'privacy policy',
    privacyAfter: '. You can unsubscribe at any time.',
    mail: {
      subject: 'Please confirm your newsletter subscription',
      intro:
        'Glad to have you on board. Please confirm your newsletter subscription with one click.',
      cta: 'Confirm subscription',
      note: 'If you did not sign up, simply ignore this email. Without confirmation we will not send you anything.',
    },
    confirm: {
      title: 'Subscription confirmed',
      text: 'Thank you! You are on the list and will hear from the Black Forest now and then.',
      invalidTitle: 'Link not valid',
      invalidText:
        'This confirmation link is invalid or out of date. Please simply sign up again.',
      cta: 'Back to home',
    },
    unsubscribe: {
      title: 'Unsubscribed',
      text: 'You will not receive any further newsletters from us.',
      invalidTitle: 'Link not valid',
      invalidText: 'This unsubscribe link is invalid or out of date.',
      cta: 'Back to home',
    },
  },

  langSwitcher: {
    label: 'Language',
  },

  cookie: {
    title: 'Cookie notice',
    text: 'We only use necessary cookies, no tracking. External maps only with your consent.',
    link: 'Privacy policy',
    accept: 'Accept',
    reject: 'Decline',
  },

  /**
   * Localised stay content (text out of data/retreats.ts).
   * Key = retreat.id. usps[] and reviews[] in the SAME order as the data file.
   */
  retreatsContent: {
    'black-forest-penthouse': {
      name: 'Black Forest Penthouse',
      highlight: 'Penthouse · view of the castle',
      tagline: 'Our most loved',
      shortDescription:
        'Characterful penthouse under the eaves with a terrace and a view of Schloss Neuenbürg.',
      description:
        'A high-end renovated penthouse with two mezzanine bedrooms under the roof, a modern kitchen and a large terrace above the Enz. Exposed wooden beams, rustic beam beds and fine details: a portafilter machine, a smart TV with Netflix and a Marshall speaker. Right in the Black Forest, with a clear view of Schloss Neuenbürg.',
      usps: [
        { title: 'View of the castle', text: 'Look straight out at Schloss Neuenbürg from the bed and the terrace.' },
        { title: 'Check-in by key box', text: 'Arrive whenever you like, with no handover needed.' },
        { title: 'Free parking', text: 'A rarity in the area, included with us.' },
        { title: 'Spotlessly clean', text: 'Praised again and again by our guests.' },
      ],
      reviews: [
        { text: 'The view of the castle from the bed is priceless. Everything spotless, and check-in via the key box was completely effortless.' },
        { text: 'Beautifully kept and tastefully furnished, every detail is right. There is plenty to do in the area, and the terrace in the evening is a dream.' },
        { text: 'Stylishly furnished, quiet and still central. Parking right there. We will be back!' },
      ],
      amenities: [
        'Large terrace',
        'View of the castle',
        'Fully equipped kitchen',
        'Portafilter machine',
        'Smart TV & Netflix',
        'Marshall speaker',
        'Fast Wi-Fi & workspace',
        'Free parking',
      ],
    },
    'fachwerk-apartment': {
      name: 'Fachwerk-Apartment (timber-frame)',
      highlight: 'Timber frame · terrace & castle view',
      tagline: 'Perfect for couples',
      shortDescription:
        'Real timber framing, plenty of warm wood and a roof terrace with a view of the castle.',
      description:
        'A stylish apartment in a historic timber-framed house: exposed beams, natural stone walls and warm wood. Two bedrooms, a private bathroom and a roof terrace above the rooftops of Neuenbürg with a clear view of the castle. The quiet retreat for two to four guests.',
      usps: [
        { title: 'Roof terrace with castle view', text: 'Above the rooftops of Neuenbürg, the castle in view.' },
        { title: 'Real timber framing', text: 'Exposed beams, natural stone walls, warm wood.' },
        { title: 'Private bathroom', text: 'All yours, modern and well equipped.' },
        { title: 'Fast Wi-Fi', text: 'Great for working or streaming too.' },
      ],
      reviews: [
        { text: 'The timber frame with its old beams has so much charm. Roof terrace with a castle view, simply a proper holiday.' },
        { text: 'Lovingly furnished, super clean and in a quiet spot. Perfect for a weekend in the Black Forest.' },
        { text: 'Very personal contact, everything went smoothly. Highly recommended.' },
      ],
      amenities: [
        'Roof terrace',
        'View of the castle',
        'Private bathroom',
        'Fully equipped kitchen',
        'Exposed timber framing',
        'Free Wi-Fi',
      ],
    },
    riverhouse: {
      name: 'Riverhouse',
      highlight: 'Right by the river · view of the water',
      tagline: 'For the whole family',
      shortDescription:
        'A spacious house right on the Enz with a wide view of the water.',
      description:
        'A roomy house right on the bank of the Enz. Large windows bring the water inside, with plenty of space for families and groups. Private access to the riverbank, a quiet setting and the sound of the river outside the door.',
      usps: [
        { title: 'Right by the river', text: 'The water flows past the door, with private bank access included.' },
        { title: 'Room for 10 guests', text: 'Eight bedrooms, ideal for families and groups.' },
        { title: 'Large dining area', text: 'A fully equipped kitchen and a table for everyone.' },
        { title: 'Fast Wi-Fi', text: 'Throughout the house, even for working by the water.' },
      ],
      reviews: [
        { text: 'Falling asleep right by the water was wonderful. Plenty of room for the whole family.' },
        { text: 'Spacious, bright and the river view is one of a kind. Any time again.' },
        { text: 'Coffee on the terrace in the morning with the Enz rushing below. The kids did not want to leave the garden.' },
      ],
      amenities: [
        'Right by the river',
        'View of the water',
        'Private bank access',
        'Fully equipped kitchen',
        'Large dining area',
        'Fast Wi-Fi',
      ],
    },
    'the-raccoon-house': {
      name: 'Country Club',
      highlight: 'Marktstraße 25 · old town',
      tagline: 'Old-town charm',
      shortDescription:
        'A characterful town house at Marktstraße 25, right in the old town.',
      description:
        'A lovingly restored town house at Marktstraße 25, right in the historic heart of Neuenbürg. Creaking floorboards, thick walls and plenty of character across several floors. Cafés, bakeries and the castle are just a few steps away.',
      usps: [
        { title: 'Right in the old town', text: 'Cafés, bakeries and the castle are just a few steps away.' },
        { title: 'Across several floors', text: 'Plenty of character and space in a historic town house.' },
        { title: 'Fully equipped kitchen', text: 'Cook just like at home.' },
        { title: 'Free Wi-Fi', text: 'Fast and stable throughout the house.' },
      ],
      reviews: [
        { text: 'Right in the old town, a charming town house over several floors. We felt at home straight away.' },
        { text: 'Perfect location, everything within walking distance. Beautiful and furnished with love.' },
        { text: 'Plenty of quiet across three floors, yet the market square is two minutes away. Check-in could not have been simpler.' },
      ],
      amenities: [
        'Right in the old town',
        'Across several floors',
        'Historic town house',
        'Fully equipped kitchen',
        'Free Wi-Fi',
      ],
    },
    'the-postal-office': {
      name: 'The Postal Office',
      highlight: 'The old post office · in the heart of Neuenbürg',
      tagline: 'Our centrepiece',
      shortDescription:
        'The venerable old post office, generously converted for large groups.',
      description:
        'The historic post office of Neuenbürg, lovingly converted into an extraordinary retreat. High ceilings, wide rooms and space for large groups or celebrations. A special place with history, right in the heart of town.',
      usps: [
        { title: 'Historic post office', text: 'A special place with history, right in the heart of Neuenbürg.' },
        { title: 'Up to 20 guests', text: 'Ten bedrooms for large groups and celebrations.' },
        { title: 'High ceilings & wide rooms', text: 'Spacious like almost no other stay.' },
        { title: 'Large shared area', text: 'For cooking, eating and being together.' },
      ],
      reviews: [
        { text: 'What a special house! High ceilings, lots of space, ideal for our large group.' },
        { text: 'History you can touch and really plenty of room. A genuine highlight.' },
        { text: 'As a former post office the house has real character. There were eight of us and everyone still had their own corner.' },
      ],
      amenities: [
        'Historic post office',
        'High ceilings & wide rooms',
        'Ideal for large groups',
        'Large shared area',
        'Fully equipped kitchen',
        'Fast Wi-Fi',
      ],
    },
    'grey-fox': {
      name: 'Grey Fox',
      highlight: 'Le Renard Ivre · old town',
      tagline: 'Old-town charm',
      shortDescription:
        'A cosy town house in the historic old town, named after "Le Renard Ivre", the drunken fox.',
      description:
        'A charming retreat in the historic old town of Neuenbürg, fondly named "Le Renard Ivre" after the old saying about the drunken fox. Warm wood, thick walls and plenty of character across several floors. Cafés, bakeries and the castle are just a few steps away.',
      usps: [
        { title: 'Right in the historic old town', text: 'Cafés, bakeries and the castle are just a few steps away.' },
        { title: 'Full of character', text: 'Warm wood and thick walls in a historic town house.' },
        { title: 'Fully equipped kitchen', text: 'Cook just like at home.' },
        { title: 'Free Wi-Fi', text: 'Fast and stable throughout the house.' },
      ],
      reviews: [
        { text: 'A real gem in the old town. The "drunken fox" won us over straight away.' },
        { text: 'Charming, quiet and everything within walking distance. We will be back.' },
        { text: 'Small, refined and full of care for the details. The bakery round the corner was our first stop every morning.' },
      ],
      amenities: [
        'Right in the historic old town',
        'Across several floors',
        'Historic town house',
        'Fully equipped kitchen',
        'Free Wi-Fi',
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
   * Localised place content (text out of data/surroundings.ts).
   * Key = place.id.
   */
  surroundingsContent: {
    'berlins-krone': {
      name: 'Berlins Krone',
      town: 'Bad Teinach',
      blurb:
        'Star-rated cuisine at Hotel Berlins KroneLamm. The special evening, for when there is something to celebrate.',
      features: ['Michelin', 'Starred cuisine', 'Fine dining'],
    },
    'benders-birkenfeld': {
      name: 'Benders Birkenfeld',
      town: 'Birkenfeld',
      blurb:
        'A down-to-earth family business with regional cooking, just around the corner.',
      features: ['Hearty fare', 'Regional', 'Family-run'],
    },
    'arlinger-gaststaette': {
      name: 'Arlinger Gaststätte',
      town: 'Pforzheim',
      blurb: 'Hearty classics and a lovely terrace for a summer evening.',
      features: ['Hearty', 'Terrace'],
    },
    'seehaus-pforzheim': {
      name: 'Seehaus',
      town: 'Pforzheim',
      blurb: 'A spot by the woods, ideal after a walk.',
      features: ['Day spot', 'By the woods'],
    },
    'foerstlich-weinbar': {
      name: 'Förstlich Weinbar',
      town: 'Langensteinbach',
      blurb: 'A wine bar with platters and regional pours for a relaxed evening.',
      features: ['Wine bar', 'Platters', 'Regional wines'],
    },
    'muellers-event-alm': {
      name: 'Müllers Eventalm',
      blurb: 'Hearty alpine-hut vibes with a large beer garden and an event feel.',
      features: ['Alpine hut', 'Beer garden', 'Events'],
    },
    'cafe-blaich': {
      name: 'Café Blaich',
      town: 'Höfen a.d. Enz',
      blurb:
        'A patisserie and café since 1954, with homemade cakes for a sweet afternoon stop.',
      features: ['Café', 'Patisserie', 'Since 1954'],
    },
    gruenhuette: {
      name: 'Waldgaststätte Grünhütte',
      town: 'Bad Wildbad',
      blurb:
        'A legendary forest inn on the Sommerberg, famous for its blueberry pancakes.',
      features: ['Blueberry pancakes', 'On foot/bike only', 'Black Forest cuisine'],
    },
    'alpaka-wanderung': {
      name: 'Alpaca hike',
      town: 'Pforzheim',
      blurb: 'A guided tour with these calm animals through woods and meadows.',
      features: ['Guided', 'Family', '≈ 2 hrs'],
    },
    'wildpark-pforzheim': {
      name: 'Wildpark Pforzheim',
      town: 'Pforzheim',
      blurb: 'Native animals up close, a year-round outing for the whole family.',
      features: ['Animals', 'Family', 'Year-round'],
    },
    'kajak-enz': {
      name: 'Kayak tour on the Enz',
      town: 'Enztal',
      blurb: 'Out on the water through the valley. Rentals and tours in summer.',
      features: ['Active', 'Summer', 'Rental'],
    },
    fliegenfischen: {
      name: 'Fly fishing',
      town: 'Eyachtal',
      blurb: 'Guided courses by clear water, calm and focus out in nature.',
      features: ['Guided', 'Course', 'Nature'],
    },
    minigolf: {
      name: 'Minigolf Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'The classic for relaxed hours in the fresh air.',
      features: ['Family', 'Outdoors'],
    },
    freibad: {
      name: 'Freibad Neuenbürg',
      town: 'Neuenbürg',
      blurb: 'A cool-off on hot days, relaxed and family-friendly.',
      features: ['Summer', 'Family'],
    },
    'ziegen-wanderung': {
      name: 'Goat hike',
      town: 'Straubenhardt',
      blurb: 'Out and about with curious goats, an experience especially for kids.',
      features: ['Guided', 'For kids'],
    },
    'nationalpark-schwarzwald': {
      name: 'Nationalpark Schwarzwald',
      town: 'Ruhestein',
      blurb:
        'The wilderness of tomorrow: long trails, high moors and summit views. A rewarding day trip.',
      features: ['Hiking', 'Views', 'Day trip'],
    },
    eyachtal: {
      name: 'Eyachtal',
      town: 'Eyachtal',
      blurb: 'A quiet river valley for hiking and breathing deep, right nearby.',
      features: ['Hiking', 'River', 'Quiet'],
    },
    'wildline-haengebruecke': {
      name: 'Wildline suspension bridge',
      town: 'Bad Wildbad',
      blurb:
        'A swaying bridge high above the valley, plus the treetop walk, with views for the whole family.',
      features: ['Views', 'Family', 'Treetop walk'],
    },
    baumwipfelpfad: {
      name: 'Black Forest Treetop Walk',
      town: 'Bad Wildbad',
      blurb:
        'High above the treetops on the Sommerberg, with a viewing tower and a long tunnel slide.',
      features: ['Viewing tower', 'Slide', 'Barrier-free'],
    },
    'gruenhuette-wandern': {
      name: 'Hike to the Grünhütte',
      town: 'Bad Wildbad',
      blurb:
        'A forest hike to the Grünhütte and its famous blueberry pancakes.',
      features: ['Hiking', '5 to 7 km', 'Refreshment stop'],
    },
    'bergwerk-neuenburg': {
      name: 'Besucherbergwerk Frischglück',
      town: 'Neuenbürg',
      blurb:
        'A historic show mine alongside Schloss Neuenbürg, with guided tours and "Theater im Berg", right on the doorstep.',
      features: ['Historic', 'Guided tour', 'Theater im Berg'],
    },
    'schloss-neuenbuerg': {
      name: 'Schloss Neuenbürg (Neuenbürg Castle)',
      town: 'Neuenbürg',
      blurb:
        'The landmark above town: a Renaissance castle high above the bend of the Enz, with a museum, castle garden and far-reaching views. Always in sight from the penthouse, a short walk away.',
      features: ['Landmark', 'Museum', 'Castle garden'],
    },
    'gasometer-pforzheim': {
      name: 'Gasometer Pforzheim',
      town: 'Pforzheim',
      blurb: 'A huge 360° panorama inside the old gasometer, an art experience like no other.',
      features: ['Art', 'Panorama', 'One of a kind'],
    },
    'porsche-museum': {
      name: 'Porsche Museum',
      town: 'Stuttgart',
      blurb: 'Sports-car icons and bold architecture. A day trip for fans of engineering.',
      features: ['Architecture', 'Day trip'],
    },
    'mercedes-museum': {
      name: 'Mercedes-Benz Museum',
      town: 'Stuttgart',
      blurb: 'Over a century of automotive history on a spiralling journey through time.',
      features: ['History', 'Day trip'],
    },
    wilhelma: {
      name: 'Wilhelma',
      town: 'Stuttgart',
      blurb: 'A zoological and botanical garden in Moorish style. A day for the whole family.',
      features: ['Zoo & botany', 'Family', 'Day trip'],
    },
    'wildpark-pforzheim-sehenswuerdigkeit': {
      name: 'Wildpark Pforzheim',
      town: 'Pforzheim',
      blurb:
        'More than 400 animals across around 70 species on 16.5 hectares, from lynx and elk to the petting zoo. Free admission, one of the finest wildlife parks in Baden-Württemberg.',
      features: ['400+ animals', 'Free admission', 'Family'],
    },
    'palais-thermal': {
      name: 'Palais Thermal',
      town: 'Bad Wildbad',
      blurb:
        'A historic thermal bath in Moorish style with a sauna world, for a calm day close by.',
      features: ['Historic thermal bath', 'Sauna'],
    },
    'siebentaeler-therme': {
      name: 'Siebentäler Therme',
      town: 'Bad Herrenalb',
      blurb: 'Warm thermal water and a wide sauna world to let go.',
      features: ['Thermal', 'Sauna'],
    },
    'mineraltherme-teinach': {
      name: 'Mineraltherme',
      town: 'Bad Teinach',
      blurb: 'Healing water and a spa in a quiet setting, ideal for slowing down.',
      features: ['Healing water', 'Spa'],
    },
    'forellenzucht-zordel': {
      name: 'Forellenzucht Zordel',
      town: 'Eyachtal',
      blurb:
        'Fresh trout straight from the farm, smoked and ready to take home. Local, the way it should be.',
      features: ['Fresh trout', 'Smokehouse', 'Farm shop'],
    },
  } as Record<
    string,
    { name: string; town?: string; blurb: string; features: string[] }
  >,

  /* ── Booking flow (calendar → review → payment → confirmation) ────────── */
  bookingFlow: {
    alsoOnAirbnb: 'Also on Airbnb',
    steps: {
      dates: 'Choose dates',
      review: 'Review',
      pay: 'Pay',
    },
    calendar: {
      title: 'Pick your nights',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      selectCheckIn: 'Select check-in date',
      selectCheckOut: 'Select check-out date',
      nights: (n: number) => (n === 1 ? '1 night' : `${n} nights`),
      minNights: (n: number) => `Minimum stay: ${n} nights`,
      blocked: 'Booked',
      available: 'Available',
      clear: 'Clear selection',
      prevMonth: 'Previous month',
      nextMonth: 'Next month',
    },
    guests: {
      title: 'Guests',
      adults: 'Adults',
      adultsHint: 'Ages 13 and up',
      children: 'Children',
      childrenHint: 'Ages 2 to 12',
      infants: 'Infants',
      infantsHint: 'Under 2',
      max: (n: number) => `Up to ${n} guests`,
      summary: (n: number) => (n === 1 ? '1 guest' : `${n} guests`),
      infantsNote: 'Infants do not count toward the guest limit.',
    },
    price: {
      perNight: 'per night',
      nightsLine: (price: string, n: number) =>
        `${price} × ${n === 1 ? '1 night' : `${n} nights`}`,
      cleaning: 'Cleaning',
      registered: 'Member benefit',
      total: 'Total',
      inclVat: (rate: string) => `incl. ${rate}% VAT`,
      goodPrice: 'Good price: your dates sit in the lower average of the last 60 days.',
      details: 'Price breakdown',
      promoLine: (code: string) => `Discount code ${code}`,
      giftLine: (code: string) => `Gift card ${code}`,
      giftRemainderNote: 'Any remaining balance stays on your gift code.',
    },
    promo: {
      title: 'Discount or gift code',
      placeholder: 'Enter code',
      apply: 'Apply',
      giftApplied: (code: string, balance: string) =>
        `Gift card ${code} active · balance ${balance}.`,
      applied: (code: string, pct: string) =>
        `Code ${code} active: ${pct}% off the nightly rate.`,
      invalid: 'Sorry, this code is not valid.',
      remove: 'Remove',
      banner: (pct: string) =>
        `Good call booking direct: ${pct}% off the nightly rate is saved for you.`,
      bannerCta: 'Pick your apartment',
      close: 'Close',
    },
    cta: {
      checkAvailability: 'Check availability',
      continue: 'Continue',
      back: 'Back',
      toPayment: 'Continue to payment',
      confirmPay: 'Confirm and pay',
      reserve: 'Book now',
    },
    review: {
      title: 'Your trip at a glance',
      dates: 'Dates',
      guests: 'Guests',
      edit: 'Edit',
      cancellationTitle: 'Cancellation',
      cancellationFree: (days: number) =>
        `Free cancellation until ${days} days before check-in. After that, the full amount is due.`,
      paymentTimingTitle: 'When would you like to pay?',
      payNow: 'Pay now',
      payNowHint: 'All done. You arrive with nothing left to think about.',
      payLater: 'Pay later',
      payLaterHint: (days: number) =>
        `Save your card now, we charge it ${days} days before check-in. Your booking is binding right away.`,
      payLaterUnavailable: 'Your check-in is too close. Only immediate payment is available.',
      contactTitle: 'Your details',
      nameLabel: 'Full name',
      emailLabel: 'Email address',
      emailHint: 'We send your confirmation and invoice to this address.',
      registerTeaser: (pct: string) =>
        `Create an account and save an extra ${pct}% on every booking.`,
      continueAsGuest: 'Book as guest',
      loginTab: 'Sign in',
      registerTab: 'Create account',
      passwordLabel: 'Password',
      loginButton: 'Sign in',
      registerButton: 'Create account and save',
      loggedInAs: (email: string) => `Signed in as ${email}`,
      logout: 'Sign out',
    },
    payment: {
      title: 'Payment',
      whenYouPay: 'When you pay',
      payNowSummary: 'The full amount is due now.',
      payLaterSummary: (date: string) =>
        `Your card will be charged on ${date}. Until then you pay nothing.`,
      methodsTitle: 'Choose payment method',
      demoBanner: 'Demo mode: no real payment will be made.',
      demoButton: 'Run demo payment',
      demoCardNote: 'Payment fields are disabled in the demo.',
      processing: 'Processing payment …',
      securityNote: 'Secure payment via Stripe. Your details stay encrypted.',
    },
    confirmation: {
      title: 'Booking confirmed',
      subtitle: 'We look forward to welcoming you to the Black Forest.',
      numberLabel: 'Booking number',
      emailSent: (email: string) => `Your confirmation is on its way to ${email}.`,
      scheduledNote: (date: string) => `Your card will be charged on ${date}.`,
      backHome: 'Back to home',
      viewAccount: 'View your bookings',
      adjustBooking: 'Adjust booking',
      adjustSubject: (nr) => `Booking ${nr}: change request`,
    },
    account: {
      title: 'Your account',
      subtitle: 'See your bookings, book faster, save every time.',
      benefit: (pct: string) => `As a registered guest you save ${pct}% on every booking.`,
      login: 'Sign in',
      register: 'Create account',
      logout: 'Sign out',
      emailLabel: 'Email address',
      passwordLabel: 'Password',
      myBookings: 'Your bookings',
      noBookings: 'No bookings yet. The Black Forest is waiting.',
      statusConfirmed: 'Confirmed',
      statusPending: 'Pending',
      statusCancelled: 'Cancelled',
      checkEmail: 'Almost there: please confirm your email address via the link in your inbox.',
      working: 'One moment …',
      passwordHint: 'At least 6 characters.',
      errInvalid: 'Email or password is incorrect. If you do not have an account yet, create one above.',
      errNotConfirmed: 'Please confirm your email address first via the link in your inbox.',
      errExists: 'An account with this email already exists. Please switch to “Sign in”.',
      errPassword: 'The password must be at least 6 characters.',
      forgotLink: 'Forgot password?',
      forgotTitle: 'Reset password',
      forgotIntro: 'Enter your email address. We will send you a link to set a new password.',
      forgotSubmit: 'Send link',
      backToLogin: 'Back to sign in',
      resetSent: 'If an account exists for this email, we have sent you a reset link. Check your spam folder too.',
      resetEmail: {
        subject: 'Reset your password · Black Forest Retreats',
        greeting: 'Hello,',
        intro: 'you asked to reset your password. Click the button to set a new one.',
        cta: 'Set a new password',
        expiry: 'For security, the link is valid for 30 minutes only.',
        ignore: 'If this was not you, simply ignore this email.',
      },
      resetPage: {
        title: 'New password',
        checking: 'One moment, we are checking your link …',
        invalid: 'This link is invalid or has expired. Please request a new one.',
        intro: 'Set your new password now.',
        newPasswordLabel: 'New password',
        submit: 'Save password',
        done: 'Done. Your password is set. You can sign in now.',
        toAccount: 'To your account',
        backToLogin: 'To sign in',
        errGeneric: 'That did not work. Please try again.',
      },
    },
    errors: {
      unavailable: 'These dates are already booked. Please pick different ones.',
      minNights: (n: number) => `Please choose at least ${n} nights.`,
      maxGuests: (n: number) => `This apartment sleeps up to ${n} guests.`,
      invalidEmail: 'Please enter a valid email address.',
      missingName: 'Please enter your name.',
      paymentFailed: 'The payment did not go through. Please try again.',
      generic: 'Something went wrong. Please try again.',
      notConfigured: 'Direct booking is not live yet. Please try again later.',
      authFailed: 'Sign-in failed. Please check your email and password.',
    },
    email: {
      confirmSubject: (nr: string) => `Your booking ${nr} is confirmed`,
      greeting: (name: string) => `Hello ${name},`,
      confirmIntro: 'thank you for booking with us directly. Here is everything at a glance:',
      datesLabel: 'Dates',
      guestsLabel: 'Guests',
      totalLabel: 'Total',
      scheduledLine: (date: string) => `Your card will be charged on ${date}.`,
      invoiceSubject: (nr: string) => `Your invoice for booking ${nr}`,
      invoiceIntro: 'your invoice is attached as a PDF. Thank you for your booking.',
      failedSubject: (nr: string) => `Payment for booking ${nr} failed`,
      failedIntro: 'unfortunately the charge for your booking did not go through. Please get in touch and we will sort it out.',
      signoff: 'Warm greetings from the Black Forest',
      teamName: 'Black Forest Retreats',
    },
  },

  giftFlow: {
    steps: {
      amount: 'Value',
      personalize: 'Personalize',
      preview: 'Preview',
      pay: 'Pay',
    },
    hero: {
      eyebrow: 'Gift card',
      title: 'Gift the Black Forest',
      intro: 'Pick a value, write a dedication, done. The gift card arrives instantly as a PDF by email.',
    },
    amount: {
      title: 'Choose the value',
      custom: 'Custom amount',
      customPlaceholder: 'e.g. 75',
      customHint: (min: string, max: string) => `Any amount between ${min} and ${max}.`,
    },
    personalize: {
      title: 'Who is it for?',
      forLabel: 'For',
      forPlaceholder: 'Name of the lucky one',
      fromLabel: 'From',
      fromPlaceholder: 'Your name',
      messageLabel: 'Personal message (optional)',
      messagePlaceholder: 'A few lines for the occasion …',
      emailLabel: 'Your email address',
      emailHint: 'We will send the gift card PDF there.',
      iconLabel: 'Motif',
      icons: {
        hut: 'Bollenhut hat',
        uhr: 'Cuckoo clock',
        kirschtorte: 'Black Forest gateau',
        schinken: 'Black Forest ham',
      },
    },
    preview: {
      title: 'This is your gift card',
      note: 'The gift code appears on the card and PDF after payment.',
    },
    card: {
      eyebrow: 'Gift card',
      forLabel: 'For',
      fromLabel: 'From',
      codeLabel: 'Code',
      validity: 'Valid for 3 years',
      validUntil: (d: string) => `Valid until ${d}`,
      redeemHint: 'Redeemable with any booking on blackforest-retreats.de',
    },
    payment: {
      title: 'Payment',
      summaryLabel: 'Gift card for',
      valueLabel: 'Value',
    },
    success: {
      pendingTitle: 'Confirming your payment …',
      pendingText: 'One moment, we are waiting for your payment confirmation.',
      title: 'Thank you! Your gift card is on its way.',
      mailInfo: (email: string) => `We have sent the gift card PDF to ${email}.`,
      codeLabel: 'Your gift code',
      downloadCta: 'Download & print PDF',
      redeemHint: 'To redeem: enter the code in the code field during booking, the value is deducted right away. Any remaining balance stays on the code.',
    },
    cta: {
      back: 'Back',
      next: 'Continue',
      toPayment: 'Continue to payment',
    },
    errors: {
      invalid: 'Please check your input.',
      generic: 'That did not work. Please try again in a moment.',
    },
    email: {
      subject: (code: string) => `Your gift card ${code} · Black Forest Retreats`,
      greeting: (name: string) => `Hello ${name},`,
      intro: (recipient: string) =>
        `your gift card for ${recipient} is paid and attached to this email as a PDF. Print it, gift it, enjoy.`,
      issuedIntro: (recipient: string) =>
        `your gift card for ${recipient} is ready and attached to this email as a PDF. Print it, gift it, enjoy.`,
      codeLabel: 'Code',
      valueLabel: 'Value',
      validLabel: 'Valid until',
      redeemHint: 'To redeem: enter the code in the code field when booking on blackforest-retreats.de. Any remaining balance stays on the code.',
      invoiceNote: 'The invoice for your purchase is also attached as a PDF.',
    },
  },
};
