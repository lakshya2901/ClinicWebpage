/**
 * Single source of truth for every piece of clinic text, contact detail, link and setting.
 *
 * Anything written as [LIKE THIS] is a PLACEHOLDER for a fact that has not been supplied
 * (credentials, reviews, address, phone ...). Replace it before launch.
 * Never publish awards, credentials, reviews or medical claims that are not verified.
 *
 * This file is plain ES-module data with no browser APIs, because it is imported both by the
 * browser bundle and by the build-time HTML renderer (see vite.config.js).
 */

export const config = {
  site: {
    url: 'https://[YOUR-DOMAIN]',
    title: 'Aura Dental Studio | Modern, Gentle Dentistry in San Francisco',
    description:
      'Aura Dental Studio is a calm, spa-inspired dental practice in Pacific Heights, San Francisco. Preventive care, cosmetic dentistry, clear aligners and implants. Book a consultation.',
    ogImage: '/og-image.png',
    locale: 'en_US',
  },

  clinic: {
    name: 'Aura Dental Studio',
    shortName: 'Aura',
    tagline: 'Dental Studio • SF',
    city: 'San Francisco',
    neighborhood: 'Pacific Heights',
    phone: '[PHONE NUMBER]', // shown on the page
    phoneHref: '+10000000000', // used in tel: links, digits only
    email: '[EMAIL ADDRESS]',
    addressLines: ['[STREET ADDRESS, SUITE]', 'San Francisco, CA [ZIP]'],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Aura+Dental+Studio+San+Francisco',
    whatsapp: '10000000000', // digits only, with country code, no "+"
    whatsappMessage: 'Hello Aura Dental Studio, I would like to book a consultation.',
    license: '[CA LICENSE NUMBER]',
    social: { instagram: '', facebook: '' },
  },

  doctor: {
    name: 'Dr. Julian Vance',
    nameWithCredentials: 'Dr. Julian Vance, [CREDENTIALS]',
    role: 'Founder & Chief Dental Surgeon',
    credentialLine: '[CREDENTIAL LINE: fellowships, school, memberships]',
    bio: [
      'For [XX] years, Dr. Vance has practised patient-centred, minimally invasive dentistry in San Francisco. Believing oral health should never come with clinical dread, [he/she/they] founded Aura Dental Studio as a calm, light-filled space that pairs modern technology with warm, human care.',
      '[ADD VERIFIED TRAINING, MEMBERSHIPS AND AREAS OF FOCUS HERE.]',
    ],
    tags: ['[Focus area 1]', '[Focus area 2]', '[Focus area 3]'],
    badge: { title: '[AWARD OR RECOGNITION]', sub: '[Publication / year]' },
    photo: '/images/doctor-placeholder.svg',
    photoAlt: 'Placeholder portrait of Dr. Julian Vance. Replace with a real photograph.',
  },

  nav: [
    { label: 'Services', href: '#services' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Meet Dr. Vance', href: '#meet-doctor' },
    { label: 'Process', href: '#process' },
    { label: 'Tech & Results', href: '#tech-results' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],

  mobileTabs: [
    { label: 'Home', href: '#top', icon: 'house' },
    { label: 'Treatments', href: '#services', icon: 'tooth' },
    { label: 'Gallery', href: '#tech-results', icon: 'camera' },
    { label: 'Studio', href: '#contact', icon: 'map-pin' },
  ],

  hero: {
    eyebrow: 'San Francisco • Pacific Heights',
    titleBefore: 'Healthy smiles engineered with',
    titleEmphasis: 'precision',
    titleAfter: '& artistry',
    lead: 'Experience elevated oral wellness combining gentle modern technology, preventive dentistry, and calm, spa-like hospitality.',
    leadMobile: 'Elevated, gentle dental wellness in Pacific Heights.',
    primaryCta: 'Book Appointment',
    // Trust row: replace with verified numbers (or delete an item) before launch.
    trust: [
      { icon: 'star', text: '[X.X] ([N] Google Reviews)' },
      { icon: 'badge-check', text: '[N]+ Patients Treated' },
      { icon: 'award', text: '[N]+ Years of Experience' },
    ],
    trustMobile: '[X.X] ([N] Reviews) • [N] Patients • [N] Yrs',
    floatingBadges: [
      { icon: 'zap', title: 'Gentle Care', sub: 'Comfort-first approach', pos: 'top' },
      { icon: 'gem', title: 'Digital Scans', sub: 'Comfortable 3D imaging', pos: 'bottom' },
    ],
  },

  services: {
    eyebrow: 'Clinical Care Disciplines',
    eyebrowMobile: 'Precision Care',
    title: 'Refined, Biological Dental Services',
    titleMobile: 'Curated Dental Services',
    lead: 'Harmonizing modern technology, quality materials, and quiet, comfortable treatment rooms for complete peace of mind.',
    leadMobile: 'Bespoke clinical treatments designed for lasting wellness.',
    items: [
      {
        icon: 'file-up',
        category: 'Preventive',
        title: 'Check-ups & Preventive Wellness',
        text: 'Thorough examinations, gentle cleanings and digital imaging to catch concerns early and keep your smile healthy.',
      },
      {
        icon: 'sparkles',
        category: 'Cosmetic',
        title: 'Veneers & Whitening',
        text: 'Professional whitening and custom porcelain veneers designed around your facial aesthetics.',
      },
      {
        icon: 'scan-face',
        category: 'Orthodontics',
        title: 'Clear Aligners & Orthodontics',
        text: 'Discreet clear aligner treatment with digital 3D simulations so you can preview your plan.',
      },
      {
        icon: 'tooth',
        category: 'Restorative',
        title: 'Dental Implants',
        text: 'Computer-guided implant planning to replace missing teeth with natural-looking, durable restorations.',
      },
      {
        icon: 'droplets',
        category: 'Endodontics',
        title: 'Gentle Root Canal Therapy',
        text: 'Careful, microscope-assisted treatment focused on comfort and on preserving your natural tooth.',
      },
      {
        icon: 'baby',
        category: 'Pediatric',
        title: 'Pediatric & Family Dental Care',
        text: 'Calm, friendly visits in private suites that help children and parents feel at ease.',
      },
    ],
    cta: 'Learn more',
  },

  // Sample figures from the design. Replace with verified numbers or remove a tile.
  stats: {
    eyebrowMobile: 'Excellence by Numbers',
    titleMobile: 'Why Aura Leads SF',
    items: [
      { value: 99.4, decimals: 1, suffix: '%', label: 'Patient Satisfaction', sub: 'Independently audited patient metrics', short: 'Satisfaction', subShort: 'Patient feedback' },
      { value: 15, decimals: 0, suffix: 'k+', label: 'Restorative Procedures', sub: 'Precision crown & veneer fittings', short: 'Procedures', subShort: 'Restorative care' },
      { value: 0, decimals: 0, suffix: '%', label: 'Hidden Fees', sub: '100% upfront transparent fee schedule', short: 'Hidden Fees', subShort: 'Upfront pricing' },
      { value: 45, decimals: 0, suffix: ' min', label: 'Average New Patient Checkup', sub: 'Thorough, never rushed care', short: 'Checkups', subShort: 'Thorough, no rush' },
    ],
    note: '[SAMPLE FIGURES: replace with verified statistics before launch]',
  },

  process: {
    eyebrow: 'The Aura Journey',
    title: 'Unhurried, Transparent Care in Four Steps',
    steps: [
      {
        title: 'Private Consultation & 3D Scan',
        text: 'Settle into our private lounge while a comfortable optical scan captures your teeth in minutes.',
      },
      {
        title: 'Digital Treatment Mapping',
        text: 'Review a clear 3D picture of your treatment plan alongside timeline milestones and transparent pricing.',
      },
      {
        title: 'Gentle, Comfort-First Treatment',
        text: 'Relax with noise-cancelling headphones and warm towels while your care is delivered with precision.',
      },
      {
        title: 'Dedicated Follow-Up',
        text: 'Stay in touch with the practice after treatment and keep on track with a personalised maintenance schedule.',
      },
    ],
  },

  tech: {
    eyebrow: 'Cutting-Edge Innovation',
    title: 'Instant Optical Scans vs Traditional Putty Impressions',
    lead: 'We replace uncomfortable silicone impressions with fast optical scanning. Thousands of data points build your digital model in moments.',
    points: [
      { title: 'Digital Intraoral Scans', text: 'No impression trays. A fast, comfortable scan for precise fittings.' },
      { title: '[Laser technology name]', text: '[Describe the laser or other technology you actually use.]' },
      { title: '[Same-day restoration option]', text: '[Describe your in-house capabilities, if offered.]' },
    ],
    caseCard: {
      title: 'Bespoke Veneer Transformation',
      chip: 'Case [#] • [N] Veneers',
      beforeLabel: 'Before',
      afterLabel: 'After',
      beforeCaption: '[Before caption]',
      afterCaption: '[After caption]',
      beforeImg: '/images/before-placeholder.svg',
      afterImg: '/images/after-placeholder.svg',
      beforeAlt: 'Placeholder for a before treatment photo',
      afterAlt: 'Placeholder for an after treatment photo',
      footTitle: 'Total Chairside Time',
      footText: '[Describe appointment count]',
      footCta: 'Explore Cases →',
    },
    mobileImg: '/images/tech-placeholder.svg',
    mobileImgAlt: 'Placeholder for a photo of the intraoral scanner',
    mobileBadge: '[Scanner spec]',
    mobileCompare: [
      { good: false, title: 'Traditional', text: 'Putty impressions' },
      { good: true, title: 'Aura Digital 3D', text: 'Fast, comfortable scan' },
    ],
  },

  reviews: {
    eyebrow: 'Patient Experiences',
    eyebrowMobile: 'Patient Voices',
    title: 'What San Francisco Is Saying',
    titleMobile: 'Trusted by San Franciscans',
    // Replace with real, permissioned reviews only.
    items: [
      { quote: '[REAL PATIENT REVIEW PLACEHOLDER 1. Use only genuine, permissioned reviews.]', name: '[Name]', meta: '[Neighborhood] • [Treatment]', initials: 'AB' },
      { quote: '[REAL PATIENT REVIEW PLACEHOLDER 2. Use only genuine, permissioned reviews.]', name: '[Name]', meta: '[Neighborhood] • [Treatment]', initials: 'CD' },
      { quote: '[REAL PATIENT REVIEW PLACEHOLDER 3. Use only genuine, permissioned reviews.]', name: '[Name]', meta: '[Neighborhood] • [Treatment]', initials: 'EF' },
      { quote: '[REAL PATIENT REVIEW PLACEHOLDER 4. Use only genuine, permissioned reviews.]', name: '[Name]', meta: '[Neighborhood] • [Treatment]', initials: 'GH' },
    ],
  },

  faq: {
    eyebrow: 'Frequently Addressed',
    title: 'Clarity On Your Studio Visit',
    items: [
      {
        q: 'Will my treatment be comfortable?',
        a: 'Comfort is central to how we work. We use gentle techniques, offer noise-cancelling headphones, ceiling displays and weighted blankets, and discuss comfort and sedation options with you before treatment. [CONFIRM OPTIONS OFFERED]',
      },
      {
        q: 'Do you accept dental insurance or offer financing?',
        a: '[DESCRIBE YOUR INSURANCE POLICY, OUT-OF-NETWORK CLAIM SUPPORT AND ANY FINANCING OPTIONS.]',
      },
      {
        q: 'How quickly can I get an appointment for an urgent concern?',
        a: '[DESCRIBE EMERGENCY AVAILABILITY.] For severe pain, swelling or trauma, call us right away, or seek emergency care if you cannot reach us.',
      },
      {
        q: 'What happens during my first visit?',
        a: 'A first visit typically includes a conversation about your goals, a thorough examination, digital imaging where appropriate and a clear plan with transparent pricing. [CONFIRM YOUR FIRST-VISIT PROCESS]',
      },
      {
        q: 'Where is Aura Dental Studio located?',
        a: 'We are in Pacific Heights, San Francisco, at [STREET ADDRESS, SUITE]. [ADD PARKING AND TRANSIT DETAILS.]',
      },
    ],
  },

  booking: {
    eyebrow: 'Effortless Scheduling',
    eyebrowMobile: 'Reserve Your Slot',
    title: 'Reserve Your Studio Time',
    titleMobile: 'Book Your Consultation',
    lead: 'Our concierge coordinates pre-visit records and parking arrangements.',
    leadMobile: 'Select your preferred date & treatment focus.',
    services: [
      'Comprehensive Checkup & Scan',
      'Veneers & Whitening Consultation',
      'Clear Aligners Consultation',
      'Dental Implants Consultation',
      'Gentle Root Canal Care',
      'Urgent / Emergency Care',
    ],
    times: [
      { value: 'morning', label: 'Morning', hint: '[HOURS]' },
      { value: 'midday', label: 'Mid-Day', hint: '[HOURS]' },
      { value: 'evening', label: 'Evening', hint: '[HOURS]' },
    ],
    submit: 'Confirm Booking Request',
    submitMobile: 'Request Appointment',
    successTitle: 'Request received',
    successText: 'Thank you. Our concierge team will contact you to confirm your appointment. [CONFIRM RESPONSE TIME]',
    /**
     * Where booking requests go. Leave empty to run in demo mode (nothing is sent).
     * Set to a URL (Formspree, Netlify function, your API ...) to POST JSON to it.
     * For custom logic, edit submitBooking() in src/sections/booking.js.
     */
    endpoint: '',
    sidebar: {
      title: 'Studio Concierge Info',
      hoursTitle: 'Studio Clinic Hours',
      hours: ['[DAYS]: [HOURS]', '[DAYS]: [HOURS]'],
      parkingTitle: 'Parking',
      parking: '[DESCRIBE PARKING OR TRANSIT ACCESS]',
      phoneTitle: 'Direct Telephone Line',
      guaranteeTitle: 'Quiet Sanctuary Promise',
      guarantee: 'We schedule single-patient studio time slots. No crowded waiting rooms. [CONFIRM]',
    },
  },

  contact: {
    eyebrow: 'Studio Visit',
    eyebrowMobile: 'Sanctuary of Care',
    title: 'Pacific Heights Sanctuary',
    titleMobile: 'Pacific Heights Studio',
    lead: 'A calm, light-filled studio in the quiet streets of Pacific Heights.',
    mapLabel: 'Pacific Heights • San Francisco',
    mapImg: '/images/map-placeholder.svg',
    mapAlt: 'Placeholder map of the clinic location. Replace with a real map image or embed.',
    hoursMobileTitle: 'Studio Hours',
  },

  footer: {
    about: 'Gentle, modern dentistry in Pacific Heights, San Francisco.',
    aboutLong:
      "Architectural precision meets holistic sanctuary care in San Francisco's Pacific Heights. Elevating diagnostic dentistry into an unhurried, restorative experience.",
    badges: ['[Accreditation 1]', '[Accreditation 2]'],
    directoryTitle: 'Full Services Directory',
    emergencyTitle: 'Dental Emergency Helpline',
    emergencyText: '[DESCRIBE EMERGENCY ACCESS FOR PATIENTS.]',
    disclaimerTitle: 'Clinical Disclaimer',
    disclaimer:
      'The information on this site is for general education and does not replace diagnosis or advice from a licensed dentist. Individual results vary.',
    hoursTitle: 'Hours & Care',
    hours: [
      ['[Days]', '[Hours]'],
      ['[Days]', '[Hours]'],
      ['[Days]', '[Hours]'],
    ],
    accreditationsTitle: 'Accreditations',
    accreditationsText: '[LIST VERIFIED ACCREDITATIONS AND MEMBERSHIPS.]',
    oncallTitle: 'Emergency On-Call',
    oncallText: '[DESCRIBE ON-CALL ARRANGEMENT, IF ANY.]',
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Notice of Nondiscrimination', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
    mobileLinks: [
      { label: 'Book Online', href: '#book' },
      { label: 'Emergency Line', href: 'tel' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },

  whatsapp: { label: 'Concierge Chat' },

  /** 3D settings */
  three: {
    /** Set to e.g. '/models/tooth.glb' to use a GLTF model instead of the procedural tooth. */
    modelUrl: '',
    maxPixelRatio: 2,
    particles: { desktop: 70, mobile: 24 },
    colors: { fromTokens: true },
  },
};

export default config;
