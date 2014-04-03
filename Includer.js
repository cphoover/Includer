var fs            = require("fs")     ,
    split         = require("split")  ,
    Stream        = require("stream");

var Includer = {};

Includer.createStream = function(_file, _options){
    if(_file !== typeof "string") throw new TypeError("must provide a string file argument");

    var self           = new Stream.Readable(_options)                                    ;
    self.viewDirectory = _options.viewDirectory  || __dirname + "/views/"                 ;
    self.startFile     = _options.startFile      || "index.ejs"                           ;
    self.includeRegex  = _options.includeRegex   || /^.*<%\s*include\s([^\s]*)\s*%>.*$/gm ;

    /** 
     * CLOSURES WILL EAT YOUR RAM 
     * HOW WILL THIS WORK AS WE HAVE
     * MORE NESTED INCLUDES
     * ALSO ERROR HANDLING??!!
     **/
    function getIncludes(_f, _cb) {
        var s = fs.createReadStream(_f).pipe(split());
        s.on("data", function (_l) {
            var m;
            if(m = includeRegex.exec(_l)) {
                s.pause();
                getIncludes(viewDirectory + m[1] + ".ejs", function () {
                    s.resume();
                });
            } else self.push(_l + "\n");
        });
        s.on("end", function () {
            "function" === typeof _cb && _cb();
        });
    }
    getIncludes(startPath);
    return self;
};

module.exports = Includer;
