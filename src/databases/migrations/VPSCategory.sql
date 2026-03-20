--User Table
CREATE TABLE IF NOT EXISTS tbl__VPSCategory (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    SupplierID INTEGER NOT NULL
);
-- User Value
INSERT INTO tbl__VPSCategory (ID, Name, SupplierID)
VALUES (1, '__Mr.V__s', 1);