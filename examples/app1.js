var Includer = require(__dirname + '/../Includer.js');

var s = Includer.createStream(
    {
         "startFile"        : 'include1.ejs',
         "includeDirectory" : __dirname + '/../views/'
    }
);

s.pipe(process.stdout);
