--Evaluation Table
CREATE TABLE IF NOT EXISTS tbl__Evaluation (
    VPSID INTEGER PRIMARY KEY,
    Email TEXT NOT NULL,
    Rate INTEGER NOT NULL,
    Status INTEGER NOT NULL
);
--Evaluation Value
INSERT INTO tbl__Evaluation (VPSID, Email, Rate, Status)
VALUES (1, 'vy@gmail.com', 4, 1)