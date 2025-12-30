import mongoose, { models, Schema } from "mongoose";


const McqSchema = new Schema(
    {
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: true,
            validate: [(val: String[]) => val.length >= 2, 'At least 2 options required']
        },
        correctIndex: {
            type: Number,
            required: true
        },
        chapter: {
            type: Schema.Types.ObjectId,
            ref: 'Chapter',
            required: true
        }
    },
    { timestamps: true }
);


export default models.Mcq || mongoose.model('Mcq', McqSchema);