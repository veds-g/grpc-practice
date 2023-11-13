const grpc = require("@grpc/grpc-js");
const {SumServiceClient} = require("../proto/sum_grpc_pb");
const {SumRequest} = require("../proto/sum_pb");

function doSum(client) {
  const req = new SumRequest().setA(3).setB(10);
  client.sum(req, (err, res) => {
    if (err) {
      return console.log(err);
    }
    console.log(res.getResult());
  });

}

function main() {
  const creds = grpc.ChannelCredentials.createInsecure();
  const client = new SumServiceClient("localhost:50051", creds);

  doSum(client);
  client.close();
}

main();