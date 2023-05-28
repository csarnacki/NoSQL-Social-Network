const { Schema, model, Types } = require('mongoose');

const ResponseSchema = new Schema (
    {
        responseId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },

        responseBody: {
            type: String,
            required: true,
            maxlength: 200,
        },

        username: {
            type: String,
            required: true,
        },
    },
        {
          toJSON: {
            getters: true,
        },
        id: false,
    }
);

const ThoughtsSchema = new Schema (
    {
        thoughtsText: {
            type: String,
            required: 'A thought needs to be provided',
            minlength: 1,
            maxlength: 200,
        },

        username: {
            type: String,
            required: true,
        },

        response: [ResponseSchema],
    },
        {
          toJSON: {
          virtuals: true,
          getters: true,
        },
        id: false,
    }
);

ThoughtsSchema.virtual('responseCount').get(function () {
    return this.response.length;
});

const Thoughts = model('Thoughts', ThoughtsSchema);

module.exports = Thoughts;