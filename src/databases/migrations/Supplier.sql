DROP TABLE IF EXISTS tbl__Supplier;

--Supplier Table
CREATE TABLE IF NOT EXISTS tbl__Supplier (
    Email TEXT PRIMARY KEY,
    Pass TEXT NOT NULL,
    Logo TEXT NOT NULL,
    Phone TEXT NOT NULL,
    Name TEXT NOT NULL,
    Location TEXT NOT NULL,
    Status INTEGER NOT NULL
);
--Supplier Value
INSERT INTO tbl__Supplier (Email, Pass, Logo, Phone, Name, Location, Status)
VALUES ('nhanhoa@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'nhanhoa.png', '01219711231' ,'Nhân Hòa', 'Hà Nội' , 200),
('zhost@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'zhost.webp', '01219711232' ,'ZHost', 'Tp.HCM' , 200),
('vinahost@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'vinahost.png', '01219711233' ,'VinaHost', 'Tp.HCM' , 200),
('vietnix@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'vietnix.png', '01219711234' ,'VietNix', 'Hà Nội' , 200),
('bkns@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'bkns.png', '01219711235' ,'Nhân Hòa', 'BKNS' , 200),
('zonecloud@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'zonecloud.png', '01219711236' ,'ZoneCloud', 'Đà Nẵng' , 200),
('matbao@gmail.com', '$2b$10$lZ.m7l67a/dCx48/Fdeqf.c0iry..KGa5p2TQE4bQ4HpXX3SqTz6m', 'matbao.svg', '01219711237' ,'Mắc Bão', 'Tp.HCM' , 200);
