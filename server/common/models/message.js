'use strict';
var app = require('../../server/server');
var pubsub = require('../../server/pubsub.js');


module.exports = function (Message) {

    Message.chat = function (req, cb) {
        var body = req.body;
        var Conversation = app.models.Conversation;
        Conversation.find({ where: { user_1: body.from, user_2: body.to } },
            (err, conversation_value) => {
                if (err) {
                    console.log(err);
                }
                if (conversation_value.length > 0) {
                    Conversation.upsert({
                        id: conversation_value[0].id,
                        last_message: body.message,
                        user_1: body.from,
                        user_2: body.to
                    }, (err, conversation_update) => {
                        console.log('updates', conversation_update);
                        if (err) {
                            console.log(err);
                        }
                    });
                } else {
                    Conversation.create({
                        last_message: body.message,
                        user_1: body.from,
                        user_2: body.to
                    }, (err, new_conversation) => {
                        if (err) {
                            console.log(err);
                        } else {
                            var socket = Conversation.app.io;
                            pubsub.publish(socket, {
                                collectionName: 'Conversation',
                                data: new_conversation,
                                method: 'POST'
                            });
                        }
                    })
                }
            })
    }

    Message.observe('after save', (ctx, next) => {
        var socket = Message.app.io;
        pubsub.publish(socket, {
            collectionName: 'Message',
            data: ctx.instance,
            method: 'POST'
        });
    })

    Message.remoteMethod('chat', {
        accepts: [{ arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'data', type: 'object' },
        http: { "verb": "post" }
    });
};
