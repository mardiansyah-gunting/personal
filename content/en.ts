import { contact, education, experience, highlight, MORE_PROJECTS, organizations, projects, skills, SOCIAL, toArtifacts } from "./shared";
import type { Site } from "./types";

const exps = experience([
  {
    role: "Technology & Customer Success Manager",
    company: "PT Solusi Hutan Digital",
    period: "May 2026 – Present",
    body: [
      highlight(
        "Manage TREEO customer success end-to-end: field visits to understand partner needs, monitoring daily activities on the TREEO cloud, refining the apps UI/UX, and preparing relevant training and documentation for partners.",
        "Manage TREEO customer success end-to-end",
      ),
    ],
  },
  {
    role: "Operations Manager",
    company: "Fairventures Digital GmbH",
    period: "May 2025 – May 2026",
    body: [
      highlight(
        "Ran daily operations across five Tree Planting Partners, covering planning and monitoring of planting programs, acting as the single point of contact for each partner, and safeguarding data quality and reporting.",
        "five Tree Planting Partners",
      ),
    ],
  },
  {
    role: "Customer Success Manager",
    company: "Fairventures Digital GmbH",
    period: "May 2024 – May 2025",
    body: [
      highlight("Assessed and evaluated TREEO user experience in the field.", "TREEO user experience in the field"),
      "Monitored daily system activity on the cloud platform.",
      "Contributed to the improvement and development of the app UI/UX.",
    ],
  },
  {
    role: "Customer Success Engineer",
    company: "Fairventures Digital GmbH",
    period: "May 2023 – May 2024",
    body: [
      "Assessed and evaluated TREEO user experience in the field.",
      "Monitored daily system activity on the cloud platform.",
      "Contributed to the improvement and development of the app UI/UX.",
      highlight("Provided direct technical support and training to users.", "direct technical support and training"),
    ],
  },
  {
    role: "Mobile Developer",
    company: "Freelance Consultant",
    period: "Oct 2022 – Apr 2023",
    body: [
      highlight(
        "Designed and shipped Android applications with Kotlin and Java in Android Studio. Created wireframes and high-fidelity mockups for mobile and web platforms, and collaborated closely with stakeholders to translate business requirements into intuitive interfaces.",
        "Android applications with Kotlin and Java",
      ),
    ],
  },
  {
    role: "HPPS Project Coordinator Assistant",
    company: "Fairventures Worldwide gGmbH",
    period: "Feb 2022 – Mar 2023",
    body: [
      highlight(
        "Prepared data flows and safety materials, managed the data collection and processing process, and ensured new safety procedures were consistently applied across all team members.",
        "new safety procedures",
      ),
    ],
  },
  {
    role: "General Affairs Officer",
    company: "Fairventures Worldwide gGmbH",
    period: "Oct 2019 – Feb 2022",
    body: [
      highlight(
        "Managed all office operations, covering contract administration, asset handovers, coordination of security and driver teams, maintenance of the operational vehicle fleet, and inventorying all company assets.",
        "all office operations",
      ),
    ],
  },
  {
    role: "Demonstration Officer",
    company: "CV Karya Hidup Sentosa",
    period: "Jul 2019 – Sep 2019",
    body: [
      highlight(
        "Managed end-to-end B2B communication and demonstrated the Quick Tractor product for oil palm plantations across Sumatra, Sulawesi, and Kalimantan.",
        "Quick Tractor product",
      ),
    ],
  },
  {
    role: "Intern",
    company: "Badan Pusat Statistik",
    period: "Jul 2018 – Dec 2018",
    body: [
      highlight(
        "Designed the cover for the annual census publication and created visual assets such as posters and vector graphics to support the launch activities.",
        "the cover for the annual census publication",
      ),
    ],
  },
]);

export const en: Site = {
  lang: "en",
  meta: {
    title: "Mardiansyah Gunting — Reliable Operator · Automation Builder",
    description:
      "Reliable operator and automation builder across project management, data automation and operations — bridging teams and building the tools they need.",
  },
  name: "Mardiansyah Gunting",
  role: "Reliable Operator · Automation Builder",
  status: { label: "Available", note: "Open to new collaborations" },
  hero: [
    "I work where operations, technology and strategy meet — bridging teams, building ",
    { text: "the tools they need", href: "#projects" },
    ", and clearing away the repetitive work that quietly slows a business down. Today I do that at ",
    { text: "TREEO Indonesia", href: "https://treeo.id/" },
    ".",
  ],
  now: {
    lead: "Right now I'm Technology & Customer Success Manager at",
    company: "TREEO",
    rest: "I visit partners in the field, analyse operational data so decisions stay data-driven, refine the apps' UI/UX, and prepare the training and documentation partners rely on.",
    about: [
      "Most of that has meant automating data requests with Python and moving reporting out of spreadsheets and into systems people actually enjoy using. Whether I'm coordinating tree-planting programmes across Indonesia or shipping an Android app, the goal stays the same: something measurable and built to last.",
      "Working alongside startups, international NGOs, and government institutions has taught me to adapt quickly and communicate across cultures — and convinced me that the best outcomes come from pairing real domain knowledge with the right technology. I'm open to new roles and collaborations, and I'd be glad to talk.",
    ],
  },
  organizations: organizations({
    "treeo-indonesia": { name: "PT Solusi Hutan Digital", note: "TREEO Indonesia · 2026 – now" },
    "fairventures-digital": { name: "Fairventures Digital GmbH", note: "TREEO · 2023 – 2026" },
    "fairventures-worldwide": { name: "Fairventures Worldwide gGmbH", note: "2019 – 2023" },
    "karya-hidup-sentosa": { name: "CV Karya Hidup Sentosa", note: "Quick · 2019" },
    bps: { name: "Badan Pusat Statistik", note: "Statistics Indonesia · 2018" },
  }),
  productsLine: [
    "Outside my day-to-day role, I build projects of my own — several of them are open on ",
    { text: "GitHub", href: MORE_PROJECTS },
    ".",
  ],
  projects: projects(
    {
      "workflow-automation": {
        title: "Workflow Automation",
        kind: "Internal · Python",
        summary:
          "Built internal Python scripts to automate data workflow pipelines (ETL: Extraction, Transformation, Loading) and data format updates. Improved the team daily operational efficiency through reliable and safe raw data processing.",
        captions: ["Raw data in, a clean report out — extracted, transformed and loaded on a schedule.", "How the automation works"],
      },
      "treeo-website": {
        title: "TREEO Indonesia Website",
        kind: "Website",
        summary:
          "Contributed to the TREEO Indonesia website development by optimizing animations and designing a responsive mobile layout to improve performance and user experience on mobile devices.",
        captions: ["Smoother, optimised animations.", "A responsive layout built for phones."],
      },
      "audio-transkript": {
        title: "Audio Transkript",
        kind: "Python tool",
        summary:
          "A small Python utility that turns audio recordings into a Word transcript. pydub reads the file, long recordings are split into 45-second chunks, each chunk goes to a cloud speech recognizer (Indonesian by default, other languages via --language), and the text is written to a .docx with python-docx.",
        captions: ["Audio in, 45-second chunks, speech recognition, a Word document out.", "Running it from a Jupyter notebook."],
      },
      "cad-converter": {
        title: "CAD Converter",
        kind: "Python tool",
        summary:
          "Built a Python utility using GDAL and GeoPandas to convert CAD formats (DWG/DXF) to GIS (Esri Shapefile/GeoJSON). Facilitated API integration and prepared spatial data structures for GIS analysis needs.",
        captions: ["DWG/DXF in, Esri Shapefile or GeoJSON out.", "Converted layers, ready for GIS mapping and analysis."],
      },
    },
    { github: "View on GitHub", website: "Visit website" },
  ),
  moreProjectsHref: MORE_PROJECTS,
  skills: skills(
    ["Software Engineering", "Customer Success & Client Relations", "Operations & Project Management", "Field, Research & Data", "Logistics & General Affairs"],
    { title: "Languages", items: ["English (Professional)", "Indonesian (Native)", "Mandarin (Beginner)"] },
    {
      title: "Skill use across my roles",
      labels: {
        communication: "Communication & Stakeholder Relations",
        fieldops: "Field Visits & On-site Operations",
        datamonitoring: "Data Monitoring, Quality & Reporting",
        training: "Training & User Documentation",
        uiux: "UI/UX & Product Design",
        opsmgmt: "Operations & Process Management",
      },
      of: (n, total) => `${n} of ${total} roles`,
    },
  ),
  experience: exps,
  education: education([
    { school: "Universitas Terbuka", programme: "Bachelor of Business Administration - BBA, Business/Managerial Economics", period: "2024 – Present" },
    { school: "Binar Academy", programme: "Data Science Bootcamp", period: "Jun 2023 – Nov 2023" },
    { school: "Binar Academy", programme: "Mobile Development Bootcamp", period: "Dec 2022 – May 2023" },
    { school: "SMKN 1 Sampit", programme: "Information Technology Engineering", period: "Jul 2017 – Aug 2019" },
  ]),
  artifacts: toArtifacts(exps),
  contact: contact("en"),
  social: SOCIAL,
  ui: {
    sections: {
      now: "Now",
      projects: "Projects",
      skills: "Skills",
      experience: "Experience",
      education: "Education",
      gallery: "Field notes",
    },
    readMore: "Read more",
    visitSite: "Visit website",
    opensNewTab: "opens in a new tab",
    galleryHint: "Scroll to dive · Select to look closer",
    close: "Close",
    previous: "Previous",
    next: "Next",
    copied: "Copied to clipboard",
    downloadCv: "Download CV",
    sendMessage: "Send a message",
    emailLabel: "Email",
    phoneLabel: "Phone",
    rights: "All rights reserved.",
    language: "Language",
    moreProjects: "Want to see more? View all my projects on GitHub",
    form: {
      title: "Send a message",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      incomplete: "Please fill in all fields.",
      sending: "Sending…",
      sent: "Message sent — thank you!",
      error: "Failed to send. Try again or email me directly.",
    },
  },
};
