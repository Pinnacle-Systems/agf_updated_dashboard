import { Grid } from "@mui/material"
import OverallFabric from "./OverallFabric"

const index = () => {
  return (
    <Grid container spacing={1} sx={{ p: 1, pl: 1.5,minHeight:200 }}>
      <Grid item xs={12} md={6}>
        <OverallFabric />
      </Grid>
    </Grid>
  )
}

export default index