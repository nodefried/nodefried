let extIP = require('ext-ip')();

extIP((err, ip) => {
    if( err ){
        throw err;
    }

    console.log(ip);
});
