import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../App';

describe('App UI Integration — Reactive Calculator & System States', () => {
  it('renders pre-populated default state (Tahura 21K • D+ 1000m • Moderate +10% • Pace 06:00)', () => {
    render(<App />);
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('34.1');
    expect(screen.getByTestId('base-itra-km').textContent).toContain('31.0 Km-Effort');
    expect(screen.getByTestId('itra-category-badge').textContent).toContain('Kategori ITRA XS');
    expect(screen.getByTestId('estimated-duration').textContent).toContain('3 jam 25 menit');
    expect(screen.getByTestId('effective-trail-pace').textContent).toContain('09:45');
  });

  it('updates calculation reactively when selecting Quick Presets including 50K Ultra Warning', () => {
    render(<App />);
    const ultraPresetBtn = screen.getByRole('button', { name: /50K Ultra Mountain/i });
    fireEvent.click(ultraPresetBtn);

    // 50 km + 3000m D+ (30 km) = 80 Base ITRA * 1.2 Technical = 96.0 km Adjusted Road Equivalent
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('96.0');
    expect(screen.getByTestId('itra-category-badge').textContent).toContain('Kategori ITRA M');
    expect(screen.getByTestId('ultra-warning-banner')).toBeDefined();
  });

  it('transitions to Empty State when clicking Kosongkan and restores default on Reset', () => {
    render(<App />);
    const clearBtn = screen.getByRole('button', { name: /Kosongkan$/i });
    fireEvent.click(clearBtn);

    const disabledCopyBtn = screen.getByText(
      /Lengkapi jarak & elevasi untuk menyalin hasil/i
    ) as HTMLButtonElement;
    expect(disabledCopyBtn.disabled).toBe(true);

    const resetBtn = screen.getByRole('button', { name: /^Reset$/i });
    fireEvent.click(resetBtn);
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('34.1');
  });

  it('shows inline validation error when distance or elevation is out of range', () => {
    render(<App />);
    const distanceInput = screen.getByLabelText(/Jarak Rute Trail/i);
    fireEvent.change(distanceInput, { target: { value: '600' } });

    expect(screen.getByRole('alert').textContent).toMatch(/maksimal 500 km/i);
  });

  it('supports Terrain Selector radio changes and keyboard navigation', () => {
    render(<App />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);

    // Click Runable (+0%)
    fireEvent.click(radios[0]!);
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('31.0');

    // Keyboard ArrowDown to Moderate (+10%)
    fireEvent.keyDown(radios[0]!, { key: 'ArrowDown' });
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('34.1');
  });

  it('shows manual copy fallback textarea when Clipboard API fails or is denied', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Permission denied')),
      },
    });

    render(<App />);
    const copyBtn = screen.getByRole('button', {
      name: /Salin Ringkasan ke WhatsApp \/ Strava/i,
    });
    fireEvent.click(copyBtn);

    const fallbackBox = await screen.findByTestId('clipboard-fallback-box');
    expect(fallbackBox).toBeDefined();

    // Dismiss fallback box
    const closeBtn = screen.getByRole('button', { name: /Tutup/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId('clipboard-fallback-box')).toBeNull();
  });

  it('shows success feedback state when Clipboard API succeeds', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<App />);
    const copyBtn = screen.getByRole('button', {
      name: /Salin Ringkasan ke WhatsApp \/ Strava/i,
    });
    fireEvent.click(copyBtn);

    expect(
      await screen.findByRole('button', { name: /Tersalin! Siap ditempel ke grup lari/i })
    ).toBeDefined();
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock.mock.calls[0]?.[0]).toContain('*34.1 km* di aspal datar');
  });

  it('handles clearing optional pace and invalid pace inline error without hiding core Km-Effort result', () => {
    render(<App />);

    // Clear pace using "Kosongkan Pace" button
    const clearPaceBtn = screen.getByRole('button', { name: /Kosongkan Pace/i });
    fireEvent.click(clearPaceBtn);

    // Core result still visible, time estimate shows friendly prompt
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('34.1');
    expect(screen.queryByTestId('estimated-duration')).toBeNull();
    expect(screen.getByText(/Ingin tahu perkiraan waktu finis\?/i)).toBeDefined();

    // Enter invalid seconds (75)
    const secInput = screen.getByLabelText(/Detik per kilometer/i);
    const minInput = screen.getByLabelText(/Menit per kilometer/i);
    fireEvent.change(minInput, { target: { value: '6' } });
    fireEvent.change(secInput, { target: { value: '75' } });

    expect(screen.getByRole('alert').textContent).toMatch(/00 hingga 59/i);
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('34.1');
  });

  it('supports full keyboard navigation (ArrowUp, ArrowLeft, ArrowRight, Enter) on Terrain radio cards', () => {
    render(<App />);
    const radios = screen.getAllByRole('radio');

    // Start at Moderate (index 1), ArrowUp -> Runable (index 0)
    fireEvent.keyDown(radios[1]!, { key: 'ArrowUp' });
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('31.0');

    // ArrowLeft from Runable (index 0) wraps around to Technical (index 2, +20% -> 31 * 1.2 = 37.2)
    fireEvent.keyDown(radios[0]!, { key: 'ArrowLeft' });
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('37.2');

    // Enter on Moderate (index 1) selects Moderate (34.1)
    fireEvent.keyDown(radios[1]!, { key: 'Enter' });
    expect(screen.getByTestId('hero-adjusted-km').textContent).toContain('34.1');
  });
});

