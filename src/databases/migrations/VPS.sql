DROP TABLE IF EXISTS tbl__VPS;

--VPS Table
CREATE TABLE IF NOT EXISTS tbl__VPS (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    CategoryID INTEGER NOT NULL,
    CPU TEXT NOT NULL,
    RAM TEXT NOT NULL,
    Storage TEXT NOT NULL,
    PricePerMonth INTEGER NOT NULL,
    Status INTEGER NOT NULL,
    Email TEXT NOT NULL
);
--VPS Value
INSERT INTO tbl__VPS (ID, Name, CategoryID,CPU, RAM, Storage, PricePerMonth, Status, Email)
VALUES (1, 'CHIP01', 1,'3 Core Xeon','2GB','20GB',150000, 1, nhanhoa@gmail.com)