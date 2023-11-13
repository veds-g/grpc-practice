const pb = require("../proto/max_pb");

exports.max = (call, _) => {
  console.log("Max was invoked");

  let mx = 0;
  call.on("data", (req) => {
    console.log("Received resp: " + req.getA());
    const num = req.getA();
    if (num > mx) {
      const res = new pb.MaxResponse().setResult(num);
      call.write(res);
      mx = num;
    }
  })
  call.on("end", () => call.end());
}