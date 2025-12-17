import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect(); 

export async function checkConnection() {
  try {
    const conn = await sql.connect(dbConfig);
    console.log("✅ Kết nối SQL Server thành công!");
    return conn;
  } catch (err) {
    console.error("❌ Kết nối thất bại:", err);
    throw err;
  }
}

export { sql, pool, poolConnect };
