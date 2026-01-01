import mongoose from "mongoose";
import dotenv from "dotenv";

export async function checkConnection() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Kết nối SQL Server thành công!");
    return conn;
  } catch (err) {
    console.error("❌ Kết nối thất bại:", err);
    throw err;
  }
}