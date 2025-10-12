import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllBookings = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM Booking");
  return result.recordset;
};

export const createBooking = async (CarID: number, CustomerID: number, RentalStartDate: string, RentalEndDate: string, TotalAmount: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input("CarID", sql.Int, CarID)
    .input("CustomerID", sql.Int, CustomerID)
    .input("RentalStartDate", sql.Date, RentalStartDate)
    .input("RentalEndDate", sql.Date, RentalEndDate)
    .input("TotalAmount", sql.Decimal(10,2), TotalAmount)
    .query(`
      INSERT INTO Booking (CarID, CustomerID, RentalStartDate, RentalEndDate, TotalAmount)
      VALUES (@CarID, @CustomerID, @RentalStartDate, @RentalEndDate, @TotalAmount)
    `);
};
