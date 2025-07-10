require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db');
const AuthRoutes = require('./routes/auth-routes');
const HomeRoutes = require('./routes/home-routes');
const AdminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/image-routes');
const app = express();
connectToDB();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());

//Routes middleware

app.use("/api/auth", AuthRoutes);
app.use('/api/home', HomeRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/image', uploadImageRoutes);


app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});