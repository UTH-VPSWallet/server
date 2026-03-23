--Category Table
CREATE TABLE IF NOT EXISTS tbl__Category (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    SupplierEmail TEXT NOT NULL,
    Status INTEGER NOT NULL
);
-- Category Value
INSERT INTO tbl__Category (ID, Name, SupplierEmail, Status)
VALUES (1, 'Categoy_01', nhanhoa@gmail.com, 1);