"use client";

import { createContext, useContext, useState } from "react";

export type Mode = "in" | "up";

type ModeCtxValue = { mode: Mode; setMode: (m: Mode) => void };
export const ModeCtx = createContext<ModeCtxValue>({
  mode: "in",
  setMode: () => {},
});
export const useMode = () => useContext(ModeCtx);

export function AuthProvider({
  children,
  initialMode = "in",
}: {
  children: React.ReactNode;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <ModeCtx.Provider value={{ mode, setMode }}>{children}</ModeCtx.Provider>
  );
}
