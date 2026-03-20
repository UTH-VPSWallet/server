--User Table
CREATE TABLE IF NOT EXISTS tbl__VPS (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    CategoryID INTEGER NOT NULL,
    SupplierID INTEGER NOT NULL,
    CountryID INTEGER NOT NULL,
    Core INTEGER NOT NULL,
    CoreType TEXT,
    Ram INTEGER NOT NULL,
    RamType TEXT,
    Disk INTEGER NOT NULL,
    DiskType TEXT,
    PriceMonth INTEGER NOT NULL,
    Discount TEXT,
    DataTransfer INTEGER,
    DomesticBw INTEGER,
    IntlBwIn INTEGER,
    IntlBwOut INTEGER,
    Quantity INTEGER,
    EndDate INTEGER,
    IPv4 INTEGER,
    OS TEXT,
    IOPS TEXT,
    Sold INTEGER,
    TotalComments INTEGER,
    Content TEXT,
    Status INTEGER NOT NULL
);
-- User Value
INSERT INTO tbl__VPS (ID, Name, CategoryID, SupplierID, CountryID, Core, CoreType, Ram, RamType, Disk, DiskType, PriceMonth,
    Discount, DataTransfer, DomesticBw, IntlBwIn, IntlBwOut, Quantity, EndDate, IPv4, OS, IOPS, Sold, TotalComments, Content, Status)
VALUES (1, 'CHIP01', 1, 1, 1, 1, 'CoreType', 1, 'RamType', 1, 'DiskType', 1,
        'Discount', 1, 1, 1, 1, 1, 1, 1, 'OS', 'IOPS', 0, 0, 'Content', 1001),
       (2, 'CHIP01', 1, 1, 1, 1, 'CoreType', 1, 'RamType', 1, 'DiskType', 1,
        'Discount', 1, 1, 1, 1, 1, 1, 1, 'OS', 'IOPS', 0, 0, 'Content', 1001);