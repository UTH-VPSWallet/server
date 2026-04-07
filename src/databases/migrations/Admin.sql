--Admin Table
CREATE TABLE IF NOT EXISTS tbl__Admin (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    Name TEXT NOT NULL
);
--Admin Value
INSERT INTO tbl__Admin (Email, Pass, Name)
VALUES ('admin@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'Admin');