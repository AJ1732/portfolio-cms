export function formatDateToCustom(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    year: "numeric",
  };

  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  return `${weekday} ${day}, ${year}`;
}
