"use client";

import { createContext, type ReactNode, use, useMemo } from "react";

// ============================================
// Types
// ============================================

type SanityDataContextValue = {
  stacks: Stack[];
  stacksMap: Record<string, SanityImageWithMetadata>;
  contacts: Contact[];
};

type SanityDataProviderProps = {
  children: ReactNode;
  stacks?: Stack[];
  contacts?: Contact[];
};

// ============================================
// Context
// ============================================

const SanityDataContext = createContext<SanityDataContextValue | null>(null);

// ============================================
// Provider
// ============================================

export function SanityDataProvider({
  children,
  stacks = [],
  contacts = [],
}: SanityDataProviderProps) {
  const value = useMemo(
    () => ({
      // Stacks with lookup map
      stacks,
      stacksMap: stacks.reduce<Record<string, SanityImageWithMetadata>>(
        (accumulator, s) => {
          accumulator[s.key.toLowerCase()] = s.icon;
          return accumulator;
        },
        {},
      ),
      contacts,
    }),
    [stacks, contacts],
  );

  return (
    <SanityDataContext.Provider value={value}>
      {children}
    </SanityDataContext.Provider>
  );
}

// ============================================
// Hooks
// ============================================

export function useSanityData() {
  const context = use(SanityDataContext);
  if (!context) {
    throw new Error("useSanityData must be used within SanityDataProvider");
  }
  return context;
}

// Convenience hooks for specific data
export function useStacks() {
  const { stacks, stacksMap } = useSanityData();
  return { stacks, stacksMap };
}

export function useContacts() {
  const { contacts } = useSanityData();
  return { contacts };
}
