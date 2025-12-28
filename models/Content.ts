import mongoose, { models, Schema } from "mongoose";


const ContentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);


export default models.Content || mongoose.model('Content', ContentSchema);