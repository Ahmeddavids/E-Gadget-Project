const mongoose = require('mongoose');
require('dotenv').config()

const url = process.env.DB

mongoose.connect(url).then(() => {
    console.log('Connection to database is successful');
}).catch((e) => {
    console.log(e.message);
})