'use strict';
var pubsub = require('../../server/pubsub.js');
var loopback = require('loopback');
var app = require('../../server/server');


var FORUM_ID;
module.exports = function(Reply) {
    Reply.remoteMethod('removeReply', {
        accepts: [
            { arg: 'id', type: 'string', required: true },
            { arg: 'forumId', type: 'string', required: true }
        ],
        returns: { arg: 'data', type: 'object' },
        http: { "verb": "delete", "path": "/:id/:forumId/remove" }
    });

    Reply.removeReply = function (id, forumId, cb) {
        FORUM_ID = forumId;
        Reply.destroyById(id, (err, removed_data) => {
            if (err) {
                console.log(err);
            }
        });
    }
    Reply.observe('after save', function(ctx, next) {
        var Forum = app.models.Forum;
        var User = app.models.UserAccount;
        var Expert = app.models.Expert;
        Forum.findById(ctx.instance.forum_id, (err, forum_data) => {
            if (err) {
                console.log(err);
            } else {
                Forum.upsert({
                    id: forum_data.id, 
                    reply_count: forum_data.reply_count + 1
                }, (err, updateInfo) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        });
        var socket = Reply.app.io;
        if (ctx.isNewInstance){
            User.find({ where: { user_id: ctx.instance.user_id}}, (err, user_data) => {
                if (err) {
                    console.log(err);
                }
                if (user_data.length > 0) {
                    let reply_data = { data : ctx.instance, user: user_data}
                    ctx.instance.user = user_data
                    pubsub.publish(socket, {
                        collectionName: 'Reply',
                        data: reply_data,
                        method: 'POST'
                    });
                }else{
                    Expert.find({ where: { user_id: ctx.instance.user_id } }, (err, expert_data) => {
                        if (err) {
                            console.log(err);
                        }
                        if (expert_data.length > 0) {
                            let reply_data = { data : ctx.instance}
                            ctx.instance.user = expert_data
                            pubsub.publish(socket, {
                                collectionName: 'Reply',
                                data: reply_data,
                                method: 'POST'
                            });
                        }
                    })
                }

            })
        } else {
            //Now publishing the data..
            pubsub.publish(socket, {
                collectionName: 'Reply',
                data: ctx.instance,
                modelId: ctx.instance.id,
                method: 'PUT'
            });
        }
        next();
    });

    Reply.observe("before delete", function (ctx, next) {
        var Forum = app.models.Forum;
        Forum.findById(FORUM_ID, (err, forum_data) => {
            if (err) {
                console.log(err);
            } else {
                Forum.upsert({
                    id: forum_data.id,
                    reply_count: forum_data.reply_count > 0 ? forum_data.reply_count - 1 : 0
                }, (err, updateInfo) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        });
        var socket = Reply.app.io;
        pubsub.publish(socket, {
            collectionName: 'Reply',
            data: {reply_id: ctx.where.id, forum_id: FORUM_ID},
            modelId: ctx.where.id,
            method: 'DELETE'
        });
        next();
    }); 
};
