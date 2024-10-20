import { useEffect, useState, useRef } from 'react';
// 新規登録ポップアップ関連
import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from 'date-fns/locale/ja';

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

const newRegist = css`
	display: block;
	text-align: center;
	/* vertical-align: middle; */
	text-decoration: none;
	width: 80px;
	margin-left: auto;
	padding: 0.5rem 1rem;
	font-weight: bold;
	border-radius: 100vh;
	border-bottom: 7px solid #0686b2;
	background: #27acd9;
	color: #fff;

  &:hover {
    margin-top: 6px;
    border-bottom: 1px solid #0686b2;
    color: #fff;
  }
`;

// ポップアップに関するコンポーネント用CSS
const modalStyle = {
  // モーダルポップアップ部分のスタイル
  content: css`
    position: fixed;       /* 画面に対して固定 */
    top: 50%;              /* 縦方向の中心 */
    left: 50%;             /* 横方向の中心 */
    transform: translate(-50%, -50%);  /* 要素自体の幅と高さの半分だけずらして中央揃え */
    width: 80%;            /* 画面幅の80%に設定（レスポンシブ） */
    max-width: 500px;      /* 最大幅を500pxに制限 */
    height: 80%;          /* 高さはコンテンツに応じて自動 */
    max-height: 900px;      /* 最大幅を500pxに制限 */
    padding: 20px;         /* 余白を追加 */
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
  `,
  // オーバーレイのスタイル
  overlay: css`
    background-color: rgb(204, 204, 204, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};

const inlineBlock = css`
  display: inline-block;
`;

const inputForm = css`
  border: none;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`

const popupFont = css`
  width: 100px;
  margin-right: 10px;
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

        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType={'ganttChart'}
          ref={chartComponentRef}
        />

      )}
    </>
  );
}

const GanttChart = () => {
  const [modal, setModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  registerLocale('ja', ja);

  const togglePopup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // ページ遷移を防ぐ
    setModal(!modal); // ポップアップの表示状態を切り替え
  };
  // モーダルを使用する前に、アプリのルート要素を設定する
  Modal.setAppElement('#root');

  return (
    <>
      <div css={Wrapper}>
        <div>
          <a
            href=""
            css={newRegist}
            onClick={(e) => { togglePopup(e); }}
          >新規登録</a>
        </div>
        <HighchartsView />
      </div>

      {/* コンポーネント化が必要 */}
      <Modal
        isOpen={modal}
        css={modalStyle.overlay}
      >
        <div css={modalStyle.content}>
          <h1>タスク新規登録</h1>
          <div>
            <div css={[inlineBlock, popupFont]}>
              タスク名
            </div>
            <div css={[inlineBlock]}>
              <input
                type='text'
                placeholder='未入力'
                css={[inputForm]}
              ></input>
            </div>
          </div>
          <div>
            <div css={[inlineBlock, popupFont]}>
              開始日
            </div>
            <div css={inlineBlock}>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                locale='ja'
                selected={startDate}
                placeholderText='yyyy/MM/dd'
                onChange={(date) => setStartDate(date)}
                css={[inputForm]}
              />
            </div>
          </div>
          <div>
            <div css={[inlineBlock, popupFont]}>
              終了日
            </div>
            <div css={inlineBlock}>
              <DatePicker
                dateFormat="yyyy/MM/dd"
                locale='ja'
                selected={endDate}
                placeholderText='yyyy/MM/dd'
                onChange={(date) => setEndDate(date)}
                css={[inputForm]}
              />
            </div>
          </div>
          <div>
            <div css={[inlineBlock, popupFont]}>
              進捗率
            </div>
            <div css={inlineBlock}>
              <input
                type='number'
                max='1'
                min='0'
                step='0.01'
                placeholder='0.5'
                css={[inputForm]}
              ></input>
            </div>
          </div>
          <span>
            <button onClick={(e) => { togglePopup(e); }}>close</button>
            <button onClick={(e) => { togglePopup(e); }}>close</button>
          </span>
        </div>
      </Modal>
    </>
  );
};

export default GanttChart;
