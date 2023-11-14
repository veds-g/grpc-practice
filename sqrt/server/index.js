const grpc = require("@grpc/grpc-js");
const {SqrtServiceService} = require("../proto/sqrt_grpc_pb");
const serviceImpl = require("./service_impl");

function cleanup(server) {
  console.log("Shutting down gRPC server");
  if (server) server.forceShutdown();
}

function main() {
  const server = new grpc.Server();

  process.on("SIGINT", () => {
    console.log("SIGINT received");
    cleanup(server);
  });

  server.addService(SqrtServiceService, serviceImpl);
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, _) => {
      if (err) {
        return cleanup(server);
      }
      console.log(`gRPC listening on localhost:50051`);
      server.start();
    });
}

main();