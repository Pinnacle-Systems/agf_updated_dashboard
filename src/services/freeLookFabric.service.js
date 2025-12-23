import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getFabric(req, res) {
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
      SELECT 'INWARD' CCATEGORY,
             COUNT(*) CNT,
             NVL(SUM(A.TOTQTY), 0) QTY
      FROM DTFABINWENTRY A
      JOIN GTFINANCIALYEAR B
        ON A.FINYR = B.GTFINANCIALYEARID
      WHERE B.FINYR = :FINYEAR

      UNION ALL

      SELECT 'OUTWARD' CCATEGORY,
             COUNT(*) CNT,
             NVL(SUM(A.TOTDCWT), 0) QTY
      FROM dtfdelchal A
      JOIN GTFINANCIALYEAR B
        ON A.FINYR = B.GTFINANCIALYEARID
      WHERE B.FINYR = :FINYEAR
      `,
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
      `SELECT A.CUSTNAME CUSTOMER ,COUNT(*) CNT,SUM(A.TOTQTY) QTY FROM DTFABINWENTRY A
JOIN GTFINANCIALYEAR B ON A.FINYR = B.GTFINANCIALYEARID
WHERE B.FINYR = :FINYEAR AND A.CCATEGORY = :CCATEGORY
GROUP BY A.CUSTNAME`,
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

export async function getFabricOutward(req, res) {
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

export async function getFabricOutwardCustomer(req, res) {
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
      `SELECT A.CUSTNAME CUSTOMER ,COUNT(*) CNT,SUM(A.TOTQTY) QTY FROM DTFABINWENTRY A
JOIN GTFINANCIALYEAR B ON A.FINYR = B.GTFINANCIALYEARID
WHERE B.FINYR = :FINYEAR AND A.CCATEGORY = :CCATEGORY
GROUP BY A.CUSTNAME`,
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

    const { finyear, category, customer } = req.query;
    const result = await connection.execute(
      `SELECT DISTINCT
	   A.DOCID AS INWNO,
	   A.DOCDATE AS INWDATE,
	   A.ORDERNO,
	   A.CUSTNAME,
	   C.FABNAME,
	   D.DIA,
	   F.UNITNAME,
	   B.QTY
FROM DTFABINWENTRY A
INNER JOIN DTFINWENTRYDET B ON A.DTFABINWENTRYID = B.DTFABINWENTRYID
INNER JOIN DTFABMAST C ON C.DTFABMASTID = B.FABRIC
INNER JOIN GTDIAMAST D ON D.GTDIAMASTID = B.DIA
INNER JOIN GTFINANCIALYEAR E ON E.GTFINANCIALYEARID = A.FINYR
INNER JOIN GTUNITMAST F ON F.GTUNITMASTID = B.UOM
WHERE E.FINYR = :FINYR AND
	  A.CUSTNAME = :CUSTNAME AND
	  A.CCATEGORY = :CCATEGORY
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

    const result = await connection.execute(
      `SELECT DISTINCT CUSTNAME FROM DTFABINWENTRY
      `
    );
    const data = result.rows.map((row) => row[0]);

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
