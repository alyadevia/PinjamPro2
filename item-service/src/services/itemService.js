const grpc = require('@grpc/grpc-js');
const Item = require('../models/itemModel');
const { Op } = require('sequelize');

const mapItemToProto = (itemJSON) => {
  return {
    id: itemJSON.id,
    name: itemJSON.name,
    description: itemJSON.description,
    category: itemJSON.category,
    total_quantity: itemJSON.totalQuantity, 
    available_quantity: itemJSON.availableQuantity, 
    image_url: itemJSON.imageUrl, 
    created_at: itemJSON.createdAt, 
  };
};

const itemService = {
  CreateItem: async (call, callback) => {
    const { name, description, category, total_quantity, image_url } = call.request;

    try {
      if (!name || total_quantity == null || total_quantity < 0) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: 'Name and total_quantity are required',
        });
      }

      const item = await Item.create({
        name,
        description: description || '',
        category: category || '',
        totalQuantity: total_quantity,
        availableQuantity: total_quantity, // Atur available = total
        imageUrl: image_url || '',
      });

      callback(null, { item: mapItemToProto(item.toJSON()) });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },

  GetItem: async (call, callback) => {
    try {
      const item = await Item.findByPk(call.request.id);
      if (!item) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Item not found',
        });
      }
      callback(null, { item: mapItemToProto(item.toJSON()) });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },

  UpdateItem: async (call, callback) => {
    const { id, name, description, category, total_quantity, available_quantity, image_url } = call.request;
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Item not found',
        });
      }

      if (name) item.name = name;
      if (description) item.description = description;
      if (category) item.category = category;
      if (image_url) item.imageUrl = image_url;

      // Logika Stok
      if (total_quantity != null && total_quantity >= 0) {
        const newTotal = parseInt(total_quantity, 10);
        const oldTotal = item.totalQuantity;
        const diff = newTotal - oldTotal; 

        item.totalQuantity = newTotal;
        if (diff > 0) {
          item.availableQuantity += diff;
        }
      }
      
      // Update available_quantity HANYA jika dikirim (dari sistem, bukan admin)
      if (available_quantity != null) {
        item.availableQuantity = available_quantity;
      }

      await item.save(); // Hook beforeUpdate akan berjalan di sini

      callback(null, { item: mapItemToProto(item.toJSON()) });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },

  DeleteItem: async (call, callback) => {
    try {
      const item = await Item.findByPk(call.request.id);
      if (!item) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Item not found',
        });
      }
      await item.destroy();
      callback(null, {}); 
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },

  ListItems: async (call, callback) => {
    const { category_filter } = call.request;
    try {
      let whereCondition = {};
      if (category_filter) {
        whereCondition.category = {
          [Op.like]: `%${category_filter}%`,
        };
      }
      const items = await Item.findAll({
        where: whereCondition,
        order: [['name', 'ASC']],
      });
      const mappedItems = items.map((item) => mapItemToProto(item.toJSON()));
      callback(null, { items: mappedItems });
    } catch (error) {
      console.error(error);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },
};

module.exports = itemService;