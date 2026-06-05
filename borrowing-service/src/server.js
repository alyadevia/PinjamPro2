const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./db');
const borrowingServiceLogic = require('./services/borrowingService');

dotenv.config();
connectDB();

const PROTO_PATH = path.join(__dirname, 'proto/borrowing.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const borrowingProto = grpc.loadPackageDefinition(packageDefinition).borrowing;

const main = async () => {
  await sequelize.sync(); // <-- HAPUS { alter: true }
  console.log('Database synchronized (Borrowing Service)');

  const server = new grpc.Server();
  server.addService(borrowingProto.BorrowingService.service, borrowingServiceLogic);

  const port = process.env.PORT || 50053;
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err);
        return;
      }
      console.log(`Borrowing Service gRPC server running on port ${port}`);
      server.start();
    }
  );
};

main();