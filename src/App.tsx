import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { MethodologySection } from './components/MethodologySection';
import { QuickPresetsBar } from './components/QuickPresetsBar';
import { ResultDashboard } from './components/ResultDashboard';
import { RouteInputPanel } from './components/RouteInputPanel';
import { evaluateCalculatorInput, findMatchingPreset } from './domain/calculator';
import { DEFAULT_CALCULATOR_INPUT, EMPTY_CALCULATOR_INPUT } from './domain/constants';
import type { QuickPreset, RawCalculatorInput } from './domain/types';

export function App() {
  const [input, setInput] = useState<RawCalculatorInput>(DEFAULT_CALCULATOR_INPUT);

  const evaluation = useMemo(() => evaluateCalculatorInput(input), [input]);
  const activePreset = useMemo(() => findMatchingPreset(input), [input]);

  const handleFieldChange = <K extends keyof RawCalculatorInput>(
    field: K,
    value: RawCalculatorInput[K]
  ) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectPreset = (preset: QuickPreset) => {
    setInput((prev) => ({
      ...prev,
      distanceKm: String(preset.distanceKm),
      elevationGainM: String(preset.elevationGainM),
      terrainId: preset.terrainId,
    }));
  };

  const handleResetDefault = () => {
    setInput(DEFAULT_CALCULATOR_INPUT);
  };

  const handleClearAll = () => {
    setInput(EMPTY_CALCULATOR_INPUT);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-slate-900">
      <Header />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6">
        <p className="text-sm text-slate-600 sm:hidden leading-relaxed">
          Ukur seberapa berat rute trail pilihanmu jika disetarakan dengan lari di jalan raya datar
          (aspal), lengkap dengan perkiraan waktu tempuh dari pace road kamu.
        </p>

        <QuickPresetsBar
          activePresetId={activePreset?.id ?? null}
          onSelectPreset={handleSelectPreset}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <RouteInputPanel
            input={input}
            errors={evaluation.errors}
            onChangeField={handleFieldChange}
            onResetDefault={handleResetDefault}
            onClearAll={handleClearAll}
          />

          <ResultDashboard evaluation={evaluation} />
        </div>

        <MethodologySection />
      </main>

      <footer className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 text-center text-xs text-slate-500 border-t border-slate-200/70 mt-6">
        Trail-to-Road Effort Converter MVP &bull; Dirancang untuk membantu pelari merencanakan beban
        latihan dan strategi lomba secara akurat.
      </footer>
    </div>
  );
}

export default App;
