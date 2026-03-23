--Admin Table
CREATE TABLE IF NOT EXISTS tbl__Admin (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    Name TEXT NOT NULL
);
--Admin Value
INSERT INTO tbl__Admin (Email, Pass, Name)
VALUES (admin@gmail.com, 1111, Admin);