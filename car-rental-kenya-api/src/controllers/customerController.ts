import { Request, Response } from "express";
import { poolPromise } from "../config/db";
import sql from "mssql";

// 🧍 Get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Customer");
    res.status(200).json(result.recordset);
  } catch (error: any) {
    console.error("❌ Error fetching customers:", error.message);
    res.status(500).json({ message: "Error retrieving customers" });
  }
};

// 🧍‍♂️ Get one customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CustomerId", sql.Int, id)
      .query("SELECT * FROM Customer WHERE CustomerId = @CustomerId");

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json(result.recordset[0]);
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving customer" });
  }
};

// ➕ Add a new customer
export const createCustomer = async (req: Request, res: Response) => {
  const { FirstName, LastName, Email, PhoneNumber, Address } = req.body;

  if (!FirstName || !LastName || !Email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("FirstName", sql.NVarChar(100), FirstName)
      .input("LastName", sql.NVarChar(100), LastName)
      .input("Email", sql.NVarChar(255), Email)
      .input("PhoneNumber", sql.NVarChar(50), PhoneNumber)
      .input("Address", sql.NVarChar(255), Address)
      .query(
        `INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Address)
         VALUES (@FirstName, @LastName, @Email, @PhoneNumber, @Address)`
      );

    res.status(201).json({ message: "✅ Customer added successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error adding customer" });
  }
};

// ✏️ Update customer
export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { FirstName, LastName, Email, PhoneNumber, Address } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CustomerId", sql.Int, id)
      .input("FirstName", sql.NVarChar(100), FirstName)
      .input("LastName", sql.NVarChar(100), LastName)
      .input("Email", sql.NVarChar(255), Email)
      .input("PhoneNumber", sql.NVarChar(50), PhoneNumber)
      .input("Address", sql.NVarChar(255), Address)
      .query(
        `UPDATE Customer
         SET FirstName=@FirstName, LastName=@LastName, Email=@Email,
             PhoneNumber=@PhoneNumber, Address=@Address
         WHERE CustomerId=@CustomerId`
      );

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating customer" });
  }
};

// 🗑️ Delete customer
export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CustomerId", sql.Int, id)
      .query("DELETE FROM Customer WHERE CustomerId=@CustomerId");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting customer" });
  }
};
