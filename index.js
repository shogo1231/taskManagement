/* デバッグ起動時の処理 */

import express from 'express';
import { sitename, baseUrl } from './app/settings.js';
import appExpress from './app.js';
// import { makeUploadsDirectory } from './global/make-uploads.js';

const app = express();
const router = express.Router();

router.use('/', appExpress);
app.use('/' + sitename, router);

const port = 3000;

// uploadsディレクトリ作成
// makeUploadsDirectory();

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
