import api from './api'; 

const listItems = (category_filter = '') => {
  return api.get('/items', {
    params: { category_filter }
  });
};

const getItemById = (id) => {
  return api.get(`/items/${id}`);
};



const createItem = (formData) => {
  return api.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateItem = (id, formData) => {
  return api.put(`/items/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const deleteItem = (id) => {
  return api.delete(`/items/${id}`);
};

const itemService = {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

export default itemService;