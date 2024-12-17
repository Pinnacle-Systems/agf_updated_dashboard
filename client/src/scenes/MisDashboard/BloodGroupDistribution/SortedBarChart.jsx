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
        // Create category axis
        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "articleId";
        categoryAxis.renderer.minGridDistance = 1;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;
        // Reduce font size of category axis labels
        categoryAxis.renderer.labels.template.fontSize = 12; // Adjust font size as needed
        categoryAxis.renderer.labels.template.maxWidth = 100; // Maximum width before truncation
        categoryAxis.renderer.labels.template.truncate = true; // Truncate labels

        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.max = Math.max(...topItems.map(i => parseFloat(i.poQty)));

        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "articleId";
        series.dataFields.valueX = "poQty";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusBottomRight = 5;
        series.columns.template.column.cornerRadiusTopRight = 5;
        // Set tooltip configuration
        series.columns.template.tooltipText = "{categoryY}: {valueX}";
        series.columns.template.tooltipText.toString()
        series.xAxis.fontSize = 12
        series.xAxis.width = '100%'

        // Create label bullet
        let labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.horizontalCenter = "left";
        labelBullet.label.dx = 10;
        labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
        labelBullet.locationX = 1;
        labelBullet.label.fontSize = 12;
        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });
        chart.events.on("ready", function () {
            // Change color for specific columns (example: first column)
            if (series.columns.length > 0) {
                series.columns.getIndex(9).fill = am4core.color("#CDCDCD");
                series.columns.getIndex(8).fill = am4core.color("#ECD16A");
                series.columns.getIndex(7).fill = am4core.color("#AEAEAE");
                series.columns.getIndex(6).fill = am4core.color("#ECC93D");
                series.columns.getIndex(5).fill = am4core.color("#8B8B8B");
                series.columns.getIndex(4).fill = am4core.color("#EFC517");
                series.columns.getIndex(3).fill = am4core.color("#606060");
                series.columns.getIndex(2).fill = am4core.color("#DBAB37");
                series.columns.getIndex(1).fill = am4core.color("#474646");
                series.columns.getIndex(0).fill = am4core.color("#F4AF1D");
            }
        });


        chart.data = topItems;
        return () => {
            if (chart) {
                chart.dispose();
            }
        };
    }, [topItems]);
    console.log(topItems, 'top');
    return <div id="sidechartdiv" style={{ width: "100%", height: "350px" }}></div>;
};

export default SortedBarChart;
