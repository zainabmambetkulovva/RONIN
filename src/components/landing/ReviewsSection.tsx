"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Quote, Star, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Marquee } from "@/components/ui/Marquee";
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

      <Marquee ariaLabel={t("reviews.title")} itemClassName="w-[270px] sm:w-[340px]" speed={35}>
        {reviews.map((review, i) => (
          <figure
            key={`${review.author}-${review.date}`}
            className="group relative flex h-full flex-col rounded-2xl border border-rn-line bg-rn-surface p-5 transition hover:border-rn-violet/60"
          >
            <Quote className="h-6 w-6 text-rn-violet/60" aria-hidden />
            <ReviewText text={review.text} author={review.author} meta={`${formatDate(review.date)} · ${review.source}`} />
            <figcaption className="mt-4 flex items-center gap-3 border-t border-rn-line pt-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]} font-display text-sm font-bold text-white`}
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
      </Marquee>
    </Section>
  );
}

/** Текст отзыва: 4 строки; длинный открывается целиком в окне (карточка не растягивается и не сдвигает ленту). */
function ReviewText({ text, author, meta }: { text: string; author: string; meta: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const long = text.length > 140;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <div className="mt-3 flex-1">
      <blockquote className="line-clamp-4 text-sm leading-relaxed text-white/85">{text}</blockquote>
      {long && (
        <button type="button" onClick={() => setOpen(true)} className="mt-2 text-xs font-semibold text-rn-cyan hover:text-white">
          {t("reviews.more")}
        </button>
      )}
      {/* Окно — в body: лента двигается через transform, внутри неё fixed-окно съехало бы */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={author}
            // События из портала всплывают по дереву React до ленты — не даём им двигать её
            onPointerDown={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
          >
            <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label={t("reviews.less")} />
            <figure className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border border-rn-line bg-rn-night p-6 sm:max-w-lg sm:rounded-3xl">
              <div className="mb-3 flex items-start justify-between gap-3">
                <Quote className="h-7 w-7 text-rn-violet/70" aria-hidden />
                <button type="button" onClick={() => setOpen(false)} className="text-rn-muted hover:text-white" aria-label={t("reviews.less")}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <blockquote className="whitespace-pre-line text-base leading-relaxed text-white/90">{text}</blockquote>
              <figcaption className="mt-5 border-t border-rn-line pt-3">
                <span className="block font-semibold text-white">{author}</span>
                <span className="block text-xs text-rn-muted">{meta}</span>
              </figcaption>
            </figure>
          </div>,
          document.body
        )}
    </div>
  );
}
