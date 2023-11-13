const grpc = require('@grpc/grpc-js');
const {AverageServiceService} = require("../proto/average_grpc_pb");
const service_impl = require("./service_impl");

function cleanup(server) {
  console.log("cleanup");
  if (server) server.forceShutdown();
}

function main() {
  const server = new grpc.Server();

  process.on('SIGINT', () => {
    console.log('Caught interrupt signal');
    cleanup(server);
  });

  server.addService(AverageServiceService, service_impl);
  server.bindAsync("localhost:50051", grpc.ServerCredentials.createInsecure(), (err, _) => {
    if (err) {
      return cleanup(server);
    }
    console.log(`gRPC listening on localhost:50051`);
    server.start();
  });
}

main();
