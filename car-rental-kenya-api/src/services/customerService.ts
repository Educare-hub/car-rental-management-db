import { CustomerRepository } from "../repositories/customerRepository";

export const CustomerService = {
  async getAllCustomers() {
    return await CustomerRepository.getAll();
  },

  async getCustomerById(id: number) {
    const customer = await CustomerRepository.getById(id);
    if (!customer) throw new Error("Customer not found");
    return customer;
  },

  async createCustomer(data: {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    Address: string;
  }) {
    if (!data.FirstName || !data.LastName || !data.Email) {
      throw new Error("Missing required fields");
    }
    await CustomerRepository.create(data);
    return { message: "Customer created successfully" };
  },

  async updateCustomer(id: number, data: any) {
    const affectedRows = await CustomerRepository.update(id, data);
    if (affectedRows === 0) throw new Error("Customer not found");
    return { message: "Customer updated successfully" };
  },

  async deleteCustomer(id: number) {
    const affectedRows = await CustomerRepository.delete(id);
    if (affectedRows === 0) throw new Error("Customer not found");
    return { message: "Customer deleted successfully" };
  },
};
