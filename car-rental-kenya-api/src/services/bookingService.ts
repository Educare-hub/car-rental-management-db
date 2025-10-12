import { getAllBookings, createBooking } from "../repositories/bookingRepository";

export const listBookings = async () => {
  return await getAllBookings();
};

export const addBooking = async (CarID: number, CustomerID: number, startDate: string, endDate: string, total: number) => {
  await createBooking(CarID, CustomerID, startDate, endDate, total);
  return { message: "Booking created successfully" };
};
