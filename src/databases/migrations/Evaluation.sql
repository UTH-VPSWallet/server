DROP TABLE IF EXISTS tbl__Evaluation;

--Evaluation Table
CREATE TABLE IF NOT EXISTS tbl__Evaluation (
    VPSID INTEGER,
    Email TEXT NOT NULL,
    Rate INTEGER NOT NULL,
    Status INTEGER NOT NULL,
    PRIMARY KEY (VPSID, Email)
);
--Evaluation Value
INSERT INTO tbl__Evaluation (VPSID, Email, Rate, Status)
VALUES (1, 'vy@gmail.com', 4, 1)