import type { CONTACTS_QUERY_RESULT } from "@/types/studio";

import { GSAPProvider } from "./gsap";
import { LenisProvider } from "./react-lenis";
import { SanityDataProvider } from "./sanity-data";

type ProviderProps = {
  children: React.ReactNode;
  contacts: CONTACTS_QUERY_RESULT;
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
