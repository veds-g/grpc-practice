const grpc = require("@grpc/grpc-js");
const {SumServiceService } = require("../proto/sum_grpc_pb");
const service_impl = require("./service_impl");
const addr = "localhost:50051";

function cleanup(server) {
  console.log("Cleanup. Shutting down server...");
  if (server) server.forceShutdown();
}

function main() {
  const server = new grpc.Server();

  process.on("SIGINT", () => {
    console.log("Received SIGINT. Cleaning up...");
    cleanup(server);
  })
  server.addService(SumServiceService, service_impl);
  server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), (err, _) => {
    if (err) {
      return cleanup(server);
    }
    console.log(`gRPC listening on ${addr}`);
    server.start();
  });
}

main();