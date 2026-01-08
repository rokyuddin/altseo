import { Leaf, Sun, Wind } from "lucide-react";

const FEATURES = [
    {
        icon: Wind,
        title: "Automated SEO Optimization",
        desc: "Boost organic visibility automatically. We weave relevant keywords into semantic descriptions that search engines prioritize.",
        color: "bg-blue-500/10 text-blue-600",
    },
    {
        icon: Sun,
        title: "WCAG Accessibility",
        desc: "Built from the ground up for inclusivity, ensuring your content meets global accessibility standards like WCAG 2.1.",
        color: "bg-amber-500/10 text-amber-600",
    },
    {
        icon: Leaf,
        title: "Scalable AI Vision",
        desc: "Our enterprise AI models adapt to your library, delivering high-quality, context-aware ALT text for thousands of images.",
        color: "bg-green-500/10 text-green-600",
    },
];

const STEPS = [
    {
        step: "01",
        title: "Observe",
        desc: "We ingest your visual assets with the precision of a gallery curator, analyzing composition and context.",
    },
    {
        step: "02",
        title: "Understand",
        desc: "Our AI identifies key subjects and emotional nuances, mapping them to relevant search intent.",
    },
    {
        step: "03",
        title: "Optimize",
        desc: "We generate rich, WCAG-compliant text that enhances both user experience and search engine visibility.",
    },
];

export { FEATURES, STEPS };