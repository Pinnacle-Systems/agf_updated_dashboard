import MisDashboard from "../scenes/MisDashboard";
import ERP from "../scenes/MisDashboard copy/index";
// import FinYear from "../../components/FinYear";
import Users from "../scenes/User & Role/Users";
import Roles from "../scenes/User & Role/Roles";
import mainDashboard from "../scenes/maindashboard/index";

const tabs = [
     { key: "DASHBOARD", name: "DASHBOARD", component: MisDashboard,list:true,list_name:"DashBoard"},
    { key: 'EPR', name: "ERP", component: ERP,list:true,list_name:"ERP " },
    // { key: 'User', name: "User", component: Users ,list:true,list_name:"User Management"},
    // { key: "Roles", name: "Roles", component: Roles,list:true,list_name:"Role Management" },
    { key: "Main", name: "Main", component: mainDashboard ,list:true,list_name:"AdminDashboard" }
    // { key: "Stock", name: "Stock", component:PieChart  ,list:true,default:false,list_name:"Stock Report" },
      
]



export default tabs;
