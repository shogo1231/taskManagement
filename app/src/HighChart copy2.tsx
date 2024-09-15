import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/highcharts-gantt';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';


Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

const GanttChart = () => {
  // const chartRef = useRef(null);

  const chartOptions = {
    title: {
      text: 'Highcharts Gantt Chart',
    },
    yAxis: {
      uniqueNames: true,
    },
    accessibility: {
      point: {
        descriptionFormat:
          '{yCategory}. {#if completed}Task {(multiply completed.amount 100):.1f}% completed. {/if} Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.',
      },
    },
    lang: {
      accessibility: {
        axis: {
          xAxisDescriptionPlural:
            'The chart has a two-part X axis showing time in both week numbers and days.',
        },
      },
    },
    series: [
      {
        name: 'Project 1',
        data: [
          {
            start: Date.UTC(2018, 11, 1),
            end: Date.UTC(2018, 11, 2),
            completed: {
              amount: 0.95,
            },
            name: 'Prototyping',
          },
          {
            start: Date.UTC(2018, 11, 2),
            end: Date.UTC(2018, 11, 5),
            completed: {
              amount: 0.444,
            },
            name: 'Development',
          },
          {
            start: Date.UTC(2018, 11, 8),
            end: Date.UTC(2018, 11, 9),
            completed: {
              amount: 0.141,
            },
            name: 'Testing',
          },
          {
            start: Date.UTC(2018, 11, 9),
            end: Date.UTC(2018, 11, 19),
            completed: {
              amount: 0.3,
              fill: '#fa0',
            },
            name: 'Development',
          },
          {
            start: Date.UTC(2018, 11, 10),
            end: Date.UTC(2018, 11, 23),
            name: 'Testing',
          },
        ],
      },
    ],
    // あなたのチャートの設定
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPDF'] // メニューからPDFを選択
        }
      }
    }
  };


  // useEffect(() => {
  //   // Adding the event listener when the component mounts
  //   const pdfButton = document.getElementById('pdf');
  //   if (pdfButton) {
  //     pdfButton.addEventListener('click', handleExportPDF);
  //   }

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     if (pdfButton) {
  //       pdfButton.removeEventListener('click', handleExportPDF);
  //     }
  //   };
  // }, []);

  // const handleExportPDF = () => {
  //   // Ensure the chart is present before attempting to export
  //   if (Highcharts.charts[0]) {
  //     Highcharts.charts[0].exportChart({
  //       type: 'application/pdf'
  //     });
  //   }
  // };

  // const chartRef = useRef<object | undefined | null>(null);

  // const handleExportPDF = () => {
  //   // Access the chart instance from the ref
  //   chartRef.current = Highcharts.charts[0];
  //   if (chartRef.current) {
  //     chartRef.current.chart.exportChart({
  //       type: 'application/pdf',
  //     });
  //   }
  // };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts.ganttChart}
        constructorType={'ganttChart'}
        options={chartOptions}
        // ref={chartRef}
      />
      <button id="pdf">
        Export to PDF
      </button>
    </div>
  );
};

export default GanttChart;
