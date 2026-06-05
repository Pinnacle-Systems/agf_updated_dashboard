import oracledb from "oracledb";
import { getConnection, getConnectionERP } from "../constants/db.connection.js";


function mapResultRows(queryResult) {
  if (!queryResult || !queryResult.rows) return [];
  return queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );
}


export async function getProcessDetails(req, res) {
  const connection = await getConnectionERP(res);

  try {
    const { selectedYear } = req.query;
    const year = selectedYear.split("-");
    const FROMDATE = `01/04/20${year[0]}`;
    const TODATE = `31/03/20${year[1]}`;

    let result = [];

    const sql = `
SELECT 
    COMPANY,
    SUM(GRNQTY)                             AS TOTAL_GRN_QTY,
    ROUND(SUM(GRNQTY * JOBRATE), 2)         AS TOTAL_VALUE
FROM (
    -- 1. Accessory Process
    SELECT 
        J.COMPCODE                          AS COMPANY,
        B.TOTALRECQTY                       AS GRNQTY,
        B.JOBRATE                           AS JOBRATE
    FROM 
        GTACCPROREC A, GTACCPRORECDTL B, GTACCMAST C,
        GTBUYERMAST D, GTCOMPMAST E, GTACCPROJO F,
        GTCOLORMAST G, GTUNITMAST H, GTSIZEMAST I, GTCOMPMAST J
    WHERE 
        A.GTACCPRORECID = B.GTACCPRORECID
        AND B.ALIASNAME = C.GTACCMASTID
        AND A.BUYERCODE = D.GTBUYERMASTID
        AND A.COMPCODE  = E.GTCOMPMASTID
        AND A.JOBNO     = F.GTACCPROJOID
        AND B.ACCCOLOR  = G.GTCOLORMASTID
        AND B.UOM       = H.GTUNITMASTID
        AND B.ACCSIZE   = I.GTSIZEMASTID
        AND A.COMPCODE  = J.GTCOMPMASTID
        AND A.APIDATE   BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') 
                            AND TO_DATE('${TODATE}', 'DD/MM/YYYY')

    UNION ALL

    -- 2. Yarn Process
    SELECT 
        H.COMPCODE                          AS COMPANY,
        B.TOTALRECQTY                       AS GRNQTY,
        B.JOBRATE                           AS JOBRATE
    FROM 
        GTYARNPRORECEIPT A, GTYARNPRORECEIPTDET B, GTYARNMASTER C,
        GTBUYERMAST D, GTCOMPMAST E, GTYARNPROJO F,
        GTCOLORMAST G, GTCOMPMAST H, GTPROCESSMAST I
    WHERE 
        A.GTYARNPRORECEIPTID = B.GTYARNPRORECEIPTID
        AND B.ALIASNAME   = C.GTYARNMASTERID
        AND A.BUYERCODE   = D.GTBUYERMASTID
        AND A.COMPCODE    = E.GTCOMPMASTID
        AND A.JOBNO       = F.GTYARNPROJOID
        AND B.COLOR       = G.GTCOLORMASTID
        AND A.COMPCODE    = H.GTCOMPMASTID
        AND A.PROCESSNAME = I.GTPROCESSMASTID
        AND A.YPISDATE    BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') 
                              AND TO_DATE('${TODATE}', 'DD/MM/YYYY')

    UNION ALL

    -- 3. Fabric Process
    SELECT 
        O.COMPCODE                          AS COMPANY,
        B.TOTRECQTY                         AS GRNQTY,
        B.JOBPRICE                          AS JOBRATE
    FROM 
        GTFABPROREC A, GTFABPRORECDTL B, GTFABRICMAST C,
        GTBUYERMAST D, GTCOMPMAST E, GTFABPROJOBORD F,
        GTCOLORMAST G, GTDESIGNMAST H, GTGSMMAST I,
        GTGGMAST K, GTLOOPMAST L, GTDIAMAST M, GTDIAMAST N,
        GTCOMPMAST O
    WHERE 
        A.GTFABPRORECID = B.GTFABPRORECID
        AND B.ALIASNAME = C.GTFABRICMASTID
        AND A.BUYERCODE = D.GTBUYERMASTID
        AND A.COMPCODE  = E.GTCOMPMASTID
        AND A.JOBNO     = F.GTFABPROJOBORDID
        AND B.COLOR     = G.GTCOLORMASTID
        AND B.DESIGN    = H.GTDESIGNMASTID
        AND B.GSM       = I.GTGSMMASTID
        AND B.GG        = K.GTGGMASTID
        AND B.LL        = L.GTLOOPMASTID
        AND B.KDIA      = M.GTDIAMASTID
        AND B.FDIA      = N.GTDIAMASTID
        AND A.COMPCODE  = O.GTCOMPMASTID
        AND A.FPDDATE   BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') 
                            AND TO_DATE('${TODATE}', 'DD/MM/YYYY')

) PROCESS_DATA
GROUP BY 
    COMPANY
ORDER BY 
    COMPANY
`;
    console.log("Executing SQL:", sql);

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetails data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
export async function getProcessDetailsTable(req, res) {
  const connection = await getConnectionERP(res);

  try {
    let result = [];
    const { finyear, buyer, status } = req.query;

    const sql = `
SELECT j.compcode,F.APJNO JOBNO,F.APJDATE JOBDATE, A.APINO DOCID,A.APIDATE DOCDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,C.aliasname,G.COLORNAME COLOR,I.SIZENAME accsize, H.UNITNAME UOM,
SUM(B.TOTALRECQTY) GRNQTY,AVG(B.JOBRATE) JOBRATE
FROM GTACCPROREC A,GTACCPRORECDTL B,GTACCMAST C,GTBUYERMAST D,GTCOMPMAST E,GTACCPROJO F,GTCOLORMAST G,gtunitmast H,gtsizemast i,gtcompmast j
WHERE A.GTACCPRORECID=B.GTACCPRORECID AND B.aliasname=C.gtaccmastid AND A.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND A.JOBNO=F.GTACCPROJOID AND B.acccolor=G.GTCOLORMASTID and B.UOM=h.gtunitmasTid and B.ACCSIZE=i.gtsizemastid and a.compcode=j.gtcompmastid
AND A.SUPPLIER not in  ('ANUGRAHA FASHION MILL PRIVATE LIMITED','FREELOOK FASHIONS','FREELOOK FASHIONS - DYEING DIVISION')
AND 
E.COMPCODE<>'TIPL'
GROUP BY A.APINO,A.APIDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,C.aliasname,F.APJNO ,F.APJDATE,B.aliasname,B.acccolor,G.COLORNAME,H.UNITNAME,i.sizename,j.compcode
ORDER BY A.APIDATE

`;
    // A.APIDATE BETWEEN :FROMDATE AND :TODATE AND 
    const queryResult = await connection.execute(sql);
    console.log("getProcessDetailsTable", queryResult);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );
    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetailsTable data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}


export async function getAccessoryProcessDetails(req, res) {
  const connection = await getConnectionERP(res);

  try {
    const { selectedYear, buyer } = req.query;

    const year = selectedYear.split("-");
    const FROMDATE = `01/04/20${year[0]}`;
    const TODATE = `31/03/20${year[1]}`;


    let result = [];

    const sql = `
  SELECT 
      j.compcode                          AS COMPANY,
      COUNT(DISTINCT A.APINO)             AS TOTAL_DOCUMENTS,
      COUNT(DISTINCT F.APJNO)             AS TOTAL_JOBS,
      COUNT(DISTINCT A.SUPPLIER)          AS TOTAL_SUPPLIERS,
      COUNT(DISTINCT D.BUYERCODE)         AS TOTAL_BUYERS,
      SUM(B.TOTALRECQTY)                  AS TOTAL_GRN_QTY,
      AVG(B.JOBRATE)                      AS AVG_JOB_RATE,
      SUM(B.TOTALRECQTY * B.JOBRATE)      AS TOTAL_VALUE
  FROM 
      GTACCPROREC       A,
      GTACCPRORECDTL    B,
      GTACCMAST         C,
      GTBUYERMAST       D,
      GTCOMPMAST        E,
      GTACCPROJO        F,
      GTCOLORMAST       G,
      GTUNITMAST        H,
      GTSIZEMAST        I,
      GTCOMPMAST        J
  WHERE 
      A.GTACCPRORECID   = B.GTACCPRORECID
      AND B.ALIASNAME   = C.GTACCMASTID
      AND A.BUYERCODE   = D.GTBUYERMASTID
      AND A.COMPCODE    = E.GTCOMPMASTID
      AND A.JOBNO       = F.GTACCPROJOID
      AND B.ACCCOLOR    = G.GTCOLORMASTID
      AND B.UOM         = H.GTUNITMASTID
      AND B.ACCSIZE     = I.GTSIZEMASTID
      AND A.COMPCODE    = J.GTCOMPMASTID
      AND A.SUPPLIER NOT IN (
          'ANUGRAHA FASHION MILL PRIVATE LIMITED',
          'FREELOOK FASHIONS',
          'FREELOOK FASHIONS - DYEING DIVISION'
      )
      AND E.COMPCODE ${buyer !== "" ? ` = '${buyer}' ` : ""}
      AND A.APIDATE BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') 
                            AND TO_DATE('${TODATE}', 'DD/MM/YYYY')
  GROUP BY 
      J.COMPCODE
  ORDER BY 
      J.COMPCODE
`;
    console.log("getAccessoryProcessDetails", sql);

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetails data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
export async function getAccessoryProcessDetailsTable(req, res) {
  const connection = await getConnectionERP(res);

  try {
    let result = [];
    const { finyear, buyer, status } = req.query;


    const year = finyear.split("-");
    const FROMDATE = `01/04/20${year[0]}`;
    const TODATE = `31/03/20${year[1]}`;

    const sql = `
SELECT j.compcode,F.APJNO JOBNO,F.APJDATE JOBDATE, A.APINO DOCID,A.APIDATE DOCDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,C.aliasname,G.COLORNAME COLOR,I.SIZENAME accsize, H.UNITNAME UOM,
SUM(B.TOTALRECQTY) GRNQTY,AVG(B.JOBRATE) JOBRATE
FROM GTACCPROREC A,GTACCPRORECDTL B,GTACCMAST C,GTBUYERMAST D,GTCOMPMAST E,GTACCPROJO F,GTCOLORMAST G,gtunitmast H,gtsizemast i,gtcompmast j
WHERE A.GTACCPRORECID=B.GTACCPRORECID AND B.aliasname=C.gtaccmastid AND A.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND A.JOBNO=F.GTACCPROJOID AND B.acccolor=G.GTCOLORMASTID and B.UOM=h.gtunitmasTid and B.ACCSIZE=i.gtsizemastid and a.compcode=j.gtcompmastid
AND A.SUPPLIER not in  ('ANUGRAHA FASHION MILL PRIVATE LIMITED','FREELOOK FASHIONS','FREELOOK FASHIONS - DYEING DIVISION')
AND A.APIDATE BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') AND TO_DATE('${TODATE}', 'DD/MM/YYYY') AND E.COMPCODE ${buyer !== "" ? ` = '${buyer}' ` : ""}
GROUP BY A.APINO,A.APIDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,C.aliasname,F.APJNO ,F.APJDATE,B.aliasname,B.acccolor,G.COLORNAME,H.UNITNAME,i.sizename,j.compcode
ORDER BY A.APIDATE



`;
    console.log("getAccessoryProcessDetailsTable", sql);
    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );
    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetailsTable data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



export async function getYarnProcessData(req, res) {
  const connection = await getConnectionERP(res);

  try {
    const { selectedYear, buyer } = req.query;

    const year = selectedYear.split("-");
    const FROMDATE = `01/04/20${year[0]}`;
    const TODATE = `31/03/20${year[1]}`;

    let result = [];

    const sql = `
  SELECT 
      H.COMPCODE                          AS COMPANY,
      COUNT(DISTINCT A.YPISNO)            AS TOTAL_DOCUMENTS,
      COUNT(DISTINCT F.GTYARNPROJOID)     AS TOTAL_JOBS,
      COUNT(DISTINCT A.SUPPLIER)          AS TOTAL_SUPPLIERS,
      COUNT(DISTINCT A.BUYERCODE)         AS TOTAL_BUYERS,
      SUM(B.TOTALRECQTY)                  AS TOTAL_GRN_QTY,
      AVG(B.JOBRATE)                      AS AVG_JOB_RATE,
      SUM(B.TOTALRECQTY * B.JOBRATE)      AS TOTAL_VALUE
  FROM 
      GTYARNPRORECEIPT      A,
      GTYARNPRORECEIPTDET   B,
      GTYARNMASTER          C,
      GTBUYERMAST           D,
      GTCOMPMAST            E,
      GTYARNPROJO           F,
      GTCOLORMAST           G,
      GTCOMPMAST            H,
      GTPROCESSMAST         I
  WHERE 
      A.GTYARNPRORECEIPTID  = B.GTYARNPRORECEIPTID
      AND B.ALIASNAME       = C.GTYARNMASTERID
      AND A.BUYERCODE       = D.GTBUYERMASTID
      AND A.COMPCODE        = E.GTCOMPMASTID
      AND A.JOBNO           = F.GTYARNPROJOID
      AND B.COLOR           = G.GTCOLORMASTID
      AND A.COMPCODE        = H.GTCOMPMASTID
      AND A.PROCESSNAME     = I.GTPROCESSMASTID
      AND A.SUPPLIER NOT IN (
          'ANUGRAHA FASHION MILL PRIVATE LIMITED - SPINNING',
          'FREELOOK FASHIONS',
          'FREELOOK FASHIONS - DYEING DIVISION'
      )
      AND E.COMPCODE ${buyer !== "" ? ` = '${buyer}' ` : ""}
      AND A.YPISDATE BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') 
                         AND TO_DATE('${TODATE}', 'DD/MM/YYYY')
  GROUP BY 
      H.COMPCODE
  ORDER BY 
      H.COMPCODE
`;
    console.log("getYarnProcessData", sql);

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetails data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
export async function getYarnProcessDetailsTable(req, res) {
  const connection = await getConnectionERP(res);

  try {
    let result = [];
    const { finyear, buyer, status } = req.query;


    const year = finyear.split("-");
    const FROMDATE = `01/04/20${year[0]}`;
    const TODATE = `31/03/20${year[1]}`;


    const sql = `
SELECT H.COMPCODE,F.DOCID JOBNO,F.DOCDATE JOBDATE, A.YPISNO DOCID,A.YPISDATE DOCDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,I.PROCESSNAME,C.YARNNAME,
G.COLORNAME COLOR,SUM(B.TOTALRECQTY) GRNQTY,AVG(B.JOBRATE) JOBRATE
FROM GTYARNPRORECEIPT A,GTYARNPRORECEIPTDET B,GTYARNMASTER C,GTBUYERMAST D,GTCOMPMAST E,GTYARNPROJO F,GTCOLORMAST G,GTCOMPMAST H,GTPROCESSMAST I
WHERE A.GTYARNPRORECEIPTID=B.GTYARNPRORECEIPTID AND B.ALIASNAME=C.GTYARNMASTERID AND A.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND A.JOBNO=F.GTYARNPROJOID AND B.COLOR=G.GTCOLORMASTID AND A.COMPCODE=H.GTCOMPMASTID AND A.PROCESSNAME=I.GTPROCESSMASTID
AND A.SUPPLIER NOT IN ('ANUGRAHA FASHION MILL PRIVATE LIMITED - SPINNING','FREELOOK FASHIONS','FREELOOK FASHIONS - DYEING DIVISION')
AND A.YPISDATE BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') AND TO_DATE('${TODATE}', 'DD/MM/YYYY') AND E.COMPCODE ${buyer !== "" ? ` = '${buyer}' ` : ""}
GROUP BY A.YPISNO,A.YPISDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,C.YARNNAME,F.DOCID ,F.DOCID,F.DOCDATE,G.COLORNAME,H.COMPCODE,I.PROCESSNAME
ORDER BY A.YPISDATE

`;
    // A.APIDATE BETWEEN :FROMDATE AND :TODATE AND 
    const queryResult = await connection.execute(sql);
    console.log("getProcessDetailsTable", queryResult);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );
    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetailsTable data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

export async function getDyedFabricProcessData(req, res) {
  const connection = await getConnectionERP(res);

  try {
    const { selectedYear, buyer } = req.query;

    const year = selectedYear.split("-");
    console.log("selectedYear", selectedYear);
    console.log("year", year);
    const FROMDATE = `01/04/20${year[0]}`;
    const TODATE = `31/03/20${year[1]}`;

    console.log("FROMDATE", FROMDATE);
    console.log("TODATE", TODATE);

    let result = [];

    const sql = `
  SELECT 
      O.COMPCODE                          AS COMPANY,
      COUNT(DISTINCT A.FPDNO)             AS TOTAL_DOCUMENTS,
      COUNT(DISTINCT F.FPJNO)             AS TOTAL_JOBS,
      COUNT(DISTINCT A.SUPPLIER)          AS TOTAL_SUPPLIERS,
      COUNT(DISTINCT A.BUYERCODE)         AS TOTAL_BUYERS,
      SUM(B.TOTRECQTY)                    AS TOTAL_GRN_QTY,
      AVG(B.JOBPRICE)                     AS AVG_JOB_RATE,
      SUM(B.TOTRECQTY * B.JOBPRICE)       AS TOTAL_VALUE
  FROM 
      GTFABPROREC       A,
      GTFABPRORECDTL    B,
      GTFABRICMAST      C,
      GTBUYERMAST       D,
      GTCOMPMAST        E,
      GTFABPROJOBORD    F,
      GTCOLORMAST       G,
      GTDESIGNMAST      H,
      GTGSMMAST         I,
      GTGGMAST          K,
      GTLOOPMAST        L,
      GTDIAMAST         M,
      GTDIAMAST         N,
      GTCOMPMAST        O
  WHERE 
      A.GTFABPRORECID = B.GTFABPRORECID
      AND B.ALIASNAME = C.GTFABRICMASTID
      AND A.BUYERCODE = D.GTBUYERMASTID
      AND A.COMPCODE  = E.GTCOMPMASTID
      AND A.JOBNO     = F.GTFABPROJOBORDID
      AND B.COLOR     = G.GTCOLORMASTID
      AND B.DESIGN    = H.GTDESIGNMASTID
      AND B.GSM       = I.GTGSMMASTID
      AND B.GG        = K.GTGGMASTID
      AND B.LL        = L.GTLOOPMASTID
      AND B.KDIA      = M.GTDIAMASTID
      AND B.FDIA      = N.GTDIAMASTID
      AND A.COMPCODE  = O.GTCOMPMASTID
      AND A.SUPPLIER NOT IN (
          'ANUGRAHA FASHION MILL PRIVATE LIMITED - KNITTING',
          'FREELOOK FASHIONS - DYEING DIVISION'
      )
      AND E.COMPCODE ${buyer !== "" ? ` = '${buyer}' ` : " = O.COMPCODE "}
      AND A.FPDDATE BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') AND TO_DATE('${TODATE}', 'DD/MM/YYYY')
  GROUP BY 
      O.COMPCODE
  ORDER BY 
      O.COMPCODE
`;
    console.log("getDyedFabricProcessData", sql);

    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );

    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetails data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
export async function getDyedFabricProcessDetailsTable(req, res) {
  const connection = await getConnectionERP(res);

  try {
    let result = [];
    const { finyear, buyer, status } = req.query;

    const year = finyear.split("-");
    const FROMDATE = `01/04/20${year[0]}`;
    const TODATE = `31/03/20${year[1]}`;

    const sql = `
SELECT o.compcode,F.FPJNO JOBNO,F.FPJDATE JOBDATE, A.FPDNO DOCID,A.FPDDATE DOCDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,C.FABALIASNAME FABRIC,H.DESIGN,G.COLORNAME COLOR,
I.GSM,K.GG,L.LL,M.DIA KDIA,N.DIA FDIA,SUM(B.TOTRECQTY) GRNQTY,AVG(B.JOBPRICE) JOBRATE
FROM GTFABPROREC A,GTFABPRORECDTL B,GTFABRICMAST C,GTBUYERMAST D,GTCOMPMAST E,GTFABPROJOBORD F,GTCOLORMAST G,GTDESIGNMAST H,GTGSMMAST I,
GTGGMAST K,GTLOOPMAST L,GTDIAMAST M,GTDIAMAST N,gtcompmast o
WHERE A.GTFABPRORECID=B.GTFABPRORECID AND B.ALIASNAME=C.GTFABRICMASTID AND A.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND A.JOBNO=F.GTFABPROJOBORDID AND B.COLOR=G.GTCOLORMASTID AND B.DESIGN=H.GTDESIGNMASTID AND B.GSM=I.GTGSMMASTID AND B.GG=K.GTGGMASTID 
AND B.LL=L.GTLOOPMASTID AND B.KDIA=M.GTDIAMASTID AND B.FDIA=N.GTDIAMASTID and a.compcode=o.gtcompmastid
AND A.SUPPLIER NOT IN ( 'ANUGRAHA FASHION MILL PRIVATE LIMITED - KNITTING','FREELOOK FASHIONS - DYEING DIVISION')
AND A.FPDDATE BETWEEN TO_DATE('${FROMDATE}', 'DD/MM/YYYY') AND TO_DATE('${TODATE}', 'DD/MM/YYYY') AND E.COMPCODE ${buyer !== "" ? ` = '${buyer}' ` : ""}
GROUP BY A.FPDNO,A.FPDDATE,A.SUPPLIER,A.ORDERNO,D.BUYERCODE,C.FABALIASNAME,F.FPJNO ,F.FPJDATE,B.ALIASNAME,B.COLOR,G.COLORNAME,H.DESIGN,
I.GSM,K.GG,L.LL,M.DIA,N.DIA,o.compcode
ORDER BY A.FPDDATE


`;
    console.log("getDyedFabricProcessDetailsTable", sql);
    const queryResult = await connection.execute(sql);

    result = queryResult.rows.map((row) =>
      queryResult.metaData.reduce((acc, column, index) => {
        acc[column.name] = row[index];
        return acc;
      }, {})
    );
    return res.json({
      statusCode: 0,
      data: result,
    });
  } catch (err) {
    console.error("Error retrieving getProcessDetailsTable data:", err);

    return res.status(500).json({
      statusCode: 1,
      error: err.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}



export async function getWorkOrderBillRegisterData(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {


    const sql = `
SELECT 
    C.COMPCODE,
    SUM(A.NETAMOUNT) AS TOTALAMOUNT
FROM GTWOBILLENTRY A
JOIN GTCOMPMAST C
    ON A.COMPCODE = C.GTCOMPMASTID
JOIN GTFINANCIALYEAR M
    ON A.FINYR = M.GTFINANCIALYEARID
WHERE M.FINYR = '${selectedYear}'
GROUP BY C.COMPCODE
ORDER BY C.COMPCODE
    `

    console.log("getWorkOrderBillRegisterData", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}


export async function getWorkOrderBillRegisterDetailsTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {


    const sql = `

SELECT  L.ALIASNAME, A.GTWOBILLENTRYID ,BB.WONO,BB.WODATE,A.WORKBILLNO,A.WORKBILLDATE,A.SUPPLIER SUPPLIER1,BB.WOTYPES,G.WODESC,H.ITEMGRPNAME,
I.ITEMNAME,B.DESCRIPTION ,J.UNITNAME UOM,B.WOQTY,B.BILLRATE,B.AMOUNT,B.BILLAMT GROSAMT,((B.BILLQTY*B.BILLRATE)*B.TAX/100)+(B.BILLQTY*B.BILLRATE) TAXAMOUNT,
A.GROSSAMOUNT,A.NETAMOUNT,K.PAYTERM,A.REMARKS,B.PARTYBILLNO,B.PARTYBILLDATE,B.BILLQTY,
B.DISCTYPE,B.DVAL,B.ORDERNO,B.CCATEGORY,L.PROJECTNAME
FROM GTWOBILLENTRY A
JOIN GTWOBILLENTRYDET B ON A.GTWOBILLENTRYID=B.GTWOBILLENTRYID
JOIN GTWORKORDER BB ON B.WONO=BB.GTWORKORDERID
JOIN GTWORKORDERDET B1 ON BB.GTWORKORDERID=B1.GTWORKORDERID AND B.DETAILID=B1.GTWORKORDERDETID
JOIN GTCOMPMAST C ON A.COMPCODE =C.GTCOMPMASTID
JOIN GTFINANCIALYEAR D ON A.FINYR =D.GTFINANCIALYEARID
JOIN GTWODESCMAST G ON B.WODESC =G.GTWODESCMASTID
JOIN GTITEMGRPMAST H ON B1.ITEMGROUP =H.GTITEMGRPMASTID
JOIN GTGENITEMMAST I ON B.ITEMNAME =I.GTGENITEMMASTID 
JOIN GTUNITMAST J ON B.UOM =J.GTUNITMASTID
JOIN GTPAYTERMS K ON BB.PAYTERMS =K.GTPAYTERMSID
LEFT JOIN GTPROJECTMAST L ON L.GTPROJECTMASTID=BB.PROJECTNAME
JOIN GTFINANCIALYEAR M
    ON A.FINYR = M.GTFINANCIALYEARID
WHERE C.COMPCODE = '${companyName}'
      AND M.FINYR = '${selectedYear}'
    `

    console.log("getWorkOrderBillRegisterData", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}