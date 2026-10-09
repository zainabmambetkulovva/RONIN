import { CyberNavbar } from "@/components/layout/CyberNavbar";
import { CyberFooter } from "@/components/layout/CyberFooter";
import { BottomNav } from "@/components/layout/BottomNav";
import { RoninHero } from "@/components/sections/RoninHero";
import { RoninAbout } from "@/components/sections/RoninAbout";
import { RoninBookingFlowFlip } from "@/components/sections/RoninBookingFlowFlip";
import { RoninStats } from "@/components/sections/RoninStats";
import { CyberGamesFlip } from "@/components/sections/CyberGamesFlip";
import { CyberEquipment } from "@/components/sections/CyberEquipment";
import { CyberFeatures } from "@/components/sections/CyberFeatures";
import { CyberTariffs } from "@/components/sections/CyberTariffs";
import { RoninContacts } from "@/components/sections/RoninContacts";

export default function HomePage() {
  return (
    <div className="min-h-screen text-white pb-20 md:pb-0" style={{ background: "#03030a" }}>
      <CyberNavbar />

      <main>
        {/* 1. Hero */}
        <RoninHero />

        {/* 2. About */}
        <RoninAbout />

        {/* 3. Features - 3D Carousel Animation */}
        <CyberFeatures />

        {/* 4. Booking Flow - NEW Flip Cards */}
        <RoninBookingFlowFlip />

        {/* 5. Stats + Computers */}
        <RoninStats />

        {/* 6. Games - NEW Flip Cards */}
        <CyberGamesFlip />

        {/* 7. Equipment */}
        <CyberEquipment />

        {/* 8. Tariffs */}
        <CyberTariffs />

        {/* 9. Contacts */}
        <RoninContacts />
      </main>

      <CyberFooter />
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
