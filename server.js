
require('./database/database')
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const cors = require('cors');

const fileupload = require("express-fileupload");

const productRouter = require("./routes/productRouter");


const PORT = process.env.PORT || 4040;

const app = express();


app.use(cors({origin: "*"}));
app.use(morgan('dev'))

app.use(express.json());
app.use(
  fileupload({
    useTempFiles: true,
  })
);

app.use("/api", userRouter);
app.use("/api", productRouter);

app.listen(PORT, () => {
  console.log(`Server is listening to PORT: ${PORT}`);
});
