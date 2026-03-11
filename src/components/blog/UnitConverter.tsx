'use client';

import { useState } from 'react';

/**
 * UnitConverter — İnteraktif birim dönüştürücü
 *
 * 4 grup: Basınç, Güç, Sıcaklık, Debi
 * Sıcaklık dönüşümleri doğrusal olmayan formülle hesaplanır (°C ↔ °F ↔ K).
 *
 * @param defaultGroup - Açılışta aktif sekme: 'Basınç' | 'Güç' | 'Sıcaklık' | 'Debi' (varsayılan: 'Basınç')
 * @param defaultFrom  - Başlangıç birimi, örn. 'bar', 'kW', '°C' (varsayılan: 'bar')
 * @param defaultTo    - Hedef birim, örn. 'psi', 'BTU/h', '°F' (varsayılan: 'psi')
 *
 * @example
 * // Varsayılan (bar → psi)
 * <UnitConverter />
 *
 * // Güç sekmesi, kW → BTU/h
 * <UnitConverter defaultGroup="Güç" defaultFrom="kW" defaultTo="BTU/h" />
 *
 * // Sıcaklık sekmesi, °C → K
 * <UnitConverter defaultGroup="Sıcaklık" defaultFrom="°C" defaultTo="K" />
 */

type ConversionGroup = {
  label: string;
  units: { label: string; factor: number }[];
};

const groups: ConversionGroup[] = [
  {
    label: 'Basınç',
    units: [
      { label: 'bar', factor: 1 },
      { label: 'psi', factor: 14.5038 },
      { label: 'Pa', factor: 100000 },
      { label: 'kPa', factor: 100 },
      { label: 'atm', factor: 0.986923 },
      { label: 'mbar', factor: 1000 },
    ],
  },
  {
    label: 'Güç',
    units: [
      { label: 'kW', factor: 1 },
      { label: 'W', factor: 1000 },
      { label: 'kcal/h', factor: 859.845 },
      { label: 'BTU/h', factor: 3412.14 },
      { label: 'HP', factor: 1.34102 },
    ],
  },
  {
    label: 'Sıcaklık',
    units: [
      { label: '°C', factor: 1 },
      { label: '°F', factor: 1 },
      { label: 'K', factor: 1 },
    ],
  },
  {
    label: 'Debi',
    units: [
      { label: 'm³/h', factor: 1 },
      { label: 'L/s', factor: 0.277778 },
      { label: 'L/min', factor: 16.6667 },
      { label: 'GPM', factor: 4.40287 },
    ],
  },
];

function convertTemp(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === '°C') celsius = value;
  else if (from === '°F') celsius = (value - 32) / 1.8;
  else celsius = value - 273.15;

  if (to === '°C') return celsius;
  if (to === '°F') return celsius * 1.8 + 32;
  return celsius + 273.15;
}

function convert(
  value: number,
  from: { label: string; factor: number },
  to: { label: string; factor: number },
  groupLabel: string
): number {
  if (groupLabel === 'Sıcaklık') return convertTemp(value, from.label, to.label);
  return (value / from.factor) * to.factor;
}

function fmt(n: number): string {
  if (!isFinite(n)) return '—';
  if (Math.abs(n) >= 1000) return n.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  if (Math.abs(n) >= 1) return n.toLocaleString('tr-TR', { maximumFractionDigits: 4 });
  return n.toLocaleString('tr-TR', { maximumFractionDigits: 6 });
}

interface UnitConverterProps {
  defaultGroup?: string;
  defaultFrom?: string;
  defaultTo?: string;
}

export default function UnitConverter({
  defaultGroup = 'Basınç',
  defaultFrom = 'bar',
  defaultTo = 'psi',
}: UnitConverterProps) {
  const [activeGroup, setActiveGroup] = useState(
    groups.find((g) => g.label === defaultGroup) ?? groups[0]
  );
  const [fromUnit, setFromUnit] = useState(
    activeGroup.units.find((u) => u.label === defaultFrom) ?? activeGroup.units[0]
  );
  const [toUnit, setToUnit] = useState(
    activeGroup.units.find((u) => u.label === defaultTo) ?? activeGroup.units[1]
  );
  const [input, setInput] = useState('1');

  const numInput = parseFloat(input.replace(',', '.'));
  const result = isNaN(numInput) ? null : convert(numInput, fromUnit, toUnit, activeGroup.label);

  function switchGroup(group: ConversionGroup) {
    setActiveGroup(group);
    setFromUnit(group.units[0]);
    setToUnit(group.units[1]);
    setInput('1');
  }

  function swap() {
    const prev = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prev);
  }

  return (
    <div className="my-6 border border-border rounded-xl bg-card overflow-hidden">
      <div className="flex border-b border-border overflow-x-auto">
        {groups.map((g) => (
          <button
            key={g.label}
            onClick={() => switchGroup(g)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${
              activeGroup.label === g.label
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <select
            value={fromUnit.label}
            onChange={(e) =>
              setFromUnit(activeGroup.units.find((u) => u.label === e.target.value)!)
            }
            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {activeGroup.units.map((u) => (
              <option key={u.label} value={u.label}>{u.label}</option>
            ))}
          </select>
          <button
            onClick={swap}
            title="Ters çevir"
            className="shrink-0 px-3 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          >
            ⇄
          </button>
          <select
            value={toUnit.label}
            onChange={(e) =>
              setToUnit(activeGroup.units.find((u) => u.label === e.target.value)!)
            }
            className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {activeGroup.units.map((u) => (
              <option key={u.label} value={u.label}>{u.label}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 px-4 py-3 bg-primary/5 border border-primary/15 rounded-lg flex items-baseline justify-between gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">
            {isNaN(numInput) ? '—' : `${input} ${fromUnit.label} =`}
          </span>
          <span className="text-xl font-black text-foreground tabular-nums">
            {result !== null ? fmt(result) : '—'}
            <span className="ml-1.5 text-sm font-semibold text-primary">{toUnit.label}</span>
          </span>
        </div>
      </div>
    </div>
  );
}