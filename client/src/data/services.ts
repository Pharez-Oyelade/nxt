export interface ProcessStep {
  title: string;
  description: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  heroImage: string;
  capabilities: string[];
  process: ProcessStep[];
}

export const servicesData: ServiceData[] = [
  {
    slug: "strategy",
    name: "Strategy",
    subtitle: "We figure out what you're building and why it should exist.",
    description:
      "A great product is built on a foundation of clear, actionable strategy. We partner with ambitious founders and teams to navigate ambiguity, define product positioning, and map out scalable roadmaps that align user needs with business goals.",
    heroImage: "/images/services/strategy_bg_1786802101253.jpg",
    capabilities: [
      "Product Positioning",
      "Market Research",
      "Go-to-market Strategy",
      "UX Audits",
      "Business Model Validation",
      "Feature Prioritization",
    ],
    process: [
      {
        title: "Discovery & Research",
        description:
          "We dive deep into your industry, competitors, and target audience to uncover unique opportunities and challenges.",
      },
      {
        title: "Synthesis & Positioning",
        description:
          "We translate raw data into a clear brand narrative and product positioning strategy that sets you apart.",
      },
      {
        title: "Roadmapping",
        description:
          "We define actionable phases for execution, ensuring the most critical features are prioritized for your MVP and beyond.",
      },
    ],
  },
  {
    slug: "identity",
    name: "Identity",
    subtitle: "We give you a clear identity that sets your brand apart.",
    description:
      "Your brand is more than a logo; it's how people feel when they interact with your product. We build memorable visual identities, design systems, and compelling brand voices that resonate with your audience and communicate unglamorous confidence.",
    heroImage: "/images/services/identity_bg_1786802112521.jpg",
    capabilities: [
      "Brand Strategy",
      "Visual Identity",
      "Logo Design",
      "Typography & Color Systems",
      "Brand Guidelines",
      "Art Direction",
    ],
    process: [
      {
        title: "Brand Workshop",
        description:
          "We collaborate to uncover your core values, personality, and the unique tone of voice that will define your brand.",
      },
      {
        title: "Visual Exploration",
        description:
          "We present multiple art directions, exploring typography, color palettes, and visual motifs that align with your strategy.",
      },
      {
        title: "System Delivery",
        description:
          "We finalize the chosen direction and build a robust design system and brand guideline document.",
      },
    ],
  },
  {
    slug: "design",
    name: "Design",
    subtitle:
      "We turn ideas into clear, useful experiences that look as good as they work.",
    description:
      "We design digital products that prioritize user experience without sacrificing premium aesthetics. By focusing on intuitive navigation, seamless micro-interactions, and pixel-perfect layouts, we create interfaces that feel effortless and engaging.",
    heroImage: "/images/services/design_bg_1786802123606.jpg",
    capabilities: [
      "UI/UX Design",
      "Wireframing & Prototyping",
      "Web Design",
      "Mobile App Design",
      "Design Systems",
      "Interaction Design",
    ],
    process: [
      {
        title: "Wireframing",
        description:
          "We establish the structural layout and user flows, focusing purely on functionality and seamless navigation.",
      },
      {
        title: "Visual Interface",
        description:
          "We apply the brand identity to the wireframes, crafting high-fidelity screens with premium typography and styling.",
      },
      {
        title: "Prototyping",
        description:
          "We build interactive prototypes to test micro-interactions, transitions, and the overall user journey before development.",
      },
    ],
  },
  {
    slug: "engineering",
    name: "Engineering",
    subtitle: "We build the products that bring everything to life.",
    description:
      "Our engineering team turns high-fidelity designs into robust, scalable, and performant digital products. We specialize in modern tech stacks, ensuring that your web or mobile application is secure, incredibly fast, and built to grow with your business.",
    heroImage: "/images/services/engineering_bg_1786802134054.jpg",
    capabilities: [
      "Frontend Development",
      "Backend Architecture",
      "Full-Stack Web Apps",
      "Mobile App Development",
      "API Integration",
      "Performance Optimization",
    ],
    process: [
      {
        title: "Architecture Setup",
        description:
          "We select the optimal tech stack and configure the foundational architecture, databases, and deployment pipelines.",
      },
      {
        title: "Development Sprints",
        description:
          "We build the product in iterative cycles, integrating front-end interfaces with secure back-end APIs.",
      },
      {
        title: "Testing & Launch",
        description:
          "We conduct rigorous QA testing for performance, accessibility, and security before deploying your product to production.",
      },
    ],
  },
];
