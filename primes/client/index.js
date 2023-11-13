const grpc = require("@grpc/grpc-js");
const {PrimeServiceClient} = require("../proto/primes_grpc_pb");
const primes_pb = require("../proto/primes_pb");

function doPrimes(client) {
  const primeRequest = new primes_pb.PrimeRequest();
  primeRequest.setNumber(12390392840);

  const call = client.prime(primeRequest);

  call.on("data", (res) => {
    console.log(`Prime factors: ${res}`);
  })
}

function main() {
  const client = new PrimeServiceClient("localhost:50051", grpc.credentials.createInsecure());

  doPrimes(client);
  client.close();
}

main();