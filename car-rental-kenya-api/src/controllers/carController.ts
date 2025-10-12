import { Request, Response } from "express";
import { poolPromise } from "../config/db";
import sql from "mssql";

// 🚗 Get all cars
export const getAllCars = async (req: Request, res: Response) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Car");
    res.status(200).json(result.recordset);
  } catch (error: any) {
    console.error("❌ Error fetching cars:", error.message);
    res.status(500).json({ message: "Error retrieving cars" });
  }
};

// 🚘 Get car by ID
export const getCarById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CarId", sql.Int, id)
      .query("SELECT * FROM Car WHERE CarId = @CarId");

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Car not found" });

    res.status(200).json(result.recordset[0]);
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving car" });
  }
};

// Add new car
export const createCar = async (req: Request, res: Response) => {
  const { CarModel, Manufacturer, Year, Color, RentalRate, Availability } = req.body;

  if (!CarModel || !Manufacturer || !Year) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("CarModel", sql.NVarChar(100), CarModel)
      .input("Manufacturer", sql.NVarChar(100), Manufacturer)
      .input("Year", sql.Int, Year)
      .input("Color", sql.NVarChar(50), Color)
      .input("RentalRate", sql.Decimal(10, 2), RentalRate)
      .input("Availability", sql.Bit, Availability ?? 1)
      .query(
        `INSERT INTO Car (CarModel, Manufacturer, Year, Color, RentalRate, Availability)
         VALUES (@CarModel, @Manufacturer, @Year, @Color, @RentalRate, @Availability)`
      );

    res.status(201).json({ message: "✅ Car added successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error adding car" });
  }
};

// ✏️ Update car
export const updateCar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { CarModel, Manufacturer, Year, Color, RentalRate, Availability } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CarId", sql.Int, id)
      .input("CarModel", sql.NVarChar(100), CarModel)
      .input("Manufacturer", sql.NVarChar(100), Manufacturer)
      .input("Year", sql.Int, Year)
      .input("Color", sql.NVarChar(50), Color)
      .input("RentalRate", sql.Decimal(10, 2), RentalRate)
      .input("Availability", sql.Bit, Availability)
      .query(
        `UPDATE Car
         SET CarModel = @CarModel, Manufacturer = @Manufacturer, Year = @Year,
             Color = @Color, RentalRate = @RentalRate, Availability = @Availability
         WHERE CarId = @CarId`
      );

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Car not found" });

    res.status(200).json({ message: "Car updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating car" });
  }
};

// 🗑️ Delete car
export const deleteCar = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CarId", sql.Int, id)
      .query("DELETE FROM Car WHERE CarId = @CarId");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Car not found" });

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting car" });
  }
};
