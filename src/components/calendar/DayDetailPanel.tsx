"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { MoonIcon } from "@/components/ui/MoonIcon";
import type { AuspiciousDayData, ScoreLabel } from "@/types";

interface DayDetailPanelProps {
  day: AuspiciousDayData;
  isOpen: boolean;
  onClose: () => void;
}

export function DayDetailPanel({ day, isOpen, onClose }: DayDetailPanelProps) {
  const dateObj = new Date(day.date + "T12:00:00");

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 bg-navy-900 border-l border-navy-700 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
          // Desktop: slide from right
          "top-0 right-0 h-full w-full sm:w-[440px] lg:w-[480px]",
          isOpen ? "translate-x-0" : "translate-x-full",
          // Mobile: slide from bottom
          "max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[85vh] max-sm:w-full max-sm:rounded-t-2xl max-sm:border-t max-sm:border-l-0",
          isOpen
            ? "max-sm:translate-y-0 max-sm:translate-x-0"
            : "max-sm:translate-y-full max-sm:translate-x-0"
        )}
      >
        {/* Handle bar for mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-navy-700/60">
          <div>
            <button
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors mb-2 flex items-center gap-1"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 12 6 8l4-4" />
              </svg>
              Back
            </button>
            <h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl text-slate-100">
              {format(dateObj, "EEEE, MMMM d, yyyy")}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-7">
          {/* Score section */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Badge label={day.scoreLabel as ScoreLabel} className="text-sm px-3 py-1" />
              <span className="text-base text-slate-400">
                Score: {day.score}/5
              </span>
            </div>
            <p className="text-base text-slate-300 italic">{day.summary}</p>
          </div>

          {/* Western Astrology */}
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-gold-400/40" />
              Western Astrology
              <span className="flex-1 h-px bg-gold-400/40" />
            </h4>
            <div className="space-y-3 text-base">
              <div className="flex items-center gap-2.5">
                <MoonIcon angle={day.moonPhase.angle} size={24} className="text-gold-300" />
                <span className="text-slate-200">
                  {day.moonPhase.name} in {day.moonSign}
                </span>
                <span className="text-slate-500 text-sm ml-auto">
                  {Math.round(day.moonPhase.illumination * 100)}% lit
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sun in {day.sunSign}</span>
              </div>
              {day.voidOfCourseMoon.isVoid && (
                <div className="flex items-center gap-2 text-orange-300 text-sm bg-orange-400/10 rounded-md px-3 py-2">
                  <span>Void-of-Course Moon: {day.voidOfCourseMoon.startTime} – {day.voidOfCourseMoon.endTime} UTC</span>
                </div>
              )}

              {/* Planetary Aspects */}
              {day.planetaryAspects.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-slate-500 mb-2">
                    Planetary Aspects
                  </p>
                  <div className="space-y-1.5">
                    {day.planetaryAspects.map((a, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2 text-sm px-3 py-1.5 rounded",
                          a.isHarmonious
                            ? "text-emerald-300 bg-emerald-400/5"
                            : "text-orange-300 bg-orange-400/5"
                        )}
                      >
                        <span>{a.isHarmonious ? "+" : "-"}</span>
                        <span>
                          {a.planet1} {a.aspect} {a.planet2}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Retrogrades */}
              {day.retrograde.length > 0 && (
                <div className="flex items-center gap-2 text-red-300 text-sm bg-red-400/10 rounded-md px-3 py-2 mt-3">
                  <span>Retrograde: {day.retrograde.join(", ")}</span>
                </div>
              )}
            </div>
          </section>

          {/* Chinese Almanac */}
          <section>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-gold-400/40" />
              Chinese Almanac
              <span className="flex-1 h-px bg-gold-400/40" />
            </h4>
            <div className="space-y-3 text-base">
              <div className="flex justify-between text-slate-300">
                <span>Lunar Date</span>
                <span className="text-slate-200">{day.chinese.lunarDate}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Day Pillar</span>
                <span className="text-slate-200">
                  {day.chinese.stemBranchDay} ({day.chinese.element}{" "}
                  {day.chinese.animalDay})
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Day Officer</span>
                <span className="text-slate-200">
                  {day.chinese.dayOfficerChinese} {day.chinese.dayOfficer}
                </span>
              </div>
              <div className="flex justify-between text-slate-300 text-sm">
                <span>Clash</span>
                <span className="text-red-300">
                  {day.chinese.clashAnimal}
                </span>
              </div>

              {/* Activities */}
              {day.chinese.auspiciousActivities.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-emerald-400 mb-2">
                    Auspicious for
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {day.chinese.auspiciousActivities.map((act) => (
                      <span
                        key={act}
                        className="text-sm px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {day.chinese.inauspiciousActivities.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-red-400 mb-2">Avoid</p>
                  <div className="flex flex-wrap gap-2">
                    {day.chinese.inauspiciousActivities.map((act) => (
                      <span
                        key={act}
                        className="text-sm px-2.5 py-1 rounded-full bg-red-400/10 text-red-300 border border-red-400/20"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Personalized CTA */}
          <section className="border border-navy-600 rounded-lg p-5 text-center bg-navy-800/50">
            <div className="text-3xl mb-2">&#x1F512;</div>
            <p className="text-base text-slate-300 mb-1">
              Personalized readings coming soon
            </p>
            <p className="text-sm text-slate-500">
              See how this day affects your natal chart
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
