"use client";

import { CyberNavbar } from "@/components/layout/CyberNavbar";
import { CyberFooter } from "@/components/layout/CyberFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { RoninHero } from "@/components/sections/RoninHero";
import { CyberGames } from "@/components/sections/CyberGames";
import { CyberTariffs } from "@/components/sections/CyberTariffs";
import { RoninBookingFlowCompact } from "@/components/sections/RoninBookingFlowCompact";
import { RoninContactsCompact } from "@/components/sections/RoninContactsCompact";
import { AIChatWidget } from "@/components/ai/AIChatWidget";

export default function HomePage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: "radial-gradient(circle at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.15) 0%, transparent 50%), #0a0a14"
      }}
    >
      <CyberNavbar />

      <main>
        {/* 1. Hero */}
        <RoninHero />

        {/* 2. Games */}
        <CyberGames />

        {/* 3. Tariffs */}
        <CyberTariffs />

        {/* 4. Booking */}
        <RoninBookingFlowCompact />

        {/* 5. Contacts */}
        <RoninContactsCompact />
      </main>

      <CyberFooter />
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
