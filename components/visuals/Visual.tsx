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
    case "flow":
      return <Flow bare={bare} />;
    case "notebook":
      return <Notebook bare={bare} />;
    case "map":
      return <GisMap bare={bare} />;
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

/* ───────────── flow: how the automation works ───────────── */

function Box({ x, y, w, h, badge, title, items, done }: { x: number; y: number; w: number; h: number; badge?: string; title: string; items: string[]; done?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#fff" stroke="#bdbdb9" strokeWidth={1.2} />
      {badge && (
        <g>
          <rect x={x + 12} y={y - 9} width={badge.length * 7.4 + 22} height={19} rx={9.5} fill="#181818" />
          <text x={x + 23} y={y + 4.5} fontSize={10.5} fill="#fff" fontWeight={700} letterSpacing={0.6}>
            {badge}
          </text>
        </g>
      )}
      <text x={x + 14} y={y + 27} fontSize={15} fontWeight={700} fill="#181818">
        {title}
      </text>
      {done && (
        <g>
          <rect x={x + w - 64} y={y + 13} width={50} height={19} rx={9.5} fill={GREEN} />
          <text x={x + w - 39} y={y + 26.5} fontSize={10.5} fill="#fff" fontWeight={700} textAnchor="middle">
            DONE
          </text>
        </g>
      )}
      <line x1={x + 14} x2={x + w - 14} y1={y + 37} y2={y + 37} stroke="#ececea" />
      {items.map((t, i) => (
        <text key={t} x={x + 14} y={y + 56 + i * 17} fontSize={12.5} fill="#5c5c58">
          {t}
        </text>
      ))}
    </g>
  );
}

function Flow({ bare }: { bare: boolean }) {
  return (
    <Stage bare={bare} bg="#efefec">
      <svg viewBox="0 0 860 360" style={{ width: "94cqw", height: "88cqh" }} role="img" aria-label="How the automation works: source data, validation, Python script, delivered output, on a schedule">
        <defs>
          <pattern id="flow-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#e6e6e3" strokeWidth={0.8} />
          </pattern>
          <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="#6f6f6c" />
          </marker>
        </defs>
        <rect width="860" height="360" fill="url(#flow-grid)" opacity={bare ? 0 : 0.9} />

        <Box x={24} y={28} w={230} h={112} badge="01 · SOURCE" title="Source Data" items={["Spreadsheets", "Cloud exports", "Partner logs"]} />
        <Box x={314} y={28} w={230} h={112} badge="02 · VALIDATE" title="Validation" items={["Format check", "Duplicate scan", "Rules enforced"]} />
        <Box x={604} y={28} w={232} h={112} badge="04 · DELIVER" title="Delivered Output" items={["Formatted reports", "Patched records", "Actionable files"]} done />
        <Box x={24} y={176} w={230} h={86} title="Schedule / Event" items={["on a timer", "on file upload"]} />
        <g>
          <Box x={314} y={176} w={230} h={104} badge="03 · PROCESS" title="Python Script" items={["Extract · Transform · Patch"]} />
          <rect x={330} y={246} width={198} height={22} rx={11} fill="#e4ede1" />
          <text x={429} y={261} fontSize={11.5} fill="#36603a" fontWeight={700} textAnchor="middle">
            repeatable · logged
          </text>
        </g>

        <g fill="none" stroke="#6f6f6c" strokeWidth={1.6} markerEnd="url(#flow-arrow)">
          <path d="M256 84H310" />
          <path d="M546 84H600" />
          <path d="M429 142V172" />
          <path d="M256 219H310" />
          <path d="M546 236C590 236 572 120 600 112" />
          <path d="M720 142C716 330 160 330 139 266" strokeDasharray="6 6" stroke="#a3a3a0" />
        </g>
        <text x="430" y="346" fontSize={14} fill="#6f6f6c" textAnchor="middle">
          You ask once — the script repeats the work for you.
        </text>
      </svg>
    </Stage>
  );
}

/* ───────────── notebook: running the transcriber in Jupyter ───────────── */

function Notebook({ bare }: { bare: boolean }) {
  const cell = (n: number, code: ReactNode, out?: ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "9cqmin 1fr", gap: "1.6cqmin", alignItems: "start" }}>
      <span style={{ color: "#2b6cb0", fontSize: "1.9cqmin", paddingTop: "0.9cqmin" }}>[{n}]:</span>
      <div style={{ display: "grid", gap: "0.8cqmin" }}>
        <div style={{ background: "#f6f6f4", border: "0.2cqmin solid #e6e6e3", borderRadius: "0.8cqmin", padding: "1cqmin 1.4cqmin", fontSize: "2cqmin" }}>{code}</div>
        {out && <div style={{ fontSize: "1.9cqmin", color: "#5c5c58", padding: "0 1.4cqmin", display: "grid", gap: "0.4cqmin" }}>{out}</div>}
      </div>
    </div>
  );
  const kw = (t: string) => <span style={{ color: "#8a3ffc" }}>{t}</span>;
  const str = (t: string) => <span style={{ color: "#1f7a4a" }}>{t}</span>;
  return (
    <Stage bare={bare} bg="#e9ecef">
      <div
        style={{
          width: "86cqw",
          height: "82cqh",
          background: "#fff",
          borderRadius: "1.6cqmin",
          boxShadow: "0 0 0 0.2cqmin rgb(0 0 0 / .06), 0 3cqmin 8cqmin -2cqmin rgb(0 0 0 / .2)",
          display: "grid",
          gridTemplateRows: "auto auto 1fr",
          overflow: "hidden",
          color: "#181818",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.4cqmin", padding: "1.4cqmin 2cqmin", borderBottom: "0.2cqmin solid #efefed", fontSize: "2.1cqmin" }}>
          <i style={{ width: "2.6cqmin", height: "2.6cqmin", borderRadius: 99, border: "0.5cqmin solid #f37726" }} />
          <span style={{ fontWeight: 700 }}>audio_transkript.ipynb</span>
          <span style={{ marginLeft: "auto", color: "#8a8a86", fontSize: "1.8cqmin" }}>Python 3 · ● idle</span>
        </div>
        <div style={{ display: "flex", gap: "2cqmin", padding: "0.8cqmin 2cqmin", borderBottom: "0.2cqmin solid #f3f3f1", color: "#8a8a86", fontSize: "1.8cqmin" }}>
          {["File", "Edit", "View", "Run", "Kernel"].map((t) => (
            <span key={t}>{t}</span>
          ))}
          <span style={{ marginLeft: "auto" }}>▶ Run all</span>
        </div>
        <div style={{ padding: "2cqmin 2.4cqmin", display: "grid", gap: "1.8cqmin", alignContent: "start", overflow: "hidden" }}>
          {cell(1, <>{kw("!pip install")} -r requirements.txt</>, <span>Successfully installed SpeechRecognition pydub python-docx</span>)}
          {cell(
            2,
            <>
              {kw("!python")} code/main.py {str("audio_input/meeting.m4a")} {str("output/meeting.docx")} --language {str("id-ID")}
            </>,
            <>
              <span>Loading audio… split into 45 s chunks: 4</span>
              {[1, 2, 3, 4].map((n) => (
                <span key={n} style={{ display: "flex", alignItems: "center", gap: "1.2cqmin" }}>
                  chunk {n}/4
                  <i style={{ flex: 1, maxWidth: "26cqmin", height: "0.8cqmin", background: "#e6e6e3", borderRadius: 99, overflow: "hidden" }}>
                    <b style={{ display: "block", height: "100%", width: "100%", background: GREEN }} />
                  </i>
                  <span style={{ color: GREEN }}>✓</span>
                </span>
              ))}
              <span style={{ color: "#181818" }}>Saved → output/meeting.docx</span>
            </>,
          )}
          {cell(3, <span style={{ color: "#9a9a96" }}> </span>)}
        </div>
      </div>
    </Stage>
  );
}

/* ───────────── map: converted layers in a GIS view ───────────── */

function GisMap({ bare }: { bare: boolean }) {
  const layers: [string, string, boolean][] = [
    ["parcels.shp", "#c9a15a", true],
    ["roads.geojson", "#6f6f6c", true],
    ["boundary.shp", "#c0392b", true],
    ["site_plan.geojson", GREEN, true],
    ["basemap", "#cfe3d4", false],
  ];
  return (
    <Stage bare={bare} bg="#e6ebe7">
      <div
        style={{
          width: "88cqw",
          height: "82cqh",
          background: "#fff",
          borderRadius: "1.6cqmin",
          boxShadow: "0 0 0 0.2cqmin rgb(0 0 0 / .06), 0 3cqmin 8cqmin -2cqmin rgb(0 0 0 / .2)",
          display: "grid",
          gridTemplateRows: "auto 1fr",
          overflow: "hidden",
          color: "#181818",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.4cqmin", padding: "1.3cqmin 2cqmin", borderBottom: "0.2cqmin solid #efefed", fontSize: "2cqmin" }}>
          <span style={{ fontWeight: 700 }}>GIS · converted layers</span>
          <span style={{ marginLeft: "auto", color: "#8a8a86", fontSize: "1.8cqmin" }}>EPSG:4326</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "26% 1fr", minHeight: 0 }}>
          <div style={{ borderRight: "0.2cqmin solid #f0f0ee", padding: "2cqmin", display: "grid", gap: "1.4cqmin", alignContent: "start", fontSize: "1.9cqmin" }}>
            <span style={{ color: "#8a8a86" }}>Layers</span>
            {layers.map(([n, c, on]) => (
              <span key={n} style={{ display: "flex", alignItems: "center", gap: "1cqmin", color: on ? "#181818" : "#a3a3a0" }}>
                <i style={{ width: "2cqmin", height: "2cqmin", borderRadius: "0.4cqmin", border: "0.25cqmin solid #181818", display: "grid", placeItems: "center", fontStyle: "normal", fontSize: "1.5cqmin" }}>{on ? "✓" : ""}</i>
                <i style={{ width: "2cqmin", height: "1.2cqmin", background: c, borderRadius: "0.3cqmin" }} />
                {n}
              </span>
            ))}
          </div>
          <div style={{ position: "relative", background: "#eef4ef" }}>
            <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden>
              <path d="M0 200C80 180 120 230 200 210S330 150 400 170V260H0Z" fill="#dbe9df" />
              <path d="M0 40C60 60 90 20 160 34" fill="none" stroke="#b9d3e6" strokeWidth={9} strokeLinecap="round" />
              <g fill="#f3e3c2" stroke="#c9a15a" strokeWidth={1.2}>
                <path d="M70 70L150 62 156 120 76 128Z" />
                <path d="M156 62L232 58 236 112 156 120Z" />
                <path d="M76 128L156 120 160 182 82 190Z" />
                <path d="M160 120L236 112 244 170 160 182Z" />
                <path d="M236 58L300 66 306 120 236 112Z" />
                <path d="M244 170L306 120 330 176 252 214Z" />
              </g>
              <path d="M150 62 160 182M236 58 244 170M70 70 300 66" fill="none" stroke="#6f6f6c" strokeWidth={1.6} />
              <path d="M20 150C90 140 180 150 250 140S360 110 392 96" fill="none" stroke="#6f6f6c" strokeWidth={3} />
              <path d="M20 150C90 140 180 150 250 140S360 110 392 96" fill="none" stroke="#fff" strokeWidth={1} strokeDasharray="6 5" />
              <path d="M56 54 316 50 344 190 70 206Z" fill="none" stroke="#c0392b" strokeWidth={1.8} strokeDasharray="7 5" />
              <path d="M180 86 214 84 216 104 182 106Z" fill={GREEN} fillOpacity={0.8} />
              <circle cx={198} cy={95} r={3} fill="#fff" />
            </svg>
            <div style={{ position: "absolute", right: "2cqmin", top: "2cqmin", display: "grid", placeItems: "center", width: "5cqmin", height: "6cqmin", fontSize: "1.8cqmin", fontWeight: 700 }}>
              <span>▲</span>
              <span>N</span>
            </div>
            <div style={{ position: "absolute", left: "2cqmin", bottom: "2cqmin", display: "flex", alignItems: "center", gap: "1cqmin", fontSize: "1.6cqmin", background: "rgb(255 255 255 / .8)", padding: "0.6cqmin 1cqmin", borderRadius: "0.6cqmin" }}>
              <i style={{ width: "10cqmin", height: "0.8cqmin", background: "linear-gradient(90deg,#181818 50%,#fff 50%)", border: "0.2cqmin solid #181818" }} />
              0 — 200 m
            </div>
          </div>
        </div>
      </div>
    </Stage>
  );
}
