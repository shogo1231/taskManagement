import mongo from '../../mongo';

// ローカルDBからサンプルデータを取得
async function getTaskData () {
  const db = await mongo.getDb();

  const result = await db.collection('project')
  .find({})
  .toArray();

  return result;
}

export = {
  getTaskData,
}