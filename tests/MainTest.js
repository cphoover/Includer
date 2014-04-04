var exec = require('child_process').exec;
var assert = require('assert');

exec('node ' + __dirname + '/app1.js', function(_err, _stdout, _stderr){
    var testStr = ["1","2","3","4","MIDDLE","4","3","2","1","DONE"].join("\n");
    console.log("testing:\n[" + testStr + "]\n===\n[" + _stdout + "]");
    assert(_stdout === testStr);
});


