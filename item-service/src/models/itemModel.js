const { DataTypes } = require('sequelize');
const { sequelize } = require('../db'); // Menggunakan koneksi DB yang sudah dibuat

const Item = sequelize.define(
  'Item',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'total_quantity',
      validate: {
        min: 0,
      }
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'available_quantity',
      validate: {
        min: 0,
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
    },
  },
  {
    tableName: 'items',
    timestamps: true,
    hooks: {
      // Saat membuat item baru, set available = total
      beforeCreate: (item) => {
        item.availableQuantity = item.totalQuantity;
      },
      // Pastikan availableQuantity tidak melebihi totalQuantity
      beforeUpdate: (item) => {
        if (item.availableQuantity > item.totalQuantity) {
            item.availableQuantity = item.totalQuantity;
        }
        if (item.availableQuantity < 0) {
            item.availableQuantity = 0;
        }
      }
    }
  }
);

module.exports = Item;