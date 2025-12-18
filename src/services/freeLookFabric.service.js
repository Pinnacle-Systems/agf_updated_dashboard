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
	   B.GRNNO,
	   B.ORDERNO,
	   B.PROTYPE AS "DELIVERYTO",
	   B.DELTO AS "FABRICNAME",
	   E.FABNAME,
	   F.DIA,
	   G.FABRICID AS "ROUTE",
	   H.UNITNAME AS "UOM",
	   C.DELQTY AS "QTY"
FROM DTFABINWENTRY A
INNER JOIN DTFDELCHAL B ON A.DOCID = B.GRNNO
INNER JOIN DTFDELCHALDET C ON C.DTFDELCHALID = B.DTFDELCHALID 
INNER JOIN GTFINANCIALYEAR D ON A.FINYR = D.GTFINANCIALYEARID
INNER JOIN DTFABMAST E ON E.DTFABMASTID = C.FABRIC
INNER JOIN GTDIAMAST F ON F.GTDIAMASTID = C.DIA
INNER JOIN DTPROROUTEMAST G ON G.DTPROROUTEMASTID = C.ROUTE
INNER JOIN GTUNITMAST H ON H.GTUNITMASTID = C.UOM
WHERE D.FINYR = :FINYR AND
	  A.CUSTNAME = :CUSTNAME AND
	  A.CCATEGORY = :CCATEGORY
ORDER BY 1,2,3,4,5,6,7,8,9`,
      { FINYR: finyear, CCATEGORY: category, CUSTNAME: customer },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const data = result.rows.map((item) => ({
      grnNo: item.GRNNO,
      orderNo: item.ORDERNO,
      deliveryTo: item.DELIVERYTO,
      fabricName: item.FABRICNAME,
      fabName: item.FABNAME,
      dia: item.DIA,
      route: item.ROUTE,
      uom: item.UOM,
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
