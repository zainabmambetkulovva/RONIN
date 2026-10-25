"use client";

import { ExternalLink, Quote, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { club } from "@/config/club";
import { reviews } from "@/config/reviews";
import { Reveal, Section, SectionHeading } from "./primitives";

const LOCALES = { ru: "ru-RU", en: "en-US", ky: "ky-KG" } as const;
const ACCENTS = ["from-rn-violet to-rn-magenta", "from-rn-electric to-rn-cyan", "from-rn-magenta to-rn-pink"];

export function ReviewsSection() {
  const { t, language } = useLanguage();

  // Блок показывается только при наличии настоящих отзывов
  if (reviews.length === 0) return null;

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(LOCALES[language], { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

  return (
    <Section id="reviews" className="bg-rn-night overflow-hidden">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow={t("reviews.eyebrow")} title={t("reviews.title")} subtitle={t("reviews.subtitle")} />
        <Reveal className="mb-10 md:mb-14">
          <a
            href={club.twoGis.reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl border border-rn-line bg-rn-surface px-5 py-4 transition hover:border-rn-pink/60"
          >
            <span className="font-display text-4xl font-black text-white">{club.twoGis.rating.toFixed(1)}</span>
            <span>
              <span className="flex gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(club.twoGis.rating) ? "fill-rn-pink text-rn-pink" : "text-rn-line"}`} />
                ))}
              </span>
              <span className="mt-1 flex items-center gap-1 text-xs text-rn-muted group-hover:text-white">
                {club.twoGis.ratingsCount} {t("reviews.ratings")} · {t("reviews.all")}
                <ExternalLink className="h-3 w-3" />
              </span>
            </span>
          </a>
        </Reveal>
      </div>

      <HorizontalCarousel ariaLabel={t("reviews.title")} itemClassName="w-[300px] sm:w-[380px]" autoPlayMs={4500}>
        {reviews.map((review, i) => (
          <figure
            key={`${review.author}-${review.date}`}
            className="group relative flex h-full min-h-[260px] flex-col rounded-3xl border border-rn-line bg-rn-surface p-6 transition hover:border-rn-violet/60"
          >
            <Quote className="h-8 w-8 text-rn-violet/60" aria-hidden />
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-white/85">{review.text}</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-rn-line pt-4">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} font-display text-sm font-bold text-white`}
                aria-hidden
              >
                {review.author.trim().charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-white">{review.author}</span>
                <span className="block text-xs text-rn-muted">
                  {formatDate(review.date)} · {review.source}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </HorizontalCarousel>
    </Section>
  );
}
