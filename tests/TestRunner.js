var exec = require('child_process').exec;
var assert = require('assert');


exec('node ' + __dirname + '/app1.js', function(_err, _stdout, _stderr){
    var testStr = ["1","2","3","4","MIDDLE","4","3","2","1","DONE"].join("\n");
    console.log("testing:\n[" + testStr + "]\n===\n[" + _stdout + "]");
    assert(_stdout === testStr, "should be equal");
});

exec('node ' + __dirname + '/app2.js', function(_err, _stdout, _stderr){
    var testStr = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '    <meta charset="UTF-8">',
        '    <title>TestFile</title>',
        '</head>',
        '<body>',
        '    <header>',
        '        <nav>',
        '            <ul>',
        '                <li>Link 1</li>',
        '                <li>Link 2</li>',
        '                <li>Link 3</li>',
        '                <li>Link 4</li>',
        '                <li>Link 5</li>',
        '                <li>Link 6</li>',
        '                <li>Link 7</li>',
        '                <li>Link 8</li>',
        '                <li>Link 9</li>',
        '            </ul>',
        '        </nav>',
        '    </header>',
        '</body>',
        '</html>'
    ].join("\n");

    console.log("testing:\n[" + testStr + "]\n===\n[" + _stdout + "]");
    assert(_stdout === testStr, "should be equal");
});
