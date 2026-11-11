const locale = 'en-IN';
const timeZone = 'Asia/Kolkata';
const currency = new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR' });
const date = new Intl.DateTimeFormat(locale, {
  timeZone, day: 'numeric', month: 'long', year: 'numeric',
});
const time = new Intl.DateTimeFormat(locale, {
  timeZone, hour: '2-digit', minute: '2-digit', hour12: true,
});
const dateTime = new Intl.DateTimeFormat(locale, {
  timeZone, day: 'numeric', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: true,
});
const apiDate = new Intl.DateTimeFormat('sv-SE', {
  timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
});
const apiTime = new Intl.DateTimeFormat('en-GB', {
  timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

function toNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) return Number(value);
  return NaN;
}

export function formatNumber(value, decimalPlaces = 2) {
  const number = toNumber(value);
  if (!Number.isFinite(number)) return '0';

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(number);
}

export function formatCurrency(value) {
  const number = toNumber(value);
  return Number.isFinite(number) ? currency.format(number) : '—';
}

// Jewellery weights are supplied in grams.
export function formatWeight(value, decimalPlaces = 3) {
  return Number.isFinite(toNumber(value)) ? `${formatNumber(value, decimalPlaces)} g` : '—';
}

// Date-only and zone-less ISO values represent Indian calendar dates and local times.
function toDate(value) {
  if (typeof value === 'string') {
    const input = value.trim();
    const calendarDate = input.match(/^\d{4}-\d{2}-\d{2}(?=$|[T ])/);
    if (!calendarDate) return null;

    const midnight = new Date(`${calendarDate[0]}T00:00:00Z`);
    if (!Number.isFinite(midnight.getTime()) ||
        midnight.toISOString().slice(0, 10) !== calendarDate[0]) return null;

    if (input === calendarDate[0]) {
      value = `${input}T00:00:00+05:30`;
    } else {
      value = input.replace(' ', 'T');
      if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)) value += '+05:30';
    }
  } else if (!(value instanceof Date) && typeof value !== 'number') {
    return null;
  }

  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function formatForDisplay(value, formatter) {
  const parsed = toDate(value);
  return parsed ? formatter.format(parsed) : 'N/A';
}

export const formatDate = (value) => formatForDisplay(value, date);
export const formatTime = (value) => formatForDisplay(value, time);
export const formatDateTime = (value) => formatForDisplay(value, dateTime);

// Calendar dates and clock times use IST. Timestamps use UTC ISO 8601.
export function formatApiDate(value) {
  const parsed = toDate(value);
  return parsed ? apiDate.format(parsed) : null;
}

export function formatApiTime(value) {
  const parsed = toDate(value);
  return parsed ? apiTime.format(parsed) : null;
}

export const formatApiDateTime = (value) => toDate(value)?.toISOString() ?? null;
