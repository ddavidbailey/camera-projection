drop table if exists "share_links";

create table "share_links" (
  "id"        text        not null primary key,
  "token"     text        not null unique,
  "userId"    text        not null references "user" ("id") on delete cascade,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default current_timestamp
);

create index "share_links_token_idx"  on "share_links" ("token");
create index "share_links_userId_idx" on "share_links" ("userId");

create table "share_link_files" (
  "id"          text not null primary key,
  "shareLinkId" text not null references "share_links" ("id") on delete cascade,
  "provider"    text not null,
  "fileId"      text not null,
  "fileName"    text not null,
  "filePath"    text not null,
  "mimeType"    text not null,
  "sortOrder"   int  not null default 0,
  "createdAt"   timestamptz not null default current_timestamp
);

create index "share_link_files_shareLinkId_idx" on "share_link_files" ("shareLinkId");
