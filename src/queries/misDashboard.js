import { currentDate } from "../Helpers/helper.js";
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
const monthName = month[d.getMonth()];
const yearName = d.getFullYear();

const lastMonthDate = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
const lastMonthName = month[lastMonthDate.getMonth()];
const lastMonthYear = lastMonthDate.getFullYear();

const currentDt = [monthName, yearName].join(' ');
const lstMnth = [lastMonthName, lastMonthYear].join(' ');



export async function getEmployees(connection, type = 'Value', filterYear, filterBuyer, lstMnth) {
    let result = ''
    if (type === "Value") {
        const sql = `SELECT  
    SUM(MALE) AS MALE,
    SUM(FEMALE) AS FEMALE,
    SUM(MALE) + SUM(FEMALE) AS TOTAL,
    COMPCODE
FROM (
    SELECT 
        CASE WHEN A.GENDER = 'MALE' THEN 1 ELSE 0 END AS MALE,
        CASE WHEN A.GENDER = 'FEMALE' THEN 1 ELSE 0 END AS FEMALE,
        A.COMPCODE
    FROM MISTABLE A  
    WHERE 
        1=1 
        AND A.PAYCAT = 'STAFF' 
        AND A.DOJ <= (
            SELECT MIN(AA.STDT) 
            FROM MONTHLYPAYFRQ AA 
            WHERE AA.PAYPERIOD =  '${currentDt}'
        ) 
        AND (A.DOL IS NULL OR A.DOL <= (
            SELECT MIN(AA.ENDT) 
            FROM MONTHLYPAYFRQ AA 
           WHERE AA.PAYPERIOD =  '${currentDt}'
        ))
) A 
GROUP BY COMPCODE
 `
  console.log(sql,"sql for Employee total")
        result = await connection.execute(sql)
    }

    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]
    }))
    return result
}

export async function getSalarydet(connection, type = "Value", search = {}, filterBuyer) {
    console.log(search,"searchSalaryDet")
    let result = [];
    const filterBuyerList = filterBuyer.split(',').map(buyer => `'${buyer.trim()}'`).join(',');
  
    if (type === "Value") {
       
      if (search.FNAME) whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
      if (search.GENDER) whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
      if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
      if (search.DEPARTMENT) whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
      if (search.COMPCODE) whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;
  
      const sql = `
        SELECT * FROM (
SELECT
DD.IDCARD EMPID,DD.FNAME FNAME,DD.GENDER GENDER,DD.DOJ DOJ,DD.DEPARTMENT,NVL(SUM(A.NETPAY), 0) AS NETPAY,DD.PAYCAT,DD.COMPCODE
FROM MISTABLE DD
LEFT JOIN HPAYROLL A ON A.EMPID = DD.IDCARD AND A.PCTYPE = 'ACTUAL' AND A.PAYPERIOD = '${lstMnth}'
LEFT JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
LEFT JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
LEFT JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
GROUP BY DD.IDCARD,DD.FNAME,DD.GENDER,DD.DOJ,DD.DEPARTMENT,DD.PAYCAT,DD.COMPCODE
) A
ORDER BY A.EMPID
      `;
  
      console.log(sql, "SQL for Staffss Detail");
  
      const queryResult = await connection.execute(sql);
  
      result = queryResult.rows.map((row) => {
        return queryResult.metaData.reduce((acc, column, index) => {
          acc[column.name] = row[index];
          return acc;
        }, {});
      });
    }
  
    return result;
  }
  
export async function getEmployeesDetail(connection, type = "Value", search = {}, filterBuyer, payCat) {
    let result = [];
    let totalCount = 0;
  
    console.log(payCat, search, "payCat for Employee");

    const filterBuyerList = filterBuyer
        .split(',')
        .map(buyer => `'${buyer.trim()}'`)
        .join(',');

    if (type === "Value") {
        let whereClause = `
            A.COMPCODE IN (${filterBuyerList})
            AND A.DOJ <= (    
                SELECT MIN(AA.STDT) 
                FROM MONTHLYPAYFRQ AA 
                WHERE AA.PAYPERIOD = '${currentDt}'
            ) 
            AND (A.DOL IS NULL OR A.DOL <= (
                SELECT MIN(AA.ENDT) 
                FROM MONTHLYPAYFRQ AA 
                WHERE AA.PAYPERIOD = '${currentDt}'
            ))
        `;

        if (search.FNAME) whereClause += ` AND LOWER(A.FNAME) LIKE LOWER('%${search.FNAME}%')`;
        if (search.GENDER) whereClause += ` AND LOWER(A.GENDER) LIKE LOWER('${search.GENDER}%')`;
        if (search.MIDCARD) whereClause += ` AND A.MIDCARD LIKE '${search.MIDCARD}'`;
        if (search.DEPARTMENT) whereClause += ` AND LOWER(A.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
        if (search.COMPCODE) whereClause += ` AND LOWER(A.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

        const sql = `
            SELECT FNAME, GENDER, MIDCARD, DEPARTMENT, COMPCODE, PAYCAT
            FROM MISTABLE A  
            WHERE ${whereClause} ORDER BY TO_NUMBER(A.MIDCARD) ASC
        `;
        const countSql = `
            SELECT COUNT(*) AS TOTAL_COUNT
            FROM MISTABLE A  
            WHERE ${whereClause}
        `;

        console.log(sql, "SQL for Employee Detail");
        console.log(countSql, "SQL for Employee Count");

        try {
            // Fetch employee data
            const queryResult = await connection.execute(sql);
            result = queryResult.rows.map((row) => {
                return queryResult.metaData.reduce((acc, column, index) => {
                    acc[column.name] = row[index];
                    return acc;
                }, {});
            });

            // Fetch total count
            const countResult = await connection.execute(countSql);
            totalCount = countResult.rows[0][0]; // Extract count from result
        } catch (error) {
            console.error("Error executing query:", error);
        }
    }

    return { employees: result, totalCount };
}

export async function getEmployees1(connection, type = 'Value', filterYear, filterBuyer, lstMnth) {
    let result = ''
    if (type === "Value") {
        const sql = `SELECT  
    SUM(MALE) AS MALE,
    SUM(FEMALE) AS FEMALE,
    SUM(MALE) + SUM(FEMALE) AS TOTAL,
    COMPCODE
FROM (
    SELECT
        CASE WHEN A.GENDER = 'MALE' THEN 1 ELSE 0 END AS MALE,
        CASE WHEN A.GENDER = 'FEMALE' THEN 1 ELSE 0 END AS FEMALE,
        A.COMPCODE
    FROM MISTABLE A
    WHERE
        A.PAYCAT <> 'STAFF'
        AND A.DOJ <= (
            SELECT MIN(AA.STDT)
            FROM MONTHLYPAYFRQ AA
            WHERE AA.PAYPERIOD =  '${currentDt}'
        )
        AND (A.DOL IS NULL OR A.DOL <= (
            SELECT MIN(AA.ENDT)
            FROM MONTHLYPAYFRQ AA
            WHERE AA.PAYPERIOD =  '${currentDt}'
        ))
) A
GROUP BY COMPCODE

 `
 console.log(sql,"sql for empDet")
        result = await connection.execute(sql)
    }

    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]
    }))
    return result
}

export async function getProfit(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
        const filterBuyerList = filterBuyer.split(',').map(buyer => `'${buyer.trim()}'`).join(',')

    if (type === "YEAR") {

        const sql = `SELECT A.PAYPERIOD, A.STDT,SUM(A.MALE) MALE,
SUM(A.FEMALE) FEMALE FROM
(SELECT B.PAYPERIOD, B.STDT,CASE WHEN A.GENDER = 'MALE' THEN COUNT(*) ELSE 0 END MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN COUNT(*) ELSE 0 END FEMALE
FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON B.COMPCODE = A.COMPCODE
AND B.PAYPERIOD ='${lstMnth}'AND A.PAYCAT = 'STAFF' 
AND A.COMPCODE IN (${filterBuyerList})
AND A.DOL BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD, B.STDT, A.COMPCODE,A.GENDER
) A
GROUP BY A.PAYPERIOD, A.STDT
ORDER BY 2
`
 console.log(sql,"sql for attr")

        result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select
        COALESCE(ROUND(prevValue), 0) as prevValue,
            COALESCE(ROUND(currentValue), 0) as currentValue
        from(
            select
                (select sum(actprofit) 
          from MISORDSALESVAL
          where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE)
          and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
                ) as currentValue,
            (select sum(actprofit) 
         from MISORDSALESVAL
         where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1))
         and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        ) as prevValue
         from dual) a
            `)
    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]

    }))
    return result
}
export async function getProfit1(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {

        const sql = `SELECT A.PAYPERIOD, A.STDT,SUM(A.MALE) MALE,
SUM(A.FEMALE) FEMALE FROM
(SELECT B.PAYPERIOD, B.STDT,CASE WHEN A.GENDER = 'MALE' THEN COUNT(*) ELSE 0 END MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN COUNT(*) ELSE 0 END FEMALE
FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON B.COMPCODE = A.COMPCODE
AND B.PAYPERIOD ='${lstMnth}'AND A.PAYCAT <> 'STAFF' 
AND A.COMPCODE IN '${filterBuyer}'
AND A.DOL BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD, B.STDT, A.COMPCODE,A.GENDER
) A
GROUP BY A.PAYPERIOD, A.STDT
ORDER BY 2
`

        result = await connection.execute(sql)

    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]

    }))
    return result
}
export async function getNewCustomers(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {
        const sql = `
         SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (
SELECT A.COMPCODE,CASE WHEN AA.GENDER = 'MALE' THEN A.NETPAY ELSE 0 END MALE,
CASE WHEN AA.GENDER = 'FEMALE' THEN A.NETPAY ELSE 0 END FEMALE FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND AND CC.BANDID <> 'STAFF' 
WHERE A.PCTYPE = 'ACTUAL' AND  A.PAYPERIOD = '${lstMnth}') group by COMPCODE `
        console.log(sql,"sql salary");

        result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select
        COALESCE(ROUND(prevValue), 0) as prevValue,
            COALESCE(ROUND(currentValue), 0) as currentValue
        from(
            select
                (select sum(actsalval) 
        from MISORDSALESVAL
        where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE)
        and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
        and extract(YEAR from CUSCRDT) = extract(YEAR from CURRENT_DATE)
         and extract(MONTH from CUSCRDT) = extract(MONTH from CURRENT_DATE)
                ) as currentValue,
            (select sum(actsalval) 
        from MISORDSALESVAL
        where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1))
        and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        and extract(YEAR from CUSCRDT) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1))
         and extract(MONTH from CUSCRDT) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        ) as prevValue
        from dual) a
            `)
    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]


    }))
    return result
}
export async function getTopCustomers(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {
        const sql = `SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (
SELECT A.COMPCODE,CASE WHEN AA.GENDER = 'MALE' THEN A.NETPAY ELSE 0 END MALE,
CASE WHEN AA.GENDER = 'FEMALE' THEN A.NETPAY ELSE 0 END FEMALE FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND AND CC.BANDID = 'STAFF' 
WHERE A.PAYPERIOD = '${lstMnth}'
)
GROUP BY COMPCODE
`



        result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select
            (select round(sum(turnover)) 
        from(
                select customer, coalesce(sum(actsalval), 0) as turnover
        from MISORDSALESVAL
        where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1))
          and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        group by customer order by turnover desc
            )
        where rownum <= 5
            ) as prevValue,
            (
                select round(sum(turnover))
        from(
            select customer, coalesce(sum(actsalval), 0) as turnover
        from MISORDSALESVAL
        where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE)
        and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
        group by customer order by turnover desc
        )
        where rownum <= 5
        ) as currentValue
        from dual
            `)
    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]

    }))
    return result
}

export async function getLoss(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {
        const sql =
            `SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (
SELECT A.COMPCODE,CASE WHEN AA.GENDER = 'MALE' THEN A.PF ELSE 0 END MALE,
CASE WHEN AA.GENDER = 'FEMALE' THEN A.PF ELSE 0 END FEMALE FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND AND CC.BANDID <> 'STAFF'
WHERE A.PAYPERIOD = '${lstMnth}' 
)
GROUP BY COMPCODE`
        console.log(sql, 'sql125');
        result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select
        COALESCE(ROUND(prevValue), 0) as prevValue,
            COALESCE(ROUND(currentValue), 0) as currentValue
        from(
            select
                (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE) 
and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
and actprofit < 0) as currentValue,
            (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1)) 
  and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
and actprofit < 0) as prevValue
from dual) a
            `)

    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]

    }))
    return result
}
export async function getLoss01(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {
        const sql =
            `SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (

SELECT A.COMPCODE,CASE WHEN AA.GENDER = 'MALE' THEN A.PF ELSE 0 END MALE,

CASE WHEN AA.GENDER = 'FEMALE' THEN A.PF ELSE 0 END FEMALE FROM HPAYROLL A

JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO

JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID

JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND AND CC.BANDID = 'STAFF'

WHERE A.PAYPERIOD = '${lstMnth}' 
)

GROUP BY COMPCODE`
        result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select
        COALESCE(ROUND(prevValue), 0) as prevValue,
            COALESCE(ROUND(currentValue), 0) as currentValue
        from(
            select
                (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE) 
and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
and actprofit < 0) as currentValue,
            (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1)) 
  and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
and actprofit < 0) as prevValue
from dual) a
            `)

    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]

    }))
    return result
}
export async function getLoss1(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {
        const sql =
            `SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (

SELECT A.COMPCODE,CASE WHEN AA.GENDER = 'MALE' THEN A.ESI ELSE 0 END MALE,

CASE WHEN AA.GENDER = 'FEMALE' THEN A.ESI ELSE 0 END FEMALE FROM HPAYROLL A

JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO

JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID

JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND AND CC.BANDID <> 'STAFF'

WHERE A.PAYPERIOD ='${lstMnth}'
)

GROUP BY COMPCODE`
        result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select
        COALESCE(ROUND(prevValue), 0) as prevValue,
            COALESCE(ROUND(currentValue), 0) as currentValue
        from(
            select
                (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE) 
and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
and actprofit < 0) as currentValue,
            (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1)) 
  and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
and actprofit < 0) as prevValue
from dual) a
            `)

    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]

    }))
    return result
}
export async function getLoss11(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {
        const sql =
            `SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (

SELECT A.COMPCODE,CASE WHEN AA.GENDER = 'MALE' THEN A.ESI ELSE 0 END MALE,
CASE WHEN AA.GENDER = 'FEMALE' THEN A.ESI ELSE 0 END FEMALE FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND AND CC.BANDID = 'STAFF'
WHERE A.PAYPERIOD ='${lstMnth}'
)
GROUP BY COMPCODE`
        console.log(sql, 'sql');

        result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select
        COALESCE(ROUND(prevValue), 0) as prevValue,
            COALESCE(ROUND(currentValue), 0) as currentValue
        from(
            select
                (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE) 
and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
and actprofit < 0) as currentValue,
            (select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1)) 
  and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
and actprofit < 0) as prevValue
from dual) a
            `)

    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]

    }))
    return result
}