"use client";

import { createContext, useContext, useState } from "react";

export type PaletteKey = "paper" | "dusk";
export type Mode = "in" | "up";

export const PaletteCtx = createContext<PaletteKey>("paper");
export const usePalette = () => useContext(PaletteCtx);

type ModeCtxValue = { mode: Mode; setMode: (m: Mode) => void };
export const ModeCtx = createContext<ModeCtxValue>({
  mode: "in",
  setMode: () => {},
});
export const useMode = () => useContext(ModeCtx);

export function AuthProvider({ children, initialMode = "in" }: { children: React.ReactNode; initialMode?: Mode }) {
  const [palette] = useState<PaletteKey>("paper");
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <PaletteCtx.Provider value={palette}>
      <ModeCtx.Provider value={{ mode, setMode }}>{children}</ModeCtx.Provider>
    </PaletteCtx.Provider>
  );
}
