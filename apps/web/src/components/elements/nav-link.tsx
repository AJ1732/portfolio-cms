import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  external?: boolean;
  target?: string;
  rel?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Reusable navigation link component that handles both internal and external links
 * Automatically detects cross-subdomain links and treats them as external
 * Uses Next.js Link for same-domain navigation (even with absolute URLs)
 * @param href - The URL to navigate to
 * @param label - The link text/label
 * @param external - Whether this is an external link (uses <a> instead of Next.js Link)
 * @param target - Link target attribute (e.g., "_blank", "_self")
 * @param rel - Link rel attribute for security (e.g., "noopener noreferrer")
 * @param className - Additional CSS classes
 * @param children - Optional children to render instead of label
 * @param onClick - Optional click handler
 */
export default function NavLink({
  href,
  label,
  external = false,
  target,
  rel,
  className = "",
  children,
  onClick,
}: NavLinkProps) {
  // Use children if provided, otherwise use label
  const content = children || label;

  // Process href to determine if it's cross-subdomain and extract pathname if needed
  const processHref = () => {
    if (typeof window === "undefined") {
      return { finalHref: href, isExternal: external };
    }

    try {
      // Check if href is an absolute URL
      if (href.startsWith("http://") || href.startsWith("https://")) {
        const linkUrl = new URL(href);
        const currentHost = window.location.hostname;

        // If hostnames differ, it's cross-subdomain - use <a> tag
        if (linkUrl.hostname !== currentHost) {
          return { finalHref: href, isExternal: true };
        }

        // Same hostname - extract pathname for Next.js Link (client-side routing)
        return { finalHref: linkUrl.pathname, isExternal: false };
      }
    } catch {
      // If URL parsing fails, treat as internal
      return { finalHref: href, isExternal: false };
    }

    // Relative URL - use as-is with Next.js Link
    return { finalHref: href, isExternal: false };
  };

  const { finalHref, isExternal } = processHref();
  const shouldUseAnchor = external || isExternal;

  // Render external link with <a> tag (for cross-subdomain or explicitly external)
  if (shouldUseAnchor) {
    return (
      <Link {...{ href, target, rel, className, onClick }}>{content}</Link>
    );
  }

  // Render internal link with Next.js Link (same domain - no page reload)
  return <Link {...{ href: finalHref, className, onClick }}>{content}</Link>;
}
