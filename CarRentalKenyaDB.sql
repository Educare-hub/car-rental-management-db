-- Create DB (Kenya-focused)
IF DB_ID('CarRentalKenyaDB') IS NULL
CREATE DATABASE CarRentalKenyaDB;
GO

USE CarRentalKenyaDB;
GO

-- Users (for authentication)
CREATE TABLE [dbo].[Users] (
  [UserId] INT IDENTITY(1,1) PRIMARY KEY,
  [Username] NVARCHAR(100) NOT NULL UNIQUE,
  [Email] NVARCHAR(255) NOT NULL UNIQUE,
  [PasswordHash] NVARCHAR(512) NOT NULL,
  [CreatedAt] DATETIME DEFAULT GETDATE()
);
GO

-- Car
CREATE TABLE [dbo].[Car] (
  [CarId] INT IDENTITY(1,1) PRIMARY KEY,
  [CarModel] NVARCHAR(100) NOT NULL,
  [Manufacturer] NVARCHAR(100),
  [Year] INT,
  [Color] NVARCHAR(50),
  [RentalRate] DECIMAL(10,2), -- assume KES per day
  [Availability] BIT DEFAULT 1
);
GO

-- Customer
CREATE TABLE [dbo].[Customer] (
  [CustomerId] INT IDENTITY(1,1) PRIMARY KEY,
  [FirstName] NVARCHAR(100),
  [LastName] NVARCHAR(100),
  [Email] NVARCHAR(255),
  [PhoneNumber] NVARCHAR(50),
  [Address] NVARCHAR(255)
);
GO

-- Booking
CREATE TABLE [dbo].[Booking] (
  [BookingId] INT IDENTITY(1,1) PRIMARY KEY,
  [CarID] INT NOT NULL,
  [CustomerID] INT NOT NULL,
  [RentalStartDate] DATE NOT NULL,
  [RentalEndDate] DATE NOT NULL,
  [TotalAmount] DECIMAL(10,2),
  CONSTRAINT FK_Booking_Car FOREIGN KEY (CarID) REFERENCES Car(CarId),
  CONSTRAINT FK_Booking_Customer FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerId)
);
GO

-- Location (keeps optional CarID to link specific cars to a branch if desired)
CREATE TABLE [dbo].[Location] (
  [LocationId] INT IDENTITY(1,1) PRIMARY KEY,
  [CarID] INT NULL,
  [LocationName] NVARCHAR(150),
  [Address] NVARCHAR(255),
  [ContactNumber] NVARCHAR(50),
  CONSTRAINT FK_Location_Car FOREIGN KEY (CarID) REFERENCES Car(CarId)
);
GO

-- Seed Cars (5 rows) — models commonly used in Kenya with KES/day rates
INSERT INTO Car (CarModel, Manufacturer, Year, Color, RentalRate, Availability) VALUES
('Probox', 'Toyota', 2018, 'White', 3000.00, 1),
('Vitz', 'Toyota', 2017, 'Silver', 3500.00, 1),
('Land Cruiser Prado', 'Toyota', 2020, 'Black', 12000.00, 1),
('NP200', 'Nissan', 2019, 'White', 3200.00, 1),
('Forester', 'Subaru', 2016, 'Grey', 7000.00, 1);
GO

SELECT * FROM Car
-- Seed Customers (5 rows) — Kenyan names & contacts
INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Address) VALUES
('Patricia','Njeri','patricia.njeri@88resume.co.ke','+254710000001','Nairobi'),
('Joseph','Mwangi','joseph.mwangi@88resume.co.ke','+254720000002','Mombasa'),
('Faith','Wanjiru','faith.wanjiru@88resume.co.ke','+254730000003','Kisumu'),
('Kevin','Oduor','kevin.oduor@88resume.co.ke','+254740000004','Eldoret'),
('Samuel','Kamau','samuel.kamau@88resume.co.ke','+254750000005','Nakuru');
GO
SELECT * FROM Customer

USE CarRentalKenyaDB;
GO

SELECT CarID, CustomerID, RentalStartDate, RentalEndDate, TotalAmount
INTO #TempBooking
FROM Booking 
ORDER BY BookingId

--clear the previous table that starts with BookingId 2
TRUNCATE TABLE Booking;
-- Seed Bookings (5 rows) — totals in KES (simple calculation: Total = rate * (end - start) days)
INSERT INTO Booking (CarID, CustomerID, RentalStartDate, RentalEndDate, TotalAmount) VALUES
(1, 1, '2025-10-01', '2025-10-03', 6000.00),   -- Probox: 2 days * 3000/day = 6000
(2, 2, '2025-09-15', '2025-09-16', 3500.00),   -- Vitz: 1 day * 3500 = 3500
(3, 3, '2025-11-01', '2025-11-04', 36000.00),  -- Prado: 3 days * 12000 = 36000
(4, 4, '2025-10-20', '2025-10-22', 6400.00),   -- NP200: 2 days * 3200 = 6400
(5, 5, '2025-10-05', '2025-10-06', 7000.00);   -- Forester: 1 day * 7000 = 7000
GO
SELECT * FROM Booking

-- Seed Locations (5 rows) — Kenyan branches and depot
INSERT INTO Location (CarID, LocationName, Address, ContactNumber) VALUES
(1,'Nairobi CBD Branch', 'Koinange St, Nairobi', '+254711111111'),
(2,'Mombasa Branch', 'Liberation Rd, Mombasa', '+254722222222'),
(3,'Kisumu Branch', 'Oginga Odinga St, Kisumu', '+254733333333'),
(4,'Eldoret Branch', 'Moi Ave, Eldoret', '+254744444444'),
(5,'Central Depot Nairobi', 'Industrial Area, Nairobi', '+254755555555'); -- depot with no specific car
GO
SELECT * FROM Location


DELETE FROM Location
WHERE LocationId BETWEEN 1 AND 5

--let's drop the identity column by copying the remaining data into a temporary location named #TempLocation
SELECT CarID, LocationName, Address, ContactNumber
INTO #TempLocation
FROM Location
ORDER BY LocationId

--Now that we've copied the date into a temporary location let's delete the table's location so that our new tables tarts at LocationId 1 INSTEAD OF 6
TRUNCATE TABLE Location;

-- Reinsert the new data into the new table from the TempLocation starting with LocationID 1
INSERT INTO Location (CarID, LocationName, Address, ContactNumber)
SELECT CarID, LocationName, Address, ContactNumber
FROM #TempLocation;

-- Checking our results to see whether the changes were successful 
SELECT * FROM Location ORDER BY LocationId
