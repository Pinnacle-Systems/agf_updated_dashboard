import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getFabricInward(req, res) {
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
      `SELECT A.CCATEGORY,COUNT(*) CNT,SUM(A.TOTQTY) QTY FROM DTFABINWENTRY A
JOIN GTFINANCIALYEAR B ON A.FINYR = B.GTFINANCIALYEARID
WHERE B.FINYR = :FINYEAR
GROUP BY A.CCATEGORY`,
      { FINYEAR: finyear },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      category: item.CCATEGORY,
      count: item.CNT,
      qty: item.QTY,
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

export async function getFabricInwardCustomer(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category } = req.query;

    const result = await connection.execute(
      `SELECT CUSTNAME CUSTOMER ,COUNT(*) CNT,SUM(QTY) QTY FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYEAR AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY CUSTNAME`,
      { FINYEAR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      customer: item.CUSTOMER,
      count: item.CNT,
      qty: item.QTY,
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

export async function getFabricInwardCustomerByName(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    let { finyear, category, customer } = req.query;
    if (customer === null || customer === "" || customer === undefined) {
      customer = "ALL";
    }
    const result = await connection.execute(
      `SELECT DISTINCT DOCID AS INWNO,
        TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS INWDATE,
                ORDERNO,
                CUSTNAME,
                FABNAME,
                DIA,
                UNITNAME,
                QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR AND 
 ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND
 ( :CUSTNAME = 'ALL' OR CUSTNAME = :CUSTNAME )
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, CCATEGORY: category, CUSTNAME: customer },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      inwNo: item.INWNO,
      inwDate: item.INWDATE,
      orderNo: item.ORDERNO,
      custName: item.CUSTNAME,
      fabName: item.FABNAME,
      dia: item.DIA,
      uom: item.UNITNAME,
      qty: item.QTY,
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

export async function getFanInwardCust(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { category } = req.query;

    const result = await connection.execute(
      `SELECT DISTINCT CUSTNAME
FROM FABRIC_INWARD_DATA
WHERE ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
ORDER BY CUSTNAME
      `,
      { CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log("result", result);
    const data = result.rows.map((row) => row.CUSTNAME);

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

export async function getFabricInwardByMonth(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, month } = req.query;
    const result = await connection.execute(
      `SELECT
    TRIM(MONTHCHAR) AS MONTHCHAR,
    COUNT(1) AS COUNT,
    SUM(QTY) AS QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR
  AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY TRIM(MONTHCHAR)
ORDER BY CASE UPPER(TRIM(MONTHCHAR))
    WHEN 'APRIL'     THEN 1
    WHEN 'MAY'       THEN 2
    WHEN 'JUNE'      THEN 3
    WHEN 'JULY'      THEN 4
    WHEN 'AUGUST'    THEN 5
    WHEN 'SEPTEMBER' THEN 6
    WHEN 'OCTOBER'   THEN 7
    WHEN 'NOVEMBER'  THEN 8
    WHEN 'DECEMBER'  THEN 9
    WHEN 'JANUARY'   THEN 10
    WHEN 'FEBRUARY'  THEN 11
    WHEN 'MARCH'     THEN 12
END`,
      { FINYR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      month: item.MONTHCHAR,
      count: item.COUNT,
      qty: item.QTY,
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

export async function getFabricInwardCusByMonth(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, month } = req.query;
    const monthOnly = month.split(" ")[0].toUpperCase();
    const result = await connection.execute(
      `SELECT 
    CUSTNAME        AS CUSTOMER,
    COUNT(*)        AS CNT,
    SUM(QTY)        AS QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR
  AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
  AND TRIM(MONTHCHAR) = :MONTHCHAR
GROUP BY CUSTNAME`,
      { FINYR: finyear, CCATEGORY: category, MONTHCHAR: monthOnly },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      customer: item.CUSTOMER,
      count: item.CNT,
      qty: item.QTY,
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

export async function getFabricInwardByQuarter(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }
    const { finyear, category } = req.query;

    const result = await connection.execute(
      `SELECT QUARTER, COUNT(1) as COUNT,SUM(QTY) as QTY
FROM FABRIC_INWARD_DATA WHERE FINYR = :FINYR AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
GROUP BY QUARTER ORDER BY
    CASE QUARTER
        WHEN 'Q1' THEN 1
        WHEN 'Q2' THEN 2
        WHEN 'Q3' THEN 3
        WHEN 'Q4' THEN 4
    END`,
      { FINYR: finyear, CCATEGORY: category },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      quarter: item.QUARTER,
      count: item.COUNT,
      qty: item.QTY,
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

export async function getFabricInwardByQuarterName(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, quarter } = req.query;
    const result = await connection.execute(
      `SELECT DISTINCT
    DOCID AS INWNO,
    TO_CHAR(DOCDATE, 'DD/MM/YYYY') AS INWDATE,
    ORDERNO,
    CUSTNAME,
    FABNAME,
    DIA,
    UNITNAME,
    QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR
  AND ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY )
  AND ( :QUARTER = 'ALL' OR QUARTER = :QUARTER )
ORDER BY 1,2,3,4,5,6,7,8`,
      { FINYR: finyear, CCATEGORY: category, QUARTER: quarter },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      inwNo: item.INWNO,
      inwDate: item.INWDATE,
      orderNo: item.ORDERNO,
      custName: item.CUSTNAME,
      fabName: item.FABNAME,
      dia: item.DIA,
      uom: item.UNITNAME,
      qty: item.QTY,
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

export async function getFabricInwardByMonthDate(req, res) {
  let connection;

  try {
    connection = await getConnectionERP();

    if (!connection) {
      return res
        .status(500)
        .json({ statusCode: 1, message: "Database connection not available" });
    }

    const { finyear, category, month } = req.query;
    const monthOnly = month.split(" ")[0].toUpperCase();
    const result = await connection.execute(
      `SELECT TO_CHAR(DOCDATE,'DD') AS INWDATE, COUNT(1) AS COUNT,
       SUM(QTY)        AS QTY
FROM FABRIC_INWARD_DATA
WHERE FINYR = :FINYR AND 
      ( :CCATEGORY = 'ALL' OR CCATEGORY = :CCATEGORY ) AND 
      TRIM(MONTHCHAR) = :MONTHCHAR
GROUP BY TO_CHAR(DOCDATE,'DD')
ORDER BY TO_NUMBER(TO_CHAR(DOCDATE,'DD'))`,
      { FINYR: finyear, CCATEGORY: category, MONTHCHAR: monthOnly },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log("resukt", result);
    console.log(monthOnly,"monthonly")
    const data = result.rows.map((item) => ({
      inwDate: item.INWDATE,
      qty: item.QTY,
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
