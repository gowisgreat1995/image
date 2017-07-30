var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.get('/api/image/:search',function(req,res){
    var now=new Date();
  var search=req.params.search;
    if(req.query.offset)
    var offset=req.query.offset;
    else
 var offset=1;
var now_utc = now.getUTCFullYear()+"-"+(now.getUTCMonth()+1)+"-"+now.getUTCDate()+"T"+now.getUTCHours()+":"+now.getUTCMinutes()+":"+now.getUTCSeconds()+":"+now.getUTCMilliseconds();
    
    const GoogleImages = require('google-images');
 
const client = new GoogleImages(process.env.cx, process.env.key);


    var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://gowisgreat1995:'+process.env.db_password+'@cluster0-shard-00-00-1hsjf.mongodb.net:27017,cluster0-shard-00-01-1hsjf.mongodb.net:27017,cluster0-shard-00-02-1hsjf.mongodb.net:27017/'+process.env.db_name+'?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
                  
                  function(err, db) {

       
        var image=db.collection("imageSearches");
        
       image.insert({
           "index":req.params.search,"time":now_utc
       },function(err,docs){
           if(docs)
               client.search(search,{page:offset}).then(images=>{res.send(images);res.end();});
           
       });
  
        } );
});

app.get("/api/latest/",function(req,res){
    
    
      var mongo = require('mongodb').MongoClient;
    mongo.connect('mongodb://gowisgreat1995:'+process.env.db_password+'@cluster0-shard-00-00-1hsjf.mongodb.net:27017,cluster0-shard-00-01-1hsjf.mongodb.net:27017,cluster0-shard-00-02-1hsjf.mongodb.net:27017/'+process.env.db_name+'?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
                  
                  function(err, db) {

       
        var image=db.collection("imageSearches");
        var dataArray=[];
      image.find({},{
          "index":1,
          "time":1
      }).toArray(function(err,docs){
        res.send(docs);
      res.end();});
        } );
     
    
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8000);
module.exports = app;
