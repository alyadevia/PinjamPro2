const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./db');
const itemServiceLogic = require('./services/itemService');

dotenv.config();
connectDB();

const PROTO_PATH = path.join(__dirname, 'proto/item.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const itemProto = grpc.loadPackageDefinition(packageDefinition).item;

const main = async () => {
  await sequelize.sync(); // <-- HAPUS { alter: true }
  console.log('Database synchronized (Item Service)');

  const server = new grpc.Server();
  server.addService(itemProto.ItemService.service, itemServiceLogic);

  const port = process.env.PORT || 50052;
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err);
        return;
      }
      console.log(`Item Service gRPC server running on port ${port}`);
      server.start();
    }
  );
};

main();