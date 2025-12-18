import MisDashboard from "../scenes/MisDashboard";
import ERP from "../scenes/MisDashboard copy/index";
// import FinYear from "../../components/FinYear";
import Users from "../scenes/User & Role/Users";
import Roles from "../scenes/User & Role/Roles";
import mainDashboard from "../scenes/maindashboard/index";
import NumericCard from "../../src/components/NumericCard";
import HRDashboard from "../../src/scenes/hrdashboard/index";
import FreeLookDyeing from "../../src/scenes/FreelookDyeing/index";
import { list } from "@chakra-ui/system";

const tabs = [
  {
    key: "Dashboard",
    name: "Dashboard",
    component: MisDashboard,
    list: true,
    list_name: "DashBoard",
  },
  { key: "EPR", name: "ERP", component: ERP, list: true, list_name: "ERP " },
  // { key: 'User', name: "User", component: Users ,list:true,list_name:"User Management"},
  // { key: "Roles", name: "Roles", component: Roles,list:true,list_name:"Role Management" },
  {
    key: "MISDashboard",
    name: "MISDashboard",
    component: mainDashboard,
    list: true,
    list_name: "AdminDashboard",
  },
  {
    key: "HRDashboard",
    name: "HRDashboard",
    component: HRDashboard,
    list: true,
    list_name: "HRDashboard",
  },
  // { key: "OnrollInsight", name: "Stock", component:NumericCard  ,list:true,default:false,list_name:"On Roll Insight" },
  {
    key: "Free Look Dyeing",
    name: "Free Look Dyeing",
    component: FreeLookDyeing,
    list: true,
    list_name: "Free Look Dyeing",
  },
];

export default tabs;
