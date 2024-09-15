import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import Top from '../components/Top';


/**
 * memo
 * Routes下のRouteは上から順に評価される
 * つまり、ログイン画面などLayout（ヘッダやフッタなどの共通コンポーネントを使いたくない画面）を
 * 使いたくない画面のpathを上に持ってくることで実装可能
 * 現状はTopで確認できる。
 */

const Router = () => {
  return  (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/Top" element={<Top />} /> */}
        <Route path="/" element={<Layout />}>
          <Route path="/Top" element={<Top />} />
          <Route path="*" element={ <p>There's nothing here!</p> } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Router;