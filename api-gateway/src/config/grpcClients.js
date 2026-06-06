const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_DIR = path.join(__dirname, '../proto');

const loadProto = (filename) => {
  const protoPath = path.join(PROTO_DIR, filename);
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  return grpc.loadPackageDefinition(packageDefinition);
};

const userProto = loadProto('user.proto');
const itemProto = loadProto('item.proto');
const borrowingProto = loadProto('borrowing.proto');
const notificationProto = loadProto('notification.proto'); // <-- Pastikan aktif

const userClient = new userProto.user.UserService(
  process.env.USER_SERVICE_URL || 'localhost:50051',
  grpc.credentials.createInsecure()
);

const itemClient = new itemProto.item.ItemService(
  process.env.ITEM_SERVICE_URL || 'localhost:50052',
  grpc.credentials.createInsecure()
);

const borrowingClient = new borrowingProto.borrowing.BorrowingService(
  process.env.BORROWING_SERVICE_URL || 'localhost:50053',
  grpc.credentials.createInsecure()
);

const notificationClient = new notificationProto.notification.NotificationService(
  process.env.NOTIFICATION_SERVICE_URL || 'localhost:50054',
  grpc.credentials.createInsecure()
);

module.exports = {
  userClient,
  itemClient,
  borrowingClient,
  notificationClient, // <-- Pastikan di-export
};