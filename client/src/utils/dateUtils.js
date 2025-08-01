import dayjs from "dayjs";

export const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const years = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);

export const monthStrToISO = (ym) =>
  ym ? dayjs(ym, "YYYY-MM").startOf("month").toISOString() : "";

export const isoToMonthStr = (iso) => (iso ? dayjs(iso).format("YYYY-MM") : "");


export const monthYearToISO = (monthName, year) => {
  if (!monthName || !year) return "";
  const idx = months.indexOf(monthName) + 1; // 1‑12
  const padded = String(idx).padStart(2, "0");
  return `${year}-${padded}-01T00:00:00.000Z`;
};

export const isoToMonthName = (iso) => (iso ? dayjs(iso).format("MMMM") : "");

export const isoToYear = (iso) => (iso ? dayjs(iso).format("YYYY") : "");
