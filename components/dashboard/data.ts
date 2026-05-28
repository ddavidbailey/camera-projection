export const SOURCES = {
  drive:   { id: "drive",   label: "Google Drive", short: "Drive",   account: "anya@studio.work" },
  dropbox: { id: "dropbox", label: "Dropbox",      short: "Dropbox", account: "studio-shared" },
} as const;

export type SourceId = keyof typeof SOURCES;
export type SourceFilter = SourceId | "all";

export type ThumbVariant = "lines" | "grid" | "figure" | "boxes" | "music" | "blueprint";

export interface Worksheet {
  id: string;
  name: string;
  path: string;
  pages: number;
  source: SourceId;
  modified: string;
  thumb: ThumbVariant;
  mimeType?: string;
}

export interface Session {
  code: string;
  wsId: string;
  expIn: string;
  soon: boolean;
  viewers: number;
}


export const LIVE_IDS = new Set<string>();

export const SESSIONS: Session[] = [];
