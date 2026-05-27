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
}

export interface Session {
  code: string;
  wsId: string;
  expIn: string;
  soon: boolean;
  viewers: number;
}

export const SEED: Worksheet[] = [
  { id: "w-01", name: "Anatomy — figure study 03.pdf",        path: "/Tracelight/Life-drawing/",  pages: 6,  source: "drive",   modified: "12m ago", thumb: "figure" },
  { id: "w-02", name: "Lettering — gothic majuscules.pdf",    path: "/Type-workshop/Module-2/",   pages: 12, source: "dropbox", modified: "16h ago", thumb: "lines" },
  { id: "w-03", name: "Grid — half-inch isometric.png",       path: "/Tracelight/Templates/",     pages: 1,  source: "drive",   modified: "22h ago", thumb: "grid" },
  { id: "w-04", name: "Botanical — leaf cross-sections.pdf",  path: "/Field-notes/2026/",         pages: 4,  source: "dropbox", modified: "34m ago", thumb: "figure" },
  { id: "w-05", name: "Composition — rule-of-thirds set.pdf", path: "/Tracelight/Foundations/",   pages: 8,  source: "drive",   modified: "2d ago",  thumb: "boxes" },
  { id: "w-06", name: "Music — staves & clefs.pdf",           path: "/Solfège/Worksheets/",       pages: 3,  source: "dropbox", modified: "3d ago",  thumb: "music" },
  { id: "w-07", name: "Perspective — one-point room.pdf",     path: "/Architecture/Studio-04/",   pages: 2,  source: "drive",   modified: "2h ago",  thumb: "blueprint" },
  { id: "w-08", name: "Handwriting — italic ductus.pdf",      path: "/Type-workshop/Module-1/",   pages: 5,  source: "dropbox", modified: "4d ago",  thumb: "lines" },
];

export const LIVE_IDS = new Set<string>();

export const SESSIONS: Session[] = [];
