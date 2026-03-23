--Comment Table
CREATE TABLE IF NOT EXISTS tbl__Comment (
    ID INTEGER PRIMARY KEY,
    VPSID INTEGER NOT NULL,
    CateContentgoryID TEXT NOT NULL,
    Status INTEGER NOT NULL
);
--Comment Value
INSERT INTO tbl__Comment (ID, Name, CategoryID, Status)
VALUES (1, 'CHIP01', 1, 1)