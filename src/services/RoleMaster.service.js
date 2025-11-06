import { prisma_Connector } from "../../index.js";
import { getConnection } from "../constants/db.connection.js";
import bcrypt from "bcrypt";

export async function Add_role(req, res) {
  const connection = await getConnection(res);
  try {
    const result = await prisma_Connector.role.create({ data: req.body });
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function get_Role(req, res) {
  const connection = await getConnection(res);
  try {
    const result = await prisma_Connector.role.findMany({});
    // console.log(result)
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}
export async function getUserPages(req, res) {
  const connection = await getConnection(res);
  const userId = parseInt(req.query.userId);
  // const{userId}=req.query.userId
  // console.log(userId);

  try {
    const result = await prisma_Connector.useronpage.findMany({
      where: { userId: userId },
    });
    // console.log(result)
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await connection.close();
  }
}

export async function createRoleOnPage(req, res) {
  const { username, employeeId, permissions, COMPCODE, password, active,compList } =
    req.body;
  const roleId = parseInt(req.body.roleId);

  try {
    if (!username || !employeeId || !roleId || !permissions || !COMPCODE || !compList) {
      return res.status(400).json({
        status: 0,
        message:
          "Missing required fields: username, employeeId, roleId, or permissions",
      });
    }
    const user = await prisma_Connector.user.findUnique({
      where: { username }, // or { username }
    });
    if (user) {
      return res.status(404).json({
        status: 0,
        message: `UserName already exists with employeeId ${employeeId} .`,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);

    const result1 = await prisma_Connector.user.create({
      data: {
        employeeId: employeeId ? parseInt(employeeId) : undefined,
        username,
        COMPCODE,
        password: hashedPassword,
        active,
        roleId,
      },
    });

    const insertData1 = (compList || []).map((item) => ({
      companyName: item.value, // use value field
      userId: result1.id,
    }));

    if (!insertData1.length) {
      return res.status(400).json({ status: 0, message: "No companies to insert" });
    }

    // 3️⃣ Insert with skipDuplicates if needed
    const result2 = await prisma_Connector.useroncompany.createMany({
      data: insertData1,
      skipDuplicates: true,
    });

    const insertData = Object.entries(permissions).map(
      ([page, pagePermissions]) => ({
        read: !!pagePermissions.read,
        create: !!pagePermissions.create,
        edit: !!pagePermissions.edit,
        delete: !!pagePermissions.delete,
        isdefault: !!pagePermissions.isdefault,
        username,
        roleId,
        link: page,
        userId: result1.id,
      })
    );

    if (!insertData.length) {
      return res
        .status(400)
        .json({ status: 0, message: "No permissions to insert" });
    }

    const result = await prisma_Connector.useronpage.createMany({
      data: insertData,
      skipDuplicates: true,
      // skip duplicates if record already exists
    });

    res.status(200).json({
      status: 1,
      message: `Inserted ${result.count} permission records for ${username}`,
      count: result.count,
    });
  } catch (err) {
    console.error(" Error in createRoleOnPage:", err);

    // Prisma known error handling
    if (err.code === "P2002") {
      return res.status(409).json({
        status: 0,
        message:
          "Duplicate entry — permission already exists for this user and page",
      });
    }

    res.status(500).json({
      status: 0,
      message: "Internal server error while creating role permissions",
      error: err.message,
    });
  }
}

// export async function AddNewUser(req, res) {

//   const connection = await getConnection(res)
//   const { employeeId, username,COMPCODE,password,active, roleId, } = req.body

//   const existingUser = await prisma_Connector.user.findUnique({
//     where: { employeeId: employeeId },
//   });

//   if (existingUser) {
//     return res.status(409).json({
//       status: 0,
//       message: `User with employeeId ${employeeId} already exists.`,
//     });
//   }
//   try {

//       const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         console.log(hashedPassword);

// const result = await prisma_Connector.user.create({ data: {employeeId, username,COMPCODE,password:hashedPassword,active, roleId,}})
//     return res.status(201).json(result)
//   }
//   catch (err) {
//     console.error('Error retrieving data:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
//   finally {
//     await connection.close()
//   }
// }
