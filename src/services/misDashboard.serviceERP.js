import { getConnection, getConnectionERP } from "../constants/db.connection.js";
import { IN_HAND } from "../constants/dbConstants.js";
import { getTopCustomers, getProfit, getTurnOver, getNewCustomers, getLoss } from "../queries/misDashboardERP.js";


export async function get(req, res) {
    const connection = await getConnectionERP(res)
    try {
        const { type, filterYear, previousYear } = req.query

        const totalTurnOver = await getTurnOver(connection, type, filterYear, previousYear);
        const profit = await getProfit(connection, type, filterYear, previousYear);
        const newCustomers = await getNewCustomers(connection, type, filterYear, previousYear);
        const topCustomers = await getTopCustomers(connection, type, filterYear, previousYear);
        const loss = await getLoss(connection, type, filterYear, previousYear);
        return res.json({
            statusCode: 0, data: {
                totalTurnOver,
                profit,
                newCustomers,
                topCustomers,
                loss
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
export async function executeProcedure (req, res){
    const connection = await getConnection(res)
    try {
      
      await connection.execute(`BEGIN MISPROD('SPA'); END;`);
      res.json({ success: true, message: "Data refetch executed successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
export async function getOrdersInHand(req, res) {
    const connection = await getConnection(res)
    try {
        const { filterYear } = req.query;

        const sql = ` 
        SELECT  customer, order_count
        FROM (
            SELECT  customer, COUNT(orderno) as order_count
            FROM MISORDSALESVAL
            WHERE status = 'In Hand'
            and finyr = '${filterYear}'
            GROUP BY status, customer
            ORDER BY COUNT(orderno) DESC
        )  where rownum < 10`

        let result = await connection.execute(sql);
        result = result.rows.map(row => ({
            buyer: row[0], value: row[1]
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
        const monthArr = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(i =>
            `
            select 
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'Mon-YYYY') as monthYear ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'MM') as monthOnly ,
            to_char(ADD_MONTHS(CURRENT_DATE, ${i}), 'YYYY') as yearOnly ,
            (
            select count(1) from MISORDSALESVAL 
            where extract(YEAR from planshipdt) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from planshipdt) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS PLANNED,
            (
            select count(1) from MISORDSALESVAL 
            where extract(YEAR from actshipdt) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, ${i}))
            and extract(MONTH from actshipdt) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, ${i}))
            ) AS ACTUAL
            FROM DUAL
        `
        )

        const sql = monthArr.join('union')

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
    const connection = await getConnection(res)
    try {
        const { } = req.query;

        const sql =
            `
            SELECT A.FINYR,A.CUSTOMER,SUM(A.ORDERQTY) ORDERQTY FROM MISORDSALESVAL A
            GROUP BY A.FINYR,A.CUSTOMER
            ORDER BY 2,1,3
     `

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({

            year: po[0],
            customer: po[1],
            orderQty: po[2],

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
        const { filterYear } = req.query;

        const sql =
            `
            SELECT A.CUSTOMER,SUM(A.ACTSALVAL) FROM MISORDSALESVAL A
            WHERE A.ACTSALVAL > 0 AND A.FINYR = '${filterYear}'
            GROUP BY A.CUSTOMER
            ORDER BY 1
     `

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({

            customer: po[0],
            revenue: po[1],


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
        const { filterMonth, filterSupplier, filterYear, filterAll } = req.query;

        let sql = '';

        if (filterAll === 'Detailed') {
            sql = `
                SELECT A.FINYR,A.ORDERNO,A.BUYERCODE,A.TYPENAME,A.YARNCOST,A.FABRICCOST,A.ACCCOST,A.CMTCOST,
                A.OTHERCOST,A.SALECOST,A.ACTPROFIT,A.ACTPROFITPER,A.ORD,A.MON,A.ORDERNO GRP 
                FROM MISORDBUDACTDETAILS A  
                               ORDER BY BUYERCODE,ORDERNO,ORD`
        } else {
            sql = `
                SELECT A.FINYR,ORDERNO,A.BUYERCODE,A.TYPENAME,A.YARNCOST,A.FABRICCOST,A.ACCCOST,A.CMTCOST,
                A.OTHERCOST,A.SALECOST,A.ACTPROFIT,A.ACTPROFITPER,A.ORD,A.MON,A.FINYR||A.MON GRP 
                FROM MISORDBUDACTCDETAILS A 
                              ORDER BY BUYERCODE,ORDERNO,ORD`
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
        const { filterYear, filterMonth, filterSupplier } = req.query;
        let sql
        if (filterMonth || filterSupplier || filterYear) {
            sql =
                `
        SELECT 
        orderNo,
        customer,
        orderQty,
        shipQty,
        (shipQty - orderQty) AS difference,
        ROUND((shipQty - orderQty) / orderQty * 100, 2) AS difference_percentage
    FROM 
        MISORDSALESVAL
   
    ORDER BY 
        difference_percentage DESC
 `
        } else {
            res.status(200).json({ message: 'filterMonth and filterSupplier are required' });
            return;
        }

        const result = await connection.execute(sql)
        let resp = result.rows.map(po => ({
            orderNo: po[0],
            customer: po[1],
            orderQty: po[2],
            shipQty: po[3],
            diffrence: po[4],
            percentage: po[5]

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


