

module.exports = function (app) {
    const User = app.models.User;
    const Expert = app.models.Expert;
    const UserAccount = app.models.UserAccount;

    User.remoteMethod('signin', {
        accepts: [{ arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'data', type: 'object' },
        http: { "verb": "post" }
    });

    User.remoteMethod('expertRegister', {
        accepts: [{ arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'data', type: 'object' },
        http: { "verb": "post" }
    });

    User.remoteMethod('userRegister', {
        accepts: [{ arg: 'req', type: 'object', http: { source: 'req' } }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        returns: { arg: 'data', type: 'object' },
        http: { "verb": "post" }
    });

    User.remoteMethod('getUser', {
        accepts: { arg: 'id', type: 'string', required: true },
        returns: { arg: 'data', type: 'object' },
        http: { "verb": "get", "path": "/getuser/:id" }
    })

    User.getUser = (id, cb) => {
        Expert.find({ where: { user_id: id } }, function (err, expert_data) {
            if (err) {
                console.log("error on getting expert")
            } else {
                if (!expert_data.length) {
                    UserAccount.find({ where: { user_id: id } }, function (err, user_data) {
                        if (err) {
                            console.log("error on getting user")
                        } else {
                            cb(null,user_data)
                        }
                    })
                } else {
                    cb(null, expert_data)
                }
            }
        })
    }

    User.signin = function (req, res, cb) {
        User.login({ username: req.body.username, password: req.body.password }, function (err, token) {
            if (err) {
                cb(err)
            } else {
                makeRole(token.userId).then(res => {
                    token.user_type = res
                    cb(null, token);
                })
            }
        });
    }

    User.expertRegister = function (req, res, cb) {
        User.create({ username: req.body.username, password: req.body.password, email: req.body.email }, function (err, token) {
            if (err) {
                cb(err);
            } else {
                Expert.create({
                    fullname: req.body.fullname,
                    username: req.body.username,
                    email: req.body.email,
                    address: req.body.address,
                    specialization: req.body.specialization,
                    office_location: req.body.office_location,
                    password: req.body.password,
                    user_id: token.id
                },function(err, data){
                    if (err) {
                        cb(err);
                    } else {
                        cb(null,data);
                    }
                })
            }
        });
    }

    User.userRegister = function (req, res, cb) {
        User.create({ username: req.body.username, password: req.body.password, email: req.body.email }, function (err, token) {
            if (err) {
                cb(err);
            } else {
                UserAccount.create({
                    fullname: req.body.fullname,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    user_id: token.id
                }, function (err, data) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null,data);
                    }
                })
            }
        });
    }

    function makeRole(user_id){
        return new Promise((resolve, reject)=>{
            Expert.find({ where: { user_id: user_id } }, function (err, data) {
                if (err) {
                    reject("error on getting expert")
                } else {
                    if (!data.length) {
                        UserAccount.find({ where: { userId: user_id } }, function (err, data2) {
                            if (err) {
                                reject("error on getting user")
                            } else {
                                resolve(1)
                            }
                        })
                    }else{
                        resolve(2)
                    }
                }
            })
        })
    }
};
