const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const historyGet = require('../services/historyGet');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
 
  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": createdAt
  }
 
  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  })
  response.code(201);
  return response;
}

async function postHistoryHandler(req, h) {
    try {
      const histories = await historyGet();
  
      const formattedHistories = [];

      histories.forEach(doc => {
      const documentData = doc.data();
      formattedHistories.push({
        id: doc.id,
        history: {
          result: documentData.result,
          createdAt: documentData.createdAt,
          suggestion: documentData.suggestion,
          id: doc.id
        }
      });
    });
  
      const res = h.response({
        status: 'success',
        data: formattedHistories
      });
  
      res.code(200);
      return res;
  
    } catch (err) {
      return h.response({
        status: 'fail',
        message: err.message || 'Terjadi kesalahan saat memproses riwayat.'
      }).code(500);
    }
  }
 
module.exports = {postPredictHandler, postHistoryHandler};