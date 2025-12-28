import mysql from "mysql2/promise";
import { ENV } from "./_core/env";

/**
 * Database transaction wrapper for atomic operations
 * Ensures all operations succeed or fail together
 */

let connectionPool: mysql.Pool | null = null;

function getConnectionPool() {
  if (!connectionPool && process.env.DATABASE_URL) {
    connectionPool = mysql.createPool(process.env.DATABASE_URL);
  }
  return connectionPool;
}

/**
 * Execute a function within a database transaction
 * All operations will be committed if successful, or rolled back on error
 * 
 * @param callback - Function to execute within transaction
 * @returns Result of the callback function
 * @throws Error if transaction fails
 */
export async function withTransaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getConnectionPool();
  
  if (!pool) {
    throw new Error("Database connection pool not available");
  }

  const connection = await pool.getConnection();
  
  try {
    // Start transaction
    await connection.beginTransaction();
    console.log("[Transaction] Started");

    // Execute callback with connection
    const result = await callback(connection);

    // Commit transaction
    await connection.commit();
    console.log("[Transaction] Committed successfully");

    return result;
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error("[Transaction] Rolled back due to error:", error);
    throw error;
  } finally {
    // Release connection back to pool
    connection.release();
  }
}

/**
 * Execute a raw SQL query within a transaction
 * 
 * @param connection - MySQL connection from transaction
 * @param query - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function executeQuery(
  connection: mysql.PoolConnection,
  query: string,
  params: any[] = []
): Promise<any> {
  const [result] = await connection.execute(query, params);
  return result;
}
