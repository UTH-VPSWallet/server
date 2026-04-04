--Supplier Table
CREATE TABLE IF NOT EXISTS tbl__Supplier (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    Name TEXT NOT NULL,
    Status INTEGER NOT NULL
);
--Supplier Value
INSERT INTO tbl__Supplier (Email, Pass, Name, Status)
VALUES ('nhanhoa@gmail.com', 1111, 'Nhân Hòa', 1);


select * from tbl__Supplier;