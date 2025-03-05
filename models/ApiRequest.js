const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ApiRequestSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        enum: ["GET", "POST", "PUT", "DELETE"],
        default: "GET",
        required: true
    },
    headers: {
        type: Map,
        of: String,  // Key-value pairs for headers
        default: {}
    },
    body: {
        type: Schema.Types.Mixed,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ApiRequest', ApiRequestSchema);
