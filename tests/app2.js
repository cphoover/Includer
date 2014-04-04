var Includer = require(__dirname + '/../Includer.js');

var s = Includer.createStream(
    {
         "includeDirectory" : __dirname + '/fixtures/test2/'
    }
);

s.pipe(process.stdout);
