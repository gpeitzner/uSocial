const mongoose = require('mongoose');

const urldb = 'mongodb://3.138.101.55:27017/db-pro2-g16';

mongoose.connect(urldb)
    .then(db => console.log('DataBases connected.'))
    .catch(err => console.error(err));


module.exports = mongoose