--Comment Table
CREATE TABLE IF NOT EXISTS tbl__Comment (
    ID INTEGER PRIMARY KEY,
    VPSID INTEGER NOT NULL,
    Content TEXT NOT NULL,
    Status INTEGER NOT NULL
);
--Comment Value
INSERT INTO tbl__Comment (ID, VPSID, Content, Status)
VALUES (1, 1, 'Ok', 1)