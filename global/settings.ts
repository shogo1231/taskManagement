import path from 'path';

// バイヤーサイト個別の設定
// 全体で共通の設定はglobalディレクトリのsettings.jsに記載している

const { __dirname } = getGlobalName(import.meta.url);

/** ejsソースフォルダとなるviewsディレクトリ */
const viewsDir = path.resolve(__dirname, 'views');

/** サイト名 */
const sitename = 'guide_dev';
// /** ベースとなるURL $divは各企業単位で異なるため、後で書き換える */
// const baseUrl = '/guide_dev/$div/';

// /** クッキー名 Todo:同じ名前で問題無いのかの調査 */
// const cookieName = 'guide_session_id';

export {
  viewsDir,
  sitename,
  // baseUrl,
  // cookieName
};
