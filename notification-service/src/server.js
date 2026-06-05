const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// --- KONFIGURASI TWILIO CLIENT ---
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(twilioAccountSid, twilioAuthToken);
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_FROM;
// ---------------------------------

// --- KONFIGURASI CLIENT UNTUK USER SERVICE ---
const USER_PROTO_PATH = path.join(__dirname, '../../userservice/src/proto/user.proto');
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;
const userClient = new userProto.UserService(
  process.env.USER_SERVICE_URL || 'localhost:50051',
  grpc.credentials.createInsecure()
);
console.log('gRPC client untuk User Service terhubung.');
// ----------------------------------------------

// --- DEFINISI NOTIFICATION SERVICE (SERVER) ---
const NOTIF_PROTO_PATH = path.join(__dirname, 'proto/notification.proto');
const notifPackageDefinition = protoLoader.loadSync(NOTIF_PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
});
const notificationProto = grpc.loadPackageDefinition(notifPackageDefinition).notification;

const grpcCall = (client, method, params) => {
  return new Promise((resolve, reject) => {
    client[method](params, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });
};

const notificationServiceLogic = {
  SendNotification: async (call, callback) => {
    const { user_id, message, type } = call.request;
    
    console.log('=================================');
    console.log(`📫 NOTIFIKASI WA DITERIMA (Tipe: ${type})`);
    
    try {
      const { user } = await grpcCall(userClient, 'GetUser', { id: user_id });
      if (!user || !user.phone_number) {
        throw new Error(`User not found or has no phone number: ${user_id}`);
      }
      
      let toWhatsAppNumber = user.phone_number;
      if (toWhatsAppNumber.startsWith('0')) {
        toWhatsAppNumber = `+62${toWhatsAppNumber.substring(1)}`;
      }
      if (!toWhatsAppNumber.startsWith('whatsapp:')) {
         toWhatsAppNumber = `whatsapp:${toWhatsAppNumber}`;
      }
     
      console.log(`   -> Mengirim ke: ${toWhatsAppNumber}`);
      
      let messageBody = `*Notifikasi PinjamPro*
Halo ${user.name},
${message}`;

      if (type === 'BORROW_APPROVED') {
        const borrowIdMatch = message.match(/\(ID: (.*?)\)/);
        const borrowId = borrowIdMatch ? borrowIdMatch[1] : null;

        const receiptLink = `http://localhost:3000/receipt/${borrowId}`;

        messageBody = `✅ *Peminjaman Disetujui (PinjamPro)*
Halo ${user.name},
Kabar baik! Peminjaman Anda telah disetujui oleh admin.

Silakan lihat "Surat Persetujuan" digital Anda di link berikut untuk mengambil barang:
${receiptLink}

Terima kasih.`;
      } else if (type === 'BORROW_REJECTED') {
        messageBody = `❌ *Peminjaman Ditolak (PinjamPro)*
Halo ${user.name},
Mohon maaf, peminjaman Anda belum dapat kami setujui.

${message}

Hubungi admin untuk info lebih lanjut.`;
      }

      const info = await twilioClient.messages.create({
         from: twilioWhatsAppNumber,
         to: toWhatsAppNumber,
         body: messageBody
      });

      console.log(`   -> WA terkirim (SID): ${info.sid}`);
      console.log('=================================');
      
      callback(null, { success: true, message: `WhatsApp sent to ${toWhatsAppNumber}` });

    } catch (error) {
      console.error('Gagal mengirim WhatsApp:', error.message);
      console.log('=================================');
      callback({
        code: grpc.status.INTERNAL,
        message: error.message
      });
    }
  }
};

const main = () => {
  const server = new grpc.Server();
  server.addService(notificationProto.NotificationService.service, notificationServiceLogic);

  const port = process.env.PORT || 50054;
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error('Failed to bind server:', err);
        return;
      }
      console.log(`Notification Service gRPC server running on port ${port}`);
      server.start();
    }
  );
};

main();