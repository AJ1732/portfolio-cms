const SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY;

if (!SERVICE_ID) throw new Error("Missing SERVICE_ID environment variable");
if (!TEMPLATE_ID) throw new Error("Missing TEMPLATE_ID environment variable");
if (!PUBLIC_KEY) throw new Error("Missing PUBLIC_KEY environment variable");

export const ENV = {
  SERVICE_ID,
  TEMPLATE_ID,
  PUBLIC_KEY,
};
