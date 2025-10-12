import * as carRepository from "../repositories/carRepository";
import { Car } from "../types/carTypes";

// 🏎️ Get all cars
export const getAllCars = async (): Promise<Car[]> => {
  return await carRepository.getAllCars();
};

// 🚗 Get car by ID
export const getCarById = async (id: number): Promise<Car | null> => {
  return await carRepository.getCarById(id);
};

// ➕ Add new car
export const createCar = async (carData: Car): Promise<void> => {
  await carRepository.createCar(carData);
};

// ✏️ Update car
export const updateCar = async (id: number, carData: Car): Promise<boolean> => {
  return await carRepository.updateCar(id, carData);
};

// 🗑️ Delete car
export const deleteCar = async (id: number): Promise<boolean> => {
  return await carRepository.deleteCar(id);
};
