import { Grid } from "@mui/material"
import OutwardType from "./OutwardType"
import CustomerDetails from "./CustomerDetails"
import { useState } from "react"

const FabricOutward = ({ year, finYear }) => {
    const [category, setCategory] = useState("INHOUSE")
    return (
        <Grid container spacing={2} sx={{ p: 1, pl: 1.5 }}>
            <Grid item xs={12} md={4} >
                <OutwardType year={year} finYear={finYear} setCategory={setCategory} />
            </Grid>
            <Grid item xs={12} md={8}>
                <CustomerDetails year={year} finYear={finYear} category={category} setCategory={setCategory} />
            </Grid>
        </Grid>
    )
}

export default FabricOutward
