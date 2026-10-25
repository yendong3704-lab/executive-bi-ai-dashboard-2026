// Formatters for Currency, Numbers, Percentages, and Dates in Vietnamese Locale

export function formatVND(value: number, compact = false): string {
  if (value === undefined || value === null || isNaN(value)) return '0 ₫';
  
  if (compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1_000_000_000) {
      return `${sign}${(abs / 1_000_000_000).toFixed(2)} tỷ ₫`;
    }
    if (abs >= 1_000_000) {
      return `${sign}${(abs / 1_000_000).toFixed(1)} tr ₫`;
    }
    if (abs >= 1_000) {
      return `${sign}${(abs / 1_000).toFixed(0)} k ₫`;
    }
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (value === undefined || value === null || isNaN(value)) return '0';

  if (compact) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1_000_000) {
      return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
    }
    if (abs >= 1_000) {
      return `${sign}${(abs / 1_000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat('vi-VN').format(Math.round(value));
}

export function formatPercent(value: number, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  // If value is in 0..1 range (like 0.6175), multiply by 100
  // If value is already in percentage format (like 61.75 or 193.1), keep as is
  const pct = Math.abs(value) <= 1.5 && value !== 0 ? value * 100 : value;
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(decimals)}%`;
}

export function formatPercentRaw(value: number, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const pct = Math.abs(value) <= 1.5 && value !== 0 ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}
