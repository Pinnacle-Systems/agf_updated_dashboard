import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

// Helper to convert Oracle query results into object lists
function mapResultRows(queryResult) {
  if (!queryResult || !queryResult.rows) return [];
  return queryResult.rows.map((row) =>
    queryResult.metaData.reduce((acc, column, index) => {
      acc[column.name] = row[index];
      return acc;
    }, {})
  );
}


export async function getGeneralGRNDetails(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {


    const sql = `
SELECT 
    SUM(GRNQTY)        AS TOTAL_GRNQTY,
    AVG(PORATE)        AS AVG_PORATE,
    SUM(GRNQTY * PORATE) AS TOTAL_VALUE
FROM 
(SELECT E.COMPCODE,F.DOCID PONO,F.DOCDATE PODATE, A.DOCID GRNNO,A.DOCDATE GRNDATE,A.SUPPLIER,FF.PROJECTNAME,C.ITEMNAME,G.UNITNAME UOM,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.RETQTY1) GRNQTY
FROM GTGENPI AA,GTGENPIRETSTKDET BB,GTGENITEMMAST CC,GTCOMPMAST EE ,GTGENPIDET FF
WHERE AA.GTGENPIID=BB.GTGENPIID AND AA.GTGENPIID=FF.GTGENPIID AND BB.GTGENPIID=FF.GTGENPIID AND BB.GTGENPIDETID=FF.GTGENPIDETID
AND FF.ITEMNAME =CC.GTGENITEMMASTID  AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ITEMNAME=B.ITEMNAME
AND AA.PTRANSACTION='Grey Yarn Purchase Return'
),0) GRNQTY,AVG(B.PORATE) PORATE,H.ITEMGRPNAME,J.CCATEGORY
FROM GTGENPI A
JOIN GTGENPIDET B ON B.GTGENPIID=A.GTGENPIID
JOIN GTGENITEMMAST C ON B.ITEMNAME=C.GTGENITEMMASTID
JOIN GTCOMPMAST E ON A.COMPCODE=E.GTCOMPMASTID
JOIN GTGENPO F ON B.PONO=F.GTGENPOID
JOIN GTPROJECTMAST FF ON FF.GTPROJECTMASTID=F.PROJECTNAME
JOIN GTUNITMAST G ON B.UOM=G.GTUNITMASTID
JOIN GTITEMGRPMAST H ON C.GROUPNAME = H.GTITEMGRPMASTID
JOIN GTGENPODET J ON F.GTGENPOID=J.GTGENPOID
JOIN GTFINANCIALYEAR K ON K.GTFINANCIALYEARID = A.FINYEAR
WHERE K.FINYR = '${selectedYear}'
AND E.COMPCODE = '${companyName}'
GROUP BY A.DOCID,A.DOCDATE,A.SUPPLIER,C.ITEMNAME,F.DOCID ,F.DOCDATE,B.PONO,B.ITEMNAME,E.COMPCODE,G.UNITNAME,H.ITEMGRPNAME,FF.PROJECTNAME,J.CCATEGORY
)
    `

    console.log("getGeneralGRNDetails", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}



export async function getGeneralGRNTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {


    const sql = `

SELECT E.COMPCODE,F.DOCID PONO,F.DOCDATE PODATE, A.DOCID GRNNO,A.DOCDATE GRNDATE,A.SUPPLIER,FF.PROJECTNAME,C.ITEMNAME,G.UNITNAME UOM,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.RETQTY1) GRNQTY
FROM GTGENPI AA,GTGENPIRETSTKDET BB,GTGENITEMMAST CC,GTCOMPMAST EE ,GTGENPIDET FF
WHERE AA.GTGENPIID=BB.GTGENPIID AND AA.GTGENPIID=FF.GTGENPIID AND BB.GTGENPIID=FF.GTGENPIID AND BB.GTGENPIDETID=FF.GTGENPIDETID
AND FF.ITEMNAME =CC.GTGENITEMMASTID  AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ITEMNAME=B.ITEMNAME
AND AA.PTRANSACTION='Grey Yarn Purchase Return'
),0) GRNQTY,AVG(B.PORATE) PORATE,H.ITEMGRPNAME,J.CCATEGORY
FROM GTGENPI A
JOIN GTGENPIDET B ON B.GTGENPIID=A.GTGENPIID
JOIN GTGENITEMMAST C ON B.ITEMNAME=C.GTGENITEMMASTID
JOIN GTCOMPMAST E ON A.COMPCODE=E.GTCOMPMASTID
JOIN GTGENPO F ON B.PONO=F.GTGENPOID
JOIN GTPROJECTMAST FF ON FF.GTPROJECTMASTID=F.PROJECTNAME
JOIN GTUNITMAST G ON B.UOM=G.GTUNITMASTID
JOIN GTITEMGRPMAST H ON C.GROUPNAME = H.GTITEMGRPMASTID
JOIN GTGENPODET J ON F.GTGENPOID=J.GTGENPOID
JOIN GTFINANCIALYEAR K ON K.GTFINANCIALYEARID = A.FINYEAR
WHERE K.FINYR = '${selectedYear}'
AND E.COMPCODE = '${companyName}'
GROUP BY A.DOCID,A.DOCDATE,A.SUPPLIER,C.ITEMNAME,F.DOCID ,F.DOCDATE,B.PONO,B.ITEMNAME,E.COMPCODE,G.UNITNAME,H.ITEMGRPNAME,FF.PROJECTNAME,J.CCATEGORY
ORDER BY A.DOCDATE
`

    console.log("getGeneralGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}


export async function getGreyFabricGRNDetails(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
    SELECT 
    SUM(GRNQTY)        AS TOTAL_GRNQTY,
    AVG(PORATE)        AS AVG_PORATE,
    SUM(GRNQTY * PORATE) AS TOTAL_VALUE
FROM 
(
SELECT o.compcode,F.DOCID PONO,F.DOCDATE PODATE, A.FPINO DOCID,A.FPIDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.FABALIASNAME FABRIC,H.DESIGN,G.COLORNAME COLOR,
I.GSM,K.GG,L.LL,M.DIA KDIA,N.DIA FDIA,B.TOTALGRNQTY GRNQTY,
B.PORATE PORATE
FROM GTFabPurInward A,GTFabPurInwardDet B,GTFABRICMAST C,GTBUYERMAST D,GTCOMPMAST E,GTfabricPO F,GTCOLORMAST G,GTDESIGNMAST H,GTGSMMAST I,
GTGGMAST K,GTLOOPMAST L,GTDIAMAST M,GTDIAMAST N,gtcompmast o,GTFINANCIALYEAR P  
WHERE A.GTFabPurInwardID=B.GTFabPurInwardID AND B.ALIASNAME=C.GTFABRICMASTID AND B.BUYERCODE=D.BUYERCODE AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTFABRICPOID AND B.COLOR=G.GTCOLORMASTID AND B.DESIGN=H.GTDESIGNMASTID AND B.GSM=I.GTGSMMASTID AND B.GG=K.GTGGMASTID AND P.GTFINANCIALYEARID = A.FINYEAR
AND B.LL=L.GTLOOPMASTID AND B.KDIA=M.GTDIAMASTID AND B.FDIA=N.GTDIAMASTID and a.compcode=o.gtcompmastid 
AND A.SUPPLIER NOT IN ( 'ANUGRAHA FASHION MILL PRIVATE LIMITED - KNITTING','FREELOOK FASHIONS - DYEING DIVISION')
AND P.FINYR = '${selectedYear}'
AND E.COMPCODE = '${companyName}'
ORDER BY F.DOCID,A.FPINO)
    `

    console.log("getGeneralGRNDetails", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

export async function getGreyFabricGRNTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {


    const sql = `

SELECT o.compcode,F.DOCID PONO,F.DOCDATE PODATE, A.FPINO DOCID,A.FPIDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.FABALIASNAME FABRIC,H.DESIGN,G.COLORNAME COLOR,
I.GSM,K.GG,L.LL,M.DIA KDIA,N.DIA FDIA,B.TOTALGRNQTY GRNQTY,
B.PORATE PORATE
FROM GTFabPurInward A,GTFabPurInwardDet B,GTFABRICMAST C,GTBUYERMAST D,GTCOMPMAST E,GTfabricPO F,GTCOLORMAST G,GTDESIGNMAST H,GTGSMMAST I,
GTGGMAST K,GTLOOPMAST L,GTDIAMAST M,GTDIAMAST N,gtcompmast o ,GTFINANCIALYEAR P  
WHERE A.GTFabPurInwardID=B.GTFabPurInwardID AND B.ALIASNAME=C.GTFABRICMASTID AND B.BUYERCODE=D.BUYERCODE AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTFABRICPOID AND B.COLOR=G.GTCOLORMASTID AND B.DESIGN=H.GTDESIGNMASTID AND B.GSM=I.GTGSMMASTID AND B.GG=K.GTGGMASTID AND P.GTFINANCIALYEARID = A.FINYEAR
AND B.LL=L.GTLOOPMASTID AND B.KDIA=M.GTDIAMASTID AND B.FDIA=N.GTDIAMASTID and a.compcode=o.gtcompmastid 
AND A.SUPPLIER NOT IN ( 'ANUGRAHA FASHION MILL PRIVATE LIMITED - KNITTING','FREELOOK FASHIONS - DYEING DIVISION')
AND P.FINYR = '${selectedYear}'
AND E.COMPCODE = '${companyName}'
ORDER BY F.DOCID,A.FPINO
`

    console.log("getGeneralGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}



export async function getGreyYarnGRNDetails(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT
    SUM(GRNQTY)        AS TOTAL_GRNQTY,
    AVG(PORATE)        AS AVG_PORATE,
    SUM(GRNQTY * PORATE) AS TOTAL_VALUE
FROM
(
SELECT H.COMPCODE,F.DOCID PONO,B.PODATE, A.YPOINO DOCID,A.YPOINDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,G.COLORNAME COLOR,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.STORETQTY) GRNQTY
FROM GTYARNPOINWARD AA,gtypurstkdet BB,GTYARNMASTER CC,GTBUYERMAST DD,GTCOMPMAST EE ,GTYARNPOINWARDDET FF
WHERE AA.GTYARNPOINWARDID=BB.GTYARNPOINWARDID AND AA.GTYARNPOINWARDID=FF.GTYARNPOINWARDID AND BB.GTYARNPOINWARDID=FF.GTYARNPOINWARDID
AND BB.GTYARNPOINWARDDETID=FF.GTYARNPOINWARDDETID
AND BB.YARNNAME1=CC.YARNNAME AND BB.BUYERCODE1=DD.BUYERCODE AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ORDERNO=B.ORDERNO AND FF.YARNNAME=B.YARNNAME AND FF.COLORNAME=B.COLORNAME
AND AA.PTRANSACTION='Grey Yarn Purchase Return'
),0) GRNQTY,AVG(B.POPRICE) PORATE
FROM GTYARNPOINWARD A,GTYARNPOINWARDDET B,GTYARNMASTER C,GTBUYERMAST D,GTCOMPMAST E,GTYARNPO F,GTCOLORMAST G,GTCOMPMAST H,GTFINANCIALYEAR I
WHERE A.GTYARNPOINWARDID=B.GTYARNPOINWARDID AND B.YARNNAME=C.GTYARNMASTERID AND B.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTYARNPOID AND B.COLORNAME=G.GTCOLORMASTID AND A.COMPCODE=H.GTCOMPMASTID AND A.FINYEAR = I.GTFINANCIALYEARID
AND A.SUPPLIER <> 'ANUGRAHA FASHION MILL PRIVATE LIMITED - SPINNING'
AND I.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.YPOINO,A.YPOINDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,F.DOCID ,B.PODATE,B.PONO,B.YARNNAME,B.COLORNAME,G.COLORNAME,H.COMPCODE
ORDER BY A.YPOINDATE
)
    `

    console.log("getGeneralGRNDetails", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

export async function getGreyYarnGRNTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {


    const sql = `

SELECT H.COMPCODE,F.DOCID PONO,B.PODATE, A.YPOINO DOCID,A.YPOINDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,G.COLORNAME COLOR,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.STORETQTY) GRNQTY
FROM GTYARNPOINWARD AA,gtypurstkdet BB,GTYARNMASTER CC,GTBUYERMAST DD,GTCOMPMAST EE ,GTYARNPOINWARDDET FF
WHERE AA.GTYARNPOINWARDID=BB.GTYARNPOINWARDID AND AA.GTYARNPOINWARDID=FF.GTYARNPOINWARDID AND BB.GTYARNPOINWARDID=FF.GTYARNPOINWARDID
AND BB.GTYARNPOINWARDDETID=FF.GTYARNPOINWARDDETID
AND BB.YARNNAME1=CC.YARNNAME AND BB.BUYERCODE1=DD.BUYERCODE AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ORDERNO=B.ORDERNO AND FF.YARNNAME=B.YARNNAME AND FF.COLORNAME=B.COLORNAME
AND AA.PTRANSACTION='Grey Yarn Purchase Return'
),0) GRNQTY,AVG(B.POPRICE) PORATE
FROM GTYARNPOINWARD A,GTYARNPOINWARDDET B,GTYARNMASTER C,GTBUYERMAST D,GTCOMPMAST E,GTYARNPO F,GTCOLORMAST G,GTCOMPMAST H ,GTFINANCIALYEAR I
WHERE A.GTYARNPOINWARDID=B.GTYARNPOINWARDID AND B.YARNNAME=C.GTYARNMASTERID AND B.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTYARNPOID AND B.COLORNAME=G.GTCOLORMASTID AND A.COMPCODE=H.GTCOMPMASTID AND A.FINYEAR = I.GTFINANCIALYEARID
AND A.SUPPLIER <> 'ANUGRAHA FASHION MILL PRIVATE LIMITED - SPINNING'
AND I.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.YPOINO,A.YPOINDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,F.DOCID ,B.PODATE,B.PONO,B.YARNNAME,B.COLORNAME,G.COLORNAME,H.COMPCODE
ORDER BY A.YPOINDATE
`

    console.log("getGeneralGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGeneralGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}



export async function getDyedYarnGRNDetails(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT
    SUM(GRNQTY)        AS TOTAL_GRNQTY,
    AVG(PORATE)        AS AVG_PORATE,
    SUM(GRNQTY * PORATE) AS TOTAL_VALUE
FROM
(
SELECT h.compcode,F.DOCID PONO,B.PODATE, A.YPOINO DOCID,A.YPOINDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,G.COLORNAME COLOR,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.STORETQTY) GRNQTY
FROM GTDYARNPOINWARD AA,gtDypurstkdet BB,GTYARNMASTER CC,GTBUYERMAST DD,GTCOMPMAST EE ,GTdYARNPOINWARDDET FF
WHERE AA.GTDYARNPOINWARDID=BB.GTDYARNPOINWARDID AND AA.GTDYARNPOINWARDID=FF.GTDYARNPOINWARDID AND BB.GTDYARNPOINWARDID=FF.GTDYARNPOINWARDID
AND BB.GTDYARNPOINWARDDETID=FF.GTDYARNPOINWARDDETID
AND BB.YARNNAME1=CC.YARNNAME AND BB.BUYERCODE1=DD.BUYERCODE AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ORDERNO=B.ORDERNO AND FF.YARNNAME=B.YARNNAME AND FF.COLORNAME=B.COLORNAME
AND AA.PTRANSACTION='Dyed Yarn Purchase Return'
),0) GRNQTY,
AVG(B.POPRICE) PORATE
FROM GTDYARNPOINWARD A,GTDYARNPOINWARDDET B,GTYARNMASTER C,GTBUYERMAST D,GTCOMPMAST E,GTdYARNPO F,GTCOLORMAST G,GTCOMPMAST h , GTFINANCIALYEAR I 
WHERE A.GTDYARNPOINWARDID=B.GTDYARNPOINWARDID AND B.YARNNAME=C.GTYARNMASTERID AND B.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTdYARNPOID AND B.COLORNAME=G.GTCOLORMASTID and a.compcode=h.gtcompmastid AND I.GTFINANCIALYEARID = A.FINYEAR
AND A.SUPPLIER <> 'ANUGRAHA FASHION MILL PRIVATE LIMITED - SPINNING'
AND I.FINYR = '${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.YPOINO,A.YPOINDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,F.DOCID ,B.PODATE,B.PONO,B.YARNNAME,B.COLORNAME,G.COLORNAME,h.compcode
ORDER BY A.YPOINDATE
)
    `

    console.log("getDyedYarnGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getDyedYarnGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}


export async function getDyedYarnGRNTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `

SELECT h.compcode,F.DOCID PONO,B.PODATE, A.YPOINO DOCID,A.YPOINDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,G.COLORNAME COLOR,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.STORETQTY) GRNQTY
FROM GTDYARNPOINWARD AA,gtDypurstkdet BB,GTYARNMASTER CC,GTBUYERMAST DD,GTCOMPMAST EE ,GTdYARNPOINWARDDET FF
WHERE AA.GTDYARNPOINWARDID=BB.GTDYARNPOINWARDID AND AA.GTDYARNPOINWARDID=FF.GTDYARNPOINWARDID AND BB.GTDYARNPOINWARDID=FF.GTDYARNPOINWARDID
AND BB.GTDYARNPOINWARDDETID=FF.GTDYARNPOINWARDDETID
AND BB.YARNNAME1=CC.YARNNAME AND BB.BUYERCODE1=DD.BUYERCODE AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ORDERNO=B.ORDERNO AND FF.YARNNAME=B.YARNNAME AND FF.COLORNAME=B.COLORNAME
AND AA.PTRANSACTION='Dyed Yarn Purchase Return'
),0) GRNQTY,
AVG(B.POPRICE) PORATE
FROM GTDYARNPOINWARD A,GTDYARNPOINWARDDET B,GTYARNMASTER C,GTBUYERMAST D,GTCOMPMAST E,GTdYARNPO F,GTCOLORMAST G,GTCOMPMAST h ,GTFINANCIALYEAR I 
WHERE A.GTDYARNPOINWARDID=B.GTDYARNPOINWARDID AND B.YARNNAME=C.GTYARNMASTERID AND B.BUYERCODE=D.GTBUYERMASTID AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTdYARNPOID AND B.COLORNAME=G.GTCOLORMASTID and a.compcode=h.gtcompmastid and I.GTFINANCIALYEARID = A.FINYEAR
AND A.SUPPLIER <> 'ANUGRAHA FASHION MILL PRIVATE LIMITED - SPINNING'
AND I.FINYR = '${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.YPOINO,A.YPOINDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.YARNNAME,F.DOCID ,B.PODATE,B.PONO,B.YARNNAME,B.COLORNAME,G.COLORNAME,h.compcode
ORDER BY A.YPOINDATE
    `

    console.log("getDyedYarnGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getDyedYarnGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}



export async function getDyedFabricGRNDetails(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT
    SUM(GRNQTY)        AS TOTAL_GRNQTY,
    AVG(PORATE)        AS AVG_PORATE,
    SUM(GRNQTY * PORATE) AS TOTAL_VALUE
FROM
(
SELECT o.compcode,F.DOCID PONO,F.DOCDATE PODATE, A.FPINO DOCID,A.FPIDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.FABALIASNAME FABRIC,H.DESIGN,G.COLORNAME COLOR,
I.GSM,K.GG,L.LL,M.DIA KDIA,N.DIA FDIA,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.STORETQTY) GRNQTY
FROM GTdFabPurInward AA,gtdfpurstkdet BB,GTFABRICMAST CC,GTBUYERMAST DD,GTCOMPMAST EE ,GTdFabPurInwardDet FF
WHERE AA.GTdFabPurInwardID=BB.GTdFabPurInwardID AND AA.GTdFabPurInwardID=FF.GTdFabPurInwardID AND BB.GTdFabPurInwardID=FF.GTdFabPurInwardID
AND BB.GTdFabPurInwardID=FF.GTdFabPurInwardID
AND BB.ALIASNAME1=CC.FABALIASNAME AND BB.BUYERCODE1=DD.BUYERCODE AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ORDERNO=B.ORDERNO AND FF.ALIASNAME =B.ALIASNAME AND FF.COLOR=B.COLOR
AND AA.PTRANSACTION='Dyed Fabric Purchase Return'
),0) GRNQTY,
AVG(B.PORATE) PORATE
FROM GTdFabPurInward A,GTdFabPurInwardDet B,GTFABRICMAST C,GTBUYERMAST D,GTCOMPMAST E,GTdfabricPO F,GTCOLORMAST G,GTDESIGNMAST H,GTGSMMAST I,
GTGGMAST K,GTLOOPMAST L,GTDIAMAST M,GTDIAMAST N,gtcompmast o ,GTFINANCIALYEAR P 
WHERE A.GTdFabPurInwardID=B.GTdFabPurInwardID AND B.ALIASNAME=C.GTFABRICMASTID AND B.BUYERCODE=D.BUYERCODE AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTdFABRICPOID AND B.COLOR=G.GTCOLORMASTID AND B.DESIGN=H.GTDESIGNMASTID AND B.GSM=I.GTGSMMASTID AND B.GG=K.GTGGMASTID AND P.GTFINANCIALYEARID = A.FINYEAR
AND B.LL=L.GTLOOPMASTID AND B.KDIA=M.GTDIAMASTID AND B.FDIA=N.GTDIAMASTID and a.compcode=o.gtcompmastid
AND A.SUPPLIER NOT IN ( 'ANUGRAHA FASHION MILL PRIVATE LIMITED - KNITTING','FREELOOK FASHIONS - DYEING DIVISION')
AND P.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.FPINO,A.FPIDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.FABALIASNAME,F.DOCID ,F.DOCDATE,B.PONO,B.ALIASNAME,B.COLOR,G.COLORNAME,H.DESIGN,
I.GSM,K.GG,L.LL,M.DIA,N.DIA,o.compcode
ORDER BY A.FPIDATE
)
    `

    console.log("getDyedYarnGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getDyedYarnGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

export async function getDyedFabricGRNTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT o.compcode,F.DOCID PONO,F.DOCDATE PODATE, A.FPINO DOCID,A.FPIDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.FABALIASNAME FABRIC,H.DESIGN,G.COLORNAME COLOR,
I.GSM,K.GG,L.LL,M.DIA KDIA,N.DIA FDIA,SUM(B.TOTALGRNQTY)-
NVL((SELECT SUM(BB.STORETQTY) GRNQTY
FROM GTdFabPurInward AA,gtdfpurstkdet BB,GTFABRICMAST CC,GTBUYERMAST DD,GTCOMPMAST EE ,GTdFabPurInwardDet FF
WHERE AA.GTdFabPurInwardID=BB.GTdFabPurInwardID AND AA.GTdFabPurInwardID=FF.GTdFabPurInwardID AND BB.GTdFabPurInwardID=FF.GTdFabPurInwardID
AND BB.GTdFabPurInwardID=FF.GTdFabPurInwardID
AND BB.ALIASNAME1=CC.FABALIASNAME AND BB.BUYERCODE1=DD.BUYERCODE AND AA.COMPCODE=EE.GTCOMPMASTID
AND FF.PONO=B.PONO AND FF.ORDERNO=B.ORDERNO AND FF.ALIASNAME =B.ALIASNAME AND FF.COLOR=B.COLOR
AND AA.PTRANSACTION='Dyed Fabric Purchase Return'
),0) GRNQTY,
AVG(B.PORATE) PORATE
FROM GTdFabPurInward A,GTdFabPurInwardDet B,GTFABRICMAST C,GTBUYERMAST D,GTCOMPMAST E,GTdfabricPO F,GTCOLORMAST G,GTDESIGNMAST H,GTGSMMAST I,
GTGGMAST K,GTLOOPMAST L,GTDIAMAST M,GTDIAMAST N,gtcompmast o ,GTFINANCIALYEAR P 
WHERE A.GTdFabPurInwardID=B.GTdFabPurInwardID AND B.ALIASNAME=C.GTFABRICMASTID AND B.BUYERCODE=D.BUYERCODE AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.GTdFABRICPOID AND B.COLOR=G.GTCOLORMASTID AND B.DESIGN=H.GTDESIGNMASTID AND B.GSM=I.GTGSMMASTID AND B.GG=K.GTGGMASTID AND P.GTFINANCIALYEARID = A.FINYEAR
AND B.LL=L.GTLOOPMASTID AND B.KDIA=M.GTDIAMASTID AND B.FDIA=N.GTDIAMASTID and a.compcode=o.gtcompmastid
AND A.SUPPLIER NOT IN ( 'ANUGRAHA FASHION MILL PRIVATE LIMITED - KNITTING','FREELOOK FASHIONS - DYEING DIVISION')
AND P.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.FPINO,A.FPIDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.FABALIASNAME,F.DOCID ,F.DOCDATE,B.PONO,B.ALIASNAME,B.COLOR,G.COLORNAME,H.DESIGN,
I.GSM,K.GG,L.LL,M.DIA,N.DIA,o.compcode
ORDER BY A.FPIDATE

    `

    console.log("getDyedYarnGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getDyedYarnGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}



export async function getAccessoryGRNDetails(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT
    SUM(TOTALGRNQTY)        AS TOTAL_GRNQTY,
    AVG(PORATE)        AS AVG_PORATE,
    SUM(TOTALGRNQTY * PORATE) AS TOTAL_VALUE
FROM
(
SELECT J.COMPCODE,F.ACCPONO PONO,B.PODATE, A.AGRNNO DOCID,A.AGRNDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.ALIASNAME,G.COLORNAME COLOR,I.SIZENAME ACCSIZE, 
H.UNITNAME UOM,B.TOTALGRNQTY,
B.PORATE PORATE
FROM GTACCPOINWARD A
JOIN GTACCPOINWARDDTL B ON A.GTACCPOINWARDID=B.GTACCPOINWARDID
JOIN GTACCMAST C ON B.ALIASNAME=C.GTACCMASTID 
JOIN GTBUYERMAST D ON B.BUYERCODE=D.GTBUYERMASTID 
JOIN GTCOMPMAST E ON A.COMPCODE=E.GTCOMPMASTID
JOIN GTACCPO F ON B.PONO=F.GTACCPOID
JOIN GTCOLORMAST G ON B.ACCCOLOR=G.GTCOLORMASTID
JOIN GTUNITMAST H ON B.UOM=H.GTUNITMASTID
JOIN GTSIZEMAST I ON B.ACCSIZE=I.GTSIZEMASTID
JOIN GTCOMPMAST J ON A.COMPCODE=J.GTCOMPMASTID
JOIN GTFINANCIALYEAR K ON A.FINYEAR = K.GTFINANCIALYEARID
WHERE A.SUPPLIER NOT IN  ('ANUGRAHA FASHION MILL PRIVATE LIMITED','FREELOOK FASHIONS')
AND K.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
AND A.PTRANSACTION='Accessory Purchase Inward'
ORDER BY A.AGRNDATE
)
    `

    console.log("getDyedYarnGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getDyedYarnGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}


export async function getAccessoryGRNTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT J.COMPCODE,F.ACCPONO PONO,B.PODATE, A.AGRNNO DOCID,A.AGRNDATE DOCDATE,A.SUPPLIER,B.ORDERNO,D.BUYERCODE,C.ALIASNAME,G.COLORNAME COLOR,I.SIZENAME ACCSIZE, 
H.UNITNAME UOM,B.TOTALGRNQTY,
B.PORATE PORATE
FROM GTACCPOINWARD A
JOIN GTACCPOINWARDDTL B ON A.GTACCPOINWARDID=B.GTACCPOINWARDID
JOIN GTACCMAST C ON B.ALIASNAME=C.GTACCMASTID 
JOIN GTBUYERMAST D ON B.BUYERCODE=D.GTBUYERMASTID 
JOIN GTCOMPMAST E ON A.COMPCODE=E.GTCOMPMASTID
JOIN GTACCPO F ON B.PONO=F.GTACCPOID
JOIN GTCOLORMAST G ON B.ACCCOLOR=G.GTCOLORMASTID
JOIN GTUNITMAST H ON B.UOM=H.GTUNITMASTID
JOIN GTSIZEMAST I ON B.ACCSIZE=I.GTSIZEMASTID
JOIN GTCOMPMAST J ON A.COMPCODE=J.GTCOMPMASTID
JOIN GTFINANCIALYEAR K ON A.FINYEAR = K.GTFINANCIALYEARID

WHERE A.SUPPLIER NOT IN  ('ANUGRAHA FASHION MILL PRIVATE LIMITED','FREELOOK FASHIONS')
AND K.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
AND A.PTRANSACTION='Accessory Purchase Inward'
ORDER BY A.AGRNDATE
    `

    console.log("getDyedYarnGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getDyedYarnGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}


export async function getCuttingPrintingGRNDetails(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT
    SUM(GRNQTY)        AS TOTAL_GRNQTY,
    AVG(PORATE)        AS AVG_PORATE,
    SUM(GRNQTY * PORATE) AS TOTAL_VALUE
FROM
(
SELECT E.COMPCODE COMPCODE1,F.DOCID PONO,F.DOCDATE PODATE, A.DOCID GRNNO,A.DOCDATE GRNDATE,A.SUPPLIER,C.ITEMNAME,G.UNITNAME UOM,SUM(B.TOTALGRNQTY) GRNQTY,AVG(B.PORATE) PORATE
FROM CTSTOREINWRET A,CTSTOREINWRETDET B,CTITEMMAST C,GTCOMPMAST E,CTSTOREPO F,GTUNITMAST G ,GTFINANCIALYEAR H
WHERE A.CTSTOREINWRETID=B.CTSTOREINWRETID AND B.ITEMNAME=C.CTITEMMASTID  AND A.COMPCODE=E.GTCOMPMASTID
AND B.PONO=F.CTSTOREPOID  AND B.UOM=G.GTUNITMASTID AND A.FINYR = H.GTFINANCIALYEARID
AND H.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.DOCID,A.DOCDATE,A.SUPPLIER,C.ITEMNAME,F.DOCID ,F.DOCDATE,B.PONO,B.ITEMNAME,E.COMPCODE,G.UNITNAME
ORDER BY A.DOCDATE
)
    `

    console.log("getCuttingPrintingGRNDetails", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getCuttingPrintingGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

export async function getCuttingPrintingGRNTable(req, res) {

  const { selectedYear, companyName } = req.query;



  const year = selectedYear.split("-");
  const FROMDATE = `01/04/20${year[0]}`;
  const TODATE = `31/03/20${year[1]}`;

  const connection = await getConnectionERP(res);
  try {



    const sql = `
SELECT E.COMPCODE COMPCODE1,F.DOCID PONO,F.DOCDATE PODATE, A.DOCID GRNNO,A.DOCDATE GRNDATE,A.SUPPLIER,C.ITEMNAME,G.UNITNAME UOM,SUM(B.TOTALGRNQTY) GRNQTY,AVG(B.PORATE) PORATE
FROM CTSTOREINWRET A,CTSTOREINWRETDET B,CTITEMMAST C,GTCOMPMAST E,CTSTOREPO F,GTUNITMAST G,GTFINANCIALYEAR H
WHERE A.CTSTOREINWRETID=B.CTSTOREINWRETID AND B.ITEMNAME=C.CTITEMMASTID  AND A.COMPCODE=E.GTCOMPMASTID 
AND B.PONO=F.CTSTOREPOID  AND B.UOM=G.GTUNITMASTID  AND A.FINYR = H.GTFINANCIALYEARID
AND H.FINYR='${selectedYear}' AND E.COMPCODE = '${companyName}'
GROUP BY A.DOCID,A.DOCDATE,A.SUPPLIER,C.ITEMNAME,F.DOCID ,F.DOCDATE,B.PONO,B.ITEMNAME,E.COMPCODE,G.UNITNAME
ORDER BY A.DOCDATE
    `

    console.log("getCuttingPrintingGRNTable", sql)
    const queryResult = await connection.execute(sql);
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getCuttingPrintingGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}






// =========================================================================
// 8. Knitting Store Purchase GRN Register
// =========================================================================

export async function getKnittingStoreGRNTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName, page, limit, search } = req.query;

    let sql;
    let countSql;
    const binds = { selectedYear, companyName };

    if (page && limit) {
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;

      binds.offset = offset;
      binds.limitVal = limitNum;
      binds.searchPattern = search ? `%${search.toUpperCase()}%` : null;

      sql = `
        SELECT A.FINYEAR AS "docYear", A.COMPCODE AS "companyCode", A.GRNDATE AS "docDate", A.GRNNO AS "docId", 
               NULL AS "orderNo", A.ITEMGROUP AS "itemGroup", A.ITEMNAME AS "item", 
               A.SUPPLIER AS "supplier", A.RECQTY AS "qty", A.UOM AS "uom", A.RATE AS "rate", 
               (A.RECQTY * A.RATE) AS "amount"
        FROM GTKNTSTOREGRN A
        WHERE A.FINYEAR = :selectedYear 
          AND A.COMPCODE = :companyName
          AND (:searchPattern IS NULL 
               OR UPPER(A.GRNNO) LIKE :searchPattern 
               OR UPPER(A.SUPPLIER) LIKE :searchPattern 
               OR UPPER(A.ITEMNAME) LIKE :searchPattern)
        ORDER BY A.GRNDATE DESC
        OFFSET :offset ROWS FETCH NEXT :limitVal ROWS ONLY
      `;

      countSql = `
        SELECT COUNT(*) AS TOTAL
        FROM GTKNTSTOREGRN A
        WHERE A.FINYEAR = :selectedYear 
          AND A.COMPCODE = :companyName
          AND (:searchPattern IS NULL 
               OR UPPER(A.GRNNO) LIKE :searchPattern 
               OR UPPER(A.SUPPLIER) LIKE :searchPattern 
               OR UPPER(A.ITEMNAME) LIKE :searchPattern)
      `;

      const [queryResult, countResult] = await Promise.all([
        connection.execute(sql, binds),
        connection.execute(countSql, { selectedYear, companyName, searchPattern: binds.searchPattern })
      ]);

      const totalCount = countResult.rows?.[0]?.[0] || 0;
      return res.json({ statusCode: 0, data: mapResultRows(queryResult), totalCount });
    } else {
      sql = `
        SELECT A.FINYEAR AS "docYear", A.COMPCODE AS "companyCode", A.GRNDATE AS "docDate", A.GRNNO AS "docId", 
               NULL AS "orderNo", A.ITEMGROUP AS "itemGroup", A.ITEMNAME AS "item", 
               A.SUPPLIER AS "supplier", A.RECQTY AS "qty", A.UOM AS "uom", A.RATE AS "rate", 
               (A.RECQTY * A.RATE) AS "amount"
        FROM GTKNTSTOREGRN A
        WHERE A.FINYEAR = :selectedYear 
          AND A.COMPCODE = :companyName
        ORDER BY A.GRNDATE DESC
      `;
      const queryResult = await connection.execute(sql, binds);
      return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
    }
  } catch (err) {
    console.error("Error retrieving getKnittingStoreGRNTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

export async function getKnittingStoreGRNDetails(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;
    const sql = `
      SELECT 
        CASE 
          WHEN TO_NUMBER(TO_CHAR(A.GRNDATE, 'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.GRNDATE, 'MM')) - 3
          ELSE TO_NUMBER(TO_CHAR(A.GRNDATE, 'MM')) + 9
        END AS "monthIndex",
        TO_CHAR(A.GRNDATE, 'MON') AS "monthName",
        SUM(A.RECQTY * A.RATE) AS "totalValue"
      FROM GTKNTSTOREGRN A
      WHERE A.FINYEAR = :selectedYear 
        AND A.COMPCODE = :companyName
      GROUP BY 
        CASE 
          WHEN TO_NUMBER(TO_CHAR(A.GRNDATE, 'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.GRNDATE, 'MM')) - 3
          ELSE TO_NUMBER(TO_CHAR(A.GRNDATE, 'MM')) + 9
        END,
        TO_CHAR(A.GRNDATE, 'MON')
      ORDER BY "monthIndex"
    `;
    const queryResult = await connection.execute(sql, { selectedYear, companyName });
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getKnittingStoreGRNDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// =========================================================================
// 9. Embroidery Accessory Purchase Inward Register
// =========================================================================

export async function getEmbroideryAccessoryInwardTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName, page, limit, search } = req.query;

    let sql;
    let countSql;
    const binds = { selectedYear, companyName };

    if (page && limit) {
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;

      binds.offset = offset;
      binds.limitVal = limitNum;
      binds.searchPattern = search ? `%${search.toUpperCase()}%` : null;

      sql = `
        SELECT A.FINYEAR AS "docYear", A.COMPCODE AS "companyCode", A.INWDDATE AS "docDate", A.INWDNO AS "docId", 
               A.PONO AS "orderNo", B.ITEMNAME AS "item", A.SUPPLIER AS "supplier", 
               B.RECQTY AS "qty", B.UOM AS "uom", B.RATE AS "rate", 
               (B.RECQTY * B.RATE) AS "amount"
        FROM GTEMBACCINWARD A
        JOIN GTEMBACCINWARDDET B ON A.GTEMBACCINWARDID = B.GTEMBACCINWARDID
        WHERE A.FINYEAR = :selectedYear 
          AND A.COMPCODE = :companyName
          AND (:searchPattern IS NULL 
               OR UPPER(A.INWDNO) LIKE :searchPattern 
               OR UPPER(A.SUPPLIER) LIKE :searchPattern 
               OR UPPER(B.ITEMNAME) LIKE :searchPattern)
        ORDER BY A.INWDDATE DESC
        OFFSET :offset ROWS FETCH NEXT :limitVal ROWS ONLY
      `;

      countSql = `
        SELECT COUNT(*) AS TOTAL
        FROM GTEMBACCINWARD A
        JOIN GTEMBACCINWARDDET B ON A.GTEMBACCINWARDID = B.GTEMBACCINWARDID
        WHERE A.FINYEAR = :selectedYear 
          AND A.COMPCODE = :companyName
          AND (:searchPattern IS NULL 
               OR UPPER(A.INWDNO) LIKE :searchPattern 
               OR UPPER(A.SUPPLIER) LIKE :searchPattern 
               OR UPPER(B.ITEMNAME) LIKE :searchPattern)
      `;

      const [queryResult, countResult] = await Promise.all([
        connection.execute(sql, binds),
        connection.execute(countSql, { selectedYear, companyName, searchPattern: binds.searchPattern })
      ]);

      const totalCount = countResult.rows?.[0]?.[0] || 0;
      return res.json({ statusCode: 0, data: mapResultRows(queryResult), totalCount });
    } else {
      sql = `
        SELECT A.FINYEAR AS "docYear", A.COMPCODE AS "companyCode", A.INWDDATE AS "docDate", A.INWDNO AS "docId", 
               A.PONO AS "orderNo", B.ITEMNAME AS "item", A.SUPPLIER AS "supplier", 
               B.RECQTY AS "qty", B.UOM AS "uom", B.RATE AS "rate", 
               (B.RECQTY * B.RATE) AS "amount"
        FROM GTEMBACCINWARD A
        JOIN GTEMBACCINWARDDET B ON A.GTEMBACCINWARDID = B.GTEMBACCINWARDID
        WHERE A.FINYEAR = :selectedYear 
          AND A.COMPCODE = :companyName
        ORDER BY A.INWDDATE DESC
      `;
      const queryResult = await connection.execute(sql, binds);
      return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
    }
  } catch (err) {
    console.error("Error retrieving getEmbroideryAccessoryInwardTable:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

export async function getEmbroideryAccessoryInwardDetails(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;
    const sql = `
      SELECT 
        CASE 
          WHEN TO_NUMBER(TO_CHAR(A.INWDDATE, 'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.INWDDATE, 'MM')) - 3
          ELSE TO_NUMBER(TO_CHAR(A.INWDDATE, 'MM')) + 9
        END AS "monthIndex",
        TO_CHAR(A.INWDDATE, 'MON') AS "monthName",
        SUM(B.RECQTY * B.RATE) AS "totalValue"
      FROM GTEMBACCINWARD A
      JOIN GTEMBACCINWARDDET B ON A.GTEMBACCINWARDID = B.GTEMBACCINWARDID
      WHERE A.FINYEAR = :selectedYear 
        AND A.COMPCODE = :companyName
      GROUP BY 
        CASE 
          WHEN TO_NUMBER(TO_CHAR(A.INWDDATE, 'MM')) >= 4 THEN TO_NUMBER(TO_CHAR(A.INWDDATE, 'MM')) - 3
          ELSE TO_NUMBER(TO_CHAR(A.INWDDATE, 'MM')) + 9
        END,
        TO_CHAR(A.INWDDATE, 'MON')
      ORDER BY "monthIndex"
    `;
    const queryResult = await connection.execute(sql, { selectedYear, companyName });
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getEmbroideryAccessoryInwardDetails:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}

// =========================================================================
// 10. GRN Summary Consolidated Data for Donut Chart
// =========================================================================

export async function getGRNSummaryData(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear } = req.query;
    const sql = `
      SELECT 
          COMPANY AS "COMPANY",
          SUM(TOTAL_VALUE) AS "TOTAL_VALUE"
      FROM (
          -- 1. General Purchase GRN
          SELECT 
              D.COMPCODE AS COMPANY,
              SUM(B.RECQTY * B.RATE) AS TOTAL_VALUE
          FROM GTGENGRN A
          JOIN GTGENGRNDET B ON A.GTGENGRNID = B.GTGENGRNID
          JOIN GTCOMPMAST D ON D.GTCOMPMASTID = A.COMPCODE
          JOIN GTFINANCIALYEAR E ON E.GTFINANCIALYEARID = A.FINYEAR
          WHERE E.FINYR = :selectedYear
            AND A.SUPPLIER NOT IN ('ANUGRAHA FASHION MILL PRIVATE LIMITED', 'FREELOOK FASHIONS')
          GROUP BY D.COMPCODE

          UNION ALL

          -- 2. Grey Fabric GRN
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(A.RECQTY * A.RATE) AS TOTAL_VALUE
          FROM GFABGRNREG A
          WHERE A.FINYEAR = :selectedYear
            AND A.SUPPLIER NOT IN ('ANUGRAHA FASHION MILL PRIVATE LIMITED - KNITTING', 'FREELOOK FASHIONS')
          GROUP BY A.COMPCODE

          UNION ALL

          -- 3. Grey Yarn GRN
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(A.RECQTY * A.RATE) AS TOTAL_VALUE
          FROM YARNGRNREG A
          WHERE A.FINYR = :selectedYear
            AND A.SUPPLIER NOT IN ('ANUGRAHA FASHION MILL PRIVATE LIMITED - SPINNING')
          GROUP BY A.COMPCODE

          UNION ALL

          -- 4. Dyed Yarn GRN
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(A.RECQTY * A.RATE) AS TOTAL_VALUE
          FROM DYARNGRNREG A
          WHERE A.FINYR = :selectedYear
            AND A.SUPPLIER NOT IN ('ANUGRAHA FASHION MILL PRIVATE LIMITED')
          GROUP BY A.COMPCODE

          UNION ALL

          -- 5. Dyed Fabric GRN
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(A.RECQTY * A.RATE) AS TOTAL_VALUE
          FROM DFABGRNREG A
          WHERE A.FINYEAR = :selectedYear
            AND A.SUPPLIER NOT IN ('FREELOOK FASHIONS - DYEING DIVISION')
          GROUP BY A.COMPCODE

          UNION ALL

          -- 6. Accessory GRN
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(A.RECQTY * A.RATE) AS TOTAL_VALUE
          FROM ACCGRNREG A
          WHERE A.FINYEAR = :selectedYear
            AND A.SUPPLIER NOT IN ('ANUGRAHA FASHION MILL PRIVATE LIMITED')
          GROUP BY A.COMPCODE

          UNION ALL

          -- 7. Cutting / Printing Store GRN
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(A.RECQTY * A.RATE) AS TOTAL_VALUE
          FROM GTCUTPRNSTOREGRN A
          WHERE A.FINYEAR = :selectedYear
            AND A.SUPPLIER NOT IN ('ANUGRAHA FASHION MILL PRIVATE LIMITED', 'FREELOOK FASHIONS')
          GROUP BY A.COMPCODE

          UNION ALL

          -- 8. Knitting Store GRN
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(A.RECQTY * A.RATE) AS TOTAL_VALUE
          FROM GTKNTSTOREGRN A
          WHERE A.FINYEAR = :selectedYear
          GROUP BY A.COMPCODE

          UNION ALL

          -- 9. Embroidery Accessory Inward
          SELECT 
              A.COMPCODE AS COMPANY,
              SUM(B.RECQTY * B.RATE) AS TOTAL_VALUE
          FROM GTEMBACCINWARD A
          JOIN GTEMBACCINWARDDET B ON A.GTEMBACCINWARDID = B.GTEMBACCINWARDID
          WHERE A.FINYEAR = :selectedYear
          GROUP BY A.COMPCODE
      ) ALL_GRN
      GROUP BY COMPANY
      ORDER BY COMPANY
    `;
    const queryResult = await connection.execute(sql, { selectedYear });
    return res.json({ statusCode: 0, data: mapResultRows(queryResult) });
  } catch (err) {
    console.error("Error retrieving getGRNSummaryData consolidated details:", err);
    return res.status(500).json({ statusCode: 1, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
}




