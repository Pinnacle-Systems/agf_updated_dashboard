import Api_districts from '../Areas/districts.js';
import Api_states from '../Areas/states.js';
import { PrismaClient } from '../src/generated/prisma/client.js';
import bcrypt from "bcrypt"


const prisma_Connector=new PrismaClient()
async function main() {

const pdata=await  prisma_Connector?.permissionMaster?.findMany({})
if(pdata?.length==0){
  await  prisma_Connector?.permissionMaster.createMany({
    data: [
      { name: 'Others', active: 'y',COMPCODE:"all"},
    ],
    skipDuplicates: true, // optional: avoid inserting duplicates
  });

}

var odata= await  prisma_Connector?.ondutyMaster?.findMany({})

if(odata?.length==0){
   await  prisma_Connector?.ondutyMaster.createMany({
    data: [
      { name: 'Others', active: 'y',COMPCODE:"all"},
    ],
    skipDuplicates: true, // optional: avoid inserting duplicates
  });

}





  const isdata=await prisma_Connector?.state.count()
  if(isdata==0){
      await  prisma_Connector?.state?.createMany({data:Api_states})
  }


    const isdata_dis=await prisma_Connector?.city.count()
    // console.log(isdata_dis);
    
    if(isdata_dis==0){
      await  prisma_Connector?.city?.createMany({data:Api_districts})
     }


  const saltRounds = 10;
 const hashedPassword = await bcrypt.hash("admin", saltRounds);
 var IdenityUser=await prisma_Connector?.user?.findUnique({where:{username:"superadmin"}})
if(!IdenityUser?.username){
   await  prisma_Connector?.user.create({data:{username:"superadmin",password:hashedPassword,isAdmin:true}})
}
    }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma_Connector.$disconnect();
  });
