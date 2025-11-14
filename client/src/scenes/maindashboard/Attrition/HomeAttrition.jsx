import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useContext } from "react";
import { Card, CardHeader } from "@mui/material";
import { ColorContext } from "../../global/context/ColorContext";
import { useGetYFActVsPlnQuery } from "../../../redux/service/orderManagement";
import {
  useGetBuyerNameQuery,
  useGetMonthQuery,
} from "../../../redux/service/commonMasters";
import { useGetFinYearQuery } from "../../../redux/service/misDashboardService";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";

const HomeAttrition = () => {
     const dispatch = useDispatch();

  const { color } = useContext(ColorContext);

  const { data: fabPlVsActFull } = useGetYFActVsPlnQuery({
    params: {}
  });

  const sumByCompany = (fabPlVsActFull?.data || []).reduce((acc, item) => {
    acc[item.company] = (acc[item.company] || 0) + item.attrition;
    return acc;
  }, {});

  const chartData = Object.entries(sumByCompany).map(([company, total]) => ({
    name: company,
    value: total,
  }));

  const categories = chartData?.map((item) => item.name);
  const seriesData = chartData?.map((item) => item.value);

const options = {
    chart: {
        scrollablePlotArea: { minWidth: 300 },
        marginTop: 10,
        type: 'line',
        height: 310,
        borderRadius: 10,
    },

    xAxis: {
        categories: categories,
        title: { text: 'Company', style: { fontSize: '10px' } },
        labels: { style: { fontSize: '10px' } }
    },

    yAxis: {
        min: 0,
        title: { text: 'Attrition Count', style: { fontSize: '12px' } },
        labels: { style: { fontSize: '10px' } }
    },

    tooltip: {
        shared: true,
        style: { fontSize: '10px' },
        formatter: function () {
            let tooltip = `<b>${this.x}</b><br/>`;
            const index = this.points[0].point.index;
            tooltip += `<b>Attrition:</b> ${seriesData[index]}`;
            return tooltip;
        }
    },

    plotOptions: {
        series: {
            marker: {
                enabled: true,
                radius: 4,
                symbol: 'circle',
            },
            point: {
                events: {
                    click: function () {
                        const companyName = this.category;
                        console.log("Clicked:", companyName);

                        dispatch(
                          push({
                            id: "Attrition",
                            name: "Attrition",
                            component: "DetailedAttribution",
                            data: { companyName },
                          }) 
                        );
                    }
                }
            }
        }
    },

    title: null,  

    series: [
        {
            name: "Attrition",
            data: seriesData,
            color: "#FF0000",
            marker: {
                fillColor: "#FF0000",
                lineWidth: 2,
                lineColor: "#000000",
            },
        },
    ],
};

  return (
    <Card style={{ padding: "0px" }}>
      <CardHeader title="Attrition Breakup"titleTypographyProps={{
            sx: { fontSize: "1rem", fontWeight: 600 },
          }}/>

      <div style={{ height: "320px" }}>
        <HighchartsReact
          highcharts={Highcharts}   // FIXED ✔
          options={options}
          
        />
      </div>
    </Card>
  );
};

export default HomeAttrition;
