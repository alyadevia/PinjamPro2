import api from './api'; 

const createBorrowRequest = (item_id, quantity, start_date, end_date, notes) => {
  return api.post('/borrowings', {
    item_id,
    quantity,
    start_date,
    end_date,
    notes,
  });
};

const getMyBorrowings = () => {
  return api.get('/borrowings/my-borrowings');
};

// Fungsi returnItemByUser Dihapus

const borrowingService = {
  createBorrowRequest,
  getMyBorrowings,
};

export default borrowingService;