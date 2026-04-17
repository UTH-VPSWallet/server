DROP TABLE IF EXISTS tbl__Order;

CREATE TABLE IF NOT EXISTS tbl__Order (
    ID INTEGER PRIMARY KEY,
    CustomerEmail TEXT NOT NULL,
    VPSID INTEGER NOT NULL,
    TotalMonth INTEGER NOT NULL,
    TotalPrice INTEGER NOT NULL,
    Status INTEGER NOT NULL,
    CreatedAt INTEGER NOT NULL,
    UpdatedAt INTEGER NOT NULL
);

-- Order Value
INSERT INTO tbl__Order (ID, CustomerEmail, VPSID, TotalMonth, TotalPrice, Status, CreatedAt, UpdatedAt)
VALUES (1, 'vy@gmail.com', 1, 3, 300000, 0, 1776358800, 1776358800);