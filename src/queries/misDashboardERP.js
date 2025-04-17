export async function getTurnOver(connection, type = 'Value', filterYear, previousYear) {
    let result;
     console.log(previousYear,filterYear,"type")
    if (type === "Value") {
        result = await connection.execute(`
        SELECT 
        COALESCE(ROUND(prevValue), 0) AS prevValue,
        COALESCE(ROUND(currentValue), 0) AS currentValue,
         COALESCE(ROUND(prevShipQty), 0) AS prevQty,
        COALESCE(ROUND(currentShipQty), 0) AS currentQty
    FROM (
        SELECT 
        (SELECT SUM(actsalval) FROM MISORDSALESVAL WHERE finyr = '${previousYear}') AS prevValue,
            (SELECT SUM(actsalval) FROM MISORDSALESVAL WHERE finyr = '${filterYear}') AS currentValue,
             (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${previousYear}') AS prevShipQty,
            (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${filterYear}') AS currentShipQty
        FROM dual
    )
     `)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select 
COALESCE(ROUND(prevValue),0) as prevValue,
COALESCE(ROUND(currentValue),0) as currentValue
from (
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
        result = await connection.execute(`SELECT 
        COALESCE(ROUND(prevShipQty), 0) AS prevValue,
        COALESCE(ROUND(currentShipQty), 0) AS currentValue
    FROM (
        SELECT 
        (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${previousYear}') AS prevShipQty,
            (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${filterYear}') AS currentShipQty
        FROM dual
    )`)
    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], prevQty: row[2], currentQty: row[3]
    }))
    return result[0]
}

export async function getProfit(connection, type = "YEAR", filterYear, previousYear) {
    let result;
    if (type === "YEAR") {
        result = await connection.execute(`
      select 
        COALESCE(ROUND(prevValue),0) as prevValue,
        COALESCE(ROUND(currentValue),0) as currentValue,
                 COALESCE(ROUND(prevShipQty), 0) AS prevQty,
        COALESCE(ROUND(currentShipQty), 0) AS currentQty
               from (
select 
(select sum(actprofit) 
from MISORDSALESVAL
WHERE finyr = '${filterYear}') as currentValue,
(select sum(actprofit) 
from MISORDSALESVAL
WHERE finyr = '${previousYear}' ) as prevValue,
  (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${previousYear}' and actprofit >0 ) AS prevShipQty,
            (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${filterYear}' and actprofit >0) AS currentShipQty
from dual) a
     `)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select 
        COALESCE(ROUND(prevValue),0) as prevValue,
        COALESCE(ROUND(currentValue),0) as currentValue
from (
select 
(select sum(actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE)
and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
) as currentValue,
(select sum(actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1) )
and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
) as prevValue
from dual) a
     `)
    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], prevQty: row[2], currentQty: row[3]

    }))
    return result[0]
}

export async function getNewCustomers(connection, type = "YEAR", filterYear, previousYear) {
    let result;
    if (type === "YEAR")  {
        const sql =`
       SELECT 
        COALESCE(ROUND(prevValue),0) as prevValue,
          COALESCE(ROUND(currentValue),0) as currentValue,
           COALESCE(ROUND(prevShipQty), 0) AS prevQty,
        COALESCE(ROUND(currentShipQty), 0) AS currentQty
          from(
          SELECT(  
       SELECT
        sum(MISORDSALESVAL.actsalval)
       FROM MISORDSALESVAL 
       LEFT JOIN GTFINANCIALYEAR ON GTFINANCIALYEAR.finyr = MISORDSALESVAL.finyr 
       WHERE TO_CHAR(GTFINANCIALYEAR.STARTDATE, 'YYYY') = extract(YEAR from CUSCRDT) and MISORDSALESVAL.finyr= '${filterYear}'
       ) as currentValue,
       (   
       SELECT
        sum(MISORDSALESVAL.actsalval)
       FROM MISORDSALESVAL 
       LEFT JOIN GTFINANCIALYEAR ON GTFINANCIALYEAR.finyr = MISORDSALESVAL.finyr 
       WHERE TO_CHAR(GTFINANCIALYEAR.STARTDATE, 'YYYY') = extract(YEAR from CUSCRDT) and MISORDSALESVAL.finyr= '${previousYear}'
       ) as prevValue,
      (SELECT SUM(shipQty) FROM MISORDSALESVAL LEFT JOIN GTFINANCIALYEAR ON GTFINANCIALYEAR.finyr = MISORDSALESVAL.finyr 
       WHERE TO_CHAR(GTFINANCIALYEAR.STARTDATE, 'YYYY') = extract(YEAR from CUSCRDT) and MISORDSALESVAL.finyr= '${previousYear}' ) AS prevShipQty,
            (SELECT SUM(shipQty) FROM MISORDSALESVAL  LEFT JOIN GTFINANCIALYEAR ON GTFINANCIALYEAR.finyr = MISORDSALESVAL.finyr 
       WHERE TO_CHAR(GTFINANCIALYEAR.STARTDATE, 'YYYY') = extract(YEAR from CUSCRDT) and MISORDSALESVAL.finyr= '${filterYear}') AS currentShipQty 
                  from dual)a
     `
    
     result = await connection.execute(sql)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select 
        COALESCE(ROUND(prevValue),0) as prevValue,
        COALESCE(ROUND(currentValue),0) as currentValue
        from (
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
        where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1) )
        and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        and extract(YEAR from CUSCRDT) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1))
         and extract(MONTH from CUSCRDT) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        ) as prevValue
        from dual) a
     `)
    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], prevQty: row[2], currentQty: row[3]

    }))
    return result[0]
}
export async function getTopCustomers(connection, type = "YEAR", filterYear, previousYear) {
    let result;
    if (type === "YEAR") {
        result = await connection.execute(`
          select 
        (select round(sum(turnover)) 
        from (
        select customer, coalesce(sum(actsalval),0) as turnover
        from MISORDSALESVAL
        WHERE finyr = '${previousYear}'
        group by customer order by turnover desc
        )
        where rownum <= 5
        ) as prevValue,
(
select round(sum(turnover)) 
from (
select customer, coalesce(sum(actsalval),0) as turnover
from MISORDSALESVAL
WHERE finyr = '${filterYear}' 
group by customer order by turnover desc
)
where rownum <= 5
) as currentValue,
      (select round(sum(totalShipQty)) 
        from (
        select customer, coalesce(sum(shipQty),0) as totalShipQty
        from MISORDSALESVAL
        WHERE finyr = '${previousYear}'
        group by customer order by totalShipQty desc
        )
        where rownum <= 5
        ) as prevQty,
       ( select round(sum(totalShipQty)) 
from (
select customer, coalesce(sum(shipQty),0) as totalShipQty
from MISORDSALESVAL
WHERE finyr = '${filterYear}'
group by customer order by totalShipQty desc
)
where rownum <= 5
) as currentValue
from dual
     `)
    } else if (type === "MONTH") {
        result = await connection.execute(`
        select 
        (select round(sum(turnover)) 
        from (
        select customer, coalesce(sum(actsalval),0) as turnover
        from MISORDSALESVAL
        where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1))
          and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
        group by customer order by turnover desc
        )
        where rownum <= 5
        ) as prevValue,
        (
        select round(sum(turnover)) 
        from (
        select customer, coalesce(sum(actsalval),0) as turnover
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
        prevValue: row[0], currentValue: row[1], prevQty: row[2], currentQty: row[3]
    }))
    return result[0]
}

export async function getLoss(connection, type = "YEAR", filterYear, previousYear) {
    let result;
    if (type === "YEAR") {
     const sql = `
        select 
        COALESCE(ROUND(prevValue),0) as prevValue,
        COALESCE(ROUND(currentValue),0) as currentValue,
          COALESCE(ROUND(prevShipQty), 0) AS prevQty,
        COALESCE(ROUND(currentShipQty), 0) AS currentQty
from (
select 
(select sum( actprofit ) 
from MISORDSALESVAL
       WHERE finyr = '${filterYear}'and actprofit<0) as currentValue,
(select sum(actprofit  ) 
from MISORDSALESVAL
       WHERE finyr = '${previousYear}' and actprofit<0) as prevValue,
                    (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${previousYear}' and actprofit<0) AS prevShipQty,
            (SELECT SUM(shipQty) FROM MISORDSALESVAL WHERE finyr = '${filterYear}' and actprofit<0) AS currentShipQty
from dual) a
     `

     result = await connection.execute(sql)

    } else if (type === "MONTH") {
        result = await connection.execute(`
        select 
        COALESCE(ROUND(prevValue),0) as prevValue,
        COALESCE(ROUND(currentValue),0) as currentValue
from (
select 
(select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from CURRENT_DATE) 
and extract(MONTH from bpodate) = extract(MONTH from CURRENT_DATE)
and actprofit < 0) as currentValue  ,
(select sum(0 - actprofit) 
from MISORDSALESVAL
where extract(YEAR from bpodate) = extract(YEAR from ADD_MONTHS(CURRENT_DATE, -1) ) 
  and extract(MONTH from bpodate) = extract(MONTH from ADD_MONTHS(CURRENT_DATE, -1))
and actprofit < 0) as prevValue
from dual) a
     `)

    }
    result = result.rows.map(row => ({
        prevValue: row[0], currentValue: row[1], prevQty: row[2], currentQty: row[3]

    }))
    return result[0]
}