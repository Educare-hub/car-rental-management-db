import express from "express";
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/carController";

const router = express.Router();

// RESTful endpoints
router.get("/", getAllCars);        // GET all cars
router.get("/:id", getCarById);     // GET one car by ID
router.post("/", createCar);        // POST new car
router.put("/:id", updateCar);      // PUT update existing car
router.delete("/:id", deleteCar);   // DELETE a car

export default router;
