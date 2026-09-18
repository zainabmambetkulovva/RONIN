import { CyberNavbar } from "@/components/layout/CyberNavbar";
import { CyberFooter } from "@/components/layout/CyberFooter";
import { RoninHero } from "@/components/sections/RoninHero";
import { RoninAbout } from "@/components/sections/RoninAbout";
import { RoninBookingFlow } from "@/components/sections/RoninBookingFlow";
import { RoninStats } from "@/components/sections/RoninStats";
import { CyberGames } from "@/components/sections/CyberGames";
import { RoninContacts } from "@/components/sections/RoninContacts";

export default function HomePage() {
  return (
    <div className="min-h-screen text-white" style={{ background: "#03030a" }}>
      <CyberNavbar />

      <main>
        {/* 1. Hero */}
        <RoninHero />

        {/* 2. About */}
        <RoninAbout />

        {/* 3. Booking Flow */}
        <RoninBookingFlow />

        {/* 4. Stats + Computers */}
        <RoninStats />

        {/* 5. Games */}
        <CyberGames />

        {/* 6. Contacts */}
        <RoninContacts />
      </main>

      <CyberFooter />
    </div>
  );
}
