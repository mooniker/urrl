var mongoose = require('mongoose');
// var shortId = require('shortid');
var hashIds = require('hashids');
var hashId = new hashIds('URrLs are not so salty');

var Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://localhost/urrl');

autoIncrement.initialize(connection);

var UrrlSchema = new Schema({
  alias: { type: String, unique: true, default: null },
  url: { type: String, unique: true, index: true },
  hits: { type: Number, default: 0 }
});

UrrlSchema.plugin(autoIncrement.plugin, 'Urrl');

UrrlSchema.pre('save', function(next) {
  console.log('URrL being saved.');
  if (!this.alias) {
    var alias = hashId.encode(this._id);
    console.log('Alias generated from', this._id, alias);
    this.alias = alias;
    next();
  }
});

module.exports = mongoose.model('Urrl', UrrlSchema);
