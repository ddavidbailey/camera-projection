create table "share_links" (
  "id"        text        not null primary key,
  "token"     text        not null unique,
  "userId"    text        not null references "user" ("id") on delete cascade,
  "provider"  text        not null,
  "fileId"    text        not null,
  "fileName"  text        not null,
  "filePath"  text        not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default current_timestamp
);

create index "share_links_token_idx"  on "share_links" ("token");
create index "share_links_userId_idx" on "share_links" ("userId");
