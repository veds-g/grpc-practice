const grpc = require("@grpc/grpc-js");
const pb = require("../proto/sqrt_pb");
const {SqrtServiceClient} = require("../proto/sqrt_grpc_pb");

function doSqrt(client, num) {
  const req = new pb.SqrtRequest().setNumber(num);
  client.sqrt(req, (err, res) => {
    if (err) return console.log(err);
    console.log(`Square root of ${num} is ${res.getResult()}`);
  });
}

function main() {
  const client = new SqrtServiceClient(
    "localhost:50051",
    grpc.ChannelCredentials.createInsecure()
  );

  doSqrt(client, -1);
  client.close();
}

main();