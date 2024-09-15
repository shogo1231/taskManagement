// import '../Top.css';
import HighChart from '../HighChart';

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

// CSS
/*******************************************************************************/
const HighChartGanttArea = css`
`


// JS
/*******************************************************************************/
function App() {
  return (
    <>
      <div id='ganttChart' css={HighChartGanttArea}>
        <HighChart />
      </div>
    </>
  )
}

export default App;