"use strict"; 
var fs            = require("fs")     ,
    split         = require("split")  ,
    Stream        = require("stream") , 
    util          = require("util")   ,
    path          = require("path")   ;

var Includer = {};

function IncluderStream(_options){

    Stream.Readable.apply(this, arguments);

    this._includeDirectory = _options.includeDirectory                  || __dirname + "/../../views/";
    this._fileExt          = _options.fileExt                           || "ejs";
    this._startFile        = _options.startFile                         || "index." + this._fileExt;
    this._currentFile      = this._includeDirectory + this._startFile;
    this._includeRegex     = _options.includeRegex                      || /^.*<%\s*include\s([^\s]*)\s*%>.*$/gm ;
    this._isRunning        = false;
    this._firstRun         = true;

    this.currentStream     = null;
    this.streamStack   = [];

}

util.inherits(IncluderStream, Stream.Readable);

IncluderStream.prototype.getIncludes = function(_f, _cb) {
    var self = this;
    
    self.currentStream = fs.createReadStream(_f, { encoding: self._readableState.encoding }).pipe(split());



    self.currentStream.on("error", function(_err){
        self.currentStream.emit("error", _err);
    });

    self.currentStream.on("data", function (_l) {

        var m;
        if(m = self._includeRegex.exec(_l)) {
            self.streamStack.push({
                stream : self.currentStream,
                file   : _f
            });
            self.currentStream.pause();
            var basename = m[1] + "." + self._fileExt;
            self._currentFile = ( 
                m[1].indexOf("/") === 0 ?
                self.includeDirectory :
                path.dirname( self._currentFile) + "/"
            ) + basename;

            self.getIncludes(self._currentFile, function () {
                var bStream = self.streamStack.pop();
                self._currentFile = bStream.file;
                self.currentStream = bStream.stream;
                bStream.stream.resume();
            });                             

        } else {
            self.push(_l.length ? (self._firstRun ? "" : "\n" ) + _l : _l);
            self._firstRun = false;
        }
    });
    self.currentStream.on("end", function () {
        "function" === typeof _cb && _cb();
    });
};

IncluderStream.prototype._read = function(){
    var self = this;
    if(self._isRunning) return false;
    self._isRunning = true;
    self.getIncludes(self._currentFile, function(){
        self.emit('end');
    }); // stream should be returned before we start
}


Includer.createStream = function(options){
     return new IncluderStream(options);
};


module.exports = Includer;
