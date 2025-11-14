// export const BASE_URL = 'http://192.168.1.61:9008'
export const BASE_URL = process.env.REACT_APP_SERVER_URL
console.log(BASE_URL,"base url");

export const PO_REGISTER = '/poRegister'
export const COMMON_MAST = '/commonMast'
export const SUPPLIER = '/supplier'
export const PO_DATA = '/poData'
export const MIS_DASHBOARD = '/misDashboard'
export const MIS_DASHBOARDERP = '/misDashboardERP'
export const ORD_MANAGEMENT = '/ordManagement'
export const LOGIN_API = "users/login"
export const USERS_API = "users"
export const ROLE_API ="role"
