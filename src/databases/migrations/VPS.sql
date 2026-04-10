DROP TABLE IF EXISTS tbl__VPS;

--VPS Table
CREATE TABLE IF NOT EXISTS tbl__VPS (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    CPU TEXT NOT NULL,
    RAM TEXT NOT NULL,
    Storage TEXT NOT NULL,
    PricePerMonth INTEGER NOT NULL,
    Status INTEGER NOT NULL,
    Email TEXT NOT NULL
);
--VPS Value
INSERT INTO tbl__VPS (ID, Name, CPU, RAM, Storage, PricePerMonth, Status, Email)
VALUES  (1, 'CHIP01', '1 Core Xeon', '2GB','20GB', 50000, 1, 'nhanhoa@gmail.com'),
        (2, 'CHIP02', '2 Core Xeon', '4GB','40GB', 100000, 1, 'nhanhoa@gmail.com'),
        (3, 'CHIP03', '3 Core Xeon', '6GB','60GB', 150000, 1, 'nhanhoa@gmail.com'),
        (4, 'CHIP03', '3 Core Xeon', '6GB','60GB', 150000, 1, 'zhost@gmail.com')