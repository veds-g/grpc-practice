const grpc = require("@grpc/grpc-js");
const serviceImpl = require('./service_impl');
const service = require('../proto/greet_grpc_pb');

const addr = "0.0.0.0:50051";

function cleanup(server) {
    console.log('Cleanup. Shutting down server...');

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

    const creds = grpc.ServerCredentials.createInsecure();

    server.addService(service.GreetServiceService, serviceImpl);
    server.bindAsync(addr, creds, (err, _) => {
        if (err) {
            return cleanup(server);
        }

        server.start();
    })

    console.log(`Listening on ${addr}`);
}

main();