"use client";

import { MotionConfig } from "framer-motion";
import { CyberNavbar } from "@/components/layout/CyberNavbar";
import { CyberFooter } from "@/components/layout/CyberFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { AdvantagesSection } from "@/components/landing/AdvantagesSection";
import { TariffsSection } from "@/components/landing/TariffsSection";
import { ComputersSection } from "@/components/landing/ComputersSection";
import { GamesSection } from "@/components/landing/GamesSection";
import { MapSection } from "@/components/landing/MapSection";
import { ContactsSection } from "@/components/landing/ContactsSection";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

export default function HomePage() {
  return (
    // reducedMotion="user": анимации уважают системную настройку «уменьшить движение»
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-rn-void text-white">
        <CyberNavbar />

        <main>
          <HeroSection />
          <AdvantagesSection />
          <TariffsSection />
          <ComputersSection />
          <MapSection />
          <GamesSection />
          <ContactsSection />
          <ReviewsSection />
        </main>

        <CyberFooter />

        {/* Нижняя навигация на телефоне */}
        <BottomNav />
        <AIChatWidget />
        <PWAInstallPrompt />
      </div>
    </MotionConfig>
  );
}
