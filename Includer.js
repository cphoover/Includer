var fs            = require("fs")     ,
    split         = require("split")  ,
    Stream        = require("stream");

var Includer = {};

Includer.createStream = function(options){
    options = options || {};
    var self               = new Stream.Readable(options);
    self._includeDirectory = options.includeDirectory                  || __dirname + "/../../views/";
    self._fileExt          = options.fileExt                           || "ejs";
    self._startFile        = options.startFile                         || "index." + self._fileExt;
    self._startPath        = self._includeDirectory + self._startFile;
    self._includeRegex     = options.includeRegex                      || /^.*<%\s*include\s([^\s]*)\s*%>.*$/gm ;
    self._isRunning        = false;

    /** 
     * ALSO ERROR HANDLING??!!
     * CHAR ENCODINGS?
     **/
    function getIncludes(_f, _cb) {
        var s = fs.createReadStream(_f).pipe(split());
        s.on("data", function (_l) {
            var m;
            if(m = self._includeRegex.exec(_l)) {
                s.pause();
                getIncludes(self._includeDirectory + m[1] + "." + self._fileExt, function () {
                    s.resume();
                });
            } else self.push( _l + "\n");
        });
        s.on("end", function () {
            "function" === typeof _cb && _cb();
        });
    }

    self._read = function(){
        if(self._isRunning) return false;
        self._isRunning = true;
        getIncludes(self._startPath, function(){
            self.emit('end');
        }); // stream should be returned before we start
    }
    return self;
};


module.exports = Includer;
