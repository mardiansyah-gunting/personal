import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16, rest: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...rest,
});

export const IconMove = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M5 3.8 19 10.4l-6.2 1.9-2.4 6.3z" />
  </svg>
);
export const IconPen = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M15.6 4.4a2 2 0 0 1 2.9 0l1.1 1.1a2 2 0 0 1 0 2.9L8.3 19.7 4 20l.3-4.3z" />
    <path d="m13.8 6.2 4 4" />
  </svg>
);
export const IconNote = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M5 4.5h14v9.2L13.2 19.5H5z" />
    <path d="M13 19.3v-5.6h5.8" />
  </svg>
);
export const IconOriginal = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="M12 4v16" />
    <path d="M6.5 4.5h5.5v15H6.5A2.5 2.5 0 0 1 4 17V7a2.5 2.5 0 0 1 2.5-2.5z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconFall = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 4v11" />
    <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
    <path d="M5 20h14" />
  </svg>
);
export const IconLink = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M10 13.5a4 4 0 0 0 5.7.3l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.2 1.2" />
    <path d="M14 10.5a4 4 0 0 0-5.7-.3L5.5 13a4 4 0 0 0 5.7 5.7l1.2-1.2" />
  </svg>
);
export const IconCopy = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" />
    <path d="M15.5 8.5V6.5A2.5 2.5 0 0 0 13 4H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5h2" />
  </svg>
);
export const IconReset = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9" />
    <path d="M4.5 4.5V9H9" />
  </svg>
);
export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />
  </svg>
);
export const IconChevron = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </svg>
);
export const IconArrow = ({ size, dir = "right", ...p }: P & { dir?: "left" | "right" }) => (
  <svg {...base(size, p)} style={{ transform: dir === "left" ? "scaleX(-1)" : undefined }}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconDownload = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14" />
  </svg>
);
export const IconKey = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3.5" y="5" width="17" height="14" rx="3" />
    <path d="M9.5 9h5M9.5 12h4M9.5 15h5M9.5 9v6" />
  </svg>
);

/* social — simple generic glyphs */
export const IconExternal = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M8 16 16.5 7.5M9.5 7H17v7.5" />
  </svg>
);
export const IconSocial = ({ name, size = 16 }: { name: "linkedin" | "github"; size?: number }) => {
  const p = base(size, {});
  if (name === "linkedin")
    return (
      <svg {...p}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M8 10.5V16M8 7.8v.01M11.5 16v-5.5M11.5 13a2.5 2.5 0 0 1 5 0v3" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M9.5 19.5c-4 1.2-4-2-5.6-2.4M15 21.5v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.6 3.1 5.6 3.4 5.6 3.4a4.3 4.3 0 0 0-.1 3.2 4.6 4.6 0 0 0-1.3 3.2c0 4.6 2.8 5.7 5.6 6a3 3 0 0 0-.8 2.3v3.4" />
    </svg>
  );
};
