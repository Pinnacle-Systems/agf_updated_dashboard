import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
} from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useGetMisDashboardEsiDetQuery } from '../../../redux/service/misDashboardService'

const CompanywiseEsi = ({ companyName }) => {
  const [totalStats, setTotalStats] = useState({ totalMale: 0, totalFemale: 0, total: 0 })

  const { data: Esidata, isLoading } = useGetMisDashboardEsiDetQuery({
    params: { filterBuyer: companyName }
  })

  useEffect(() => {
    if (!Esidata?.data?.length) return

    const femaleData = Esidata.data.filter(x => x.GENDER === 'FEMALE')
    const maleData = Esidata.data.filter(x => x.GENDER === 'MALE')

    const totalFemale = femaleData.reduce((acc, emp) => acc + (emp.NETPAY || 0), 0)
    const totalMale = maleData.reduce((acc, emp) => acc + (emp.NETPAY || 0), 0)

    setTotalStats({ totalMale, totalFemale, total: totalMale + totalFemale })
  }, [Esidata])

  const data = [
    { name: 'Male', value: totalStats.totalMale, color: '#0D5C75' },
    { name: 'Female', value: totalStats.totalFemale, color: '#FF7F50' }
  ]

  if (isLoading) {
    return <Card sx={{ padding: 2, textAlign: 'center' }}>Loading...</Card>
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardHeader
        title={<Typography variant="h6" sx={{ fontWeight: 500 }}>ESI Contribution Genderwise</Typography>}
      />

      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Legend */}
          <Box>
            {data.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, mr: 1.5 }}
                />
                <Typography variant="body2">
                  <strong>{item.value}</strong> <span style={{ color: item.color }}>{item.name}</span>
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Pie Chart with Tooltip */}
          <Box sx={{ width: 180, height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* ✅ Tooltip on hover */}
                <Tooltip
                  formatter={(value, name) => [`${value}`, name]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #ccc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          {/* <Box>
            <Typography>
              Total ESI Contribution:{}
            </Typography>

          </Box> */}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CompanywiseEsi
