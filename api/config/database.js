const mongoose = require('mongoose');

const urldb = 'mongodb://3.137.170.89/db-pro2-g16';

mongoose.connect(urldb)
    .then(db => console.log('DataBases connected.'))
    .catch(err => console.error(err));


module.exports = mongoose
