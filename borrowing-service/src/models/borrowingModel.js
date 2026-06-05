const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Borrowing = sequelize.define(
  'Borrowing',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID, // Harus sesuai dengan ID di userModel
      allowNull: false,
      field: 'user_id',
    },
    itemId: {
      type: DataTypes.UUID, // Harus sesuai dengan ID di itemModel
      allowNull: false,
      field: 'item_id',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'returned', 'late'),
      defaultValue: 'pending',
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'admin_notes',
    },
  },
  {
    tableName: 'borrowings',
    timestamps: true, // createdAt, updatedAt
  }
);

// TODO: Definisikan relasi jika model User dan Item ada di DB yang sama
// dan di-load oleh service ini.
// Jika tidak, biarkan sebagai UUID saja.

module.exports = Borrowing;