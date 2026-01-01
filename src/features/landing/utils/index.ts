import { Leaf, Sun, Wind } from "lucide-react";

const FEATURES = [
    {
        icon: Leaf,
        title: "Organic Growth",
        desc: "Our models adapt to your brand voice, ensuring consistent, high-quality descriptions that scale with your library.",
        color: "bg-green-500/10 text-green-600",
    },
    {
        icon: Wind,
        title: "Search Engine Harmony",
        desc: "Boost organic visibility naturally. We weave relevant keywords into semantic narratives that search engines prioritize.",
        color: "bg-blue-500/10 text-blue-600",
    },
    {
        icon: Sun,
        title: "Accessible Core",
        desc: "Built from the ground up to nurture inclusivity, ensuring your content reaches every user in the digital ecosystem.",
        color: "bg-amber-500/10 text-amber-600",
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