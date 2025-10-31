import { Grid } from "@mui/material"
import RolePermission from "./Roles"
import YearlyComChart from "../MisDashboard/comParision/YearlyCompChart"

const Roles =()=>{
    return(
        <>
    <Grid container>
        <Grid item lg={9}>

        <RolePermission/>
        
        </Grid>
        <Grid item lg={3}>
        {/* <YearlyComChart/> */}
        
    </Grid>

    </Grid>
    
        </>
    )
}
export default Roles