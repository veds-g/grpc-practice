const pb = require('../proto/average_pb');

exports.avg = (call, callback) => {
  console.log("Average was invoked");

  let sum = 0.0;
  let cnt = 0.0;
  call.on("data", (req) => {
    sum += req.getNumber();
    cnt++;
  });
  call.on("end", () => {
    //call.request.getNumbersList().length
    const res = new pb.AverageResponse().setResult(sum / cnt);
    callback(null, res);
  })
}