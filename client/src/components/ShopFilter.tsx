import React from "react";
import type { ProductType } from "../../../shared/types/product";

type Mode = "all" | ProductType;

interface ShopFilterProps {
  mode: Mode;
  onChange: (m: Mode) => void;
}

export default function ShopFilter({ mode, onChange }: ShopFilterProps) {
  const buttons: { mode: Mode; label: string }[] = [
    { mode: "all", label: "All" },
    { mode: "towers", label: "Towers" },
    { mode: "modules", label: "Modules" },
    { mode: "addons", label: "Add-ons" },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {buttons.map(({ mode: m, label }) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`px-4 py-2 rounded-xl border transition
            ${
              mode === m
                ? "bg-green-500 text-white border-green-500"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
