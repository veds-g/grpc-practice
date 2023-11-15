const grpc = require('@grpc/grpc-js');
const serviceImpl = require('./service_impl');
const { BlogServiceService } = require('../proto/blog_grpc_pb');
const {MongoClient } = require('mongodb');

const uri = 'mongodb://root:root@localhost:27017/';
const mongoClient = new MongoClient(uri);
global.collection = undefined;

async function cleanup(server) {
  console.log('Shutting down server');
  if (server) {
    await mongoClient.close();
    server.forceShutdown();
  }
}

async function main() {
  const server = new grpc.Server();

  process.on('SIGINT', () => {
    console.log('Received SIGINT');
    cleanup(server);
  });

  await mongoClient.connect();
  const database = mongoClient.db('blogdb');
  collection = database.collection('blog');

  server.addService(BlogServiceService, serviceImpl);
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, _) => {
    if (err) {
      return cleanup(server);
    }
    console.log(`gRPC listening on localhost:50051`);
    server.start();
  });
}

main().catch(cleanup);