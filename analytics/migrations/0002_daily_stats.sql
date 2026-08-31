CREATE TABLE IF NOT EXISTS daily_stats (
  visit_date TEXT PRIMARY KEY NOT NULL,
  unique_visitors INTEGER NOT NULL CHECK (unique_visitors >= 0),
  finalized_at TEXT NOT NULL
) WITHOUT ROWID;
