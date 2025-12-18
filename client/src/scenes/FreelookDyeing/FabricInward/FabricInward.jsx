import { Box, Grid, Typography } from "@mui/material"
import CustomerDetails from "./CustomerDetails"
import { useState } from "react"


const FabricInward = ({ finYear, year, selectCategory }) => {
    const [category, setCategory] = useState(selectCategory);
    const [selectedYear, setSelectedYear] = useState(year);

    return (
        <>
            <div
                className="mt-2"
                style={{
                    position: "sticky",
                    top: 30,
                    zIndex: 50,
                    backgroundColor: "white",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        p: 0.5,
                        borderBottom: "1px solid #afafaf",
                        borderTop: "1px solid #afafaf",
                    }}
                >
                    {/* LEFT TITLE */}
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 600, ml: 1 }}
                    >
                        Overview of Fabric Inward
                    </Typography>

                    {/* RIGHT FILTERS */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border rounded-md text-xs p-1"
                        >
                            <option value="INHOUSE">INHOUSE</option>
                            <option value="OUTSIDE">OUTSIDE</option>
                        </select>

                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="border rounded-md text-xs p-1"
                        >
                            {finYear?.data?.map((option) => (
                                <option key={option.finYear} value={option.finYear}>
                                    {option.finYear}
                                </option>
                            ))}
                        </select>
                    </Box>
                </Box>

            </div>
            <Grid container spacing={2} sx={{ p: 1, pl: 1.5 }}>
                <Grid item xs={12} md={12}>
                    <CustomerDetails selectedYear={selectedYear} category={category} finYear={finYear} />
                </Grid>
            </Grid>
        </>
    )
}

export default FabricInward
