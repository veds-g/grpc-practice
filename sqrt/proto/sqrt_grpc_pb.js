// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var sqrt_pb = require('./sqrt_pb.js');

function serialize_sqrt_SqrtRequest(arg) {
  if (!(arg instanceof sqrt_pb.SqrtRequest)) {
    throw new Error('Expected argument of type sqrt.SqrtRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqrt_SqrtRequest(buffer_arg) {
  return sqrt_pb.SqrtRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sqrt_SqrtResponse(arg) {
  if (!(arg instanceof sqrt_pb.SqrtResponse)) {
    throw new Error('Expected argument of type sqrt.SqrtResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sqrt_SqrtResponse(buffer_arg) {
  return sqrt_pb.SqrtResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var SqrtServiceService = exports.SqrtServiceService = {
  sqrt: {
    path: '/sqrt.SqrtService/Sqrt',
    requestStream: false,
    responseStream: false,
    requestType: sqrt_pb.SqrtRequest,
    responseType: sqrt_pb.SqrtResponse,
    requestSerialize: serialize_sqrt_SqrtRequest,
    requestDeserialize: deserialize_sqrt_SqrtRequest,
    responseSerialize: serialize_sqrt_SqrtResponse,
    responseDeserialize: deserialize_sqrt_SqrtResponse,
  },
};

exports.SqrtServiceClient = grpc.makeGenericClientConstructor(SqrtServiceService);
