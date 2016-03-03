var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var mongoose = require('mongoose');

// var env; // configuration variables
// try { // check if local env.js exists for dev server
//   env = require('./env');
// } catch (localEnvJsNotPresentException) {
//   // otherwise use production server's config vars
//   env = process.env;
// }

var mongoConnection = mongoose.connect('mongodb://localhost/urrl' || env.MONGO_SERVER_URI);
var UrrlModel = require('./models/urrl');

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser());

app.post('/', function(request, response) {
  // console.log('REQ:', request.body);
  UrrlModel.findOne({ url: request.body.url }, function(err, doc) {
    if (err) response.json({ error: err });
    else if (doc) {
      response.json(doc);
    } else {
      new UrrlModel({
        url: request.body.url // need to generate alias
      }).save(function(err, urrl) {
        if (err) console.error(err);
        else response.json(urrl);
      });
    }
  });
});

app.get('/index', function(request, response) {
  UrrlModel.find({}, function(err, docs) {
    response.json(docs);
  });
});

app.get('/:alias', function(request, response) {
  // console.log('GET /', request.params.alias, typeof(request.params.alias));
  UrrlModel.findOne({ alias: request.params.alias }, function(err, doc) {
    if (err) {
      response.json({ error: err });
    } else if (!doc) {
      // console.log('Alias not found, redirect to home.');
      response.redirect('/');
    } else {
      console.log('Redirecting to', doc.url + '.');
      response.redirect(doc.url);
      doc.hits += 1;
      doc.save(function(err) {
        if (err) console.error(err);
        // else console.log('Hit count updated.');
      });
    }
  });
});

app.listen(4000, function() {
  console.log('URrL server is up and running.');
});
