const {models, sequelize} = require('../../models');

module.exports = {
    event(root, {id}) {
        return models.Event.find({
            where: {id: id},
            include: [{
                model: models.User
            }]
        }).then(res => {
            return res;
        });
    },
    events(root, args, context) {
        return models.Event.findAll({
            order: [ ['dateStart', 'ASC'] ]
        }, context);
    },
    user(root, {id}) {
        return models.User.findById(id);
    },
    users(args, context) {
        return models.User.findAll({
            where: []
        }, context);
    },
    room(root, {id}) {
        return models.Room.findById(id);
    },
    rooms(root, args, context) {
        return models.Room.findAll({
            include: [{
                model: models.Event,
                include: {
                    model: models.User,
                    as: 'Users'
                }
            }]
        }).then(res => {
            return res;
        })
    }
};