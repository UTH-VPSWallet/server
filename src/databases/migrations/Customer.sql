--Customer Table
CREATE TABLE IF NOT EXISTS tbl__Customer (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Name TEXT NOT NULL,
    Status INTEGER NOT NULL
);
--Customer Value
INSERT INTO tbl__Customer (Email, Pass, Phone, Name, Status)
VALUES ('vy@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', '01218577732', 'Vỹ', 1);