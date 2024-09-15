import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import  Router from "./router/Router";

/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';

// CSS
/*******************************************************************************/
const globalStyles = css`
  body {
    margin: 0px;
    padding: 0px;
  }
`

// JS
/*******************************************************************************/
const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement!).render(
  <>
    <Global styles={globalStyles} />
    <React.StrictMode>
      <Router />
    </React.StrictMode>
  </>
)