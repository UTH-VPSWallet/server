DROP TABLE IF EXISTS tbl__VPS;

--VPS Table
CREATE TABLE IF NOT EXISTS tbl__VPS (
  ID INTEGER PRIMARY KEY,
  Name TEXT NOT NULL,
  CPU TEXT NOT NULL,
  RAM TEXT NOT NULL,
  Storage TEXT NOT NULL,
  PricePerMonth INTEGER NOT NULL,
  Category INTEGER NOT NULL,
  Status INTEGER NOT NULL,
  Email TEXT NOT NULL
);
--VPS Value
INSERT INTO tbl__VPS (ID, Name, CPU, RAM, Storage, PricePerMonth, Category, Status, Email)
VALUES (1, 'CHIP01', '1 Core Xeon', '2GB', '20GB', 50000, 1, 1, 'nhanhoa@gmail.com'),
       (2, 'CHIP02', '2 Core Xeon', '4GB', '40GB', 100000, 1, 1, 'nhanhoa@gmail.com'),
       (3, 'SSD01', '2 Core Xeon', '4GB', '100GB', 150000, 2, 1, 'nhanhoa@gmail.com'),
       (4, 'SSD02', '4 Core Xeon', '8GB', '500GB', 250000, 2, 1, 'nhanhoa@gmail.com'),
       (5, 'RAM01', '2 Core Xeon', '16GB', '20GB', 200000, 3, 1, 'nhanhoa@gmail.com'),
       (6, 'RAM02', '4 Core Xeon', '32GB', '40GB', 350000, 3, 1, 'nhanhoa@gmail.com'),
       (7, 'CHIP01', '1 Core Xeon', '2GB', '20GB', 50000, 1, 1, 'zhost@gmail.com'),
       (8, 'CHIP02', '2 Core Xeon', '4GB', '40GB', 100000, 1, 1, 'zhost@gmail.com'),
       (9, 'SSD01', '2 Core Xeon', '4GB', '120GB', 170000, 2, 1, 'zhost@gmail.com'),
       (10, 'SSD02', '4 Core Xeon', '8GB', '350GB', 200000, 2, 1, 'zhost@gmail.com'),
       (11, 'RAM01', '2 Core Xeon', '16GB', '20GB', 200000, 3, 1, 'zhost@gmail.com'),
       (12, 'RAM02', '4 Core Xeon', '32GB', '40GB', 350000, 3, 1, 'zhost@gmail.com'),
       (13, 'CHIP01', '1 Core Xeon', '2GB', '20GB', 50000, 1, 1, 'vinahost@gmail.com'),
       (14, 'CHIP02', '2 Core Xeon', '4GB', '40GB', 100000, 1, 1, 'vinahost@gmail.com'),
       (15, 'SSD01', '2 Core Xeon', '4GB', '120GB', 170000, 2, 1, 'vinahost@gmail.com'),
       (16, 'SSD02', '4 Core Xeon', '8GB', '350GB', 200000, 2, 1, 'vinahost@gmail.com'),
       (17, 'RAM01', '2 Core Xeon', '16GB', '20GB', 200000, 3, 1, 'vinahost@gmail.com'),
       (18, 'RAM02', '4 Core Xeon', '32GB', '40GB', 350000, 3, 1, 'vinahost@gmail.com'),
       (19, 'CHIP01', '1 Core Xeon', '2GB', '20GB', 50000, 1, 1, 'vietnix@gmail.com'),
       (20, 'CHIP02', '2 Core Xeon', '4GB', '40GB', 100000, 1, 1, 'vietnix@gmail.com'),
       (21, 'SSD01', '2 Core Xeon', '4GB', '120GB', 170000, 2, 1, 'vietnix@gmail.com'),
       (22, 'SSD02', '4 Core Xeon', '8GB', '350GB', 200000, 2, 1, 'vietnix@gmail.com'),
       (23, 'RAM01', '2 Core Xeon', '16GB', '20GB', 200000, 3, 1, 'vietnix@gmail.com'),
       (24, 'RAM02', '4 Core Xeon', '32GB', '40GB', 350000, 3, 1, 'vietnix@gmail.com'),
       (25, 'CHIP01', '1 Core Xeon', '2GB', '20GB', 50000, 1, 1, 'bkns@gmail.com'),
       (26, 'CHIP02', '2 Core Xeon', '4GB', '40GB', 100000, 1, 1, 'bkns@gmail.com'),
       (27, 'SSD01', '2 Core Xeon', '4GB', '120GB', 170000, 2, 1, 'bkns@gmail.com'),
       (28, 'SSD02', '4 Core Xeon', '8GB', '350GB', 200000, 2, 1, 'bkns@gmail.com'),
       (29, 'RAM01', '2 Core Xeon', '16GB', '20GB', 200000, 3, 1, 'bkns@gmail.com'),
       (30, 'RAM02', '4 Core Xeon', '32GB', '40GB', 350000, 3, 1, 'bkns@gmail.com'),
       (31, 'CHIP01', '1 Core Xeon', '2GB', '20GB', 50000, 1, 1, 'zonecloud@gmail.com'),
       (32, 'CHIP02', '2 Core Xeon', '4GB', '40GB', 100000, 1, 1, 'zonecloud@gmail.com'),
       (33, 'SSD01', '2 Core Xeon', '4GB', '120GB', 170000, 2, 1, 'zonecloud@gmail.com'),
       (34, 'SSD02', '4 Core Xeon', '8GB', '350GB', 200000, 2, 1, 'zonecloud@gmail.com'),
       (35, 'RAM01', '2 Core Xeon', '16GB', '20GB', 200000, 3, 1, 'zonecloud@gmail.com'),
       (36, 'RAM02', '4 Core Xeon', '32GB', '40GB', 350000, 3, 1, 'zonecloud@gmail.com'),
       (37, 'CHIP01', '1 Core Xeon', '2GB', '20GB', 50000, 1, 1, 'matbao@gmail.com'),
       (38, 'CHIP02', '2 Core Xeon', '4GB', '40GB', 100000, 1, 1, 'matbao@gmail.com'),
       (39, 'SSD01', '2 Core Xeon', '4GB', '120GB', 170000, 2, 1, 'matbao@gmail.com'),
       (40, 'SSD02', '4 Core Xeon', '8GB', '350GB', 200000, 2, 1, 'matbao@gmail.com'),
       (41, 'RAM01', '2 Core Xeon', '16GB', '20GB', 200000, 3, 1, 'matbao@gmail.com'),
       (42, 'RAM02', '4 Core Xeon', '32GB', '40GB', 350000, 3, 1, 'matbao@gmail.com');


       