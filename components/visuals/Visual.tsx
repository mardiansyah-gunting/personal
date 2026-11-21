import type { CSSProperties, ReactNode } from "react";
import type { Visual as VisualT } from "@/content/types";

/**
 * Generative, asset-free mockups. Every visual fills its parent and scales
 * with container-query units (cqmin / cqw / cqh), so the same component
 * works as a carousel card, a gallery tile or a full-width sheet hero.
 * Real photos and diagrams use { kind: "image" }.
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
      return <img src={v.src} alt={v.alt} className="h-full w-full" style={{ objectFit: v.fit ?? "cover" }} draggable={false} loading="lazy" />;
    case "phone":
      return <Phone bare={bare} label={v.label} />;
    case "browser":
      return <Browser bare={bare} />;
    case "darkapp":
      return <Terminal bare={bare} label={v.label} />;
    case "chart":
      return <Chart tone={v.tone} bare={bare} label={v.label} />;
    case "specimen":
      return <Lesson />;
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
const GREEN = "#1f6b45";

/* ───────────── phone: field app ───────────── */

function Phone({ bare, label = "Tree Monitoring" }: { bare: boolean; label?: string }) {
  const rows = [
    ["Species", "62%"],
    ["Tree health", "78%"],
    ["DBH", "44%"],
    ["GPS walk", "90%"],
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
          <span style={{ color: "#8a8a86", fontSize: "1.8cqh" }}>Field check</span>
          <span style={{ fontSize: "3.6cqh", fontWeight: 700, lineHeight: 1.05 }}>{label}</span>
          <span style={{ display: "flex", gap: "0.8cqh" }}>
            <span style={{ background: "#e4ede1", color: "#36603a", borderRadius: 99, padding: "0.5cqh 1.4cqh", fontSize: "1.7cqh" }}>ID</span>
            <span style={{ background: "#eeeeec", borderRadius: 99, padding: "0.5cqh 1.4cqh", fontSize: "1.7cqh" }}>EN</span>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5cqh", marginTop: "1cqh" }}>
            {rows.map(([n, p]) => (
              <div key={n} style={{ display: "grid", gap: "0.6cqh" }}>
                <span>{n}</span>
                <span style={{ height: "0.9cqh", background: "#e6e6e3", borderRadius: 99 }}>
                  <span style={{ display: "block", height: "100%", width: p, background: GREEN, borderRadius: 99 }} />
                </span>
              </div>
            ))}
          </div>
          <span style={{ marginTop: "auto", alignSelf: "center", background: "#181818", color: "#fff", borderRadius: 99, padding: "1.2cqh 3cqh", fontSize: "1.9cqh" }}>
            Save
          </span>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── browser: desktop + phone layout ───────────── */

function Browser({ bare }: { bare: boolean }) {
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
          {[0, 1, 2].map((i) => (
            <i key={i} style={{ width: "1.4cqmin", height: "1.4cqmin", borderRadius: 99, background: "#ececea" }} />
          ))}
          <span style={{ margin: "0 auto", background: "#f4f4f2", borderRadius: 99, padding: "0.4cqmin 4cqmin", color: "#9a9a96", fontSize: "1.8cqmin" }}>treeo.id</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 26%", gap: "3cqmin", padding: "3cqmin 3.4cqmin", minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2cqmin", minHeight: 0 }}>
            <span style={{ fontWeight: 700, color: GREEN }}>TREEO</span>
            <span style={{ display: "block", flex: 1, borderRadius: "1.2cqmin", background: "linear-gradient(135deg, #dfe9e1, #a9c8b3)" }} />
            <Line w="70%" />
            <Line w="54%" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.4cqmin", height: "18%" }}>
              {["#e9efe6", "#d5e4d8", "#c4d9c9"].map((c) => (
                <span key={c} style={{ background: c, borderRadius: "1cqmin" }} />
              ))}
            </div>
          </div>
          {/* the same page, stacked for a phone */}
          <div style={{ alignSelf: "center", aspectRatio: "9 / 17", borderRadius: "2.4cqmin", border: "0.5cqmin solid #181818", padding: "1.4cqmin", display: "flex", flexDirection: "column", gap: "1cqmin" }}>
            <span style={{ height: "30%", borderRadius: "1cqmin", background: "linear-gradient(135deg, #dfe9e1, #a9c8b3)" }} />
            <Line w="80%" h={0.7} />
            <Line w="60%" h={0.7} />
            <span style={{ height: "18%", borderRadius: "1cqmin", background: "#e9efe6" }} />
            <span style={{ height: "18%", borderRadius: "1cqmin", background: "#d5e4d8" }} />
          </div>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── terminal: file conversion ───────────── */

function Terminal({ bare, label = "cad-converter" }: { bare: boolean; label?: string }) {
  const rows = [
    ["site_plan.dwg", "site_plan.geojson", true],
    ["parcels.dxf", "parcels.shp", true],
    ["roads.dwg", "roads.geojson", true],
    ["boundary.dxf", "boundary.shp", false],
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
          fontSize: "2.4cqmin",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8b8b88", marginBottom: "1.2cqmin" }}>
          <span style={{ color: "#e9e9e7", fontWeight: 700 }}>{label}</span>
          <span>DWG · DXF → SHP · GeoJSON</span>
        </div>
        {rows.map(([from, to, done], i) => (
          <div
            key={from}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr auto",
              gap: "2cqmin",
              padding: "1.1cqmin 1.4cqmin",
              borderRadius: "1cqmin",
              background: i === 0 ? "#262626" : "transparent",
            }}
          >
            <span>{from}</span>
            <span style={{ color: "#6f6f6c" }}>→</span>
            <span style={{ color: "#9d9d9a" }}>{to}</span>
            <span style={{ color: done ? "#7fc79a" : "#6f6f6c" }}>{done ? "✓" : "…"}</span>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "4cqmin",
            translate: "-50% 0",
            width: "70%",
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
          <span style={{ color: "#8b8b88" }}>$</span>
          <span style={{ color: "#bdbdba" }}>python convert.py --to geojson</span>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── lesson card: mentoring ───────────── */

function Lesson() {
  const topics = ["Python", "Data processing", "Security logs"];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f4f2ed", color: "#181818", display: "grid", gridTemplateColumns: "1fr 1.1fr", alignItems: "center", padding: "6cqmin", gap: "4cqmin" }}>
      <span style={{ fontSize: "40cqmin", lineHeight: 0.8, color: GREEN }}>Py</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.2cqmin", fontSize: "3.2cqmin" }}>
        <span style={{ fontSize: "5cqmin", fontWeight: 700 }}>TechMentoring</span>
        {topics.map((t) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: "1.6cqmin" }}>
            <i style={{ width: "2.6cqmin", height: "2.6cqmin", borderRadius: "0.6cqmin", border: "0.35cqmin solid #181818", display: "grid", placeItems: "center", fontStyle: "normal", fontSize: "2cqmin" }}>✓</i>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────── chart card ───────────── */

function Chart({ tone = "#f0efec", bare, label = "Field data" }: { tone?: string; bare: boolean; label?: string }) {
  const bars = [38, 64, 52, 80, 44, 22, 30];
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
          fontSize: "2.8cqmin",
        }}
      >
        <span style={{ color: "#8a8a86" }}>{label}</span>
        <span style={{ display: "flex", gap: "1.2cqmin", marginTop: "1.6cqmin" }}>
          <Line w="30%" h={1.4} c="#181818" />
          <Line w="16%" h={1.4} />
        </span>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "2cqmin", marginTop: "3cqmin" }}>
          {bars.map((b, i) => (
            <span key={i} style={{ flex: 1, height: `${b}%`, background: i === 3 ? GREEN : "#e7e7e4", borderRadius: "1cqmin" }} />
          ))}
        </div>
      </div>
    </Stage>
  );
}
