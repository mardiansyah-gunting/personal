/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this one file to make the template yours.
 *  Everything on the page (text, projects, posts, gallery) comes
 *  from here. All names below are placeholders.
 * ─────────────────────────────────────────────────────────────
 */

/** A piece of rich text: plain string, or a link that gets the hand-drawn underline. */
export type Seg = string | { text: string; href?: string; project?: string; post?: string };

/**
 * Visual = what fills a card / gallery tile.
 * - `kind: "image" | "video"` → your own asset (put files in /public).
 * - any other kind → a built-in generative mockup (no images needed).
 */
export type Visual =
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "contain" }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "timer" | "phone" | "browser" | "darkapp" | "orb" | "specimen" | "chart" | "stickers" | "palette" | "frame"; tone?: string; label?: string }
  | { kind: "poster"; tone?: string; ink?: string; label?: string };

export type Project = {
  slug: string;
  title: string;
  year: string;
  kind: string; // short category shown in the sheet
  portrait?: boolean; // portrait mockup → narrower in the rail
  cover: Visual;
  summary: string;
  body: string[];
  cta?: { label: string; href: string };
  gallery: { visual: Visual; caption: string }[];
};

export type Post = {
  slug: string;
  title: string;
  date: string; // MM/YYYY
  /** first paragraph; wrap a phrase in [[double brackets]] to highlight it */
  body: string[];
};

export type Service = { title: string; text: string };

export type Artifact = { title: string; kind: string; visual: Visual; ratio: number /* width / height */ };

export const site = {
  meta: {
    title: "Alex Moreno — Designer & Founder",
    description: "Independent designer building brands, products and the systems between them.",
    url: "https://example.com",
  },

  name: "Alex Moreno",
  role: "Designer & Founder",
  status: { label: "Available", note: "Booking projects from March" },

  hero: [
    "I design brands, products and the systems between them. I run ",
    { text: "Northwind", href: "#companies" },
    ", a small studio for early-stage teams, and ",
    { text: "Fieldnotes", href: "#companies" },
    ", a workshop series in Lisbon.",
  ] as Seg[],

  now: {
    lead: "Right now I lead product design at",
    company: "ACME",
    rest: "I take on two teams at a time, so each one gets real focus.",
  },

  companies: [
    { name: "Northwind", note: "Studio, since 2019", href: "#", mark: "northwind" },
    { name: "Fieldnotes", note: "Workshops, since 2022", href: "#", mark: "fieldnotes" },
  ],

  productsLine: [
    "On the side I make my own tools: ",
    { text: "Tempo", project: "tempo" },
    ", ",
    { text: "Ledger", project: "ledger" },
    ", ",
    { text: "Pinboard", project: "pinboard" },
    " and ",
    { text: "Driftmail", project: "driftmail" },
    ".",
  ] as Seg[],

  projects: [
    {
      slug: "tempo",
      title: "Tempo",
      year: "2026",
      kind: "macOS app",
      portrait: true,
      cover: { kind: "timer" },
      summary:
        "A quiet focus timer that lives in the menu bar. One shortcut starts a session, the rest of the Mac goes calm, and a soft chime tells you when to stand up.",
      body: [
        "I wanted a timer that respects attention instead of competing for it. No streaks, no badges, no account — just a ring that fills while you work.",
        "Sessions sync with your calendar so meetings never get interrupted, and Do Not Disturb follows the timer automatically.",
      ],
      cta: { label: "Download", href: "#" },
      gallery: [
        { visual: { kind: "timer", label: "Break" }, caption: "Breaks get the same calm treatment as focus." },
        { visual: { kind: "chart" }, caption: "A weekly view that shows rhythm, not scores." },
      ],
    },
    {
      slug: "ledger",
      title: "Ledger",
      year: "2026",
      kind: "iOS app",
      portrait: true,
      cover: { kind: "phone" },
      summary: "A shared budget for two. Ledger turns money talk into a weekly five-minute ritual.",
      body: [
        "Couples told us budgeting apps felt like spreadsheets with guilt. Ledger starts with a single question each week: what felt worth it?",
        "Everything is stored on-device and synced end-to-end encrypted between two phones.",
      ],
      cta: { label: "Join the beta", href: "#" },
      gallery: [
        { visual: { kind: "chart", tone: "#e9efe6" }, caption: "Spending by feeling, not by category." },
        { visual: { kind: "palette" }, caption: "A palette tuned for calm numbers." },
      ],
    },
    {
      slug: "pinboard",
      title: "Pinboard",
      year: "2025",
      kind: "Brand guide builder",
      cover: { kind: "browser" },
      summary:
        "Pinboard turns a folder of logos, colours and fonts into a living brand guide that teams actually open.",
      body: [
        "Every guide is a website with one link. Edits publish instantly, and old versions stay available for anyone who needs them.",
        "We built it for studios handing over identities — the handover becomes the start of a relationship rather than a PDF.",
      ],
      cta: { label: "Visit Pinboard", href: "#" },
      gallery: [
        { visual: { kind: "palette" }, caption: "Colour pages generate contrast notes automatically." },
        { visual: { kind: "specimen" }, caption: "Type specimens rendered from the uploaded files." },
      ],
    },
    {
      slug: "driftmail",
      title: "Driftmail",
      year: "2025",
      kind: "Email client",
      cover: { kind: "darkapp" },
      summary: "A keyboard-first inbox that sorts mail into three piles: reply, read later, and let it drift.",
      body: [
        "Driftmail reads like a calm newspaper in the morning and gets out of the way the rest of the day.",
        "A single command bar handles search, snooze and send — nothing hides behind menus.",
      ],
      cta: { label: "Request access", href: "#" },
      gallery: [{ visual: { kind: "darkapp", label: "Reading" }, caption: "Reading view with generous margins." }],
    },
    {
      slug: "loudposters",
      title: "Less, Louder",
      year: "2024",
      kind: "Poster series",
      portrait: true,
      cover: { kind: "poster", tone: "#1f3fbf", ink: "#ffffff", label: "LESS BUT LOUDER" },
      summary: "A series of twelve type posters for a community print fair. Each one says less than the last.",
      body: [
        "Printed in two colours on recycled stock, the series was sold out in an afternoon and every euro went to the fair's grant fund.",
      ],
      gallery: [
        { visual: { kind: "poster", tone: "#f2efe8", ink: "#e0412b", label: "SAY LESS" }, caption: "Poster 07 — the quietest one." },
        { visual: { kind: "frame" }, caption: "In the wild." },
      ],
    },
    {
      slug: "orbit",
      title: "Orbit",
      year: "2024",
      kind: "Brand identity",
      cover: { kind: "orb" },
      summary: "Identity and launch film for a climate data startup measuring forests from space.",
      body: [
        "The mark is a single soft gradient that shifts with real-time canopy data — the brand literally changes with the planet.",
      ],
      gallery: [{ visual: { kind: "orb", tone: "#c9d8cf" }, caption: "Gradient states mapped to canopy health." }],
    },
  ] as Project[],

  services: [
    {
      title: "Design lead on retainer",
      text: "I join your team two or three days a week, set direction, review work and raise the bar without adding headcount.",
    },
    {
      title: "Brand and identity systems",
      text: "Positioning, naming support, identity and the guidelines that keep it alive after launch.",
    },
    {
      title: "Product and interface design",
      text: "From first flows to shipped UI — prototypes, design systems and the details that make software feel considered.",
    },
    {
      title: "Prototyping in code",
      text: "Interactive prototypes built with modern tooling and AI, so ideas get tested in real browsers instead of slides.",
    },
  ] as Service[],

  posts: [
    {
      slug: "write-the-prompt-like-a-brief",
      title: "Write the prompt like a brief",
      date: "03/2026",
      body: [
        "The best results I get from AI tools don't come from clever tricks. They come from [[the same brief I'd give a good designer]]: context, constraints, and what success looks like.",
        "When I over-engineer prompts the output gets stiff. When I explain the situation plainly, the work gets better and so does my own thinking.",
        "A brief is a thinking tool first and an instruction second. That hasn't changed just because the reader is a model.",
      ],
    },
    {
      slug: "taste-is-a-practice",
      title: "Taste is a practice",
      date: "01/2026",
      body: [
        "Taste isn't a gift you're born with. It's [[the habit of noticing why something works]] and having the patience to keep only that.",
        "As tools make making cheaper, deciding becomes the job. Editing is the skill that scales.",
        "Practise it daily: collect, compare, cut.",
      ],
    },
    {
      slug: "small-teams-sharp-edges",
      title: "Small teams, sharp edges",
      date: "11/2025",
      body: [
        "Every team I've loved working with had one thing in common: [[a short distance between an idea and a decision]].",
        "Small teams feel risky on paper. In practice they ship sharper work because nobody can hide behind process.",
      ],
    },
    {
      slug: "ship-the-boring-version",
      title: "Ship the boring version first",
      date: "08/2025",
      body: [
        "The first version should be [[almost embarrassingly plain]]. Plain things are easy to test and easy to love once they work.",
        "Delight is a second-pass job. It lands better when the foundation is solid.",
      ],
    },
  ] as Post[],

  artifacts: [
    { title: "Tempo, first launch", kind: "Motion", visual: { kind: "timer" }, ratio: 0.82 },
    { title: "Less but Louder", kind: "Poster", visual: { kind: "poster", tone: "#1f3fbf", ink: "#fff", label: "LESS BUT LOUDER" }, ratio: 0.72 },
    { title: "Orbit", kind: "Identity", visual: { kind: "orb" }, ratio: 1.5 },
    { title: "Stickers", kind: "Illustration", visual: { kind: "stickers" }, ratio: 1.6 },
    { title: "Pinboard, colours", kind: "Product", visual: { kind: "palette" }, ratio: 1.3 },
    { title: "Driftmail, triage", kind: "Product", visual: { kind: "darkapp" }, ratio: 1.45 },
    { title: "Say Less", kind: "Poster", visual: { kind: "poster", tone: "#f2efe8", ink: "#e0412b", label: "SAY LESS" }, ratio: 0.72 },
    { title: "Ledger", kind: "iOS app", visual: { kind: "phone" }, ratio: 0.62 },
    { title: "Specimen", kind: "Type", visual: { kind: "specimen" }, ratio: 1.25 },
    { title: "In the wild", kind: "Poster", visual: { kind: "frame" }, ratio: 1.35 },
    { title: "Weekly rhythm", kind: "Data", visual: { kind: "chart" }, ratio: 1.4 },
    { title: "Pinboard", kind: "Product", visual: { kind: "browser" }, ratio: 1.5 },
    { title: "Orbit, canopy", kind: "Motion", visual: { kind: "orb", tone: "#c9d8cf" }, ratio: 1 },
    { title: "Field poster", kind: "Poster", visual: { kind: "poster", tone: "#181818", ink: "#f2f2f2", label: "MAKE IT PLAIN" }, ratio: 0.72 },
    { title: "Tempo, break", kind: "Motion", visual: { kind: "timer", label: "Break" }, ratio: 0.82 },
    { title: "Sticker sheet", kind: "Illustration", visual: { kind: "stickers", tone: "#efe9df" }, ratio: 1.2 },
  ] as Artifact[],

  footer: {
    email: "hello@example.com",
    links: [
      { label: "Studio", href: "#companies" },
      { label: "Contact", href: "mailto:hello@example.com" },
      { label: "Privacy", href: "#" },
      { label: "Imprint", href: "#" },
    ],
    social: [
      { label: "LinkedIn", href: "#", icon: "linkedin" },
      { label: "X", href: "#", icon: "x" },
      { label: "Instagram", href: "#", icon: "instagram" },
      { label: "Dribbble", href: "#", icon: "dots" },
    ],
  },
};

export type Site = typeof site;
