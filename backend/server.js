const express = require ('express');
const dotenv = require ('dotenv');
const connectDB = require ('./db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());

const productRoutes = require('./routes/productRoutes');  

app.use('/products', productRoutes);  
app.use('/auth', authRoutes);
app.use('/api', orderRoutes);


app.get('/', (req, res) => {
  res.send("Running");
});

app.listen(process.env.PORT,()=>{
    console.log(`Server Running On Port ${process.env.PORT}`);

})