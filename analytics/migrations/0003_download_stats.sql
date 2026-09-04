CREATE TABLE IF NOT EXISTS download_stats (
  download_date TEXT NOT NULL,
  asset_key TEXT NOT NULL CHECK (asset_key IN ('brand', 'mushhero', 'mushdash')),
  downloads INTEGER NOT NULL CHECK (downloads >= 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (download_date, asset_key)
) WITHOUT ROWID;
