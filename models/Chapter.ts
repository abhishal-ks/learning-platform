import mongoose, { Schema, models } from "mongoose";


const ChapterSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        body: {
            type: String,
            required: true,
        },
        content: {
            type: Schema.Types.ObjectId,
            ref: 'Content',
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);


export default models.Chapter || mongoose.model('Chapter', ChapterSchema);