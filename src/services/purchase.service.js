import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

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
      COMPCODE: po[0],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// combined order purchase home page

export async function getCombinedPurchase(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { filterYear } = req.query;

    const sql = `
-- Combined purchase orders
SELECT A.FINYR, A.COMPCODE, SUM(A.VAL) AS VAL
FROM (
    -- YARN / DYARN / FAB / ACC POs
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE AS VAL
    FROM YARNPURREG
    WHERE FINYR = '${filterYear}'

    UNION ALL
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE
    FROM DYARNPURREG
    WHERE FINYR = '${filterYear}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM GFABPOREG
    WHERE FINYEAR = '${filterYear}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM DFABPOREG
    WHERE FINYEAR = '${filterYear}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM ACCPOREG
    WHERE FINYEAR = '${filterYear}'

    -- GTGENPO data
    UNION ALL
    SELECT D.FINYR, C.COMPCODE, B.AMOUNT
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${filterYear}'

) A
GROUP BY A.FINYR, A.COMPCODE
HAVING SUM(A.VAL) > 0
ORDER BY A.FINYR, A.COMPCODE
    `;

    const result = await connection.execute(sql);
    const resp = result.rows?.map((po) => ({
      FINYEAR: po[0],
      COMPCODE: po[1],
      VAL: po[2],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving combined data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// General purchase Home page not in use

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

// order against purchase home page not in use

export async function getPurchaseOrder(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { filterYear } = req.query;

    const sql = `
SELECT 
    A.FINYR,
    A.COMPCODE,
    SUM(A.VAL) AS VAL
FROM 
(
    SELECT A.FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PRICE AS VAL 
    FROM YARNPURREG A

    UNION ALL

    SELECT A.FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PRICE 
    FROM DYARNPURREG A

    UNION ALL

    SELECT A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PORATE 
    FROM GFABPOREG A

    UNION ALL

    SELECT A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PORATE 
    FROM DFABPOREG A

    UNION ALL

    SELECT A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY - A.CANQTY) * A.PORATE 
    FROM ACCPOREG A

) A
WHERE A.FINYR = '${filterYear}'
GROUP BY 
    A.FINYR,
    A.COMPCODE
HAVING 
    SUM(A.VAL) > 0
ORDER BY 
    A.FINYR,
    A.COMPCODE
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



// order against purchase year

export async function getPurchaseOrderYear(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
    SELECT A.FINYR,A.COMPCODE,SUM(A.VAL) VAL FROM 
(
SELECT 'GREY YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM YARNPURREG A
UNION ALL
SELECT 'DYED YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM DYARNPURREG A
UNION ALL
SELECT 'GREY FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM GFABPOREG  A
UNION ALL
SELECT 'DYED FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM DFABPOREG A
UNION ALL
SELECT 'ACCESSORY' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM ACCPOREG  A
) A
where A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}'
GROUP BY A.FINYR,A.COMPCODE
HAVING SUM(A.VAL) > 0
ORDER BY 2,3,1
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

// general purchase order year

export async function getPurchaseGeneralYear(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
  SELECT D.FINYR FINYEAR,C.COMPCODE,SUM(B.AMOUNT) VAL FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
where D.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'
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

// COMBINED DATA YEAR WISE WITH COMPANY PARAMS

export async function getPurchaseCombinedCOMPYear(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
  SELECT A.FINYR, A.COMPCODE, SUM(A.VAL) AS VAL
FROM (
   
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE AS VAL
    FROM YARNPURREG
    WHERE FINYR = '${finYear}' AND COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYR, COMPCODE, (POQTY - CANQTY) * PRICE
    FROM DYARNPURREG
    WHERE FINYR = '${finYear}' AND COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM GFABPOREG
    WHERE FINYEAR = '${finYear}' AND COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM DFABPOREG
    WHERE FINYEAR = '${finYear}' AND COMPCODE = '${companyName}'

    UNION ALL
    SELECT FINYEAR AS FINYR, COMPCODE, (POQTY - CANQTY) * PORATE
    FROM ACCPOREG
    WHERE FINYEAR = '${finYear}' AND COMPCODE = '${companyName}'

    
    UNION ALL
    SELECT D.FINYR, C.COMPCODE, B.AMOUNT
    FROM GTGENPO A
    JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
    JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
    JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
    WHERE D.FINYR = '${finYear}' AND C.COMPCODE = '${companyName}'

) A
GROUP BY A.FINYR, A.COMPCODE
HAVING SUM(A.VAL) > 0
ORDER BY A.FINYR, A.COMPCODE
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




// order against purchase month wise

export async function getPurchaseOrderMonthWise(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT A.FINYR, INITCAP(TRIM(A.Month)) AS Month_Name, A.COMPCODE,SUM(A.VAL) VAL,MNO,YNO FROM 
(
SELECT A.FINYR, TO_CHAR(DOCDATE,'MONTH') AS Month, TO_CHAR(DOCDATE,'MM') AS MNO, TO_CHAR(DOCDATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM YARNPURREG A
UNION ALL
SELECT A.FINYR, TO_CHAR(DOCDATE,'MONTH') AS Month, TO_CHAR(DOCDATE,'MM') AS MNO, TO_CHAR(DOCDATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM DYARNPURREG A
UNION ALL
SELECT A.FINYEAR, TO_CHAR(PODATE,'MONTH') AS Month, TO_CHAR(PODATE,'MM') AS MNO, TO_CHAR(PODATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM GFABPOREG  A
UNION ALL
SELECT A.FINYEAR, TO_CHAR(PODATE,'MONTH') AS Month, TO_CHAR(PODATE,'MM') AS MNO, TO_CHAR(PODATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM DFABPOREG A
UNION ALL
SELECT A.FINYEAR, TO_CHAR(ACCPODATE,'MONTH') AS Month, TO_CHAR(ACCPODATE,'MM') AS MNO, TO_CHAR(ACCPODATE,'YYYY') AS YNO, A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM ACCPOREG  A
) A
where A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}'
GROUP BY A.FINYR,A.COMPCODE,MONTH,MNO,YNO
HAVING SUM(A.VAL) > 0
ORDER BY 1,YNO,MNO
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finyear: po[0],
      month: po[1],
      company: po[2],
      value: po[3],
      monthNumber: po[4],
      yearNo: po[5],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}


// order against raw material wise

export async function getPurchaseOrderMaterial(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
SELECT A.TYPENAME,A.FINYR,A.COMPCODE,SUM(A.VAL) VAL FROM 
(
SELECT 'GREY YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM YARNPURREG A
UNION ALL
SELECT 'DYED YARN' TYPENAME,A.FINYR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PRICE VAL FROM DYARNPURREG A
UNION ALL
SELECT 'GREY FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM GFABPOREG  A
UNION ALL
SELECT 'DYED FABRIC' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM DFABPOREG A
UNION ALL
SELECT 'ACCESSORY' TYPENAME,A.FINYEAR,A.COMPCODE,(A.POQTY-A.CANQTY)*A.PORATE VAL FROM ACCPOREG  A
) A
where A.FINYR = '${finYear}' AND A.COMPCODE = '${companyName}' 
GROUP BY TYPENAME,A.FINYR,A.COMPCODE
HAVING SUM(A.VAL) > 0
ORDER BY 2,3,1
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      TYPENAME: po[0],
      FINYEAR: po[1],
      COMPCODE: po[2],
      VAL: po[3],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

// top ten supplier order against

export async function getTopTenSupplier(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { finYear, companyName } = req.query;

    const sql = `
WITH Combined AS (
    SELECT A.SUPPLIER, 'GREY YARN' AS TYPENAME, A.FINYR, A.COMPCODE, (A.POQTY-A.CANQTY)*A.PRICE AS VAL
    FROM YARNPURREG A
    WHERE (A.POQTY-A.CANQTY)*A.PRICE > 0

    UNION ALL

    SELECT A.SUPPLIER, 'DYED YARN' AS TYPENAME, A.FINYR, A.COMPCODE, (A.POQTY-A.CANQTY)*A.PRICE AS VAL
    FROM DYARNPURREG A
    WHERE (A.POQTY-A.CANQTY)*A.PRICE > 0

    UNION ALL

    SELECT A.SUPPLIER, 'GREY FABRIC' AS TYPENAME, A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY-A.CANQTY)*A.PORATE AS VAL
    FROM GFABPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0

    UNION ALL

    SELECT A.SUPPLIER, 'DYED FABRIC' AS TYPENAME, A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY-A.CANQTY)*A.PORATE AS VAL
    FROM DFABPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0

    UNION ALL

    SELECT A.SUPPLIER, 'ACCESSORY' AS TYPENAME, A.FINYEAR AS FINYR, A.COMPCODE, (A.POQTY-A.CANQTY)*A.PORATE AS VAL
    FROM ACCPOREG A
    WHERE (A.POQTY-A.CANQTY)*A.PORATE > 0
)
SELECT *
FROM (
    SELECT SUPPLIER, SUM(VAL) AS TOTAL_VAL
    FROM Combined
    where FINYR = '${finYear}' AND COMPCODE = '${companyName}' 
     GROUP BY SUPPLIER
    ORDER BY SUM(VAL) DESC
)
WHERE ROWNUM <= 10
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      supplierName: po[0],
      TOTAL_VAL: po[1],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
