import { getConnection } from "../constants/db.connection.js";
import { IN_HAND } from "../constants/dbConstants.js";
import { getTopCustomers, getProfit, getEmployees, getNewCustomers, getLoss, getLoss1, getEmployees1,
     getProfit1, getLoss11, getLoss01}
    from "../queries/misDashboard.js";
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
const monthName = month[d.getMonth()];
const yearName = d.getFullYear();

const lastMonthDate = new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
const lastMonthName = month[lastMonthDate.getMonth()];
const lastMonthYear = lastMonthDate.getFullYear();

const currentDt = [monthName, yearName].join(' ');
const lstMnth = [lastMonthName, lastMonthYear].join(' ');

export async function get(req, res) {
    const connection = await getConnection(res)
    try {
        const { type, filterYear, filterBuyer, filterMonth,search ,payCat} = req.query
        console.log(search,filterBuyer,"filterBuyer for mis")

        const totalTurnOver = await getEmployees(connection, type, filterYear, filterBuyer, filterMonth);
        const totalTurnOver1 = await getEmployees1(connection, type, filterYear, filterBuyer, filterMonth);

        const profit = await getProfit(connection, type, filterYear, filterBuyer, filterMonth);
        const profit1 = await getProfit1(connection, type, filterYear, filterBuyer, filterMonth);

        const newCustomers = await getNewCustomers(connection, type, filterYear, filterBuyer, filterMonth);
        const topCustomers = await getTopCustomers(connection, type, filterYear, filterBuyer, filterMonth);

        const loss = await getLoss(connection, type, filterYear, filterMonth);
        const loss01 = await getLoss01(connection, type, filterYear, filterMonth);

        const loss1 = await getLoss1(connection, type, filterYear, filterMonth);
        const loss11 = await getLoss11(connection, type, filterYear, filterMonth);
    

        return res.json({
            statusCode: 0, data: {
                totalTurnOver,
                totalTurnOver1,
                profit,
                newCustomers,
                topCustomers,
                loss, loss1, profit1, loss11, loss01,
            }
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
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
    const { filterBuyer, search ={}  } = req.query;
    let result = [];
    const filterBuyerList = filterBuyer.split(',').map(buyer => `'${buyer.trim()}'`).join(',')
    console.log(filterBuyerList ,"filterBuyerList");

    let whereClause = `DD.COMPCODE IN (${filterBuyerList})`;

    if (search.FNAME) whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
    if (search.GENDER) whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
    if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
    if (search.DEPARTMENT) whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
    if (search.COMPCODE) whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

    const sql = `
        SELECT * FROM (
            SELECT
                DD.IDCARD EMPID, DD.FNAME FNAME, DD.GENDER GENDER, DD.DOJ DOJ, 
                DD.DEPARTMENT, NVL(SUM(A.NETPAY), 0) AS NETPAY, DD.PAYCAT, DD.COMPCODE  
            FROM MISTABLE DD
             JOIN HPAYROLL A ON A.EMPID = DD.IDCARD 
                AND A.PCTYPE = 'ACTUAL' 
                AND A.PAYPERIOD = '${lstMnth}'
             JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
             JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
             JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
            WHERE ${whereClause}
            AND DD.DOJ <= (
                SELECT MIN(AA.STDT) 
                FROM MONTHLYPAYFRQ AA 
                WHERE AA.PAYPERIOD = '${lstMnth}'
            ) 
            AND (DD.DOL IS NULL OR DD.DOL <= (
                SELECT MIN(AA.ENDT) 
                FROM MONTHLYPAYFRQ AA 
                WHERE AA.PAYPERIOD = '${lstMnth}'
            ))
            GROUP BY DD.IDCARD, DD.FNAME, DD.GENDER, DD.DOJ, 
                     DD.DEPARTMENT, DD.PAYCAT, DD.COMPCODE
        ) A
        ORDER BY A.EMPID`

    console.log(sql, "SQL for Staffs Detail");

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map(row =>
        queryResult.metaData.reduce((acc, column, index) => {
            acc[column.name] = row[index];
            return acc;
        }, {})
    );

   res.status(200).json({ success: true, data: result });
}
export async function getpfdet(req, res) {
    const connection = await getConnection(res);
    const { filterBuyer, search ={}  } = req.query;
    let result = [];
    const filterBuyerList = filterBuyer.split(',').map(buyer => `'${buyer.trim()}'`).join(',')
    console.log(filterBuyerList ,"filterBuyerList");

    let whereClause = `DD.COMPCODE IN (${filterBuyerList}) AND A.PCTYPE = 'ACTUAL' and A.PAYPERIOD = '${lstMnth}'
    AND DD.DOJ <= (
                SELECT MIN(AA.STDT)
                FROM MONTHLYPAYFRQ AA
                WHERE AA.PAYPERIOD = 'February 2025'
            )
            AND (DD.DOL IS NULL OR DD.DOL <= (
                SELECT MIN(AA.ENDT)
                FROM MONTHLYPAYFRQ AA
                WHERE AA.PAYPERIOD = 'February 2025'
            ))`;

    if (search.FNAME) whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
    if (search.GENDER) whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
    if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
    if (search.DEPARTMENT) whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
    if (search.COMPCODE) whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

    const sql = `
      SELECT A.EMPID,AA.FNAME,AA.GENDER,BB.DOJ,DD.DEPARTMENT,A.PF AS NETPAY, DD.PAYCAT, DD.COMPCODE 
FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN MISTABLE  DD ON A.EMPID = DD.IDCARD
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND 
  WHERE ${whereClause}
 ORDER BY A.EMPID`;

    console.log(sql, "SQL for pf Detail");

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map(row =>
        queryResult.metaData.reduce((acc, column, index) => {
            acc[column.name] = row[index];
            return acc;
        }, {})
    );

   res.status(200).json({ success: true, data: result });
}
export async function getesidet(req, res) {
    const connection = await getConnection(res);
    const { filterBuyer, search ={}  } = req.query;
    let result = [];
    const filterBuyerList = filterBuyer.split(',').map(buyer => `'${buyer.trim()}'`).join(',')
    console.log(filterBuyerList ,"filterBuyerList");

    let whereClause = `DD.COMPCODE IN (${filterBuyerList}) AND A.PCTYPE = 'ACTUAL' and A.PAYPERIOD = '${lstMnth}'
    AND DD.DOJ <= (
                SELECT MIN(AA.STDT)
                FROM MONTHLYPAYFRQ AA
                WHERE AA.PAYPERIOD = 'February 2025'
            )
            AND (DD.DOL IS NULL OR DD.DOL <= (
                SELECT MIN(AA.ENDT)
                FROM MONTHLYPAYFRQ AA
                WHERE AA.PAYPERIOD = 'February 2025'
            ))`;

    if (search.FNAME) whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
    if (search.GENDER) whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
    if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
    if (search.DEPARTMENT) whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
    if (search.COMPCODE) whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

    const sql = `
      SELECT A.EMPID,AA.FNAME,AA.GENDER,BB.DOJ,DD.DEPARTMENT,A.ESI AS NETPAY, DD.PAYCAT, DD.COMPCODE 
FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN MISTABLE  DD ON A.EMPID = DD.IDCARD
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND 
  WHERE ${whereClause}
 ORDER BY A.EMPID`;

    console.log(sql, "SQL for ESI Detail");

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map(row =>
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
        .split(',')
        .map(buyer => `'${buyer.trim()}'`)
        .join(',');

    console.log(filterBuyerList, "filterBuyerList");

    let whereClause = `A.COMPCODE IN (${filterBuyerList}) AND B.PAYPERIOD = '${lstMnth}'`;

    if (search.FNAME) whereClause += ` AND LOWER(AA.FNAME) LIKE LOWER('%${search.FNAME}%')`;
    if (search.GENDER) whereClause += ` AND LOWER(AA.GENDER) LIKE LOWER('${search.GENDER}%')`;
    if (search.MIDCARD) whereClause += ` AND A.EMPID LIKE '${search.MIDCARD}'`;
    if (search.DEPARTMENT) whereClause += ` AND LOWER(DD.DEPARTMENT) LIKE LOWER('%${search.DEPARTMENT}%')`;
    if (search.COMPCODE) whereClause += ` AND LOWER(DD.COMPCODE) LIKE LOWER('%${search.COMPCODE}%')`;

    const sql = `
    SELECT A.IDCARD, A.FNAME, A.GENDER, A.DOJ, A.DEPARTMENT, 
           C.REMARKS AS REASON, A.COMPCODE
    FROM MISTABLE A
    JOIN MONTHLYPAYFRQ B 
        ON B.COMPCODE = A.COMPCODE 
        AND (A.DOL IS NULL OR A.DOL BETWEEN B.STDT AND B.ENDT)
    LEFT JOIN EMPDESGENTRY C 
        ON A.IDCARD = C.IDCARDNO
    WHERE ${whereClause}
    ORDER BY A.COMPCODE, A.IDCARD, A.FNAME, A.GENDER`;

    console.log(sql, "SQL for pf Detail");

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map(row =>
        queryResult.metaData.reduce((acc, column, index) => {
            acc[column.name] = row[index];
            return acc;
        }, {})
    );

    res.status(200).json({ success: true, data: result });
}

export async function getEmployeesDetail(req,res) {
    const connection = await getConnection(res);
    const { filterBuyer,search={}} = req.query
    let result = [];
    let totalCount = 0;
  

    const filterBuyerList = filterBuyer
        .split(',')
        .map(buyer => `'${buyer.trim()}'`)
        .join(',');

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
            const queryResult = await connection.execute(sql);
            result = queryResult.rows.map((row) => {
                return queryResult.metaData.reduce((acc, column, index) => {
                    acc[column.name] = row[index];
                    return acc;
                }, {});
            });
             console.log(result,"employeeDetail")
            const countResult = await connection.execute(countSql);
            totalCount = countResult.rows[0][0]; 
        } catch (error) {
            console.error("Error executing query:", error);
        }

    return res.status(200).json({ success: true, data: result });
}




export async function getOrdersInHand(req, res) {
    const connection = await getConnection(res)
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
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) )
) X
) X
WHERE X.SLAP IS NOT NULL
GROUP BY X.SLAP
ORDER BY 1
`
        console.log(sql, 'sql60');
        let result = await connection.execute(sql);
        result = result.rows.map(row => ({
            buyer: row[0], value: row[1], female: row[2], total: row[3]
        }))
        return res.json({
            statusCode: 0, data: result
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}

export async function getOrdersInHandMonthWise(req, res) {
    const connection = await getConnection(res)
    try {
        const monthArr =
            `
        SELECT B.PAYPERIOD,B.STDT,A.COMPCODE,COUNT(*) ATTRITION FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE 
AND B.FINYR = :FINYEAR AND A.COMPCODE = :COMPCODE
AND A.DOL BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD,B.STDT,A.COMPCODE
ORDER BY 2
        `



        let result = await connection.execute(monthArr);
        result = result.rows.map(row => ({
            date: row[0], planned: row[3], actual: row[4]
        }))
        return res.json({
            statusCode: 0, data: result, sql
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}


export async function getActualVsBudgetValueMonthWise(req, res) {
    const connection = await getConnection(res)
    try {
        const monthArr = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(i =>
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
        )
        const sql = monthArr.join('union')
        console.log(sql, 'sql133');
        let result = await connection.execute(`select * from (${sql}) order by yearOnly,monthOnly`);
        result = result.rows.map(row => ({
            date: row[0], planned: row[3], actual: row[4]
        }))
        return res.json({
            statusCode: 0, data: result, sql
        })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function getYearlyComp(req, res) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    const monthName = month[d.getMonth()];
    const yearName = d.getFullYear();
    const lastmonth = month[d.getMonth() - 1]
    const currentDt = [monthName, yearName].join(' ')
    const lstMnth = [lastmonth, yearName].join(' ')
    const connection = await getConnection(res)
    try {
        const { } = req.query;

        const sql =
            `
           SELECT A.COMPCODE,SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL FROM (
SELECT A.COMPCODE,CASE WHEN A.GENDER = 'MALE' THEN 1 ELSE 0 END MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN 1 ELSE 0 END FEMALE FROM MISTABLE A WHERE  A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}'
) )
) A
GROUP BY A.COMPCODE
     `

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({

            customer: po[0],
            male: po[1],
            female: po[2],

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function getBuyerWiseRevenue(req, res) {
    const connection = await getConnection(res)
    try {
        const { filterYear, filterSupplier } = req.query;
        const supplierArray = filterSupplier.split(',');
        const sepComName = supplierArray.join('');
        const supplierList = supplierArray.map(supplier => `'${supplier}'`).join(',');
        const sql =
            `
         SELECT A.PAYPERIOD,A.STDT,ROUND(A.CLOSING/A.OPENING*100,2) RETENTIONPER FROM (
SELECT A.PAYPERIOD,A.STDT,SUM(A.OPENING) OPENING,SUM(A.ATTRITION) ATTRITION,SUM(A.OPENING) - SUM(A.ATTRITION) + SUM(A.JOINERS) CLOSING FROM (
SELECT B.PAYPERIOD,B.STDT,0 OPENING,COUNT(*) ATTRITION,0 JOINERS FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE 
AND B.FINYR = '${filterYear}' AND A.COMPCODE IN (${supplierList})
AND A.DOL BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD,B.STDT,A.COMPCODE
UNION ALL
SELECT B.PAYPERIOD,B.STDT,0 OPENING,0 ATTRITION,COUNT(*) JOINERS FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE 
AND B.FINYR = '${filterYear}' AND A.COMPCODE  IN (${supplierList})
AND A.DOJ BETWEEN B.STDT AND B.ENDT
GROUP BY B.PAYPERIOD,B.STDT,A.COMPCODE
UNION ALL
SELECT B.PAYPERIOD,B.STDT,COUNT(*) OPENING,0 ATTRITION,0 JOINERS FROM MISTABLE A
JOIN MONTHLYPAYFRQ B ON A.COMPCODE = B.COMPCODE 
AND B.FINYR = '${filterYear}' AND A.COMPCODE  IN (${supplierList})
AND A.DOJ < B.STDT
GROUP BY B.PAYPERIOD,B.STDT
) A
GROUP BY A.PAYPERIOD,A.STDT
) A
ORDER BY 2
     `
        console.log(sql, '215');

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({

            payPeriod: po[0],
            stdt: po[1],
            retention: po[2],

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}


export async function getActualVsBudget(req, res) {
    const connection = await getConnection(res);
    try {
        const { filterMonth, filterSupplier, filterYear, filterAll = 'Detailed' } = req.query;

        let sql = '';

        if (filterAll === 'Detailed') {
            sql = `
              SELECT A.COMPCODE,SUM(MALE) MALE,SUM(FEMALE) FEMALE,SUM(MALE)+SUM(FEMALE) TOTAL FROM (
SELECT A.COMPCODE,CASE WHEN A.GENDER = 'MALE' THEN 1 ELSE 0 END MALE,
CASE WHEN A.GENDER = 'FEMALE' THEN 1 ELSE 0 END FEMALE FROM MISTABLE A WHERE A.COMPCODE = 'AGF'
AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE AA.PAYPERIOD = '${currentDt}' 
) )
) A
GROUP BY A.COMPCODE`;
            console.log(sql, 'dqw');
            
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
        let resp = result.rows.map(po => ({
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
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await connection.close();
    }
}
export async function getShortShipmentRatio(req, res) {
    const connection = await getConnection(res)
    try {
        const { filterCat, filterBuyer } = req.query;
        let sql
        if (filterCat === 'Birthday') {
            sql =
                `
     SELECT A.COMPCODE,A.IDCARD,A.FNAME,A.GENDER,A.DOB,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOB)/12) AGE,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOJ)/12) EXP ,A.DOJ FROM MISTABLE A 
WHERE TO_CHAR(SYSDATE, 'WW') = TO_CHAR(A.DOB, 'WW') 
 ${filterBuyer ? `AND A.COMPCODE = '${filterBuyer}'` : ''}
AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) )
ORDER BY TO_CHAR(A.DOB, 'MM-DD')

 `
        } else {
            sql = `SELECT A.COMPCODE,A.IDCARD,A.FNAME,A.GENDER,A.DOB,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOB)/12) AGE,TRUNC(MONTHS_BETWEEN(TRUNC(SYSDATE),A.DOJ)/12) EXP ,A.DOJ FROM MISTABLE A 
WHERE TO_CHAR(SYSDATE, 'WW') = TO_CHAR(A.DOJ, 'WW') 
 ${filterBuyer ? `AND A.COMPCODE = '${filterBuyer}'` : ''}
AND A.DOJ <= (
SELECT MIN(AA.STDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) AND (A.DOL IS NULL OR A.DOL <= (
SELECT MIN(AA.ENDT) STDT FROM MONTHLYPAYFRQ AA WHERE TO_DATE(SYSDATE) BETWEEN AA.STDT AND AA.ENDT 
) )
ORDER BY TO_CHAR(A.DOB, 'MM-DD')
`
        }



        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({
            customer: po[0],
            idCard: po[1],
            name: po[2],
            gender: po[3],
            dob: po[4],
            age: po[5],
            exp: po[6],
            doj: po[7]

        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
export async function getESIPF(req, res) {
    const connection = await getConnection(res)
    try {
        const { filterCat, filterSupplier, filterYear } = req.query;
        console.log(filterSupplier, "filterSupplier")
        let sql

        sql = `
SELECT 
    A.COMPCODE,
    A.PAYPERIOD,
    EE.FINYR,
    SUM(A.ESI) AS ESI,
    SUM(A.PF) AS PF,
    COUNT(DISTINCT A.EMPID) AS HEADCOUNT,TO_CHAR(EE.STDT,'MM') STDT,TO_CHAR(EE.STDT,'YY') STDT1
FROM HPAYROLL A
JOIN HREMPLOYMAST AA ON A.EMPID = AA.IDCARDNO
JOIN HREMPLOYDETAILS BB ON AA.HREMPLOYMASTID = BB.HREMPLOYMASTID
JOIN HRBANDMAST CC ON CC.HRBANDMASTID = BB.BAND
JOIN MONTHLYPAYFRQ EE ON EE.PAYPERIOD = A.PAYPERIOD AND EE.COMPCODE = A.COMPCODE
WHERE EE.FINYR = '${filterYear}'
AND A.COMPCODE = '${filterSupplier}'
GROUP BY A.COMPCODE, EE.FINYR,A.PAYPERIOD,EE.STDT
ORDER BY STDT1,STDT

 
`
        console.log(sql, "event Query sql")


        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({
            customer: po[0],
            month: po[1],
            Year: po[2],
            esi: po[3],
            pf: po[4],
            headCount:  po[5]


        }))
        return res.json({ statusCode: 0, data: resp })
    }
    catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    finally {
        await connection.close()
    }
}
