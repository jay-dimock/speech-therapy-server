// if getting connection errors, make sure MongoDB is installed and running.
// on Windows:
// cd C:\Program Files\MongoDB\Server\4.2\bin 
// mongo start
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
})
    .then(() => console.log('Connected to Database'))
    .catch(err => console.log('Unable to connect to Database', err));