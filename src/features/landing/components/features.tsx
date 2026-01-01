import { cn } from "@/lib/utils";
import { FEATURES } from "../utils";



export function FeaturesSection() {
    return (
        <section id="features" className="py-32 px-6 relative">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-4xl @md:text-5xl font-bold mb-6 text-foreground">
                        Naturally Intelligent
                    </h2>
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                        Our system mimics human perception, understanding context and
                        emotion to create descriptions that flow naturally.
                    </p>
                </div>

                <div className="grid @md:grid-cols-3 gap-8">
                    {FEATURES.map((feature, i) => (
                        <div
                            key={i}
                            className="group p-10 rounded-4xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-2"
                        >
                            <div
                                className={cn(
                                    "size-14 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500",
                                    feature.color
                                )}
                            >
                                <feature.icon className="size-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
