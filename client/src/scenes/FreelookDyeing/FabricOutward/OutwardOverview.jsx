import { Box, Grid, Typography } from "@mui/material";
import FinYear from "../../../components/FinYear";
import { useState } from "react";

const OutwardOverview = ({ finYear, year }) => {
    const [selectedYear, setSelectedYear] = useState(year);
    const [selectmonths, setSelectmonths] = useState("");

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
                        Overview of Fabric Outward
                    </Typography>

                    {/* RIGHT FILTERS */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <div className="flex gap-2">
                        </div>
                        <div className="flex items-center">
                            <select
                                value={selectedYear}
                                autoFocus={true}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className={`w-full px-2 py-1 text-xs border border-blue-800 rounded-md 
      transition-all duration-200 ring-1 `}                            >
                                {finYear?.data?.map((option) => (
                                    <option key={option.finYear} value={option.finYear}>
                                        {option.finYear}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <FinYear
                            selectedYear={selectedYear}
                            selectmonths={selectmonths}
                            setSelectmonths={setSelectmonths}
                            autoSelect={true}
                        />
                    </Box>
                </Box>

            </div>
            <Grid container spacing={1} sx={{ p: 1, }}>
                
            </Grid>
        </>
    )
}

export default OutwardOverview