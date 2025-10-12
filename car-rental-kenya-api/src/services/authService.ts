import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { poolPromise } from "../config/db";
import sql from "mssql";


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// REGISTER USER
export const registerUser = async (username: string, email: string, password: string) => {
  if (!username || !email || !password) {
    throw new Error("All fields (username, email, password) are required");
  }

  const pool = await poolPromise;
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.request()
    .input("Username", sql.NVarChar(100), username)
    .input("Email", sql.NVarChar(255), email)
    .input("PasswordHash", sql.NVarChar(512), hashedPassword)
    .query(`
      INSERT INTO Users (Username, Email, PasswordHash)
      VALUES (@Username, @Email, @PasswordHash)
    `);

  const token = jwt.sign({ username, email }, JWT_SECRET, { expiresIn: "1h" });

  return { message: "✅ User registered successfully", token };
};

// ✅ LOGIN USER — simplified to accept ONLY (email, password)
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const pool = await poolPromise;
  const result = await pool.request()
    .input("Email", sql.NVarChar(255), email)
    .query(`SELECT * FROM Users WHERE Email = @Email`);

  const user = result.recordset[0];
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.UserId, username: user.Username, email: user.Email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    message: "✅ Login successful",
    token,
  };
};
