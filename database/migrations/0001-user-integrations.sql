create table "user_integrations" (
  "id"             text        not null primary key,
  "userId"         text        not null references "user" ("id") on delete cascade,
  "provider"       text        not null,
  "accountEmail"   text        not null,
  "accessToken"    text        not null,
  "refreshToken"   text,
  "tokenExpiresAt" timestamptz,
  "scope"          text        not null,
  "folderRoot"     text,
  "createdAt"      timestamptz not null default current_timestamp,
  "updatedAt"      timestamptz not null default current_timestamp,
  unique ("userId", "provider")
);

create index "user_integrations_userId_idx" on "user_integrations" ("userId");
