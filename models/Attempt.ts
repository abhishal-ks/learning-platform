import mongoose, { Schema, models } from "mongoose";

const AttemptSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        chapter: {
            type: Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
            index: true,
        },

        score: {
            type: Number,
            required: true,
        },

        total: {
            type: Number,
            required: true,
        },

        answers: [
            {
                mcqId: {
                    type: Schema.Types.ObjectId,
                    ref: "Mcq",
                    required: true,
                },
                selectedIndex: {
                    type: Number,
                    required: true,
                },
                correct: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default models.Attempt || mongoose.model("Attempt", AttemptSchema);
