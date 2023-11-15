const grpc = require('@grpc/grpc-js');
const {Blog, BlogId} = require('../proto/blog_pb');
const {ObjectId} = require("mongodb");
const {Empty} = require('google-protobuf/google/protobuf/empty_pb');

function blogToDocument(blog) {
  return {
    author_id: blog.getAuthorId(),
    title: blog.getTitle(),
    content: blog.getContent()
  };
}

const internal = (err, callback) => callback({
  code: grpc.status.INTERNAL,
  message: err.toString(),
});

function checkNotAcknowledged(res, callback) {
  if (!res.acknowledged) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Operation wasn\'t acknowledged',
    });
  }
}

function checkOID(id, callback) {
  try {
    return new ObjectId(id);
  } catch(err) {
    callback({
      code: grpc.status.INTERNAL,
      message: 'Invalid OID',
    });
  }
}

function checkNotFound(res, callback) {
  if (!res || res.matchedCount === 0 || res.deleteCount === 0) {
    callback({
      code: grpc.status.NOT_FOUND,
      message: 'Blog not found',
    });
  }
}

function documentToBlog(doc) {
  const blog = new Blog();
  blog.setId(doc._id.toString());
  blog.setAuthorId(doc.author_id);
  blog.setTitle(doc.title);
  blog.setContent(doc.content);
  return blog;
}

exports.createBlog = async (call, callback) => {
  const data = blogToDocument(call.request);

  await collection.insertOne(data)
    .then(res => {
      checkNotAcknowledged(res, callback);
      const blogId = new BlogId();
      blogId.setId(res.insertedId.toString());
      callback(null, blogId);
    })
    .catch(err => internal(err, callback));
};

exports.readBlog = async (call, callback) => {
  const id = checkOID(call.request.getId(), callback);

  await collection.findOne({_id: id})
    .then(res => {
      checkNotFound(res, callback);
      callback(null, documentToBlog(res));
    })
    .catch(err => internal(err, callback));
}

exports.updateBlog = async (call, callback) => {
  const id = checkOID(call.request.getId(), callback);
  const data = blogToDocument(call.request);

  await collection.updateOne({_id: id}, {$set: data})
    .then(res => {
      checkNotFound(res, callback);
      checkNotAcknowledged(res, callback);
      callback(null, new Empty());
    })
    .catch(err => internal(err, callback));
}

exports.listBlog = async (call, _) => {
  await collection.find()
    .map(doc => documentToBlog(doc))
    .forEach(blog => call.write(blog))
    .then(() => call.end())
    .catch(err => call.destroy({
      code: grpc.status.INTERNAL,
      message: 'Could not list blogs',
    }));
}

exports.deleteBlog = async (call, callback) => {
  const id = checkOID(call.request.getId(), callback);

  await collection.deleteOne({_id: id})
    .then(res => {
      checkNotFound(res, callback);
      checkNotAcknowledged(res, callback);
      callback(null, new Empty());
    })
    .catch(err => internal(err, callback));
}