const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorMiddleware');
const allRoutes = require('./routes');
const path = require('path'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
// ---------------------

app.use('/api', allRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});