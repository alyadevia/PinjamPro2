const grpc = require('@grpc/grpc-js');

const grpcCall = (client, method, params) => {
  return new Promise((resolve, reject) => {
    client[method](params, (error, response) => {
      if (error) {
        console.error('gRPC Error:', error.message);
        const status =
          error.code === grpc.status.NOT_FOUND
            ? 404
            : error.code === grpc.status.ALREADY_EXISTS
            ? 409
            : error.code === grpc.status.INVALID_ARGUMENT
            ? 400
            : error.code === grpc.status.UNAUTHENTICATED
            ? 401
            : 500;

        const err = new Error(error.details || error.message);
        err.statusCode = status;
        return reject(err);
      }
      resolve(response);
    });
  });
};

module.exports = { grpcCall };