import { getUser } from "@/lib/auth";
import { getUserPlan } from "@/lib/subscription";
import { PricingSection } from "./pricing-section";

export async function PricingContainer() {
    const user = await getUser();
    const userPlan = user ? await getUserPlan(user.id) : "free";

    return (
        <PricingSection
            user={user}
            userPlan={userPlan}
        />
    );
}
