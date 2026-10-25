"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ClubMap } from "@/components/map/ClubMap";
import { Reveal, Section, SectionHeading } from "./primitives";

/** 3D-карта зала: какие ПК свободны сейчас или в выбранное время. */
export function MapSection() {
  const { t } = useLanguage();
  return (
    <Section id="map">
      <SectionHeading eyebrow={t("map.eyebrow")} title={t("map.title")} subtitle={t("map.subtitle")} />
      <Reveal>
        <ClubMap />
      </Reveal>
    </Section>
  );
}
