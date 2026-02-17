import { assets } from "@/assets";
import {
  BlurImage,
  ContactMenu,
  CurrentTimeUTC,
  NavLink,
} from "@/components/elements";
import { NAVLINKS } from "@/constants/navlinks";
import {
  getSanityImageDimensions,
  getSanityUrlWithLQIP,
} from "@/lib/sanity/image";

export function HeroSection() {
  const dimensions = getSanityImageDimensions(assets["profile"]);
  const lqipUrl = getSanityUrlWithLQIP(assets.profile);
  return (
    <div
      className="content-grid min-h-svh py-20"
      style={
        { "--content-max-width": "max(50rem, 50vw)" } as React.CSSProperties
      }
    >
      <header className="flex h-fit min-h-[calc(100svh-16rem)] text-neutral-600 max-md:flex-col md:gap-8">
        <div className="flex flex-col gap-4 max-lg:items-end">
          <BlurImage
            src={assets["profile"]}
            alt={"lemme stare in your eyes a little bit"}
            width={dimensions?.width || 800}
            height={dimensions?.height || 600}
            lqip={lqipUrl}
            priority
            className="aspect-square size-full max-w-20 overflow-hidden bg-neutral-800 drop-shadow-sm max-md:rounded-full md:aspect-9/16 md:max-h-140 md:max-w-80"
          />

          <CurrentTimeUTC />
        </div>

        <div className="text-base-expand flex flex-1 flex-col md:gap-8">
          <article className="max-w-md space-y-4 py-10 leading-[175%]">
            <p className="text-3xl-expand text-neutral-800">Hey, I'm AJ.</p>
            <p>
              Experienced Engineer with a proven track record in crafting
              pixel-perfect user interfaces.
            </p>
            <p>
              A lover of bridging design and engineering to craft beautiful
              experiences for users.
            </p>
          </article>

          {/* LINKS */}
          <dl className="mt-auto ml-auto space-y-4 pb-10 lg:space-y-8">
            {NAVLINKS.slice(1).map((link) => (
              <NavLink
                key={link.label}
                aria-labelledby="label"
                className="group relative block w-fit"
                {...link}
              >
                <dt
                  id="label"
                  className="text-xl-expand lg:text-2xl-expand text-neutral-800 uppercase group-hover:text-orange-500"
                >
                  {link.label}
                </dt>
                <dd className="text-sm-expand tracking-wide">
                  {link.description}
                </dd>
              </NavLink>
            ))}
          </dl>
        </div>
      </header>
      <ContactMenu className="mt-10 flex flex-wrap justify-between gap-4" />
    </div>
  );
}
