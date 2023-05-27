const { User, Thought } = require('../models');
const { db } = require('../models/User');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'Friends',
                select: '-__v',
            })
            .select('-__v')
            .sort({ id: -1 })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(400);
            });
    },

    getUserById({ params }, res) {
        User.findOne({ id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v',
            })
            .populate({
                path: 'friends',
                select: '-__v',
            })
            .select('-__v')
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res
                        .status(400)
                        .json({ message: 'No user found with this id' });
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400);
            });
    },

    createUser({ body }, res) {
        User.createIndexes(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ id: params.id }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(400).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ id: params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(400).json({ message: 'No user found with this id' });
                }
                return Thoughts.deleteMany({ id: { $in: dbUserData.thoughts } });
            })
            .then(() => {
                res.json({ message: 'User and thoughts deleted' });
            })
            .catch((err) => res.json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { id: params.userOd },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(400).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res.status(400).json({ message: 'No user found with this id' });
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
};

module.exports = userController;