const grpc = require('@grpc/grpc-js');
const pb = require('../proto/average_pb');
const {AverageServiceClient} = require("../proto/average_grpc_pb");

function doAverage(client) {
  console.log("doAverage was invoked");

  const nums = [1,2,3,4];

  const call = client.avg((err, res) => {
    if (err) {
      return console.log(err);
    }
    console.log(`Avg: ${res}`);
  })

  nums.map((num) => {
    return new pb.AverageRequest().setNumber(num);
  }).forEach((req) => call.write(req));
  call.end();
}

function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new AverageServiceClient("localhost:50051", creds);

  doAverage(client);
  client.close();
}

main();
