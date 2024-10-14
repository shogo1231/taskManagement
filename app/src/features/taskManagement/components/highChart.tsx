import { useEffect, useState, useRef } from 'react';
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

interface Obj {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: number]: any // 『[prop: string]: any』を記述してあげることでどんなプロパティも持てるようになります。
}

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

const HighchartsView = () => {
  const [chartItem, setChartItem] = useState<Obj>();
  const [loading, setLoading] = useState(true); // ローディング管理用フラグ。Highcharts用データ取得後のグラフ描画に関する遅延発生を防ぐ。
  const chartComponentRef = useRef(null);
  const URL = 'http://localhost:3000/taskAppAPI/taskManagement/getTaskManagementData';

  useEffect(() => {
    console.log('データ取得のuseEffectが実行されました')
    const fetchData = async () => {
      try {
        fetch(URL)
        .then(res => res.json())
        .then(result => {
          // Highcharts-ganttの仕様なのか日付の項目はUTCに変換して表示する必要がある（めんどくさい）
          // eslint-disable-next-line prefer-const
          let newResult: Array<object> = [];
          result.forEach((item: Obj) => {
            const startDate = new Date(item.start);
            const endDate = new Date(item.end);
            newResult.push({
              start: Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()),
              end: Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()),
              completed: item.completed,
              name: item.name,
            });
          })

          setChartItem(newResult);

          setLoading(false);
        })
      } catch (e) {
        console.log('データ取得のuseEffectが失敗しました')
        console.error(e);
      }
    };

    fetchData();
  }, [URL]);

  const chartOptions = {
    title: {
      text: 'タスク一覧'
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
    series: !loading ? [
      {
        name: 'task1',
        data: chartItem,
      }
    ]: [],
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
      {loading ? (
        <div>Loading...</div>
      ) : (
      <div css={Wrapper}>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType={'ganttChart'}
          ref={chartComponentRef}
        />
      </div>
      )}
    </>
  );
}

const GanttChart = () => {
  return (
    <>
      <HighchartsView />
    </>
  );
};

export default GanttChart;
