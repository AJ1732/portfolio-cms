import { toast } from "sonner";

export const copyToClipboard = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast("Copied", {
      description: "copied to clipboard.",
      icon: <div className="size-2 rounded-full bg-orange-500"></div>,
      duration: Infinity,
    });
  } catch (error) {
    console.error(error);
    toast.error("Failed to copy link", { description: "Please try again." });
  }
};
