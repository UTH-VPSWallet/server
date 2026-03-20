--User Table
CREATE TABLE IF NOT EXISTS tbl__User (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    PassVer INTEGER NOT NULL,
    Phone INTEGER NOT NULL,
    Name TEXT NOT NULL,
    Avatar TEXT,
    Status INTEGER NOT NULL,
    AuthOTP TEXT,
    Role INTEGER NOT NULL
);
-- User Value
INSERT INTO tbl__User (Email, Pass, PassVer, Phone, Name, Avatar, Status, AuthOTP, Role)
VALUES ('nguyenhohoangvy@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 0, 0355653400, 'Nguyễn Hồ Hoàng Vỹ', 'VPSWallet/avatar/1767079293483', 1001, NULL, 90001),
       ('hoangvy55cth@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 0, 0355653400, 'Nguyễn Hồ Hoàng Vỹ', 'VPSWallet/avatar/1767079293483', 1001, NULL, 1001);