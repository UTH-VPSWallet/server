DROP TABLE IF EXISTS tbl__OrderDetail;

CREATE TABLE IF NOT EXISTS tbl__OrderDetail (
    ID INTEGER PRIMARY KEY,
    OrderID INTEGER NOT NULL,
    VPSID INTEGER NOT NULL,
    TotalMonth INTEGER NOT NULL,
    PriceAtPurchase INTEGER NOT NULL
);
-- OrderDetail Value
INSERT INTO tbl__OrderDetail (ID, OrderID, VPSID, TotalMonth, PriceAtPurchase)
VALUES (1, 1, 1, 3, 300000);
INSERT INTO tbl__OrderDetail (ID, OrderID, VPSID, TotalMonth, PriceAtPurchase)
VALUES (2, 1, 2, 6, 600000);