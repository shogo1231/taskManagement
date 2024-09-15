import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';
import HighchartsReact from 'highcharts-react-official';
// グラフのExport用モジュールとして下記を読み込ませる。
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';

// Emotion
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// CSS
/*******************************************************************************/
const Wrapper = css`
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

// JS
/*******************************************************************************/
// Highchartsに関するモジュールの初期化
HighchartsGantt(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);
Accessibility(Highcharts);

const GanttChart = () => {
  const chartComponentRef = useRef(null);

  const chartOptions = {
    title: {
      text: 'プロジェクト一覧'
    },
    yAxis: {
      uniqueNames: true
    },
    accessibility: {
      point: {
        descriptionFormat: '{yCategory}. ' +
          '{#if completed}Task {(multiply completed.amount 100):.1f}% ' +
          'completed. {/if}' +
          'Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.'
      }
    },
    lang: {
      accessibility: {
        axis: {
          xAxisDescriptionPlural: 'The chart has a two-part X axis ' +
            'showing time in both week numbers and days.'
        }
      }
    },
    // 表示データ設定
    series: [
      {
        name: 'Project 1',
        data: [
          {
            start: Date.UTC(2018, 11, 1),
            end: Date.UTC(2018, 11, 2),
            completed: {
              amount: 0.95
            },
            name: 'Prototyping' // ここをPJ名に見立てる。
          },
          {
            start: Date.UTC(2018, 11, 2),
            end: Date.UTC(2018, 11, 5),
            completed: {
              amount: 0.444
            },
            name: 'Development'
          },
          {
            start: Date.UTC(2018, 11, 8),
            end: Date.UTC(2018, 11, 9),
            completed: {
              amount: 0.141
            },
            name: 'Testing'
          },
          {
            start: Date.UTC(2018, 11, 9),
            end: Date.UTC(2018, 11, 19),
            completed: {
              amount: 0.3,
              fill: '#fa0'
            },
            name: 'Development'
          },
          {
            start: Date.UTC(2018, 11, 10),
            end: Date.UTC(2018, 11, 23),
            name: 'Testing'
          }
        ]
      }
    ],
    // チャートのエクスポート設定
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: ['downloadPDF'] // メニューからPDFを選択
        }
      }
    },
  };

  // 忘れてたのでメモ useEffect 関数コンポーネントのレンダリング発生時に動く、第二引数に初期値（空配列）を設定しいるので初回のみ自動起動
  useEffect(() => {
    // React.StrictModeの影響で２回DL処理が実行されるのが難点ではある
    // 何個か記事をあさってみたが、回避策はフラグ管理が現実的らしい
    // https://qiita.com/asahina820/items/665c55594cfd55e6f14a
    // これをビルドしてないとき（＝開発モードの時）のみとしたいが上手くできるか・・・
    console.log('useEffectが実行されました')
    // Add event listener for the custom button to export the chart
    const exportButton = document.getElementById('pdf');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        if (chartComponentRef.current) {
          chartComponentRef.current.chart.exportChart({
            type: 'application/pdf'
          });
        }
      });
    }
  }, []);

  return (
    <>
      <div css={Wrapper}>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType={'ganttChart'}
          ref={chartComponentRef}
        />
      </div>

      <button id="pdf">Export to PDF</button>
    </>
  );
};

export default GanttChart;
