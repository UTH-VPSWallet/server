CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  imageUrl TEXT,
  bgColor TEXT NOT NULL,
  ctaText TEXT NOT NULL,
  ctaLink TEXT NOT NULL
);

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL,
  count INTEGER NOT NULL
);

CREATE TABLE providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logoUrl TEXT NOT NULL,
  rating REAL NOT NULL,
  totalProducts INTEGER NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE vps_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerId TEXT NOT NULL,
  cpu TEXT NOT NULL,
  ram TEXT NOT NULL,
  storage TEXT NOT NULL,
  ipCount INTEGER NOT NULL,
  bandwidth TEXT NOT NULL,
  intlBandwidthIn TEXT NOT NULL,
  intlBandwidthOut TEXT NOT NULL,
  dataTransfer TEXT NOT NULL,
  price INTEGER NOT NULL,
  priceUnit TEXT NOT NULL,
  featured INTEGER NOT NULL,
  badge TEXT,
  location TEXT NOT NULL,
  os TEXT NOT NULL,
  imageUrl TEXT
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL
);

CREATE TABLE cart_items (
  itemId TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  planId TEXT NOT NULL,
  planJson TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  billingCycle TEXT NOT NULL
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  itemsJson TEXT NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL,
  paymentMethod TEXT,
  createdAt TEXT NOT NULL
);

INSERT INTO banners (id, title, subtitle, imageUrl, bgColor, ctaText, ctaLink) VALUES
('b1', 'KHUYẾN MÃI TẾT 2025', 'Giảm 30% tất cả giá VPS cho đơn hàng từ 6 tháng', '/images/banner1.png', 'from-green-600 to-green-800', 'Mua Ngay', '/vps'),
('b2', 'VPS SSD SIÊU TỐC', 'Tốc độ NVMe nhanh hơn 10x so với HDD thông thường', '/images/banner2.png', 'from-blue-600 to-indigo-800', 'Xem Chi Tiết', '/vps'),
('b3', 'FREE DOMAIN 1 NĂM', 'Tặng kèm tên miền .com miễn phí khi đăng ký VPS 12 tháng', '/images/banner3.png', 'from-purple-600 to-pink-700', 'Đăng Ký Ngay', '/vps');

INSERT INTO categories (id, name, icon, slug, count) VALUES
('c1', 'VPS Phổ Thông', '🖥️', 'basic', 24),
('c2', 'VPS Cao Cấp', '⚡', 'premium', 12),
('c3', 'VPS GPU', '🎮', 'gpu', 6),
('c4', 'VPS Windows', '🪟', 'windows', 8),
('c5', 'VPS Linux', '🐧', 'linux', 18),
('c6', 'VPS Cloud', '☁️', 'cloud', 15);

INSERT INTO providers (id, name, logoUrl, rating, totalProducts, location) VALUES
('p1', 'Nhân Hòa', '/providers/nhanhoa.png', 4.5, 12, 'HN'),
('p2', 'Viettel IDC', '/providers/viettelidc.png', 4.3, 10, 'HN'),
('p3', 'VNPT Cloud', '/providers/vnpt.png', 4.2, 8, 'HN'),
('p4', 'Bizfly Cloud', '/providers/bizfly.png', 4.6, 14, 'HN'),
('p5', 'DigitalOcean', '/providers/digitalocean.png', 4.7, 20, 'SG'),
('p6', 'Vultr', '/providers/vultr.png', 4.4, 16, 'SG');

INSERT INTO vps_plans (id, name, provider, providerId, cpu, ram, storage, ipCount, bandwidth, intlBandwidthIn, intlBandwidthOut, dataTransfer, price, priceUnit, featured, badge, location, os, imageUrl) VALUES
('v1', 'SSD Cloud VPS A', 'Nhân Hòa', 'p1', '3 Core Intel Xeon E5-26XX/Gold 6138', '2GB', '20GB SSD', 1, '100Mbps', '100Mbps', 'Không giới hạn', 'Không giới hạn', 150000, 'month', 1, 'Bán chạy', 'HN', '["Ubuntu","CentOS","Debian","Windows"]', '/images/vps-v1.png'),
('v2', 'SSD Cloud VPS B', 'Nhân Hòa', 'p1', '4 Core Intel Xeon Gold 6138', '4GB', '40GB SSD', 1, '200Mbps', '200Mbps', 'Không giới hạn', 'Không giới hạn', 280000, 'month', 1, NULL, 'HN', '["Ubuntu","CentOS","Debian"]', '/images/vps-v2.png'),
('v3', 'SSD Cloud VPS C', 'Nhân Hòa', 'p1', '6 Core Intel Xeon Gold 6138', '8GB', '80GB SSD', 2, '500Mbps', '500Mbps', 'Không giới hạn', 'Không giới hạn', 560000, 'month', 0, NULL, 'HN', '["Ubuntu","CentOS","Debian","Windows"]', NULL),
('v4', 'Viettel VPS Starter', 'Viettel IDC', 'p2', '2 Core', '2GB', '30GB SSD', 1, '100Mbps', '100Mbps', 'Không giới hạn', 'Không giới hạn', 200000, 'month', 0, NULL, 'HN', '["Ubuntu","CentOS"]', NULL),
('v5', 'Viettel VPS Pro', 'Viettel IDC', 'p2', '4 Core', '8GB', '60GB SSD', 1, '500Mbps', '500Mbps', 'Không giới hạn', 'Không giới hạn', 450000, 'month', 1, 'Hot', 'HN', '["Ubuntu","CentOS","Windows"]', NULL),
('v6', 'Bizfly Cloud Basic', 'Bizfly Cloud', 'p4', '2 Core AMD EPYC', '4GB', '40GB NVMe', 1, '250Mbps', '250Mbps', 'Không giới hạn', 'Không giới hạn', 320000, 'month', 0, NULL, 'HN', '["Ubuntu","Debian","CentOS"]', NULL),
('v7', 'DigitalOcean Droplet Basic', 'DigitalOcean', 'p5', '1 vCPU', '1GB', '25GB SSD', 1, '1TB Transfer', '1Gbps', '1Gbps', '1TB/tháng', 120000, 'month', 1, 'Giá tốt', 'SG', '["Ubuntu","Debian","Fedora","FreeBSD"]', NULL),
('v8', 'DigitalOcean Droplet Standard', 'DigitalOcean', 'p5', '2 vCPU', '4GB', '80GB SSD', 1, '4TB Transfer', '1Gbps', '1Gbps', '4TB/tháng', 350000, 'month', 0, NULL, 'SG', '["Ubuntu","Debian","CentOS"]', NULL),
('v9', 'Vultr Cloud Compute', 'Vultr', 'p6', '1 vCPU', '1GB', '25GB NVMe', 1, '1TB Transfer', '1Gbps', '1Gbps', '1TB/tháng', 110000, 'month', 0, NULL, 'SG', '["Ubuntu","Debian","Windows","FreeBSD"]', NULL),
('v10', 'VNPT Cloud VPS S', 'VNPT Cloud', 'p3', '2 Core', '2GB', '30GB SSD', 1, '100Mbps', '100Mbps', 'Không giới hạn', 'Không giới hạn', 180000, 'month', 0, NULL, 'DN', '["Ubuntu","CentOS"]', NULL);

INSERT INTO users (id, name, email, passwordHash) VALUES
('u1', 'Nguyễn Văn A', 'user@example.com', 'password123');
