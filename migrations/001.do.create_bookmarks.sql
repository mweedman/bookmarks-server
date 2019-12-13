CREATE TYPE range AS ENUM ('0', '1', '2', '3', '4', '5')

CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    rating range NOT NULL,
    description TEXT,
);