import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getLoadPurchaseData(req, res) {
  let connection;

  try {
    // 1️⃣ Get DB Connection
    connection = await getConnectionERP();

    if (!connection) {
      return res.status(500).json({
        statusCode: 1,
        message: "Database connection not available",
      });
    }

    // 2️⃣ Call Stored Procedure
    await connection.execute(`
      BEGIN
      LOAD_COLOUR_STORE_DATA();
      END;
    `);

    // 6️⃣ Send Response
    return res.json({
      statusCode: 0,
      data : "Purchase data loaded successfully",
    });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    // 7️⃣ Close Connection
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getSupplierPOS(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear } = req.query;

    const result = await connection.execute(
      `
SELECT *
FROM (
    SELECT 
        SUPPLIER,
        UNITNAME,
        SUM(QTY) AS ITEMQTY, 
        SUM(AMOUNT) AS TOTALAMOUNTVALUE
    FROM COLOUR_STORE_PO
    WHERE APPROVALSTATUS = 'APPROVED'
      AND FINYR = :FINYEAR
    GROUP BY SUPPLIER, UNITNAME
    ORDER BY ITEMQTY DESC
)
WHERE ROWNUM <= 10`,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      supplier: item.SUPPLIER,
      qty: item.ITEMQTY,
      amountValue: item.TOTALAMOUNTVALUE,
      unit: item.UNITNAME,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

export async function getSupplierPOSMonth(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, month } = req.query;
     const monthOnly = month.split(" ")[0].toUpperCase();
    const result = await connection.execute(
      `
SELECT *
FROM (
    SELECT 
        SUPPLIER,
        UNITNAME,
        SUM(QTY) AS ITEMQTY, 
        SUM(AMOUNT) AS TOTALAMOUNTVALUE
    FROM COLOUR_STORE_PO
    WHERE APPROVALSTATUS = 'APPROVED'
      AND FINYR = :FINYEAR
      AND TRIM(MONTHCHAR) = :MONTHCHAR
    GROUP BY SUPPLIER, UNITNAME
    ORDER BY ITEMQTY DESC
)
WHERE ROWNUM <= 10`,
      { FINYEAR: finyear, MONTHCHAR: monthOnly },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      supplier: item.SUPPLIER,
      qty: item.ITEMQTY,
      amountValue: item.TOTALAMOUNTVALUE,
      unit: item.UNITNAME,
    }));

    return res.json({ statusCode: 0, data });
  } catch (err) {
    console.error("Error retrieving data:", err);

    return res.status(500).json({
      statusCode: 1,
      message: "Database error",
      error: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

