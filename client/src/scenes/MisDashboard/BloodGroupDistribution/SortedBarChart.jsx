import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const SortedBarChart = ({ topItems }) => {

    useEffect(() => {
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        let chart = am4core.create("sidechartdiv", am4charts.XYChart);
        chart.padding(5, 5, 5, 5);
        chart.logo.disabled = true;

        // Set chart background color
        chart.background.fill = am4core.color("#f7f7f7");

        // Create category axis
        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "articleId";
        categoryAxis.renderer.minGridDistance = 1;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;

        // Adjust font size and label truncation
        categoryAxis.renderer.labels.template.fontSize = 14;
        categoryAxis.renderer.labels.template.maxWidth = 120;
        categoryAxis.renderer.labels.template.truncate = true;
        categoryAxis.renderer.labels.template.fill = am4core.color("#333333");

        // Create value axis
        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.max = Math.max(...topItems.map(i => parseFloat(i.poQty)));
        valueAxis.renderer.minGridDistance = 40;
        valueAxis.renderer.labels.template.fill = am4core.color("#333333");

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "articleId";
        series.dataFields.valueX = "poQty";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusBottomRight = 8;
        series.columns.template.column.cornerRadiusTopRight = 8;
        series.columns.template.tooltipText = "{categoryY}: {valueX}";

        // Improve tooltip design
        series.tooltip.background.fill = am4core.color("#2c3e50");
        series.tooltip.label.fill = am4core.color("#ffffff");
        series.tooltip.label.fontSize = 14;
        series.tooltip.pointerOrientation = "vertical";

        // Label Bullet for value display
        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.horizontalCenter = "left";
        labelBullet.label.dx = 10;
        labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
        labelBullet.locationX = 1;
        labelBullet.label.fontSize = 14;
        labelBullet.label.fill = am4core.color("#ffffff");

        // Apply gradient color for columns
        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

        // Add animations for smoother transitions
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;
        chart.cursor.behavior = "zoomX";

        // Events for changing specific column colors (Optional)
        chart.events.on("ready", function () {
            if (series.columns.length > 0) {
                series.columns.getIndex(0).fill = am4core.color("#f39c12"); // First column color
                series.columns.getIndex(1).fill = am4core.color("#e74c3c"); // Second column color
                // Add more column colors if needed
            }
        });

        // Set chart data
        chart.data = topItems;

        return () => {
            if (chart) {
                chart.dispose();
            }
        };
    }, [topItems]);

    return <div id="sidechartdiv" style={{ width: "100%", height: "350px" }}></div>;
};

export default SortedBarChart;
