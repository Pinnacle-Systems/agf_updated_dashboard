import { getConnection } from "../constants/db.connection.js";
import { IN_HAND } from "../constants/dbConstants.js";
import {
  getTopCustomers,
  getProfit,
  getEmployees,
  getNewCustomers,
  getLoss,
  getLoss1,
  getEmployees1,
  getProfit1,
  getLoss11,
  getLoss01,
} from "../queries/misDashboard.js";
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const d = new Date();
const monthName = month[d.getMonth()];
const yearName = d.getFullYear();

const lastMonthDate = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
const lastMonthName = month[lastMonthDate.getMonth()];
const lastMonthYear = lastMonthDate.getFullYear();

const currentDt = [monthName, yearName].join(" ");
const lstMnth = [lastMonthName, lastMonthYear].join(" ");

export async function get(req, res) {
  const connection = await getConnection(res);
  try {
    const { type, filterYear, filterBuyer, filterMonth, search, payCat } =
      req.query;

    const totalTurnOver = await getEmployees(
      connection,
      type,
      filterYear,
      filterBuyer,
      filterMonth
    );
    const totalTurnOver1 = await getEmployees1(
      connection,
      type,
      filterYear,
      filterBuyer,
      filterMonth
    );

    const profit = await getProfit(
      connection,
      type,
      filterYear,
      filterBuyer,
      filterMonth
    );
    const profit1 = await getProfit1(
      connection,
      type,
      filterYear,
      filterBuyer,
      filterMonth
    );

    const newCustomers = await getNewCustomers(
      connection,
      type,
      filterYear,
      filterBuyer,
      filterMonth
    );
    const topCustomers = await getTopCustomers(
      connection,
      type,
      filterYear,
      filterBuyer,
      filterMonth
    );

    const loss = await getLoss(connection, type, filterYear, filterMonth);
    const loss01 = await getLoss01(connection, type, filterYear, filterMonth);

    const loss1 = await getLoss1(connection, type, filterYear, filterMonth);
    const loss11 = await getLoss11(connection, type, filterYear, filterMonth);

    return res.json({
      statusCode: 0,
      data: {
        totalTurnOver,
        totalTurnOver1,
        profit,
        newCustomers,
        topCustomers,
        loss,
        loss1,
        profit1,
        loss11,
        loss01,
      },
    });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function executeProcedure(req, res) {
  const connection = await getConnection(res);
  try {
    await connection.execute(`BEGIN MISHR('aa'); END;`);

    res.json({ success: true, message: "Data refetch executed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
export async function getSalarydet(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];
  const filterBuyerList = filterBuyer
    .split(",")
    .map((buyer) => `'${buyer.trim()}'`)
    .join(",");

  let whereClause = `DD.COMPCODE IN (${filterBuyerList})`;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
  if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(DD.COMPCODE) = LOWER('%${search.COMPCODE}%')`;

  const sql = `
        SELECT * FROM (
SELECT
DD.IDCARD EMPID, DD.FNAME FNAME, DD.GENDER GENDER, DD.DOJ DOJ,
DD.DEPARTMENT, NVL(SUM(A.NETPAY), 0) AS NETPAY, DD.PAYCAT, DD.COMPCODE
FROM MISTABLE DD
JOIN HPAYROLL A ON A.EMPID = DD.IDCARD
AND A.PCTYPE = 'ACTUAL'
AND A.PAYPERIOD = '${lstMnth}'
JOIN HREMPLOYDETAILS BB ON A.EMPID = BB.IDCARD
JOIN HREMPLOYMAST AA ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
WHERE ${whereClause}
GROUP BY DD.IDCARD, DD.FNAME, DD.GENDER, DD.DOJ,
DD.DEPARTMENT, DD.PAYCAT, DD.COMPCODE
) A
ORDER BY A.EMPID`;


  const queryResult = await connection.execute(sql);

  result = queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );

  res.status(200).json({ success: true, data: result });
}
export async function getpfdet(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];
  const filterBuyerList = filterBuyer
    .split(",")
    .map((buyer) => `'${buyer.trim()}'`)
    .join(",");

  let whereClause = `DD.COMPCODE IN (${filterBuyerList}) AND A.PCTYPE = 'BUYER' and A.PAYPERIOD = '${lstMnth}' AND A.PF> 0
    `;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
  if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
      SELECT A.EMPID,AA.FNAME,AA.GENDER,BB.DOJ,DD.DEPARTMENT,A.PF AS NETPAY, DD.PAYCAT, DD.COMPCODE

FROM HPAYROLL A

JOIN HREMPLOYDETAILS BB ON A.EMPID = BB.IDCARD

JOIN HREMPLOYMAST AA ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID

JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND

JOIN MISTABLE  DD ON A.EMPID = DD.IDCARD

WHERE ${whereClause}
ORDER BY A.EMPID

 `;


  const queryResult = await connection.execute(sql);

  result = queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );

  res.status(200).json({ success: true, data: result });
}
export async function getesidet(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];
  const filterBuyerList = filterBuyer
    .split(",")
    .map((buyer) => `'${buyer.trim()}'`)
    .join(",");

  let whereClause = `DD.COMPCODE IN (${filterBuyerList}) AND A.PCTYPE = 'BUYER' AND A.PAYPERIOD = '${lstMnth}' AND A.ESI > 0
`;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
  if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
    SELECT A.EMPID,AA.FNAME,AA.GENDER,BB.DOJ,DD.DEPARTMENT,A.ESI AS NETPAY, DD.PAYCAT, DD.COMPCODE ,DD.PAYCAT     
FROM HPAYROLL A
JOIN HREMPLOYDETAILS BB ON A.EMPID = BB.IDCARD
JOIN HREMPLOYMAST AA ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
JOIN MISTABLE  DD ON A.EMPID = DD.IDCARD
WHERE ${whereClause}
ORDER BY A.EMPID`;


  const queryResult = await connection.execute(sql);

  result = queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );

  res.status(200).json({ success: true, data: result });
}
export async function getattdet(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];
  const filterBuyerList = filterBuyer
    .split(",")
    .map((buyer) => `'${buyer.trim()}'`)
    .join(",");

  let whereClause = `A.COMPCODE IN (${filterBuyerList}) 
                       AND B.PAYPERIOD = '${lstMnth}'`;

  if (search.FNAME)
    whereClause += ` AND LOWER(A.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(A.GENDER) = LOWER('${search.GENDER}')`;
  if (search.MIDCARD) whereClause += ` AND A.IDCARD LIKE '%${search.MIDCARD}%'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(A.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(A.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
    SELECT 
        A.IDCARD EMPID,
        A.PAYCAT,
        A.FNAME,
        A.GENDER,
        A.DOJ,
        A.DEPARTMENT,
        (SELECT LISTAGG(C.REMARKS, ',') WITHIN GROUP (ORDER BY C.REMARKS)
         FROM EMPDESGENTRY C 
         WHERE C.IDCARDNO = A.IDCARD 
         AND C.LWORKDAY = A.DOL) AS REASON,
        A.COMPCODE,
        A.DOL
    FROM MISTABLE A
    JOIN MONTHLYPAYFRQ B ON B.COMPCODE = A.COMPCODE 
        AND A.DOL BETWEEN B.STDT AND B.ENDT
    WHERE ${whereClause}
    ORDER BY A.COMPCODE, 1, 2, 3`;


  const queryResult = await connection.execute(sql);

  result = queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );

  res.status(200).json({ success: true, data: result });
}
export async function getattdetTable(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {}, filterYear} = req.query;
  let result = [];
 
  let whereClause = `C.IDCARDNO = A.IDCARD 
         AND C.LWORKDAY = A.DOL) AS REASON,
        A.COMPCODE,
        A.DOL
            FROM MISTABLE A
            JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE 
            AND B.FINYR = '${filterYear}' 
            AND A.COMPCODE IN '${filterBuyer}'
            AND A.DOL BETWEEN B.STDT AND B.ENDT`;

  if (search.FNAME)
    whereClause += ` AND LOWER(A.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(A.GENDER) = LOWER('${search.GENDER}')`;
  if (search.MIDCARD) whereClause += ` AND A.IDCARD LIKE '%${search.MIDCARD}%'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(A.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(A.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
   SELECT B.PAYPERIOD, B.STDT ,B.PAYPERIOD,
  A.IDCARD EMPID,
        A.PAYCAT,
        A.FNAME,
        A.GENDER,
        A.DOJ,
        A.DEPARTMENT,
        (SELECT LISTAGG(C.REMARKS, ',') WITHIN GROUP (ORDER BY C.REMARKS)
         FROM EMPDESGENTRY C 
    WHERE ${whereClause}
   `;


  const queryResult = await connection.execute(sql);

  result = queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );

  res.status(200).json({ success: true, data: result });
}
export async function getretdetTable(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {}, filterYear } = req.query;
  let result = [];

  // Initialize whereClause
  let whereClause = '';

  // Add filters dynamically
  if (search.FNAME)
    whereClause += ` AND LOWER(A.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(A.GENDER) = LOWER('${search.GENDER}')`;
  if (search.MIDCARD)
    whereClause += ` AND A.IDCARD LIKE '%${search.MIDCARD}%'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(A.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(A.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  // Build final SQL query
  const sql = `
    SELECT * FROM (
      SELECT
        A.IDCARD AS EMPID,
        A.PAYCAT,
        A.FNAME,
        A.GENDER,
        A.DOJ,
        A.DEPARTMENT,
        B.PAYPERIOD,
        B.STDT,
        A.COMPCODE
      FROM MISTABLE A
      JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE
      WHERE A.COMPCODE = '${filterBuyer}'
        AND B.FINYR = '${filterYear}'
        AND A.DOJ < B.STDT
        AND (A.DOL <= B.ENDT OR A.DOL IS NULL)
        AND NOT EXISTS (
          SELECT 'X' FROM (
            SELECT AA.IDCARD, AB.PAYPERIOD, AB.COMPCODE
            FROM MISTABLE AA
            JOIN MONTHLYPAYFRQ AB ON AA.COMPCODE = AB.COMPCODE AND AB.FINYR = '${filterYear}'
            WHERE AA.DOL BETWEEN AB.STDT AND AB.ENDT
          ) ZA
          WHERE ZA.IDCARD = A.IDCARD AND ZA.PAYPERIOD = B.PAYPERIOD AND A.COMPCODE = ZA.COMPCODE
        )

      UNION

      SELECT
        A.IDCARD AS EMPID,
        A.PAYCAT,
        A.FNAME,
        A.GENDER,
        A.DOJ,
        A.DEPARTMENT,
        B.PAYPERIOD,
        B.STDT,
        A.COMPCODE
      FROM MISTABLE A
      JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE AND B.FINYR = '${filterYear}'
      WHERE A.COMPCODE = '${filterBuyer}'
        AND EXISTS (
          SELECT 'X' FROM (
            SELECT AA.IDCARD, AB.PAYPERIOD, AB.COMPCODE
            FROM MISTABLE AA
            JOIN MONTHLYPAYFRQ AB ON AA.COMPCODE = AB.COMPCODE AND AB.FINYR = '${filterYear}'
            WHERE AA.DOJ BETWEEN AB.STDT AND AB.ENDT
          ) ZA
          WHERE ZA.IDCARD = A.IDCARD AND ZA.PAYPERIOD = B.PAYPERIOD AND A.COMPCODE = ZA.COMPCODE
        )
        AND NOT EXISTS (
          SELECT 'X' FROM (
            SELECT AA.IDCARD, AB.PAYPERIOD, AB.COMPCODE
            FROM MISTABLE AA
            JOIN MONTHLYPAYFRQ AB ON AA.COMPCODE = AB.COMPCODE AND AB.FINYR = '${filterYear}'
            WHERE AA.DOL BETWEEN AB.STDT AND AB.ENDT
          ) ZA
          WHERE ZA.IDCARD = A.IDCARD AND ZA.PAYPERIOD = B.PAYPERIOD AND A.COMPCODE = ZA.COMPCODE
        )
    ) A
    WHERE 1=1 ${whereClause}
    ORDER BY EMPID, STDT
  `;


  try {
    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error executing SQL:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
export async function getagedet(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];
  let whereClause = `AA.COMPCODE IN ('${filterBuyer}')
  AND AA.DOB <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) AND (AA.DOL IS NULL OR AA.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) )`;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) = LOWER('${search.GENDER}')`;
  if (search.MIDCARD)
    whereClause += ` AND AA.IDCARD LIKE '%${search.MIDCARD}%'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(AA.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(AA.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
    SELECT AA.IDCARD AS EMPID,AA.FNAME,AA.PAYCAT,MONTHS_BETWEEN(TRUNC(SYSDATE),AA.DOB)/12 AS AGEMON,
AA.COMPCODE,AA.DEPARTMENT,AA.GENDER FROM MISTABLE AA
JOIN HREMPLOYMAST BB ON AA.IDCARD = BB.IDCARDNO
JOIN HREMPLOYDETAILS CC ON BB.HREMPLOYMASTID = CC.HREMPLOYMASTID
WHERE ${whereClause}
    `;


  try {
    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
export async function getexpdet(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];

  let whereClause = `AA.COMPCODE IN ('${filterBuyer}')
AND AA.DOJ <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) AND (AA.DOL IS NULL OR AA.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) ) ORDER BY EXPMON ASC `;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) = LOWER('${search.GENDER}')`;
  if (search.MIDCARD)
    whereClause += ` AND AA.IDCARD LIKE '%${search.MIDCARD}%'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(AA.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(AA.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
        SELECT AA.IDCARD AS EMPID,AA.FNAME,AA.PAYCAT,
MONTHS_BETWEEN(TRUNC(SYSDATE),AA.DOJ)/12 AS EXPMON,
AA.COMPCODE,
AA.DEPARTMENT,
AA.GENDER
FROM MISTABLE AA
JOIN HREMPLOYMAST BB ON AA.IDCARD = BB.IDCARDNO
JOIN HREMPLOYDETAILS CC ON BB.HREMPLOYMASTID = CC.HREMPLOYMASTID
WHERE 
${whereClause}
    `;


  try {
    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
export async function getbgdet(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];

  let whereClause = `AA.COMPCODE IN ('${filterBuyer}')
AND AA.BGF IS NOT NULL AND AA.DOJ <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) AND (AA.DOL IS NULL OR AA.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) )
ORDER BY 2 DESC,1`;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) = LOWER('${search.GENDER}')`;
  if (search.MIDCARD)
    whereClause += ` AND AA.IDCARD LIKE '%${search.MIDCARD}%'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(AA.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(AA.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
   SELECT AA.IDCARD AS EMPID,AA.FNAME,AA.PAYCAT,AA.COMPCODE,AA.DEPARTMENT,AA.GENDER,CC.BGF AS BLOODGROUP
FROM MISTABLE AA
JOIN HREMPLOYMAST bb on AA.IDCARD = BB.IDCARDNO
JOIN HRBGMAST CC ON BB.BG = CC.HRBGMASTID
WHERE  ${whereClause}
    `;


  try {
    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
 export async function getPfDataDet(req,res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {}, selectedYear } = req.query;
  let result = [];
  let whereClause = `DD.COMPCODE IN ('${filterBuyer}') AND A.PCTYPE = 'BUYER' and EE.FINYR  = '${selectedYear}' AND A.PF> 0
    `;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
  if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
      SELECT A.EMPID,AA.FNAME,AA.GENDER,BB.DOJ,DD.DEPARTMENT,A.PF AS NETPAY, DD.PAYCAT, DD.COMPCODE,A.PAYPERIOD,TO_CHAR(EE.STDT,'MM') DAY,TO_CHAR(EE.STDT,'YYYY') YEAR
FROM HPAYROLL A
JOIN HREMPLOYDETAILS BB ON A.EMPID = BB.IDCARD
JOIN HREMPLOYMAST AA ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
JOIN MISTABLE  DD ON A.EMPID = DD.IDCARD
JOIN MONTHLYPAYFRQ EE ON EE.PAYPERIOD = A.PAYPERIOD AND EE.COMPCODE = A.COMPCODE

WHERE ${whereClause}
ORDER BY A.EMPID,YEAR,DAY
 `;


  const queryResult = await connection.execute(sql);

  result = queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );

  res.status(200).json({ success: true, data: result });
}
export async function getEsiDataDet(req,res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {}, selectedYear } = req.query;
  let result = [];
  let whereClause = `DD.COMPCODE IN ('${filterBuyer}') AND A.PCTYPE = 'BUYER' and EE.FINYR  = '${selectedYear}' AND A.ESI> 0
    `;

  if (search.FNAME)
    whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
  if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
      SELECT A.EMPID,AA.FNAME,AA.GENDER,BB.DOJ,DD.DEPARTMENT,A.ESI AS NETPAY, DD.PAYCAT, DD.COMPCODE,A.PAYPERIOD,TO_CHAR(EE.STDT,'MM') DAY,TO_CHAR(EE.STDT,'YYYY') YEAR
FROM HPAYROLL A
JOIN HREMPLOYDETAILS BB ON A.EMPID = BB.IDCARD
JOIN HREMPLOYMAST AA ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
JOIN MISTABLE  DD ON A.EMPID = DD.IDCARD
JOIN MONTHLYPAYFRQ EE ON EE.PAYPERIOD = A.PAYPERIOD AND EE.COMPCODE = A.COMPCODE

WHERE ${whereClause}
ORDER BY A.EMPID,YEAR,DAY
 `;


  const queryResult = await connection.execute(sql);

  result = queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );

  res.status(200).json({ success: true, data: result });
}
export async function getEmployeesDetail(req, res) {
  const connection = await getConnection(res);
  const { filterBuyer, search = {} } = req.query;
  let result = [];
  let totalCount = 0;

  const filterBuyerList = filterBuyer
    .split(",")
    .map((buyer) => `'${buyer.trim()}'`)
    .join(",");

  let whereClause = `
          AA.PAYPERIOD = '${currentDt}'
            )
            AND (A.DOL IS NULL OR A.DOL <= (
                SELECT MIN(AA.ENDT)
                FROM MONTHLYPAYFRQ AA
                WHERE AA.PAYPERIOD = '${currentDt}'
            ))
        `;

  if (search.FNAME)
    whereClause += ` AND LOWER(A.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(A.GENDER) LIKE LOWER('${search.GENDER}%')`;
  if (search.MIDCARD) whereClause += ` AND A.MIDCARD LIKE '${search.MIDCARD}'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(A.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(A.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
           SELECT FNAME, GENDER, MIDCARD, DEPARTMENT, COMPCODE, PAYCAT
            FROM MISTABLE A
            WHERE
            A.COMPCODE IN  (${filterBuyerList}) 
            AND A.DOJ <= (
                SELECT MIN(AA.ENDT)
                FROM MONTHLYPAYFRQ AA
                WHERE 
       ${whereClause} ORDER BY TO_NUMBER(A.MIDCARD) ASC
        `;
  const countSql = `
            SELECT COUNT(*) AS TOTAL_COUNT
            FROM MISTABLE A  
            WHERE ${whereClause}
        `;



  try {
    const queryResult = await connection.execute(sql);
    result = queryResult.rows.map((row) => {
      return queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {});
    });
    const countResult = await connection.execute(countSql);
    totalCount = countResult.rows[0][0];
  } catch (error) {
    console.error("Error executing query:", error);
  }

  return res.status(200).json({ success: true, data: result });
}
export async function getEmployeesDetail1(req, res) {
  const connection = await getConnection(res);
  const { search = {} } = req.query;
  let result = [];
  let whereClause = `
            A.DOJ <= (
                SELECT MIN(AA.ENDT)
                FROM MONTHLYPAYFRQ AA
                WHERE AA.PAYPERIOD = '${currentDt}'
            )
            AND (A.DOL IS NULL OR A.DOL <= (
                SELECT MIN(AA.ENDT)
                FROM MONTHLYPAYFRQ AA
                WHERE AA.PAYPERIOD = '${currentDt}'
            ))
        `;

  if (search.FNAME)
    whereClause += ` AND LOWER(A.FNAME) LIKE LOWER('%${search.FNAME}%')`;
  if (search.GENDER)
    whereClause += ` AND LOWER(A.GENDER) LIKE LOWER('${search.GENDER}%')`;
  if (search.MIDCARD) whereClause += ` AND A.MIDCARD LIKE '${search.MIDCARD}'`;
  if (search.DEPARTMENT)
    whereClause += ` AND LOWER(A.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
  if (search.COMPCODE)
    whereClause += ` AND LOWER(A.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

  const sql = `
           SELECT FNAME, GENDER, MIDCARD, DEPARTMENT, COMPCODE, PAYCAT
            FROM MISTABLE A
            WHERE
         ${whereClause}  ORDER BY TO_NUMBER(A.MIDCARD) ASC
        `;
  const countSql = `
            SELECT COUNT(*) AS TOTAL_COUNT
            FROM MISTABLE A  
            WHERE ${whereClause}
        `;



  try {
    const queryResult = await connection.execute(sql);
    result = queryResult.rows.map((row) => {
      return queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {});
    });
    const countResult = await connection.execute(countSql);
    totalCount = countResult.rows[0][0];
  } catch (error) {
    console.error("Error executing query:", error);
  }

  return res.status(200).json({ success: true, data: result });
}
export async function getOrdersInHand(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterYear, filterBuyer } = req.query;

    const sql = ` 
SELECT X.SLAP,COUNT(X.SLAP) VAL FROM (
SELECT CASE WHEN X.AGE BETWEEN 18 AND 25 THEN '18 - 25'
WHEN X.AGE BETWEEN 25 AND 35 THEN '25 - 35'
WHEN X.AGE BETWEEN 35 AND 45 THEN '35 - 45'
WHEN X.AGE BETWEEN 45 AND 65 THEN '45 - 60'
WHEN X.AGE > 60 THEN '60 Above'  END SLAP FROM (
SELECT MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOB)/12 AGE FROM MISTABLE A WHERE A.COMPCODE = '${filterBuyer}'
AND A.DOJ <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT
) )
) X
) X
WHERE X.SLAP IS NOT NULL
GROUP BY X.SLAP
ORDER BY 1
`;
    let result = await connection.execute(sql);
    result = result.rows.map((row) => ({
      buyer: row[0],
      value: row[1],
      female: row[2],
      total: row[3],
    }));
    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getOrdersInHandMonthWise(req, res) {
  const connection = await getConnection(res);
  try {
    const monthArr = `
        SELECT B.PAYPERIOD,B.STDT,A.COMPCODE,COUNT(*) ATTRITION FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE 
AND B.FINYR = :FINYEAR AND A.COMPCODE IN '${filterBuyer}'
AND A.DOL BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD,B.STDT,A.COMPCODE
ORDER BY 2
        `;

    let result = await connection.execute(monthArr);
    result = result.rows.map((row) => ({
      date: row[0],
      planned: row[3],
      actual: row[4],
    }));
    return res.json({
      statusCode: 0,
      data: result,
      sql,
    });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getActualVsBudgetValueMonthWise(req, res) {
  const connection = await getConnection(res);
  try {
    const monthArr = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(
      (i) =>
        `
            select 
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'Mon-YYYY') as monthYear ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'MM') as monthOnly ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'YYYY') as yearOnly ,
            (
                select round(COALESCE(sum(PLANSALESVAL),0)) from MISORDSALESVAL
            where extract(YEAR from BPODATE) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from BPODATE) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS PLANNED,
            (
                select round(COALESCE(sum(ACTSALVAL),0)) from MISORDSALESVAL
            where extract(YEAR from BPODATE) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from BPODATE) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS ACTUAL
            FROM DUAL
        `
    );
    const sql = monthArr.join("union");
    let result = await connection.execute(
      `select * from (${sql}) order by yearOnly,monthOnly`
    );
    result = result.rows.map((row) => ({
      date: row[0],
      planned: row[3],
      actual: row[4],
    }));
    return res.json({
      statusCode: 0,
      data: result,
      sql,
    });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getYearlyComp(req, res) {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date();
  const monthName = month[d.getMonth()];
  const yearName = d.getFullYear();
  const lastmonth = month[d.getMonth() - 1];
  const currentDt = [monthName, yearName].join(" ");
  const lstMnth = [lastmonth, yearName].join(" ");
  const connection = await getConnection(res);
  try {
    const {} = req.query;

    const sql = `
           SELECT A.COMPCODE,SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL FROM (
SELECT A.COMPCODE,CASE WHEN A.GENDER = 'MALE' THEN 1 ELSE 0 END MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN 1 ELSE 0 END FEMALE FROM MISTABLE A WHERE  A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}'
) )
) A
GROUP BY A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows.map((po) => ({
      customer: po[0],
      male: po[1],
      female: po[2],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getBuyerWiseRevenue(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterYear, filterSupplier } = req.query;
    const supplierArray = filterSupplier.split(",");
    const sepComName = supplierArray.join("");
    const supplierList = supplierArray
      .map((supplier) => `'${supplier}'`)
      .join(",");
    const sql = `
         SELECT A.PAYPERIOD,A.STDT,ROUND(A.CLOSING/A.OPENING*100,2) RETENTIONPER,A.CLOSING,A.OPENING FROM (
SELECT A.PAYPERIOD,A.STDT,SUM(A.OPENING) OPENING,SUM(A.ATTRITION) ATTRITION,SUM(A.OPENING) - SUM(A.ATTRITION) + SUM(A.JOINERS) CLOSING FROM (
SELECT B.PAYPERIOD,B.STDT,0 OPENING,COUNT(*) ATTRITION,0 JOINERS FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE
AND B.FINYR ='${filterYear}' AND A.COMPCODE IN '${filterSupplier}'
AND A.DOL BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD,B.STDT,A.COMPCODE
UNION ALL
SELECT B.PAYPERIOD,B.STDT,0 OPENING,0 ATTRITION,COUNT(*) JOINERS FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE
AND B.FINYR ='${filterYear}' AND A.COMPCODE  IN '${filterSupplier}'
AND A.DOJ BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD,B.STDT,A.COMPCODE
UNION ALL
SELECT B.PAYPERIOD,B.STDT,COUNT(*) OPENING,0 ATTRITION,0 JOINERS FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE
AND B.FINYR ='${filterYear}' AND A.COMPCODE  IN '${filterSupplier}'
AND A.DOJ < B.STDT
GROUP BY B.PAYPERIOD,B.STDT
) A
GROUP BY A.PAYPERIOD,A.STDT
) A
ORDER BY 2
     `;

    const result = await connection.execute(sql);
    let resp = result.rows.map((po) => ({
      payPeriod: po[0],
      stdt: po[1],
      retention: po[2],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getActualVsBudget(req, res) {
  const connection = await getConnection(res);
  try {
    const {
      filterMonth,
      filterSupplier,
      filterYear,
      filterAll = "Detailed",
    } = req.query;

    let sql = "";

    if (filterAll === "Detailed") {
      sql = `
              SELECT A.COMPCODE,SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL FROM (
SELECT A.COMPCODE,CASE WHEN A.GENDER = 'MALE' THEN 1 ELSE 0 END MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN 1 ELSE 0 END FEMALE FROM MISTABLE A WHERE A.COMPCODE = '${filterBuyer}'
AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) )
) A
GROUP BY A.COMPCODE`;
    } else {
      sql = `
                SELECT A.FINYR,ORDERNO,A.BUYERCODE,A.TYPENAME,A.YARNCOST,A.FABRICCOST,A.ACCCOST,A.CMTCOST,
                A.OTHERCOST,A.SALECOST,A.ACTPROFIT,A.ACTPROFITPER,A.ORD,A.MON,A.FINYR||A.MON GRP 
                FROM MISORDBUDACTCDETAILS A 
                WHERE A.TYPENAME <> 'Detailed1' AND A.BUYERCODE = :filterSupplier  
                AND A.Mon = :filterMonth AND A.finYr = :filterYear 
                ORDER BY BUYERCODE,ORDERNO,ORD`;
    }

    const result = await connection.execute(sql);
    let resp = result.rows.map((po) => ({
      finYr: po[0],
      orderNo: po[1],
      buyerCode: po[2],
      typeName: po[3],
      yarnCost: po[4],
      fabricCost: po[5],
      accCost: po[6],
      cmtCost: po[7],
      otherCost: po[8],
      saleCost: po[9],
      actProfit: po[10],
      actProfitPer: po[11],
      ord: po[12],
      mon: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getShortShipmentRatio(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterCat, filterBuyer } = req.query;
    let sql;
    if (filterCat === "Birthday") {
      sql = `
     SELECT A.COMPCODE,A.IDCARD,A.FNAME,A.GENDER,A.DOB,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOB)/12) AGE,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOJ)/12) EXP ,A.DOJ,A.MIDCARD FROM MISTABLE A 
WHERE TO_CHAR(SYSDATE, 'WW') = TO_CHAR(A.DOB, 'WW') 
 ${filterBuyer ? `AND A.COMPCODE = '${filterBuyer}'` : ""}
AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) )
ORDER BY TO_CHAR(A.DOB, 'MM-DD')

 `;
    } else {
      sql = `SELECT A.COMPCODE,A.IDCARD,A.FNAME,A.GENDER,A.DOB,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOB)/12) AGE,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOJ)/12) EXP ,A.DOJ,A.MIDCARD FROM MISTABLE A 
WHERE TO_CHAR(SYSDATE, 'WW') = TO_CHAR(A.DOJ, 'WW') 
 ${filterBuyer ? `AND A.COMPCODE = '${filterBuyer}'` : ""}
AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) )
ORDER BY TO_CHAR(A.DOB, 'MM-DD')
`;
    }

    const result = await connection.execute(sql);
    let resp = result.rows.map((po) => ({
      customer: po[0],
      idCard: po[1],
      name: po[2],
      gender: po[3],
      dob: po[4],
      age: po[5],
      exp: po[6],
      doj: po[7],
      mid: po[8]
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getESIPF(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterCat, filterSupplier, filterYear } = req.query;
    let sql;

    sql = `
SELECT
A.COMPCODE,
A.PAYPERIOD,
A.FINYR,
 SUM(A.ESI) AS ESI,
SUM(A.PF) AS PF,
COUNT(A.EMPID) AS HEADCOUNT,A.STDT,A.STDT1
FROM
(SELECT
A.COMPCODE,
A.PAYPERIOD,
EE.FINYR,
A.ESI,
A.PF AS PF,
A.EMPID,TO_CHAR(EE.STDT,'MM') STDT,TO_CHAR(EE.STDT,'YY') STDT1
FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
JOIN MONTHLYPAYFRQ EE ON EE.PAYPERIOD = A.PAYPERIOD AND EE.COMPCODE = A.COMPCODE
WHERE EE.FINYR = '${filterYear}'
AND A.COMPCODE = '${filterSupplier}' AND A.PCTYPE = 'BUYER' AND A.PF>0
) A
GROUP BY A.COMPCODE, A.FINYR, A.PAYPERIOD, A.STDT,A.STDT1
HAVING SUM(A.PF) > 0
ORDER BY STDT1,STDT

 
`;

    const result = await connection.execute(sql);
    let resp = result.rows.map((po) => ({
      customer: po[0],
      month: po[1],
      Year: po[2],
      esi: po[3],
      pf: po[4],
      headCount: po[5],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getESIPF1(req, res) {
  const connection = await getConnection(res);
  try {
    const { filterCat, filterSupplier, filterYear } = req.query;
    let sql;

    sql = `
SELECT
A.COMPCODE,
A.PAYPERIOD,
A.FINYR,
 SUM(A.ESI) AS ESI,
COUNT(A.EMPID) AS HEADCOUNT,A.STDT,A.STDT1
FROM
(SELECT
A.COMPCODE,
A.PAYPERIOD,
EE.FINYR,
A.ESI,
A.EMPID,TO_CHAR(EE.STDT,'MM') STDT,TO_CHAR(EE.STDT,'YY') STDT1
FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
JOIN MONTHLYPAYFRQ EE ON EE.PAYPERIOD = A.PAYPERIOD AND EE.COMPCODE = A.COMPCODE
WHERE EE.FINYR = '${filterYear}'
AND A.COMPCODE = '${filterSupplier}' AND A.PCTYPE = 'BUYER' AND A.ESI > 0
) A
GROUP BY A.COMPCODE, A.FINYR, A.PAYPERIOD, A.STDT,A.STDT1
ORDER BY STDT1,STDT

 
`;

    const result = await connection.execute(sql);
    let resp = result.rows.map((po) => ({
      customer: po[0],
      month: po[1],
      Year: po[2],
      esi: po[3],
     headCount: po[4],
    }));
    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getLeaveAvailable(req,res) {
   const connection = await getConnection(res);
  try {
     const { compCode, filterYear } = req.query;
     console.log(compCode,filterYear,"leave Available params")
    const sql = `
  SELECT IDCARD,MIDCARD,FNAME,PAYCAT,LCODE,LDESC,SUM(LCOUNT) AVL,SUM(LT) LT,SUM(LCOUNT)-SUM(LT) LBAL 
FROM (SELECT A.FINYEAR FINYR,A.LCODE, A.LDESC,D.IDCARD,D.MIDCARD,DD.FNAME,B.LDAYS AVL,0 LT,B.LDAYS LCOUNT,C.BANDID PAYCAT FROM HRLEAVEMAST A
JOIN HRLEAVEDEPTDET B ON A.HRLEAVEMASTID = B.HRLEAVEMASTID
JOIN HRBANDMAST C ON C.HRBANDMASTID = A.PAYCAT
JOIN HREMPLOYDETAILS D ON D.IDACTIVE = 'YES' AND D.DOJ < A.STDT
JOIN HREMPLOYMAST DD ON D.HREMPLOYMASTID = DD.HREMPLOYMASTID  
JOIN HRBANDMAST E ON D.BAND = E.HRBANDMASTID AND E.BANDID = C.BANDID  
JOIN GTDEPTDESGMAST F ON F.GTDEPTDESGMASTID = D.DEPTNAME AND ( F.MNAME = B.DEPT OR 'All' = B.DEPT) AND DD.COMPCODE = F.COMPCODE
JOIN GTCOMPMAST G ON G.GTCOMPMASTID = F.COMPCODE AND B.COMPCODE1 = G.COMPCODE  
WHERE A.FINYEAR ='${filterYear}' AND B.COMPCODE1 = '${compCode}'
UNION ALL
SELECT A.FINYEAR FINYR,B.LCODE,B.LDESC,D.IDCARD,D.MIDCARD,C.FNAME, CASE WHEN A.LTYPE IN 'OPB' THEN A.OPBAL ELSE 0 END AVL,
CASE WHEN A.LTYPE NOT IN 'OPB' THEN CASE WHEN A.LTYPE NOT IN 'LRQ' THEN (0-A.OPBAL) ELSE A.OPBAL END ELSE 0 END LT,
 CASE WHEN A.LTYPE IN 'OPB' THEN A.OPBAL ELSE 0 END  LCOUNT,A.PAYCAT
FROM HRLEAVEREGMAST A,HRLEAVECODEMAST B,HREMPLOYMAST C,HREMPLOYDETAILS D
WHERE A.LEAVETYPE=B.LCODE AND C.HREMPLOYMASTID=D.HREMPLOYMASTID AND A.IDCARD=C.HREMPLOYMASTID
AND A.FINYEAR= '${filterYear}' AND A.COMPCODE ='${compCode}' AND D.IDACTIVE = 'YES'
UNION ALL
SELECT A.FINYEAR FINYR,A.LCODE, A.LDESC,D.IDCARD,D.MIDCARD,DD.FNAME,
((12-TO_NUMBER(TO_CHAR(ADD_MONTHS((LAST_DAY(TO_DATE(D.DOJ))+1),-1),'mm')))*B.FRM1)+
CASE WHEN TO_NUMBER(TO_CHAR(D.DOJ,'dd'))<16 THEN B.FRM1 ELSE B.FRM2 END  AVL,0 LT,
((12-TO_NUMBER(TO_CHAR(ADD_MONTHS((LAST_DAY(TO_DATE(D.DOJ))+1),-1),'mm')))*B.FRM1)+
CASE WHEN TO_NUMBER(TO_CHAR(D.DOJ,'dd'))<16 THEN B.FRM1 ELSE B.FRM2 END LCOUNT,C.BANDID PAYCAT FROM HRLEAVEMAST A
JOIN HRLEAVEDEPTDET B ON A.HRLEAVEMASTID = B.HRLEAVEMASTID
JOIN HRBANDMAST C ON C.HRBANDMASTID = A.PAYCAT
JOIN HREMPLOYDETAILS D ON D.IDACTIVE = 'YES' AND D.DOJ BETWEEN A.STDT AND A.ENDT
JOIN HREMPLOYMAST DD ON D.HREMPLOYMASTID = DD.HREMPLOYMASTID AND D.BAND = A.PAYCAT   
JOIN GTDEPTDESGMAST F ON F.GTDEPTDESGMASTID = D.DEPTNAME AND ( F.MNAME = B.DEPT OR 'All' = B.DEPT)
JOIN GTCOMPMAST G ON G.GTCOMPMASTID = A.COMPCODE AND B.COMPCODE1 = G.COMPCODE 
WHERE A.FINYEAR ='${filterYear}' AND B.COMPCODE1 = '${compCode}' AND B.FRM1 > 0
)
GROUP BY LCODE,LDESC,IDCARD,MIDCARD,FNAME,PAYCAT
ORDER BY TO_NUMBER(IDCARD),LCODE
    `;
 

   const result = await connection.execute(sql);
       let resp = result.rows.map((po) => ({
      id: po[0],
      mid: po[1],
      fname: po[2],
      paycat: po[3],
     lcode: po[4],
     ldesc: po[5],
     Avl: po[6],
     lt: po[7],
     lbal: po[8]
    }));
     return res.json({ statusCode: 0, data: resp });

  } catch (err) {
    console.error("Error fetching leave availability:", err);
    throw err;
  }
  finally {
    await connection.close();
  }
}
export async function getlongAbsent(req,res) {
   const connection = await getConnection(res);
  try {
     const { compCode, docdate,docdate1,payCat } = req.query;
        console.log(compCode,docdate,docdate1,payCat,"long Adsent")

    const sql = `
  SELECT DENSE_RANK() OVER (ORDER BY TO_NUMBER(C.IDCARD)) SNO,E.COMPCODE COMPCODE1,
D.BANDID,G.MNNAME1 DEPARTMENT,H.DESIGNATION,
TO_NUMBER(C.IDCARD) IDCARD,C.MIDCARD MIDCARD,B.FNAME EMPNAME,C.DOJ,
(
SELECT Z.CONTACTNO FROM HRECONTACTDETAILS Z WHERE Z.HREMPLOYMASTID = B.HREMPLOYMASTID ) CONNO,
(SELECT MAX(Z.ATTDATE) DATEE FROM ( SELECT DISTINCT AA.IDCARD,AA.ATTDATE FROM 
AGFATT AA WHERE AA.ATTDATE <= TO_DATE('${docdate}','DD/MM/YYYY') ) Z WHERE Z.IDCARD = C.IDCARD AND Z.ATTDATE <= TO_DATE('${docdate}','DD/MM/YYYY')  ) LWDA 
FROM HREMPLOYMAST B,HREMPLOYDETAILS C,HRBANDMAST D,GTCOMPMAST E,GTDEPTDESGMAST G,GTDESIGNATIONMAST  H
WHERE B.HREMPLOYMASTID = C.HREMPLOYMASTID AND C.BAND = D.HRBANDMASTID AND B.COMPCODE = E.GTCOMPMASTID 
AND C.IDACTIVE = 'YES' AND C.DEPTNAME = G.GTDEPTDESGMASTID 
AND H.GTDESIGNATIONMASTID = C.DESIGNATION AND E.COMPCODE = '${compCode}'
AND ( D.BANDID =' ${payCat}' OR 'ALL' = '${payCat}' ) 
AND C.DOJ <= TO_DATE('${docdate1}','DD/MM/YYYY')  
AND C.IDCARD NOT IN
(
SELECT DISTINCT AA.IDCARD FROM (
SELECT DISTINCT A.IDCARD,B.FNAME,A.ATTDATE 
FROM AGFATT A,HREMPLOYMAST B,HREMPLOYDETAILS C,HRBANDMAST D,GTDEPTDESGMAST E,GTDESIGNATIONMAST F
WHERE A.HREMPLOYMASTID = B.HREMPLOYMASTID AND C.HREMPLOYMASTID = B.HREMPLOYMASTID AND C.PAYCAT = D.HRBANDMASTID
AND C.DEPTNAME = E.GTDEPTDESGMASTID AND F.GTDESIGNATIONMASTID = C.DESIGNATION  
AND A.COMPCODE = '${compCode}' AND A.ATTDATE BETWEEN TO_DATE('${docdate}','DD/MM/YYYY')  AND TO_DATE('${docdate1}','DD/MM/YYYY') 
AND A.PMNO IN ( SELECT B.MACNO FROM HRMACIPENTRY A JOIN HRMACIPENTRYDET B ON A.HRMACIPENTRYID = B.HRMACIPENTRYID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE AND C.COMPCODE = '${compCode}' AND B.MTYPE IN ('IN','IN/OUT'))
) AA
UNION 
SELECT BB.IDCARDNO IDCARD 
FROM HRONDUTY AAA, HRONDUTYDET AA,HREMPLOYMAST BB,GTCOMPMAST C
WHERE AAA.HRONDUTYID=AA.HRONDUTYID AND C.GTCOMPMASTID = AAA.COMPCODE AND C.COMPCODE = '${compCode}'
AND AA.ODATE BETWEEN TO_DATE('${docdate}','DD/MM/YYYY')  AND TO_DATE('${docdate1}','DD/MM/YYYY') 
UNION
SELECT A.IDCARD FROM ( 
SELECT A.IDCARD,SUM(A.STKOPBAL) STOCK,A.LRDATE  
FROM HRLEAVEREGMAST A WHERE A.LRDATE BETWEEN TO_DATE('${docdate}','DD/MM/YYYY')  AND TO_DATE('${docdate1}','DD/MM/YYYY')  AND A.COMPCODE = '${compCode}'
GROUP BY A.IDCARD,A.LRDATE) A
)
ORDER BY 1

    `;
     console.log(sql,"long Absent sql")
 

   const result = await connection.execute(sql);
       let resp = result.rows.map((po) => ({
      sno: po[0],
      company: po[1],
      fname: po[2],
      department: po[3],
     designation: po[4],
     idCard: po[5],
     midCard: po[6],
     empName: po[7],
     doj: po[8],
     contactNumber: po[9],
     lwda: po[10]

    }));
   console.log(result.rows,"leave availble result")
     return res.json({ statusCode: 0, data: resp });

  } catch (err) {
    console.error("Error fetching leave availability:", err);
    throw err;
  }
  finally {
    await connection.close();
  }
}