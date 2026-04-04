--Supplier Table
CREATE TABLE IF NOT EXISTS tbl__Supplier (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    Name TEXT NOT NULL,
    Location TEXT NOT NULL,
    Status INTEGER NOT NULL,
    
);
--Supplier Value
INSERT INTO tbl__Supplier (Email, Pass, Name, Location, Status)
VALUES ('nhanhoa@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'Nhân Hòa', 'Hà Nội' , 1);


select * from tbl__Supplier;