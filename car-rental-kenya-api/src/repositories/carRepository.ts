import { poolPromise } from "../config/db";
import sql from "mssql";
import { Car } from "../types/carTypes";

export const getAllCars = async (): Promise<Car[]> => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM Car");
  return result.recordset;
};

export const getCarById = async (id: number): Promise<Car | null> => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("CarId", sql.Int, id)
    .query("SELECT * FROM Car WHERE CarId = @CarId");

  return result.recordset.length ? result.recordset[0] : null;
};

export const createCar = async (car: Car): Promise<void> => {
  const pool = await poolPromise;
  await pool
    .request()
    .input("CarModel", sql.NVarChar(100), car.CarModel)
    .input("Manufacturer", sql.NVarChar(100), car.Manufacturer)
    .input("Year", sql.Int, car.Year)
    .input("Color", sql.NVarChar(50), car.Color)
    .input("RentalRate", sql.Decimal(10, 2), car.RentalRate)
    .input("Availability", sql.Bit, car.Availability ?? 1)
    .query(
      `INSERT INTO Car (CarModel, Manufacturer, Year, Color, RentalRate, Availability)
       VALUES (@CarModel, @Manufacturer, @Year, @Color, @RentalRate, @Availability)`
    );
};

export const updateCar = async (id: number, car: Car): Promise<boolean> => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("CarId", sql.Int, id)
    .input("CarModel", sql.NVarChar(100), car.CarModel)
    .input("Manufacturer", sql.NVarChar(100), car.Manufacturer)
    .input("Year", sql.Int, car.Year)
    .input("Color", sql.NVarChar(50), car.Color)
    .input("RentalRate", sql.Decimal(10, 2), car.RentalRate)
    .input("Availability", sql.Bit, car.Availability)
    .query(
      `UPDATE Car
       SET CarModel = @CarModel, Manufacturer = @Manufacturer, Year = @Year,
           Color = @Color, RentalRate = @RentalRate, Availability = @Availability
       WHERE CarId = @CarId`
    );

  return result.rowsAffected[0] > 0;
};

export const deleteCar = async (id: number): Promise<boolean> => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("CarId", sql.Int, id)
    .query("DELETE FROM Car WHERE CarId = @CarId");

  return result.rowsAffected[0] > 0;
};
