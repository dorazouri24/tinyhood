import type { SVGProps } from "react";

type S = SVGProps<SVGSVGElement>;

export const Squiggle = (p: S) => (
  <svg viewBox="0 0 120 12" fill="none" {...p}>
    <path
      d="M2 6 Q 12 1, 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 118 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Sparkle = (p: S) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M12 2 L13.5 9.5 L21 11 L13.5 12.5 L12 20 L10.5 12.5 L3 11 L10.5 9.5 Z"
      fill="currentColor"
    />
  </svg>
);

export const ArrowDoodle = (p: S) => (
  <svg viewBox="0 0 60 30" fill="none" {...p}>
    <path
      d="M2 18 C 14 4, 30 4, 50 14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M44 6 L 50 14 L 42 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const StarBurst = (p: S) => (
  <svg viewBox="0 0 24 24" fill="none" {...p}>
    <path
      d="M12 1 L13 8 L20 5 L15 11 L23 12 L15 13 L20 19 L13 16 L12 23 L11 16 L4 19 L9 13 L1 12 L9 11 L4 5 L11 8 Z"
      fill="currentColor"
    />
  </svg>
);

export const HeartScribble = (p: S) => (
  <svg viewBox="0 0 24 22" fill="none" {...p}>
    <path
      d="M12 20 C 4 14, 1 9, 4 5 C 7 1, 11 3, 12 6 C 13 3, 17 1, 20 5 C 23 9, 20 14, 12 20 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const HouseDoodle = (p: S) => (
  <svg viewBox="0 0 48 42" fill="none" {...p}>
    <path
      d="M4 22 L 24 4 L 44 22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 20 L 8 38 L 40 38 L 40 20"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M20 38 L 20 28 L 28 28 L 28 38"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
