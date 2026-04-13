DROP TABLE IF EXISTS tbl__Order;

CREATE TABLE IF NOT EXISTS tbl__Order (
    ID INTEGER PRIMARY KEY,
    CustomerEmail TEXT NOT NULL,
    VPSID INTEGER NOT NULL,
    Status INTEGER NOT NULL,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);

-- Order Value
INSERT INTO tbl__Order (ID, CustomerEmail, VPSID, Status, CreatedAt, UpdatedAt)
VALUES (1, 'nhanhoa@gmail.com', 1, 0, '2026-04-13', '2026-04-13');