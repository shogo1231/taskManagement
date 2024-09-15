import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';

import HighchartsReact from 'highcharts-react-official';

// Highchartsモジュールを初期化
HighchartsGantt(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

const GanttChartComponent = () => {
  // const chartContainerRef = useRef<string | HTMLElement | undefined | null>(null);

  // useEffect(() => {
  //   // チャートの初期化
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-expect-error
  //   Highcharts.ganttChart(chartContainerRef.current, {
  //     title: {
  //       text: 'プロジェクト計画'
  //     },
  //     series: [
  //       {
  //         name: 'タスク',
  //         data: [
  //           {
  //             name: '開始',
  //             start: Date.UTC(2024, 8, 1),
  //             end: Date.UTC(2024, 8, 3)
  //           },
  //           // 他のタスクデータをここに追加
  //         ]
  //       }
  //     ],
  //     exporting: {
  //       enabled: true, // エクスポートボタンを有効化
  //       buttons: {
  //         contextButton: {
  //           menuItems: ['downloadPDF'] // メニューからPDFを選択
  //         }
  //       }
  //     }
  //   });
  // }, []);

  const chartOptions = {
    title: {
      text: 'プロジェクト計画'
    },
    series: [
      {
        name: 'タスク',
        data: [
          {
            name: '開始',
            start: Date.UTC(2024, 8, 1),
            end: Date.UTC(2024, 8, 3)
          },
          // 他のタスクデータをここに追加
        ]
      }
    ],
    exporting: {
      enabled: true, // エクスポートボタンを有効化
      buttons: {
        contextButton: {
          menuItems: ['downloadPDF'] // メニューからPDFを選択
        }
      }
    }
  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts.ganttChart}
        constructorType={'container'}
        options={chartOptions}
        // ref={chartRef}
      />
      <button id="pdf">
        Export to PDF
      </button>
    </div>
  );
  // return <div id="container" ref={chartContainerRef} />;
};

export default GanttChartComponent;
