import { Request, Response } from "express";
import { poolPromise } from "../config/db";
import sql from "mssql";

// 📋 Get all bookings with car + customer info
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        b.BookingId, b.RentalStartDate, b.RentalEndDate, b.TotalAmount,
        c.CarModel, c.Manufacturer, cust.FirstName, cust.LastName
      FROM Booking b
      JOIN Car c ON b.CarID = c.CarId
      JOIN Customer cust ON b.CustomerID = cust.CustomerId
    `);
    res.status(200).json(result.recordset);
  } catch (error: any) {
    console.error("❌ Error fetching bookings:", error.message);
    res.status(500).json({ message: "Error retrieving bookings" });
  }
};

// 📄 Get one booking
export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("BookingId", sql.Int, id)
      .query(`
        SELECT 
          b.BookingId, b.RentalStartDate, b.RentalEndDate, b.TotalAmount,
          c.CarModel, c.Manufacturer, cust.FirstName, cust.LastName
        FROM Booking b
        JOIN Car c ON b.CarID = c.CarId
        JOIN Customer cust ON b.CustomerID = cust.CustomerId
        WHERE b.BookingId = @BookingId
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(result.recordset[0]);
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving booking" });
  }
};

// ➕ Add a new booking
export const createBooking = async (req: Request, res: Response) => {
  const { CarID, CustomerID, RentalStartDate, RentalEndDate, TotalAmount } = req.body;

  if (!CarID || !CustomerID || !RentalStartDate || !RentalEndDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("CarID", sql.Int, CarID)
      .input("CustomerID", sql.Int, CustomerID)
      .input("RentalStartDate", sql.Date, RentalStartDate)
      .input("RentalEndDate", sql.Date, RentalEndDate)
      .input("TotalAmount", sql.Decimal(10, 2), TotalAmount)
      .query(
        `INSERT INTO Booking (CarID, CustomerID, RentalStartDate, RentalEndDate, TotalAmount)
         VALUES (@CarID, @CustomerID, @RentalStartDate, @RentalEndDate, @TotalAmount)`
      );

    res.status(201).json({ message: "✅ Booking created successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating booking" });
  }
};

// ✏️ Update booking
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { CarID, CustomerID, RentalStartDate, RentalEndDate, TotalAmount } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("BookingId", sql.Int, id)
      .input("CarID", sql.Int, CarID)
      .input("CustomerID", sql.Int, CustomerID)
      .input("RentalStartDate", sql.Date, RentalStartDate)
      .input("RentalEndDate", sql.Date, RentalEndDate)
      .input("TotalAmount", sql.Decimal(10, 2), TotalAmount)
      .query(
        `UPDATE Booking
         SET CarID=@CarID, CustomerID=@CustomerID, RentalStartDate=@RentalStartDate,
             RentalEndDate=@RentalEndDate, TotalAmount=@TotalAmount
         WHERE BookingId=@BookingId`
      );

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating booking" });
  }
};

// 🗑️ Delete booking
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("BookingId", sql.Int, id)
      .query("DELETE FROM Booking WHERE BookingId=@BookingId");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting booking" });
  }
};
