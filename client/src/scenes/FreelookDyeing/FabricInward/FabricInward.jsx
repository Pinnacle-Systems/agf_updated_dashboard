import { Grid } from "@mui/material"
import InwardType from "./inwardType"
import CustomerDetails from "./CustomerDetails"
import { useState } from "react"

const FabricInward = ({ year, finYear }) => {
    const [category, setCategory] = useState("INHOUSE")
    return (
        <Grid container spacing={2} sx={{ p: 1, pl: 1.5 }}>
            <Grid item xs={12} md={4} >
                <InwardType year={year} finYear={finYear} setCategory={setCategory} />
            </Grid>
            <Grid item xs={12} md={8}>
                <CustomerDetails year={year} finYear={finYear} category={category} setCategory={setCategory} />
            </Grid>
        </Grid>
    )
}

export default FabricInward
