const { Firestore } = require('@google-cloud/firestore');
 
async function historyGet(id, data) {
  const db = new Firestore();
 
  const predictCollection = db.collection('predictions');
  const history = await predictCollection.get();
  return history;
}
 
module.exports = historyGet;