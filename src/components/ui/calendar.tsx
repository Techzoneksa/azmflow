"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "date-fns";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  locale?: Locale;
  className?: string;
}

const DAYS = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = React.useState(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSelected = (day: number) =>
    selected &&
    selected.getDate() === day &&
    selected.getMonth() === month &&
    selected.getFullYear() === year;

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  const handleSelect = (day: number) => {
    const date = new Date(year, month, day);
    onSelect?.(date);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 text-text-secondary hover:text-text-primary transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-text-primary">
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1 text-text-secondary hover:text-text-primary transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div key={day} className="flex h-8 items-center justify-center text-xs text-text-muted font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => handleSelect(day)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all",
              isSelected(day)
                ? "bg-primary text-white font-bold"
                : isToday(day)
                ? "border border-primary text-primary font-medium"
                : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
