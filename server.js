require('./config/config')
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const cors = require('cors');

const PORT = 4000;

const app = express();

app.use(cors({origin: "*"}));
app.use(morgan('dev'))
app.use(express.json());

app.use('/api', userRouter);


app.listen(PORT, () => {
    console.log(`Server is listening to PORT: ${PORT}`);
})