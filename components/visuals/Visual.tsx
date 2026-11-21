import type { CSSProperties, ReactNode } from "react";
import type { Visual as VisualT } from "@/content/site";

/**
 * Generative, asset-free mockups. Every visual fills its parent and scales
 * with container-query units (cqmin / cqw / cqh), so the same component
 * works as a carousel card, a gallery tile or a full-width sheet hero.
 *
 * Swap any of them for your own work with { kind: "image" } or { kind: "video" }.
 */
export function Visual({ visual, bare = false, className = "" }: { visual: VisualT; bare?: boolean; className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ containerType: "size" }}>
      {render(visual, bare)}
    </div>
  );
}

function render(v: VisualT, bare: boolean): ReactNode {
  switch (v.kind) {
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={v.src} alt={v.alt} className="h-full w-full" style={{ objectFit: v.fit ?? "cover" }} draggable={false} />;
    case "video":
      return <video src={v.src} poster={v.poster} className="h-full w-full object-cover" autoPlay muted loop playsInline />;
    case "timer":
      return <Timer bare={bare} label={v.label} />;
    case "phone":
      return <Phone bare={bare} />;
    case "browser":
      return <Browser bare={bare} />;
    case "darkapp":
      return <DarkApp bare={bare} label={v.label} />;
    case "orb":
      return <Orb tone={v.tone} />;
    case "specimen":
      return <Specimen />;
    case "chart":
      return <Chart tone={v.tone} bare={bare} />;
    case "stickers":
      return <Stickers tone={v.tone} />;
    case "palette":
      return <Palette />;
    case "frame":
      return <Frame />;
    case "poster":
      return <Poster tone={v.tone} ink={v.ink} label={v.label} bare={bare} />;
  }
}

/* ───────────── shared bits ───────────── */

const center: CSSProperties = { position: "absolute", inset: 0, display: "grid", placeItems: "center" };
const Stage = ({ bare, children, bg = "#efefed" }: { bare: boolean; children: ReactNode; bg?: string }) => (
  <div style={{ ...center, background: bare ? "transparent" : `radial-gradient(120% 90% at 50% 0%, #fafaf9, ${bg})` }}>{children}</div>
);
const Line = ({ w, h = 0.9, c = "#d9d9d6", r = 99 }: { w: string; h?: number; c?: string; r?: number }) => (
  <span style={{ display: "block", width: w, height: `${h}cqmin`, background: c, borderRadius: r }} />
);
/** Film grain as a self-contained SVG image (no id-referenced filters → safe to repeat & transform). */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const Grain = ({ opacity = 0.18 }: { opacity?: number }) => (
  <span aria-hidden style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none", backgroundImage: GRAIN, backgroundSize: "180px 180px" }} />
);

/* ───────────── timer widget ───────────── */

function Timer({ bare, label = "Deep work" }: { bare: boolean; label?: string }) {
  const isBreak = label.toLowerCase() === "break";
  const pct = isBreak ? 0.35 : 0.68;
  const R = 40;
  const C = 2 * Math.PI * R;
  return (
    <Stage bare={bare}>
      <div
        style={{
          width: "min(62cqh, 86cqw)",
          aspectRatio: "0.82",
          background: "#fbfbfa",
          borderRadius: "5cqmin",
          boxShadow: "0 0 0 0.25cqmin rgb(0 0 0 / .06), 0 4cqmin 10cqmin -3cqmin rgb(0 0 0 / .22)",
          padding: "3.2cqmin",
          display: "flex",
          flexDirection: "column",
          gap: "2.6cqmin",
          color: "#181818",
          fontSize: "3.2cqmin",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1cqmin" }}>
          <span style={{ fontWeight: 600 }}>Tempo</span>
          <span style={{ display: "flex", gap: "1.6cqmin" }}>
            <i style={{ width: "3.4cqmin", height: "3.4cqmin", borderRadius: 99, border: "0.45cqmin solid #9a9a96" }} />
            <i style={{ width: "3.4cqmin", height: "3.4cqmin", borderRadius: 99, background: "#d8d8d4" }} />
          </span>
        </div>
        <div
          style={{
            flex: 1,
            background: "#eeeeec",
            borderRadius: "4cqmin",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.2cqmin",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", width: "40%", aspectRatio: "1" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", rotate: "-90deg" }}>
              <circle cx="50" cy="50" r={R} fill="none" stroke="#dcdcd8" strokeWidth="7" />
              <circle cx="50" cy="50" r={R} fill="none" stroke="#181818" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`} />
            </svg>
            <span style={{ ...center, fontSize: "6cqmin", fontWeight: 600, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
              {isBreak ? "04:50" : "24:10"}
            </span>
          </div>
          <span style={{ fontWeight: 600, fontSize: "3.6cqmin", marginTop: "1.6cqmin" }}>{label}</span>
          <span style={{ color: "#7a7a76", fontSize: "2.8cqmin" }}>{isBreak ? "Stand up, look outside." : "Calendar is clear until 3pm."}</span>
          <div style={{ position: "absolute", left: "3cqmin", right: "3cqmin", bottom: "3cqmin", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", gap: "0.8cqmin" }}>
              <i style={{ width: "3.4cqmin", height: "1.1cqmin", borderRadius: 99, background: "#181818" }} />
              <i style={{ width: "1.1cqmin", height: "1.1cqmin", borderRadius: 99, background: "#c4c4c0" }} />
              <i style={{ width: "1.1cqmin", height: "1.1cqmin", borderRadius: 99, background: "#c4c4c0" }} />
            </span>
            <span style={{ background: "#2a2a2a", color: "#fff", borderRadius: 99, padding: "1cqmin 2.6cqmin", fontSize: "2.6cqmin", fontWeight: 600 }}>
              {isBreak ? "Skip" : "Pause"}
            </span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── phone ───────────── */

function Phone({ bare }: { bare: boolean }) {
  const rows = [
    ["Groceries", "€ 86", "62%"],
    ["Dinner out", "€ 54", "40%"],
    ["Train tickets", "€ 38", "28%"],
    ["Plants", "€ 19", "14%"],
  ];
  return (
    <Stage bare={bare}>
      <div
        style={{
          height: "86cqh",
          aspectRatio: "9 / 19",
          borderRadius: "7cqh",
          background: "#141414",
          padding: "1.1cqh",
          boxShadow: "0 3cqh 8cqh -2cqh rgb(0 0 0 / .35)",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "6cqh",
            background: "#f7f7f5",
            color: "#181818",
            padding: "6cqh 2.6cqh 2cqh",
            display: "flex",
            flexDirection: "column",
            gap: "1.6cqh",
            fontSize: "2.1cqh",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <i style={{ position: "absolute", top: "1.6cqh", left: "50%", translate: "-50% 0", width: "9cqh", height: "2.6cqh", borderRadius: 99, background: "#141414" }} />
          <span style={{ color: "#8a8a86", fontSize: "1.8cqh" }}>This week, together</span>
          <span style={{ fontSize: "5.4cqh", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1 }}>€ 412</span>
          <span style={{ display: "flex", gap: "0.8cqh" }}>
            <span style={{ background: "#e4ede1", color: "#36603a", borderRadius: 99, padding: "0.5cqh 1.4cqh", fontSize: "1.7cqh" }}>Worth it · 7</span>
            <span style={{ background: "#eeeeec", borderRadius: 99, padding: "0.5cqh 1.4cqh", fontSize: "1.7cqh" }}>Meh · 2</span>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5cqh", marginTop: "1cqh" }}>
            {rows.map(([n, a, p]) => (
              <div key={n} style={{ display: "grid", gap: "0.6cqh" }}>
                <span style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{n}</span>
                  <span style={{ color: "#8a8a86" }}>{a}</span>
                </span>
                <span style={{ height: "0.9cqh", background: "#e6e6e3", borderRadius: 99 }}>
                  <span style={{ display: "block", height: "100%", width: p, background: "#181818", borderRadius: 99 }} />
                </span>
              </div>
            ))}
          </div>
          <span style={{ marginTop: "auto", alignSelf: "center", background: "#181818", color: "#fff", borderRadius: 99, padding: "1.2cqh 3cqh", fontSize: "1.9cqh", fontWeight: 600 }}>
            What felt worth it?
          </span>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── browser / brand guide ───────────── */

function Browser({ bare }: { bare: boolean }) {
  const sw = ["#181818", "#f2efe8", "#3550e6", "#e7e3da"];
  return (
    <Stage bare={bare} bg="#e9e9e6">
      <div
        style={{
          width: "86cqw",
          height: "78cqh",
          background: "#fff",
          borderRadius: "1.6cqmin",
          boxShadow: "0 0 0 0.2cqmin rgb(0 0 0 / .06), 0 3cqmin 8cqmin -2cqmin rgb(0 0 0 / .2)",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          overflow: "hidden",
          color: "#181818",
          fontSize: "2.3cqmin",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.9cqmin", padding: "1.4cqmin 1.8cqmin", borderBottom: "0.2cqmin solid #efefed" }}>
          {["#ececea", "#ececea", "#ececea"].map((c, i) => (
            <i key={i} style={{ width: "1.4cqmin", height: "1.4cqmin", borderRadius: 99, background: c }} />
          ))}
          <span style={{ margin: "0 auto", background: "#f4f4f2", borderRadius: 99, padding: "0.4cqmin 4cqmin", color: "#9a9a96", fontSize: "1.8cqmin" }}>pinboard.example/northwind</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "22% 1fr", minHeight: 0 }}>
          <div style={{ borderRight: "0.2cqmin solid #f0f0ee", padding: "2.4cqmin 2cqmin", display: "flex", flexDirection: "column", gap: "1.5cqmin" }}>
            <span style={{ fontWeight: 600 }}>Northwind</span>
            {["Logo", "Colours", "Type", "Voice", "Imagery"].map((t, i) => (
              <span key={t} style={{ color: i === 1 ? "#181818" : "#a3a3a0" }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ padding: "3cqmin 3.4cqmin", display: "flex", flexDirection: "column", gap: "2cqmin" }}>
            <span style={{ fontSize: "4.4cqmin", fontWeight: 600, letterSpacing: "-0.03em" }}>Colours</span>
            <Line w="70%" />
            <Line w="54%" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.4cqmin", marginTop: "1cqmin", flex: 1 }}>
              {sw.map((c) => (
                <div key={c} style={{ display: "flex", flexDirection: "column", gap: "0.8cqmin" }}>
                  <span style={{ flex: 1, background: c, borderRadius: "1cqmin", boxShadow: "inset 0 0 0 0.2cqmin rgb(0 0 0 / .05)" }} />
                  <span style={{ fontSize: "1.7cqmin", color: "#8a8a86" }}>{c.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── dark app / email ───────────── */

function DarkApp({ bare, label = "Inbox" }: { bare: boolean; label?: string }) {
  const rows = [
    ["Mara Lind", "Draft for Thursday", true],
    ["Studio Ops", "Invoices for March"],
    ["Jun Park", "Re: launch film cut 3"],
    ["Field Club", "Saturday walk, 9am"],
    ["Notion", "Weekly digest"],
    ["Leo", "Photos from the print fair"],
  ] as const;
  return (
    <Stage bare={bare} bg="#e4e4e1">
      <div
        style={{
          width: "84cqw",
          height: "80cqh",
          background: "#161616",
          color: "#e9e9e7",
          borderRadius: "1.8cqmin",
          boxShadow: "0 3cqmin 9cqmin -2cqmin rgb(0 0 0 / .45)",
          padding: "2.4cqmin",
          display: "flex",
          flexDirection: "column",
          gap: "0.6cqmin",
          fontSize: "2.2cqmin",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8b8b88", marginBottom: "1.2cqmin" }}>
          <span style={{ color: "#e9e9e7", fontWeight: 600 }}>{label}</span>
          <span>Reply · Later · Drift</span>
        </div>
        {rows.map(([from, subj, sel]) => (
          <div
            key={from}
            style={{
              display: "grid",
              gridTemplateColumns: "28% 1fr auto",
              gap: "2cqmin",
              padding: "1.1cqmin 1.4cqmin",
              borderRadius: "1cqmin",
              background: sel ? "#262626" : "transparent",
            }}
          >
            <span style={{ fontWeight: 600 }}>{from}</span>
            <span style={{ color: "#9d9d9a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subj}</span>
            <span style={{ color: "#6f6f6c" }}>9:4{from.length % 10}</span>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "4cqmin",
            translate: "-50% 0",
            width: "62%",
            background: "#232323",
            border: "0.2cqmin solid #333",
            borderRadius: "1.4cqmin",
            padding: "1.2cqmin 1.8cqmin",
            display: "flex",
            gap: "1.4cqmin",
            alignItems: "center",
            boxShadow: "0 2cqmin 6cqmin rgb(0 0 0 / .5)",
          }}
        >
          <span style={{ color: "#8b8b88" }}>⌘K</span>
          <span style={{ color: "#bdbdba" }}>Snooze until Monday…</span>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── gradient orb ───────────── */

function Orb({ tone = "#d9d4ea" }: { tone?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 90% at 50% 100%, ${tone}, #f3f2ef 70%)` }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "52cqmin",
          height: "52cqmin",
          translate: "-50% -50%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #ffffff, ${tone} 45%, #5b6b8a 100%)`,
          filter: "blur(0.6cqmin)",
          boxShadow: `0 6cqmin 14cqmin -2cqmin ${tone}`,
        }}
      />
      <span style={{ position: "absolute", left: "5cqmin", bottom: "4cqmin", fontSize: "4cqmin", fontWeight: 600, letterSpacing: "-0.03em", color: "#2a2f3a" }}>
        orbit
      </span>
      <span style={{ position: "absolute", right: "5cqmin", bottom: "4.4cqmin", fontSize: "2.4cqmin", color: "#5c6170" }}>Canopy index 0.82</span>
      <Grain opacity={0.22} />
    </div>
  );
}

/* ───────────── type specimen ───────────── */

function Specimen() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f4f2ed", color: "#181818", display: "grid", gridTemplateColumns: "1.1fr 1fr", alignItems: "center", padding: "6cqmin" }}>
      <span style={{ fontSize: "44cqmin", fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 0.8 }}>Aa</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.6cqmin", fontSize: "2.8cqmin" }}>
        <span style={{ fontSize: "5cqmin", fontWeight: 600, letterSpacing: "-0.03em" }}>Inter Tight</span>
        <span style={{ color: "#77756f" }}>Light · Regular · Medium · Bold</span>
        <span style={{ fontSize: "3.6cqmin", lineHeight: 1.3, marginTop: "2cqmin" }}>
          ABCDEFGHIJKLM
          <br />
          nopqrstuvwxyz
          <br />
          0123456789 &amp;?!
        </span>
      </div>
    </div>
  );
}

/* ───────────── chart card ───────────── */

function Chart({ tone = "#f0efec", bare }: { tone?: string; bare: boolean }) {
  const bars = [38, 64, 52, 80, 44, 22, 30];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <Stage bare={bare} bg={tone}>
      <div
        style={{
          width: "72cqw",
          height: "74cqh",
          background: "#fff",
          borderRadius: "2.4cqmin",
          boxShadow: "0 0 0 0.2cqmin rgb(0 0 0 / .05), 0 3cqmin 8cqmin -2cqmin rgb(0 0 0 / .16)",
          padding: "4cqmin",
          display: "flex",
          flexDirection: "column",
          color: "#181818",
          fontSize: "2.6cqmin",
        }}
      >
        <span style={{ color: "#8a8a86" }}>Focus this week</span>
        <span style={{ fontSize: "7cqmin", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1 }}>14h 20m</span>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "2cqmin", marginTop: "3cqmin" }}>
          {bars.map((b, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1cqmin", height: "100%", justifyContent: "flex-end" }}>
              <span style={{ width: "100%", height: `${b}%`, background: i === 3 ? "#181818" : "#e7e7e4", borderRadius: "1cqmin" }} />
              <span style={{ color: "#9a9a96", fontSize: "2.2cqmin" }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── stickers ───────────── */

function Stickers({ tone = "#eeece7" }: { tone?: string }) {
  const s = [
    { bg: "#f2b632", rot: -10, shape: "circle" },
    { bg: "#e0412b", rot: -3, shape: "half" },
    { bg: "#3550e6", rot: 4, shape: "tri" },
    { bg: "#2e8b57", rot: 9, shape: "wave" },
    { bg: "#181818", rot: 14, shape: "dot" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {s.map((x, i) => (
        <div
          key={i}
          style={{
            width: "22cqmin",
            aspectRatio: "0.8",
            marginLeft: i ? "-5cqmin" : 0,
            rotate: `${x.rot}deg`,
            translate: `0 ${[2, -2, 1, -3, 2][i]}cqmin`,
            background: "#fffdf8",
            padding: "1.6cqmin",
            borderRadius: "0.6cqmin",
            boxShadow: "0 1.2cqmin 3cqmin -1cqmin rgb(0 0 0 / .3)",
            WebkitMask: "radial-gradient(circle 0.9cqmin at 0.9cqmin 0.9cqmin, transparent 98%, #000) -0.9cqmin -0.9cqmin / 2.6cqmin 2.6cqmin",
            mask: "radial-gradient(circle 0.9cqmin at 0.9cqmin 0.9cqmin, transparent 98%, #000) -0.9cqmin -0.9cqmin / 2.6cqmin 2.6cqmin",
          }}
        >
          <div style={{ height: "100%", background: x.bg, display: "grid", placeItems: "center" }}>
            <Glyph shape={x.shape} />
          </div>
        </div>
      ))}
      <Grain opacity={0.12} />
    </div>
  );
}

function Glyph({ shape }: { shape: string }) {
  const c = "#fffdf8";
  const st: CSSProperties = { width: "55%", height: "55%" };
  if (shape === "circle") return <svg viewBox="0 0 10 10" style={st}><circle cx="5" cy="5" r="4" fill={c} /></svg>;
  if (shape === "half") return <svg viewBox="0 0 10 10" style={st}><path d="M1 6a4 4 0 0 1 8 0z" fill={c} /></svg>;
  if (shape === "tri") return <svg viewBox="0 0 10 10" style={st}><path d="M5 1 9 9H1z" fill={c} /></svg>;
  if (shape === "wave") return <svg viewBox="0 0 10 10" style={st}><path d="M1 6c1.5-3 2.5-3 4 0s2.5 3 4 0" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>;
  return <svg viewBox="0 0 10 10" style={st}><circle cx="3" cy="3" r="1.3" fill={c} /><circle cx="7" cy="3" r="1.3" fill={c} /><circle cx="3" cy="7" r="1.3" fill={c} /><circle cx="7" cy="7" r="1.3" fill={c} /></svg>;
}

/* ───────────── palette ───────────── */

function Palette() {
  const sw = [
    ["Ink", "#181818", "#fff"],
    ["Paper", "#f2efe8", "#181818"],
    ["Signal", "#3550e6", "#fff"],
    ["Clay", "#c96b4b", "#fff"],
    ["Moss", "#6f7f5a", "#fff"],
    ["Fog", "#d9d9d4", "#181818"],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", padding: "5cqmin", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2cqmin", color: "#181818" }}>
      {sw.map(([n, c, t]) => (
        <div key={n} style={{ background: c, color: t, borderRadius: "1.6cqmin", padding: "2.4cqmin", display: "flex", flexDirection: "column", justifyContent: "space-between", fontSize: "2.6cqmin", boxShadow: "inset 0 0 0 0.2cqmin rgb(0 0 0 / .05)" }}>
          <span style={{ fontWeight: 600 }}>{n}</span>
          <span style={{ opacity: 0.7 }}>{c.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

/* ───────────── framed poster on a wall ───────────── */

function Frame() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, #f3f3f1 0%, #e4e4e1 55%, #d6d6d2 100%)" }}>
      {/* window light */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, transparent 20%, rgb(255 255 255 / .55) 32%, transparent 44%, rgb(255 255 255 / .4) 52%, transparent 62%)" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "12%",
          height: "56%",
          aspectRatio: "0.75",
          translate: "-50% 0",
          border: "1cqmin solid #1a1a1a",
          background: "#f6f3ec",
          padding: "3cqmin",
          boxShadow: "1.6cqmin 2.4cqmin 3cqmin -1cqmin rgb(0 0 0 / .3)",
        }}
      >
        <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#e0412b", fontWeight: 900, fontSize: "8cqmin", lineHeight: 0.82, letterSpacing: "-0.04em" }}>
          SAY
          <br />
          LESS
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "20%", background: "linear-gradient(#bdbcb7, #a9a8a3)" }} />
      <div style={{ position: "absolute", left: "8%", bottom: "14%", width: "34%", height: "6%", background: "#7b5a3f", borderRadius: "0.6cqmin", boxShadow: "0 2cqmin 2cqmin -1cqmin rgb(0 0 0 / .3)" }} />
      <Grain opacity={0.12} />
    </div>
  );
}

/* ───────────── type poster ───────────── */

function Poster({ tone = "#1f3fbf", ink = "#fff", label = "LESS BUT LOUDER", bare }: { tone?: string; ink?: string; label?: string; bare: boolean }) {
  const words = label.split(" ");
  const poster = (
    <div
      style={{
        position: "relative",
        height: bare ? "88cqh" : "100%",
        width: bare ? undefined : "100%",
        aspectRatio: bare ? "0.72" : undefined,
        background: tone,
        color: ink,
        padding: "6cqmin",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        boxShadow: bare ? "0 3cqmin 8cqmin -2cqmin rgb(0 0 0 / .3)" : undefined,
        borderRadius: bare ? "0.8cqmin" : 0,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: `${Math.min(19, 64 / Math.max(...words.map((w) => w.length)))}cqh`, lineHeight: 0.84, letterSpacing: "-0.045em", textTransform: "uppercase" }}>
        {words.map((w, i) => (
          <div key={i}>{w}</div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "2.4cqh", opacity: 0.8 }}>
        <span>Print Fair 2024</span>
        <span>No. 03</span>
      </div>
      <Grain opacity={0.16} />
    </div>
  );
  return bare ? <div style={center}>{poster}</div> : poster;
}
