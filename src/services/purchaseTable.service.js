import { getConnectionERP } from "../constants/db.connection.js";
import oracledb from "oracledb";

export async function getGeneralTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT D.FINYR FINYEAR,C.COMPCODE,A.DOCDATE,A.DOCID,G.ITEMGRPNAME,I.ITEMNAME,A.SUPPLIER,B.POQTY-B.CANQTY POQTY,
U.UNITNAME,B.PORATE,(B.POQTY-B.CANQTY)*B.PORATE AMOUNT FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
where D.FINYR = '${selectedYear}' AND C.COMPCODE = '${companyName}'
AND (B.POQTY-B.CANQTY)*B.PORATE > 0
ORDER BY 1,2,3
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      itemGroup: po[4],
      item: po[5],
      supplier: po[6],
      qty: po[7],
      uom: po[8],
      rate: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getGreyYarnTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.YPONO DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,A.PRICE PRICE, 
(A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM YARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedYarnTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYR,A.COMPCODE,A.DOCDATE,A.DOCID,A.YARN,A.SUPPLIER,A.ORDERNO,A.COLORNAME,(A.POQTY - A.CANQTY) POQTY,A.UNITNAME,
A.PRICE PRICE, (A.POQTY - A.CANQTY) * A.PRICE  VAL
FROM DYARNPURREG A
where A.FINYR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PRICE > 0
ORDER BY A.FINYR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      yarnName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      qty: po[8],
      uom: po[9],
      price: po[10],
      amount: po[11],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getGreyFabricTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM GFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getDyedFabricTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.PODATE DOCDATE,A.PONO DOCID,A.FABRIC,A.SUPPLIER,A.ORDERNO,A.COLOR,A.DESIGN,A.GSM,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM DFABPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      fabricName: po[4],
      supplier: po[5],
      orderNo: po[6],
      color: po[7],
      design: po[8],
      gsm: po[9],
      qty: po[10],
      uom: po[11],
      price: po[12],
      amount: po[13],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function getAccessoryTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName } = req.query;

    const sql = `
SELECT A.FINYEAR FINYR,A.COMPCODE,A.ACCPODATE DOCDATE,A.ACCPONO DOCID,A.ACCGROUP,A.ACCITEM,A.ACCNAME2,A.ACCSIZE,A.ALIASNAME2,
A.SUPPLIER,A.ORDERNO1,
(A.POQTY - A.CANQTY) POQTY,A.UOM,A.PORATE PRICE, (A.POQTY - A.CANQTY) * A.PORATE  VAL
FROM ACCPOREG A
where A.FINYEAR = '${selectedYear}' AND A.COMPCODE = '${companyName}'
AND  (A.POQTY - A.CANQTY) * A.PORATE > 0
ORDER BY A.FINYEAR,A.COMPCODE
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      accessGroupName: po[4],
      accessItemName: po[5],
      accessItemDesc: po[6],
      accessSize: po[7],
      accessAliasName: po[8],
      supplier: po[9],
      orderNo: po[10],
      qty: po[11],
      uom: po[12],
      price: po[13],
      amount: po[14],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}


export async function getGeneralSupplierToptenTable(req, res) {
  const connection = await getConnectionERP(res);
  try {
    const { selectedYear, companyName,supplier } = req.query;

    const sql = `
SELECT D.FINYR FINYEAR,C.COMPCODE,A.DOCDATE,A.DOCID,G.ITEMGRPNAME,I.ITEMNAME,A.SUPPLIER,B.POQTY-B.CANQTY POQTY,
U.UNITNAME,B.PORATE,(B.POQTY-B.CANQTY)*B.PORATE AMOUNT FROM GTGENPO A
JOIN GTGENPODET B ON A.GTGENPOID = B.GTGENPOID
JOIN GTCOMPMAST C ON C.GTCOMPMASTID = A.COMPCODE
JOIN GTFINANCIALYEAR D ON D.GTFINANCIALYEARID = A.FINYEAR
JOIN GTITEMGRPMAST G ON G.GTITEMGRPMASTID = B.ITEMGRPNAME
JOIN GTGENITEMMAST I ON I.GTGENITEMMASTID = B.ITEMNAME
JOIN GTUNITMAST U ON U.GTUNITMASTID = B.UOM
where D.FINYR = '${selectedYear}' AND C.COMPCODE = '${companyName}' AND A.SUPPLIER = '${supplier}'
AND (B.POQTY-B.CANQTY)*B.PORATE > 0
ORDER BY 1,2,3
     `;

    const result = await connection.execute(sql);
    let resp = result.rows?.map((po) => ({
      finYear: po[0],
      compCode: po[1],
      docDate: po[2],
      docId: po[3],
      itemGroup: po[4],
      item: po[5],
      supplier: po[6],
      qty: po[7],
      uom: po[8],
      rate: po[9],
      amount: po[10],
    }));

    return res.json({ statusCode: 0, data: resp });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}



