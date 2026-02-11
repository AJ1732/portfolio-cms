import { GSAPProvider } from "./gsap";
import { LenisProvider } from "./react-lenis";
import { SanityDataProvider } from "./sanity-data";

type ProviderProps = {
  children: React.ReactNode;
  contacts: Contact[];
};

export function Provider({ children, contacts }: ProviderProps) {
  return (
    <SanityDataProvider {...{ contacts }}>
      <LenisProvider>
        <GSAPProvider>{children}</GSAPProvider>
      </LenisProvider>
    </SanityDataProvider>
  );
}
