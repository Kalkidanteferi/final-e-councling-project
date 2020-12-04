'use strict';
var pubsub = require('../../server/pubsub.js');

module.exports = function(Conversation) {
    Conversation.get_conversation = function (id, cb) {
        Conversation.find({ where: { or: [{ user_1: id }, { user_2: id }] } },
            function (err, conversation_data) {
            if (err) {
                console.log(err);
            }
            cb(null, conversation_data);
        });

    }

    Conversation.remoteMethod('get_conversation', {
        accepts: [
            { arg: 'id', type: 'string', required: true }
        ],
        returns: { arg: 'data', type: 'object' },
        http: { "verb": "get", "path": "/get/:id" }
    });
};
