import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const SortedBarChart = ({ topItems }) => {

    useEffect(() => {
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        let chart = am4core.create("sidechartdiv", am4charts.XYChart);
        chart.padding(10, 10, 10, 10); // Increased padding for cleaner layout
        chart.logo.disabled = true;

        // Create category axis
        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "articleId";
        categoryAxis.renderer.minGridDistance = 1;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 10; // Reduced font size
        categoryAxis.renderer.labels.template.fill = am4core.color("#666"); // Lighter gray for readability
        categoryAxis.renderer.labels.template.maxWidth = 100;
        categoryAxis.renderer.labels.template.truncate = true; // Truncate long labels
        categoryAxis.title.text = "Blood Group";
        categoryAxis.title.fontWeight = 600;

        categoryAxis.title.fontSize = 14; // Reduced title font size
        categoryAxis.title.fill = am4core.color("#333"); // Title color

        // Create value axis
        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.max = Math.max(...topItems.map(i => parseFloat(i.poQty)));
        valueAxis.renderer.labels.template.fontSize = 10; // Reduced font size
        valueAxis.renderer.labels.template.fill = am4core.color("#666"); // Lighter gray for readability
        valueAxis.title.text = "Number of Employees";
        valueAxis.title.paddingTop = 10;
        valueAxis.title.fontWeight = 600;
        valueAxis.title.fontSize = 14; // Reduced title font size
        valueAxis.title.fill = am4core.color("#333"); // Title color

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "articleId";
        series.dataFields.valueX = "poQty";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusBottomRight = 8; // Rounded corners for smoother look
        series.columns.template.column.cornerRadiusTopRight = 8;
        series.columns.template.tooltipText = "{categoryY}: {valueX}";
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color("#333");
        series.tooltip.background.cornerRadius = 5;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.label.fontSize = 10; // Slightly larger tooltip text
        series.tooltip.label.fill = am4core.color("#fff");

        // Create label bullet
        // Create label bullet
let labelBullet = series.bullets.push(new am4charts.LabelBullet());
labelBullet.label.horizontalCenter = "left";
labelBullet.label.dx = 10;
labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#')}"; // Remove decimals
labelBullet.locationX = 1;
labelBullet.label.fontSize = 10; // Larger label font size
labelBullet.label.fill = am4core.color("#333");


        // Apply color to columns with hover effect
        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

        // Add hover effect for columns
        series.columns.template.events.on("over", function (event) {
            event.target.fill = am4core.color("#ffcc00"); // Change color on hover
        });
        series.columns.template.events.on("out", function (event) {
            event.target.fill = event.target.dataItem.column.fill; // Revert to original color
        });

        // Set chart data
        chart.data = topItems;

        // Apply different colors for the top columns
        chart.events.on("ready", function () {
            if (series.columns.length > 0) {
                series.columns.getIndex(0).fill = am4core.color("#9E1710");
                series.columns.getIndex(1).fill = am4core.color("#9E4110");
                series.columns.getIndex(2).fill = am4core.color("#32fce1");
                series.columns.getIndex(3).fill = am4core.color("#299E10");
                series.columns.getIndex(4).fill = am4core.color("#446b8d");
                series.columns.getIndex(5).fill = am4core.color("#109E87");
                series.columns.getIndex(6).fill = am4core.color("#10799E");
                series.columns.getIndex(7).fill = am4core.color("#101F9E");
                series.columns.getIndex(8).fill = am4core.color("#6178ff");
                series.columns.getIndex(9).fill = am4core.color("#82109E");
            }
        });

        return () => {
            if (chart) {
                chart.dispose();
            }
        };
    }, [topItems]);

    return (
        <div id="sidechartdiv" style={{
            width: "100%", 
            height: "360px", 
            backgroundColor: "#f5f5f5", 
            borderRadius: "12px", 
            padding: "15px", 
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}></div>
    );
};

export default SortedBarChart;
