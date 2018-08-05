// setup stream and utils module imports
var stream = require('stream');
var util = require('util');

//so we will be implementing a class freom the stream.Transform.
// I think the JSONObjectStream is our *own* class of the stream.Transform prototype
util.inherits(JSONObjectStream, stream.Transform);

function JSONObjectStream(opt) {
    stream.Transform.call(this, opt);
};

JSONObjectStream.prototype._transform = function (data, encoding, callback) {
    //wtf wizadry is this....
    object = data ? JSON.parse(data.toString()) : "";
    //so i think it parsed some JSON from the variable 'data' into an object    
    this.emit("object", object);
    //emit an event?
    object.handled = true;

    this.push(JSON.stringify(object));
    callback();
};

JSONObjectStream.prototype._flush = function(cb) {
    cb();
};

var tc = new JSONObjectStream();

tc.on("object", function(object){
    console.log("Name: %s", object.name);
    console.log("Colour: %s", object.color);
});

tc.on("data", function(data){
    console.log("Data: %s", data.toString());
});

tc.write('{"name":"bob", "color":"green"}');
tc.write('{"name":"wimna", "color":"grey"}');
tc.write('{"name":"frank", "color":"red"}');
tc.write('{"name":"immy", "color":"blue"}');