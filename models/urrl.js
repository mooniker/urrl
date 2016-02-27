var mongoose = require('mongoose');
var shortId = require('shortid');

var Schema = mongoose.Schema; //,
    // ObjectId = Schema.ObjectId;

var UrrlSchema = new Schema({
  alias: { type: String, unique: true, default: shortId.generate },
  url: { type: String, unique: true, index: true },
  hits: { type: Number, default: 0 }
});

// UrrlSchema.statics.generateAlias = function() {
//   return shortId({ alphabet: ALPHABET });
// };

module.exports = mongoose.model('Urrl', UrrlSchema);
