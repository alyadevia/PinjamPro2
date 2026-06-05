const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./db');
const userServiceLogic = require('./services/userService');

// Load .env
dotenv.config();

// Load DB
connectDB();

// Definisikan path ke proto file
const PROTO_PATH = path.join(__dirname, 'proto/user.proto');

// Konfigurasi Proto Loader
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load package
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Fungsi utama
const main = async () => {
  try {
    /**
     * SINKRONISASI DATABASE
     * Menggunakan { alter: true } untuk menambahkan kolom baru (profilePicture) 
     * secara otomatis ke tabel MySQL tanpa menghapus data yang sudah ada.
     */
    await sequelize.sync({ alter: true });
    console.log('Database synchronized with structural changes applied');

    const server = new grpc.Server({
      // Opsi tambahan untuk menangani pesan besar (Base64 gambar)
      'grpc.max_receive_message_length': 10 * 1024 * 1024, // 10MB
      'grpc.max_send_message_length': 10 * 1024 * 1024,    // 10MB
    });

    // Tambahkan service ke server
    server.addService(userProto.UserService.service, userServiceLogic);

    const port = process.env.PORT || 50051;
    server.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err, boundPort) => {
        if (err) {
          console.error('Failed to bind server:', err);
          return;
        }
        console.log(`User Service gRPC server running on port ${boundPort}`);
        // Di versi gRPC terbaru, server.start() sudah tidak wajib dipanggil 
        // secara eksplisit jika menggunakan bindAsync, namun tetap aman dibiarkan.
      }
    );
  } catch (error) {
    console.error('Failed to start User Service:', error);
    process.exit(1);
  }
};

main();