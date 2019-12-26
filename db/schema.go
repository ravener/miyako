package db

// SQL Queries to create the schemas.
const SCHEMA = `
CREATE TABLE guildcreate (
  id TEXT PRIMARY KEY NOT NULL UNIQUE
);

CREATE TABLE guilds (
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  prefix TEXT DEFAULT 't!'
);

CREATE TABLE members (
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  guild TEXT NOT NULL,
  points BIGINT DEFAULT 0,
  level INTEGER DEFAULT 0
);

CREATE TABLE bot (
  id TEXT PRIMARY KEY NOT NULL UNIQUE,
  "psa.text" TEXT,
  "psa.date" INTEGER,
  "guildBlacklist" TEXT[],
  "userBlacklist" TEXT[]
);
`
