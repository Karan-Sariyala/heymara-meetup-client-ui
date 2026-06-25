export const CATS = {
  Frontend:   { hex: "#38BDF8", emoji: "\u269B\uFE0F", dark: "#001B3D", key: "frontend" },
  "AI/ML":    { hex: "#D946EF", emoji: "\uD83E\uDD16", dark: "#1A001A", key: "aiml" },
  DevOps:     { hex: "#FB923C", emoji: "\uD83D\uDEE0\uFE0F", dark: "#1A0800", key: "devops" },
  Design:     { hex: "#FB7185", emoji: "\uD83C\uDFA8", dark: "#1A020A", key: "design" },
  Backend:    { hex: "#FBBF24", emoji: "\u2699\uFE0F", dark: "#1A1000", key: "backend" },
  Web3:       { hex: "#A78BFA", emoji: "\uD83D\uDD17", dark: "#0B001A", key: "web3" },
  Product:    { hex: "#34D399", emoji: "\uD83D\uDCCB", dark: "#001A0F", key: "product" },
  Gaming:     { hex: "#22D3EE", emoji: "\uD83C\uDFAE", dark: "#001A1A", key: "gaming" },
  Startup:    { hex: "#F472B6", emoji: "\uD83D\uDE80", dark: "#1A0014", key: "startup" },
  Security:   { hex: "#F87171", emoji: "\uD83D\uDD12", dark: "#1A0000", key: "security" },
  Mobile:     { hex: "#A3E635", emoji: "\uD83D\uDCF1", dark: "#001A00", key: "mobile" },
  Data:       { hex: "#60A5FA", emoji: "\uD83D\uDCCA", dark: "#00091A", key: "data" },
  Community:  { hex: "#D946EF", emoji: "\uD83E\uDD1D", dark: "#1A001A", key: "community" },
  Hardware:   { hex: "#FACC15", emoji: "\uD83D\uDD27", dark: "#1A0F00", key: "hardware" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatFullDate(dateStr) {
  const [d, m] = dateStr.split("/");
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}`;
}

export function fmtDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

const HOST_NAMES_MAP = {
  DB: "David B.", JA: "Jenny A.", MC: "Max C.", LO: "Lena O.",
  RT: "Riley T.", NP: "Noah P.", EW: "Emma W.", JM: "Jordan M.",
  SE: "Sam E.", CH: "Chris H.", VK: "Vikram K.", PG: "Priya G.",
  MT: "Morgan T.", TH: "Taylor H.", XB: "Xin B.", PM: "Parker M.",
  IK: "Ishaan K.", DA: "Diana A.", GW: "George W.", WJ: "Will J.",
  SB: "Sam B.", BF: "Bella F.", RB: "Rohan B.", HB: "Hana B.",
  DR: "Dylan R.", DP: "Dev P.", CS: "Casey S.",
};

export function hostName(initials) {
  return HOST_NAMES_MAP[initials] || initials;
}

const ORBS = [
  { orb1: { x: "78%", y: "-20%" }, orb2: { x: "10%", y: "60%" } },
  { orb1: { x: "70%", y: "-15%" }, orb2: { x: "5%", y: "70%" } },
  { orb1: { x: "80%", y: "-10%" }, orb2: { x: "0%", y: "55%" } },
  { orb1: { x: "75%", y: "-25%" }, orb2: { x: "15%", y: "65%" } },
  { orb1: { x: "82%", y: "-20%" }, orb2: { x: "8%", y: "60%" } },
  { orb1: { x: "70%", y: "-15%" }, orb2: { x: "5%", y: "55%" } },
  { orb1: { x: "75%", y: "-20%" }, orb2: { x: "10%", y: "65%" } },
  { orb1: { x: "80%", y: "-20%" }, orb2: { x: "5%", y: "60%" } },
  { orb1: { x: "72%", y: "-18%" }, orb2: { x: "8%", y: "62%" } },
  { orb1: { x: "77%", y: "-22%" }, orb2: { x: "12%", y: "58%" } },
  { orb1: { x: "83%", y: "-12%" }, orb2: { x: "3%", y: "68%" } },
  { orb1: { x: "69%", y: "-24%" }, orb2: { x: "14%", y: "63%" } },
  { orb1: { x: "76%", y: "-16%" }, orb2: { x: "7%", y: "57%" } },
  { orb1: { x: "81%", y: "-19%" }, orb2: { x: "11%", y: "61%" } },
  { orb1: { x: "73%", y: "-21%" }, orb2: { x: "6%", y: "66%" } },
  { orb1: { x: "79%", y: "-14%" }, orb2: { x: "9%", y: "59%" } },
  { orb1: { x: "71%", y: "-23%" }, orb2: { x: "13%", y: "64%" } },
  { orb1: { x: "84%", y: "-17%" }, orb2: { x: "4%", y: "67%" } },
];

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export { MONTH_NAMES };

function buildVisuals(event) {
  const i = event.id - 1;
  const orbs = ORBS[i % ORBS.length];
  const full = formatFullDate(event.date);
  let tag = "";
  if (event.status === "Waitlist") tag = "Selling fast";
  else if (event.status === "Live") tag = "\uD83D\uDD25 Trending";
  else if (event.status === "Upcoming") {
    const parts = event.date.split("/");
    const d = new Date(2000 + parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    if (d - Date.now() < 7 * 86400000 && d > Date.now()) tag = "New";
  }
  return { ...event, ...orbs, fullDate: full, tag, featured: false };
}

export const INITIAL_EVENTS = [
  {
    id: 1, name: "React Advanced Sydney", initials: "RA",
    avatarColor: "bg-sky-500/20 text-sky-300",
    category: "Frontend", catColor: "text-sky-400",
    location: "Sydney", date: "22/06/26",
    rsvp: 145, capacity: 200,
    notes: "Deep dive into React 19 compiler, server components in production, and migrating large codebases. Lightning talks from Atlassian and Canva engineers.",
    hosts: ["DB", "JA"], status: "Past", rating: 4.8, accent: "bg-zinc-600/60",
  },
  {
    id: 2, name: "AI Founders Mixer", initials: "AI",
    avatarColor: "bg-fuchsia-500/20 text-fuchsia-300",
    category: "AI/ML", catColor: "text-fuchsia-400",
    location: "Melbourne", date: "27/06/26",
    rsvp: 89, capacity: 120,
    notes: "Casual evening for AI startup founders. Discuss fundraising, GPU costs, and the latest in agentic workflows. Drinks sponsored by a stealth YC company.",
    hosts: ["MC", "LO"], status: "Upcoming", rating: 4.6, accent: "bg-emerald-500/60",
  },
  {
    id: 3, name: "DevOps Brisbane Quarterly", initials: "DO",
    avatarColor: "bg-orange-500/20 text-orange-300",
    category: "DevOps", catColor: "text-orange-400",
    location: "Brisbane", date: "05/07/26",
    rsvp: 67, capacity: 80,
    notes: "Platform engineering, internal developer platforms, and the death of the SRE role. Talks from WiseTech and SafetyCulture.",
    hosts: ["RT", "NP"], status: "Waitlist", rating: 4.2, accent: "bg-orange-500/60",
  },
  {
    id: 4, name: "Design Systems Coffee", initials: "DS",
    avatarColor: "bg-rose-500/20 text-rose-300",
    category: "Design", catColor: "text-rose-400",
    location: "Remote", date: "12/07/26",
    rsvp: 234, capacity: 500,
    notes: "Monthly virtual hangout for design systems practitioners. Open mic, token strategy, and a roast of the worst component APIs in the wild.",
    hosts: ["EW"], status: "Upcoming", rating: 4.5, accent: "bg-emerald-500/60",
  },
  {
    id: 5, name: "Rust Sydney Hack Night", initials: "RS",
    avatarColor: "bg-amber-500/20 text-amber-300",
    category: "Backend", catColor: "text-amber-400",
    location: "Sydney", date: "18/07/26",
    rsvp: 42, capacity: 60,
    notes: "Bring your laptop, your borrow checker frustrations, and pizza money. We'll hack on open source Rust projects until the venue kicks us out.",
    hosts: ["JM", "SE"], status: "Upcoming", rating: 4.9, accent: "bg-emerald-500/60",
  },
  {
    id: 6, name: "Web3 Melbourne", initials: "W3",
    avatarColor: "bg-violet-500/20 text-violet-300",
    category: "Web3", catColor: "text-violet-400",
    location: "Melbourne", date: "20/07/26",
    rsvp: 18, capacity: 100,
    notes: "Skeptics welcome. Honest conversations about onchain identity, stablecoin payments, and whether any of this is still worth building in 2026.",
    hosts: ["CH"], status: "Draft", rating: 3.4, accent: "bg-zinc-600/60",
  },
  {
    id: 7, name: "Product Managers Lunch", initials: "PM",
    avatarColor: "bg-emerald-500/20 text-emerald-300",
    category: "Product", catColor: "text-emerald-400",
    location: "Sydney", date: "24/07/26",
    rsvp: 56, capacity: 60,
    notes: "Monthly PM lunch. This month: discovery vs delivery, working with skeptical engineering leads, and the great Jira-or-Linear debate.",
    hosts: ["VK", "PG"], status: "Waitlist", rating: 4.3, accent: "bg-orange-500/60",
  },
  {
    id: 8, name: "Indie Game Dev Showcase", initials: "GD",
    avatarColor: "bg-cyan-500/20 text-cyan-300",
    category: "Gaming", catColor: "text-cyan-400",
    location: "Brisbane", date: "01/08/26",
    rsvp: 112, capacity: 150,
    notes: "Eight indie studios showing prototypes. Playable demos, brutal feedback, and a publisher pitch session at the end of the night.",
    hosts: ["MT", "TH"], status: "Upcoming", rating: 4.7, accent: "bg-emerald-500/60",
  },
  {
    id: 9, name: "Postgres Performance Night", initials: "PG",
    avatarColor: "bg-indigo-500/20 text-indigo-300",
    category: "Backend", catColor: "text-amber-400",
    location: "Melbourne", date: "07/08/26",
    rsvp: 73, capacity: 90,
    notes: "EXPLAIN ANALYZE all evening. Index strategy, partitioning at scale, and a war story from a team that survived a 14TB migration.",
    hosts: ["XB", "PM"], status: "Upcoming", rating: 4.6, accent: "bg-emerald-500/60",
  },
  {
    id: 10, name: "Founders & Coffee Perth", initials: "FC",
    avatarColor: "bg-pink-500/20 text-pink-300",
    category: "Startup", catColor: "text-pink-400",
    location: "Perth", date: "09/08/26",
    rsvp: 28, capacity: 40,
    notes: "Early-stage founders only. Tactical conversations on first hires, MVP scope, and getting your first 10 paying customers without burning out.",
    hosts: ["IK", "DA"], status: "Upcoming", rating: 4.4, accent: "bg-emerald-500/60",
  },
  {
    id: 11, name: "Tailwind & Type Workshop", initials: "TW",
    avatarColor: "bg-teal-500/20 text-teal-300",
    category: "Frontend", catColor: "text-sky-400",
    location: "Remote", date: "15/08/26",
    rsvp: 301, capacity: 400,
    notes: "Hands-on workshop: building a marketing site with Tailwind v4, fluid type, and zero arbitrary values. Bring a laptop and a strong opinion.",
    hosts: ["EW", "GW"], status: "Upcoming", rating: 4.8, accent: "bg-emerald-500/60",
  },
  {
    id: 12, name: "Security Engineers Drinks", initials: "SE",
    avatarColor: "bg-red-500/20 text-red-300",
    category: "Security", catColor: "text-red-400",
    location: "Sydney", date: "21/08/26",
    rsvp: 64, capacity: 70,
    notes: "Casual drinks for AppSec, infra security, and red teamers. Off the record. Chatham House rules. Do not put this on your work calendar.",
    hosts: ["WJ", "SB"], status: "Waitlist", rating: 4.5, accent: "bg-orange-500/60",
  },
  {
    id: 13, name: "Mobile Devs Melbourne", initials: "MD",
    avatarColor: "bg-lime-500/20 text-lime-300",
    category: "Mobile", catColor: "text-lime-400",
    location: "Melbourne", date: "28/08/26",
    rsvp: 91, capacity: 120,
    notes: "Swift, Kotlin, React Native, Flutter \u2014 all welcome. This month: what App Intents and Live Activities actually look like in shipping apps.",
    hosts: ["BF", "JM"], status: "Upcoming", rating: 4.3, accent: "bg-emerald-500/60",
  },
  {
    id: 14, name: "Data Engineering Sydney", initials: "DE",
    avatarColor: "bg-blue-500/20 text-blue-300",
    category: "Data", catColor: "text-blue-400",
    location: "Sydney", date: "02/09/26",
    rsvp: 47, capacity: 80,
    notes: "dbt, DuckDB, Iceberg, and the slow death of the lakehouse hype cycle. Real talks from teams running data platforms at meaningful scale.",
    hosts: ["MT", "RB"], status: "Draft", rating: 3.9, accent: "bg-zinc-600/60",
  },
  {
    id: 15, name: "Vue Nation Meetup", initials: "VN",
    avatarColor: "bg-emerald-500/20 text-emerald-300",
    category: "Frontend", catColor: "text-sky-400",
    location: "Brisbane", date: "08/09/26",
    rsvp: 38, capacity: 60,
    notes: "Nuxt 4 in production, Vapor mode benchmarks, and a live debugging session on someone's actual broken Pinia store. Submit yours in advance.",
    hosts: ["HB", "RT"], status: "Upcoming", rating: 4.2, accent: "bg-emerald-500/60",
  },
  {
    id: 16, name: "Women Who Code Dinner", initials: "WW",
    avatarColor: "bg-fuchsia-500/20 text-fuchsia-300",
    category: "Community", catColor: "text-fuchsia-400",
    location: "Melbourne", date: "14/09/26",
    rsvp: 82, capacity: 100,
    notes: "Quarterly dinner. Mentorship matching, lightning talks from senior ICs, and a frank panel on staying technical past the staff level.",
    hosts: ["LO", "EW"], status: "Upcoming", rating: 4.9, accent: "bg-emerald-500/60",
  },
  {
    id: 17, name: "GraphQL Conf Pre-Party", initials: "GQ",
    avatarColor: "bg-pink-500/20 text-pink-300",
    category: "Backend", catColor: "text-amber-400",
    location: "Sydney", date: "18/09/26",
    rsvp: 156, capacity: 180,
    notes: "Warm-up event the night before the main conference. Speaker meet-and-greet, federation horror stories, and an open bar for the first hour.",
    hosts: ["DR", "DP"], status: "Upcoming", rating: 4.7, accent: "bg-emerald-500/60",
  },
  {
    id: 18, name: "Hardware Hackers Garage", initials: "HH",
    avatarColor: "bg-yellow-500/20 text-yellow-300",
    category: "Hardware", catColor: "text-yellow-400",
    location: "Remote", date: "25/09/26",
    rsvp: 12, capacity: 30,
    notes: "Virtual show-and-tell for embedded and hardware projects. ESP32 builds, custom keyboards, and one person who genuinely built a CNC from scratch.",
    hosts: ["CS"], status: "Upcoming", rating: 4.0, accent: "bg-emerald-500/60",
  },
].map(buildVisuals);

// Mark first 6 Upcoming as featured
let featCount = 0;
for (const e of INITIAL_EVENTS) {
  if (e.status === "Upcoming" && featCount < 6) {
    e.featured = true;
    featCount++;
  }
}

export const AVATAR_PALETTE = ["#8B7FF0", "#F5AA2C", "#2ED4A2", "#F05476", "#F07A2E", "#3B9CF5", "#A78BF5", "#34D9B0"];
