import { ReactLenis } from "lenis/react";

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05,
      }}
    >
      {children}
    </ReactLenis>
  );
};
