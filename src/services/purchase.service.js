import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

// FRONTPAGE DASHBOARD

export async function getPurchase(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { filterYear } = req.query;

    const sql = `
 SELECT D.FINYR FINYEAR,C.COMPCODE,SUM(B.AMOUNT) VAL FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
where D.FINYR = '${filterYear}'
GROUP BY D.FINYR,C.COMPCODE
ORDER BY 1,2
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      FINYEAR: po[0],
      COMPCODE: po[1],
      VAL: po[2],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// COMPCODE DROPDOWN DATA

export async function getCompany(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear } = req.query;

    const sql = `
SELECT C.COMPCODE  FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
where D.FINYR = '${selectedYear}'
GROUP BY C.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
     
      COMPCODE: po[0]
      
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
