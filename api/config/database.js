const mongoose = require('mongoose');

const urldb = 'mongodb://13.58.137.11:27017/db-pro2-g16';

mongoose.connect(urldb)
    .then(db => console.log('DataBases connected.'))
    .catch(err => console.error(err));


module.exports = mongoose
