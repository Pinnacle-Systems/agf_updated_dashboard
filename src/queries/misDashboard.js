import { currentDate } from "../Helpers/helper.js";
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
const monthName = month[d.getMonth()];
const yearName = d.getFullYear();
const lastmonth = month[d.getMonth() - 1]
const currentDt = [monthName, yearName].join(' ')
const lstMnth = [lastmonth, yearName].join(' ')
console.log(lastmonth, 'mnth');
export async function getEmployees(connection, type = 'Value', filterYear, filterBuyer, lstMnth) {
    let result = ''
    if (type === "Value") {
        const sql = ` SELECT  SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (
SELECT CASE WHEN A.GENDER = 'MALE' THEN 1 ELSE 0 END MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN 1 ELSE 0 END FEMALE, A.COMPCODE FROM MISTABLE A  WHERE 1=1 
AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) )
) A group by COMPCODE
 `
        console.log(sql, '23');


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
                ) as currentValue,
            (select sum(actsalval) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1))
    and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        ) as prevValue
from dual)
        `)
    } else if (type === 'Quantity') {
        result = await connection.execute(
            `SELECT
        COALESCE(ROUND(prevShipQty), 0) AS prevValue,
            COALESCE(ROUND(currentShipQty), 0) AS currentValue
        FROM(
            SELECT
                (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${previousYear}') AS prevShipQty,
            (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${filterYear}') AS currentShipQty
        FROM dual
    )`
        )
    }
    console.log(result, 'res');

    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], currentQty: row[2], comCode: row[3]
    }))
    return result
}



export async function getProfit(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {

        const sql = `SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (
SELECT CASE WHEN A.GENDER = 'MALE' THEN A.CURSAL ELSE 0 END*( (
SELECT AA.WORKINGDAYS STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}'  AND AA.COMPCODE = 'AGF'
) ) MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN A.CURSAL ELSE 0 END*(
SELECT AA.WORKINGDAYS STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}'  AND AA.COMPCODE = 'AGF' 
) FEMALE, A.COMPCODE  FROM MISTABLE A
WHERE 1=1  AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}'  
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}'  
) )
) A group by A.COMPCODE `
        console.log(sql, 'sql22');

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

export async function getNewCustomers(connection, type = "YEAR", filterYear, filterBuyer, filterMonth) {
    let result;
    if (type === "YEAR") {
        const sql = `
          SELECT SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL,COMPCODE FROM (
SELECT CASE WHEN AA.GENDER = 'MALE' THEN A.NETPAY ELSE 0 END MALE,
CASE WHEN AA.GENDER = 'FEMALE' THEN A.NETPAY ELSE 0 END FEMALE,A.COMPCODE  FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
WHERE  A.PAYPERIOD = '${lstMnth}') group by COMPCODE `
console.log(sql,"sql12")

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
        console.log(sql, '168');


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
SELECT A.COMPCODE,CASE WHEN AA.GENDER = 'MALE' THEN A.NETPAY ELSE 0 END MALE,
CASE WHEN AA.GENDER = 'FEMALE' THEN A.NETPAY ELSE 0 END FEMALE FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND AND CC.BANDID <> 'STAFF' 
WHERE A.PAYPERIOD = '${lstMnth}'
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
