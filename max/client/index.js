const grpc = require("@grpc/grpc-js");
const pb = require("../proto/max_pb");
const {MaxServiceClient} = require("../proto/max_grpc_pb");

function doMax(client) {
  console.log("doMax was invoked");
  const nums = [1,5,3,6,2,20];
  const call = client.max();

  call.on("data", (res) => {
    console.log(`Max: ${res.getResult()}`);
  })

  nums.map(num => {
    return new pb.MaxRequest().setA(num);
  }).forEach(req => call.write(req));
  call.end();
}

function main() {
  const client = new MaxServiceClient("localhost:50051", grpc.ChannelCredentials.createInsecure());
  doMax(client);
  client.close();
}

main();