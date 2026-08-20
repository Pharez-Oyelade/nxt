"use client";

import LogoLoop from "../LogoLoop";

// const techLogos = [
//   { node: <SiReact />, title: "React", href: "https://react.dev" },
//   { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
//   { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
//   { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
// ];

// Alternative with image sources
const imageLogos = [
  {
    src: "/logos/company1.svg",
    darkSrc: "/logos/company1-dark.svg",
    alt: "Company 1",
    href: "https://company1.com",
  },
  {
    src: "/logos/company2.svg",
    darkSrc: "/logos/company2-dark.svg",
    alt: "Company 2",
    href: "https://company2.com",
  },
  {
    src: "/logos/company3.svg",
    darkSrc: "/logos/company3-dark.svg",
    alt: "Company 3",
    href: "https://company3.com",
  },
  {
    src: "/logos/company4.svg",
    darkSrc: "/logos/company4-dark.svg",
    alt: "Company 4",
    href: "https://company3.com",
  },
  {
    src: "/logos/company5.svg",
    darkSrc: "/logos/company5-dark.svg",
    alt: "Company 5",
    href: "https://company3.com",
  },
];

export default function Logos() {
  return (
    <div style={{ height: "200px", position: "relative", overflow: "hidden" }}>
      {/* Basic horizontal loop */}
      <LogoLoop
        logos={imageLogos}
        speed={100}
        direction="left"
        logoHeight={60}
        gap={60}
        hoverSpeed={10}
        scaleOnHover
        fadeOut
        ariaLabel="Technology partners"
      />

      {/* Vertical loop with deceleration on hover */}
      <LogoLoop logos={imageLogos} />
    </div>
  );
}
