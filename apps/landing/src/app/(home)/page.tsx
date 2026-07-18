
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { Header } from "@/sections/Header";
import HeroSection from "@/sections/Hero";
import { LogoTicker } from "@/sections/LogoTicker";
import { Features } from "@/sections/Features";
import { Benefits } from "@/sections/Benefits";
import { PricingPage } from "@/components/ui/pricing-page";
import { Testimonials } from "@/sections/Testimonials";
import { CallToAction } from "@/sections/CallToAction";
import { Footer2 } from "@/components/footer2";
import { MietResults } from "@/components/miet-results";
import { Faq } from "@/components/faq";
import FeaturesSectionDemo from "@/components/features-section-demo-3";

export default async function Home() {
    const { userId } = await auth();
    if (userId) {
        redirect(`/c/new`);
    }

    return (
        <div className="w-full relative overflow-hidden">
            {/* <Header /> */}
            <section id="hero" className="scroll-mt-24">
                <HeroSection />
            </section>
            <section id="logo-ticker" className="max-w-480 mx-auto px-4 scroll-mt-24">
                <LogoTicker />
            </section>
            <section id="features" className="max-w-480 mx-auto px-4 scroll-mt-24">
                <Features />
            </section>
            <section id="demo" className="max-w-480 mx-auto px-4 scroll-mt-24">
                {/* <BentoFeatures /> */}
                <FeaturesSectionDemo />
            </section>
            <section id="pricing" className="max-w-480 mx-auto px-4 scroll-mt-24">
                <PricingPage embedded />
            </section>
            <section id="testimonials" className="max-w-480 mx-auto px-4 scroll-mt-24">
                <Testimonials />
            </section>
            <section id="results" className="scroll-mt-24">
                <MietResults />
            </section>
            <section id="faq" className="scroll-mt-24">
                <Faq />
            </section>
            <section id="contact" className="scroll-mt-24">
                <CallToAction />
            </section>
            <div>
                <Footer2 />
            </div>
        </div>
    );
}
