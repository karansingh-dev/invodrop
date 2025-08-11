import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import OnboardingCarousal from "@/features/onboarding/onboarding-carousal"


export default function Onboarding() {
    return <div className="flex min-h-screen justify-center items-center">



        <OnboardingCarousal />
    </div>
}



