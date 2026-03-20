--User Table
CREATE TABLE IF NOT EXISTS tbl__Supplier (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    Website TEXT NOT NULL,
    Phone INTEGER NOT NULL,
    Email TEXT NOT NULL,
    Logo TEXT NOT NULL,
    CountryID INTEGER NOT NULL,
    Status INTEGER NOT NULL
);
-- User Value
INSERT INTO tbl__Supplier (ID, Name, Website, Phone, Email, Logo, CountryID, Status)
VALUES (1, '__Mr.V__', 'Website', 1, 'Email', 'Logo', 1, 1001);