const pb = require("../proto/sum_pb");

exports.sum = (call, callback) => {
  const res = new pb.SumResponse().setResult(call.request.getA() + call.request.getB());
  callback(null, res);
}