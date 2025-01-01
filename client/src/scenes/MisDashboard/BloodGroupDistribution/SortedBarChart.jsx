import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const SortedBarChart = ({ topItems }) => {
    useEffect(() => {
        if (!topItems || topItems.length === 0) return;

        am4core.useTheme(am4themes_animated);

        let chart = am4core.create("sidechartdiv", am4charts.XYChart);
        chart.padding(10, 20, 10, 20);
        chart.logo.disabled = true;
        chart.background.fill = am4core.color("#ffffff");

        let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "articleId";
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.fontSize = 14;
        categoryAxis.renderer.labels.template.fill = am4core.color("#333333");
        categoryAxis.title.text = "Blood Group";
        categoryAxis.title.fontSize = 14;
        categoryAxis.title.fill = am4core.color("#333333");
        categoryAxis.title.fontWeight = "bold"

        let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.max = topItems.length > 0 ? Math.max(...topItems.map(i => parseFloat(i.poQty))) : 100;
        valueAxis.renderer.minGridDistance = 40;
        valueAxis.renderer.labels.template.fill = am4core.color("#333333");
        valueAxis.title.text = "Number of Employees";
        valueAxis.title.fontSize = 14;
        valueAxis.title.fill = am4core.color("#333333");
        valueAxis.title.fontWeight = "bold"


        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "articleId";
        series.dataFields.valueX = "poQty";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusBottomRight = 8;
        series.columns.template.column.cornerRadiusTopRight = 8;
        series.columns.template.tooltipText = "{categoryY}: {valueX}";

        series.tooltip.background.fill = am4core.color("#2c3e50");
        series.tooltip.label.fill = am4core.color("#ffffff");

        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.horizontalCenter = "left";
        labelBullet.label.dx = 10;
        labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
        labelBullet.label.fill = am4core.color("#ffffff");

        series.columns.template.adapter.add("fill", (fill, target) => chart.colors.getIndex(target.dataItem.index));

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;

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
