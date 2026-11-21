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
    case "pipeline":
      return <Pipeline bare={bare} />;
    case "transcript":
      return <Transcript bare={bare} />;
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

function Phone({ bare, label = "TREEO" }: { bare: boolean; label?: string }) {
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

/* ───────────── pipeline: ETL from raw files to a clean report ───────────── */

const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: "1.6cqmin",
      boxShadow: "0 0 0 0.2cqmin rgb(0 0 0 / .05), 0 2cqmin 6cqmin -2cqmin rgb(0 0 0 / .18)",
      padding: "2.2cqmin",
      display: "flex",
      flexDirection: "column",
      gap: "1.2cqmin",
      color: "#181818",
      ...style,
    }}
  >
    {children}
  </div>
);
const Arrow = () => <span style={{ color: "#9a9a96", fontSize: "4cqmin", lineHeight: 1 }}>→</span>;
const Sheet = ({ name, tone }: { name: string; tone: string }) => (
  <span style={{ display: "flex", alignItems: "center", gap: "1cqmin", fontSize: "2.2cqmin" }}>
    <i style={{ width: "2.6cqmin", height: "3.2cqmin", borderRadius: "0.4cqmin", background: tone, flexShrink: 0 }} />
    {name}
  </span>
);

function Pipeline({ bare }: { bare: boolean }) {
  const steps = [
    ["Extract", "read raw files"],
    ["Transform", "clean · validate · reformat"],
    ["Load", "write the report"],
  ];
  return (
    <Stage bare={bare} bg="#e9efe6">
      <div style={{ width: "90cqw", height: "80cqh", display: "grid", gridTemplateRows: "1fr auto", gap: "2.4cqmin" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1.3fr auto 1fr", alignItems: "center", gap: "1.6cqmin", minHeight: 0 }}>
          <Card>
            <span style={{ fontSize: "2cqmin", color: "#8a8a86" }}>Input</span>
            <Sheet name="field_data.csv" tone="#d5e4d8" />
            <Sheet name="partners.xlsx" tone="#c4d9c9" />
            <Sheet name="export_raw.csv" tone="#d5e4d8" />
          </Card>
          <Arrow />
          <Card style={{ background: "#161616", color: "#e9e9e7" }}>
            <span style={{ fontSize: "2cqmin", color: "#8b8b88" }}>python main.py</span>
            {steps.map(([t, d], i) => (
              <span key={t} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.2cqmin", alignItems: "baseline" }}>
                <span style={{ color: "#7fc79a", fontSize: "2.2cqmin" }}>{i + 1}</span>
                <span style={{ fontSize: "2.4cqmin" }}>
                  {t}
                  <span style={{ display: "block", color: "#8b8b88", fontSize: "1.9cqmin" }}>{d}</span>
                </span>
              </span>
            ))}
          </Card>
          <Arrow />
          <Card>
            <span style={{ fontSize: "2cqmin", color: "#8a8a86" }}>Output</span>
            <span style={{ fontSize: "2.6cqmin", fontWeight: 700, color: GREEN }}>report.xlsx</span>
            {[80, 64, 72, 50].map((w, i) => (
              <Line key={i} w={`${w}%`} h={1.1} c={i === 0 ? "#181818" : "#e3e3e0"} />
            ))}
            <span style={{ alignSelf: "flex-start", background: "#e4ede1", color: "#36603a", borderRadius: 99, padding: "0.4cqmin 1.4cqmin", fontSize: "1.8cqmin" }}>✓ ready</span>
          </Card>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "2cqmin", fontSize: "2cqmin", color: "#6f6f6c" }}>
          <span style={{ background: "#fff", borderRadius: 99, padding: "0.6cqmin 1.8cqmin" }}>⏱ schedule · every morning</span>
          <span style={{ background: "#fff", borderRadius: 99, padding: "0.6cqmin 1.8cqmin" }}>logging · run.log</span>
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── transcript: audio in, Word document out ───────────── */

function Transcript({ bare }: { bare: boolean }) {
  const wave = [3, 6, 10, 5, 8, 12, 7, 4, 9, 13, 6, 3, 8, 11, 5, 7, 10, 4, 6, 9, 12, 5, 3, 7];
  return (
    <Stage bare={bare} bg="#ecebe7">
      <div style={{ width: "90cqw", height: "78cqh", display: "grid", gridTemplateColumns: "1fr auto 1fr auto 1.15fr", alignItems: "center", gap: "1.6cqmin" }}>
        <Card>
          <span style={{ fontSize: "2cqmin", color: "#8a8a86" }}>Input</span>
          <span style={{ fontSize: "2.4cqmin", fontWeight: 700 }}>meeting.m4a</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.4cqmin", height: "8cqmin" }}>
            {wave.map((h, i) => (
              <i key={i} style={{ flex: 1, height: `${h * 0.6}cqmin`, background: "#181818", borderRadius: 99 }} />
            ))}
          </span>
          <span style={{ fontSize: "1.9cqmin", color: "#8a8a86" }}>pydub · ffmpeg</span>
        </Card>
        <Arrow />
        <Card style={{ background: "#161616", color: "#e9e9e7" }}>
          <span style={{ fontSize: "2cqmin", color: "#8b8b88" }}>45 s chunks</span>
          {["00:00", "00:45", "01:30", "02:15"].map((t, i) => (
            <span key={t} style={{ display: "flex", justifyContent: "space-between", fontSize: "2.1cqmin" }}>
              <span>{t}</span>
              <span style={{ color: i < 3 ? "#7fc79a" : "#6f6f6c" }}>{i < 3 ? "✓" : "…"}</span>
            </span>
          ))}
          <span style={{ fontSize: "1.9cqmin", color: "#8b8b88" }}>speech recognition · id-ID</span>
        </Card>
        <Arrow />
        <Card style={{ aspectRatio: "0.78", justifyContent: "flex-start" }}>
          <span style={{ display: "flex", justifyContent: "space-between", fontSize: "2cqmin", color: "#8a8a86" }}>
            <span>Output</span>
            <span style={{ color: "#2b579a", fontWeight: 700 }}>W</span>
          </span>
          <span style={{ fontSize: "2.4cqmin", fontWeight: 700 }}>transcript.docx</span>
          {[92, 84, 96, 70, 88, 60, 90, 76].map((w, i) => (
            <Line key={i} w={`${w}%`} h={0.9} c="#d9d9d6" />
          ))}
        </Card>
      </div>
    </Stage>
  );
}
