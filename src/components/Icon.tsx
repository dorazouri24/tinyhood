import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 24): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export const HomeIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10.5V20h14V10.5" />
  </svg>
);

export const InboxIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M4 13h4l2 3h4l2-3h4" />
    <path d="M4 13 6 5h12l2 8" />
    <path d="M4 13v6h16v-6" />
  </svg>
);

export const BellIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const UserIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
  </svg>
);

export const ArrowRight = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

export const ArrowLeft = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M19 12H5" />
    <path d="M11 5l-7 7 7 7" />
  </svg>
);

export const SendIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M22 2 11 13" />
    <path d="M22 2l-7 20-4-9-9-4Z" />
  </svg>
);

export const CheckIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const XIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </svg>
);

export const PinIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const HeartIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M20.8 6.6a5 5 0 0 0-8.8-2 5 5 0 0 0-8.8 2 5.7 5.7 0 0 0 1.5 5.4L12 21l7.3-9a5.7 5.7 0 0 0 1.5-5.4Z" />
  </svg>
);

export const SparkleIcon = ({ size, ...p }: Props) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l3 3M15.5 15.5l3 3M18.5 5.5l-3 3M8.5 15.5l-3 3" />
  </svg>
);
