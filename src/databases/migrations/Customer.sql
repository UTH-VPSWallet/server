--Customer Table
CREATE TABLE IF NOT EXISTS tbl__Customer (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    Name TEXT NOT NULL,
    Status INTEGER NOT NULL
);
--Customer Value
INSERT INTO tbl__Customer (Email, Pass, Name, Status)
VALUES (vy@gmail.com, 1111, Vỹ, 1);