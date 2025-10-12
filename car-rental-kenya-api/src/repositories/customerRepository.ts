import { poolPromise } from "../config/db";
import sql from "mssql";

export const CustomerRepository = {
  async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Customer");
    return result.recordset;
  },

  async getById(id: number) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CustomerId", sql.Int, id)
      .query("SELECT * FROM Customer WHERE CustomerId = @CustomerId");
    return result.recordset[0];
  },

  async create(data: {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    Address: string;
  }) {
    const pool = await poolPromise;
    await pool
      .request()
      .input("FirstName", sql.NVarChar(100), data.FirstName)
      .input("LastName", sql.NVarChar(100), data.LastName)
      .input("Email", sql.NVarChar(255), data.Email)
      .input("PhoneNumber", sql.NVarChar(50), data.PhoneNumber)
      .input("Address", sql.NVarChar(255), data.Address)
      .query(
        `INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Address)
         VALUES (@FirstName, @LastName, @Email, @PhoneNumber, @Address)`
      );
  },

  async update(id: number, data: any) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CustomerId", sql.Int, id)
      .input("FirstName", sql.NVarChar(100), data.FirstName)
      .input("LastName", sql.NVarChar(100), data.LastName)
      .input("Email", sql.NVarChar(255), data.Email)
      .input("PhoneNumber", sql.NVarChar(50), data.PhoneNumber)
      .input("Address", sql.NVarChar(255), data.Address)
      .query(
        `UPDATE Customer
         SET FirstName=@FirstName, LastName=@LastName, Email=@Email,
             PhoneNumber=@PhoneNumber, Address=@Address
         WHERE CustomerId=@CustomerId`
      );
    return result.rowsAffected[0];
  },

  async delete(id: number) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("CustomerId", sql.Int, id)
      .query("DELETE FROM Customer WHERE CustomerId=@CustomerId");
    return result.rowsAffected[0];
  },
};
