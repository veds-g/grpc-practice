const pb = require("../proto/primes_pb");
exports.prime = (call, _) => {
  console.log("Prime was invoked");

  let num = call.request.getNumber();
  let k = 2;
  const res = new pb.PrimeResponse();
  while (num > 2) {
    if (num % k == 0) {
      res.setNumber(k);
      call.write(res);
      num /= k;
    } else {
      k++;
    }
  }
  call.end();
}