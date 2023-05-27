const { Thoughts, User } = require('../models');

const thoughtsController = {
    getAllThoughts(req, res) {
        Thoughts.find({})
            .populate({
                path: 'response',
                select: '-__v',
            })
            .select('-__v')
            .sort({ id: -1 })
            .then((dbThoughtsData) => res.json(dbThoughtsData))
            .catch((err) => {
                console.log(err);
                res.status(400);
            });
        },

    getThoughtsById({ params }, res) {
        Thoughts.findOne({ id: params.id })
            .populate({
                path: 'response',
                select: '-__v',
            })
            .select('-__v')
            .then((dbThoughtsData) => {
                if ( !dbThoughtsData) {
                    return res.status(400).json({ message: 'No thoughts found with this id' });
                }
                re.json(dbThoughtsData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400);
            });
        },

        createThought({ params, body }, res) {
            Thoughts.create(body)
                .then(({ id }) => {
                    return User.findOneAndUpdate(
                        { id: body.userId },
                        { $push: { thoughts: id } },
                        { new: true }
                    );
                })
                .then((dbUserData) => {
                    if (!dbUserData) {
                        return res
                            .status(400)
                            .json({ message: 'No user found with this id' });
                    }
                    res.json({ message: 'Thought successfull created' });
                })
                .catch((err) => res.json(err));
        },

        updateThoughts({ params, body }, res) {
            Thoughts.findOneAndUpdate({ id: params.id }, body, {
                new: true,
                runValidators: true,
            })
                .then((dbThoughtsData) => {
                    if (!dbThoughtsData) {
                        res.status(400).json({ message: 'No thoughts found with this id' });
                        return;
                    }
                    res.json(dbThoughtsData);
                })
                .catch((err) => res.json(err));
        },

        deleteThought({ params }, res) {
            Thoughts.findOneAndDelete({ id: params.id })
                .then((dbThoughtsData) => {
                    if (!dbThoughtsData) {
                        return res.status(400).json({ message: 'No thoughts found with this id '});
                    }

                    return User.findOneAndUpdate(
                        { thoughts: params.id },
                        { $pull: { thoughts: params.id } },
                        { new: true }
                    );
                })
                .then((dbUserData) => {
                    if (!dbUserData) {
                        return res
                            .status(400)
                            .json({ message: 'No user found with this id' });
                    }
                    res.json({ message: 'Thought successfully created '});
                })
                .catch((err) => res.json(err));
        },

        addResponse({ params, body }, res)  {
            Thoughts.findOneAndUpdate(
                { id: params.thoughtsId },
                { $addToSet: { reaction: body } },
                { new: true, runValidators: true}
            )
                .then((dbThoughtsData) => {
                    if (!dbThoughtsData) {
                        res.status(400).json({ message: 'No thoughts found with this id' });
                        return;
                    }
                    res,json(dbThoughtsData);
                })
                .catch((err) => res.json(err));
        },

        removeRespnse({ params }, res) {
            Thoughts.findOneAndUpdate(
                { id: params.thoughtsId },
                { $pull: { response: { responseId: params.responseId } } },
                { new: true }
            )
            .then((dbThoughtsData) => res.json(dbThoughtsData))
            .catch((err) => res.json(err));
        },
};

module.exports = thoughtsController;