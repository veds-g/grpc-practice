const pb = require("../proto/sqrt_pb");
const grpc = require("@grpc/grpc-js");

exports.sqrt = (call, callback) => {
  console.log("Sqrt was invoked");
  const num = call.request.getNumber();
  if (num < 0) {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: `Cannot calculate square root of ${num}, as it is negative`
    })
  }

  const sqrt = Math.sqrt(num);
  const res = new pb.SqrtResponse().setResult(sqrt);
  callback(null, res);
};