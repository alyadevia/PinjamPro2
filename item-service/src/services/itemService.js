const grpc = require('@grpc/grpc-js');
const Item = require('../models/itemModel');
const { Op } = require('sequelize');

const mapItemToProto = (item) => {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,

    // 🔥 FIX UTAMA: pastikan tidak undefined
    total_quantity: Number(item.totalQuantity ?? 0),
    available_quantity: Number(item.availableQuantity ?? 0),

    image_url: item.imageUrl || '',
    created_at: item.createdAt,
  };
};

// ================= CREATE =================
const CreateItem = async (call, callback) => {
  try {
    const { name, description, category, total_quantity, image_url } = call.request;

    if (!name || total_quantity == null) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: 'Name and total_quantity required',
      });
    }

    const item = await Item.create({
      name,
      description: description || '',
      category: category || '',
      totalQuantity: Number(total_quantity),
      availableQuantity: Number(total_quantity),
      imageUrl: image_url || '',
      is_deleted: 0,
    });

    return callback(null, { item: mapItemToProto(item) });
  } catch (err) {
    console.error(err);
    return callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= GET =================
const GetItem = async (call, callback) => {
  try {
    const item = await Item.findOne({
      where: { id: call.request.id, is_deleted: 0 },
    });

    if (!item) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Item not found',
      });
    }

    return callback(null, { item: mapItemToProto(item) });
  } catch (err) {
    console.error(err);
    return callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= UPDATE =================
const UpdateItem = async (call, callback) => {
  try {
    const item = await Item.findOne({
      where: { id: call.request.id, is_deleted: 0 },
    });

    if (!item) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Item not found',
      });
    }

    const { name, description, category, total_quantity, image_url } = call.request;

    if (name) item.name = name;
    if (description) item.description = description;
    if (category) item.category = category;
    if (image_url) item.imageUrl = image_url;

    if (total_quantity != null) {
      const newTotal = Number(total_quantity);
      const diff = newTotal - item.totalQuantity;

      item.totalQuantity = newTotal;
      item.availableQuantity = Math.max(0, item.availableQuantity + diff);
    }

    await item.save();

    return callback(null, { item: mapItemToProto(item) });
  } catch (err) {
    console.error(err);
    return callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= DELETE (SOFT DELETE FIX) =================
const DeleteItem = async (call, callback) => {
  try {
    const item = await Item.findOne({
      where: { id: call.request.id, is_deleted: 0 },
    });

    if (!item) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Item not found',
      });
    }

    item.is_deleted = 1;
    await item.save();

    return callback(null, { success: true });
  } catch (err) {
    console.error(err);
    return callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

// ================= LIST =================
const ListItems = async (call, callback) => {
  try {
    const { category_filter } = call.request;

    const where = {
      is_deleted: 0,
    };

    if (category_filter) {
      where.category = { [Op.like]: `%${category_filter}%` };
    }

    const items = await Item.findAll({ where });

    return callback(null, {
      items: items.map(mapItemToProto),
    });
  } catch (err) {
    console.error(err);
    return callback({ code: grpc.status.INTERNAL, message: err.message });
  }
};

module.exports = {
  CreateItem,
  GetItem,
  UpdateItem,
  DeleteItem,
  ListItems,
};