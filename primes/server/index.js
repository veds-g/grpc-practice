const grpc = require("@grpc/grpc-js");
const {PrimeServiceService} = require("../proto/primes_grpc_pb");
const service_impl = require("./service.impl");

function cleanup(server) {
  console.log("Cleanup. Shutting down server...");
  if (server) {
    server.forceShutdown();
  }
}

function main() {
  const server = new grpc.Server();

  process.on('SIGINT', () => {
    console.log('Caught interrupt signal');
    cleanup(server);
  });

  server.addService(PrimeServiceService, service_impl);
  server.bindAsync("localhost:50051", grpc.ServerCredentials.createInsecure(), (err, _) => {
    if (err) {
      return cleanup(server);
    }
    console.log(`gRPC listening on localhost:50051`);
    server.start();
  });
}

main();