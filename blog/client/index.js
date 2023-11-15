const grpc = require('@grpc/grpc-js');
const { BlogServiceClient } = require('../proto/blog_grpc_pb');
const {Blog, BlogId } = require('../proto/blog_pb');
const {Empty} = require('google-protobuf/google/protobuf/empty_pb');

function createBlog(client) {
  console.log('Creating blog');

  return new Promise((resolve, reject) => {
    const req = new Blog()
      .setAuthorId('Vedant')
      .setTitle('My First Blog')
      .setContent('Hello World!');

    client.createBlog(req, (err, res) => {
      if (err) {
        return reject(err);
      }
      console.log(`Blog created: ${res}`);
      resolve(res.getId());
    });
  })
}

function readBlog(client, id) {
  console.log('Reading blog');

  return new Promise((resolve, reject) => {
    const req = new BlogId().setId(id);

    client.readBlog(req, (err, res) => {
      if (err) {
        return reject(err);
      }
      console.log(`Blog read: ${res}`);
      resolve(res);
    });
  });
}

function updateBlog(client, id) {
  console.log('Updating blog');

  return new Promise((resolve, reject) => {
    const req = new Blog()
      .setId(id)
      .setAuthorId('not Vedant')
      .setTitle('My First Blog (updated)')
      .setContent('Hello World! 2 (updated)');

    client.updateBlog(req, (err, _) => {
      if (err) {
        return reject(err);
      }
      console.log(`Blog updated`);
      resolve();
    });
  });
}

function listBlog(client) {
  console.log('Listing blogs');

  return new Promise((resolve, reject) => {
    const req = new Empty();
    const call = client.listBlog(req);

    call.on('data', (res) => {
      console.log(`Blog: ${res}`);
    })

    call.on('error', (err) => {
      reject(err);
    });

    call.on('end', () => {
      resolve();
    });
  })
}

function deleteBlog(client, id) {
  console.log('Deleting blog');

    return new Promise((resolve, reject) => {
      const req = new BlogId().setId(id);

      client.deleteBlog(req, (err, _) => {
        if (err) {
          return reject(err);
        }
        console.log(`Blog deleted`);
        resolve();
      });
    });
}

async function main() {
  const client = new BlogServiceClient('localhost:50051', grpc.ChannelCredentials.createInsecure());

  // const id = await createBlog(client);
  // await readBlog(client, id);
  // await updateBlog(client, '655458aae2d72b0f72c58dbb');
  // await listBlog(client);
  await deleteBlog(client, '655458aae2d72b0f72c58dbb');

  client.close();
}

main();