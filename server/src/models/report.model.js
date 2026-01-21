import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    originalName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'image'],
        required: true
    },
    aiOutput: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['uploaded', 'processing', 'completed', 'failed'],
        default: 'uploaded'
    },
    aiError: {
        type: String,
        default: null
    },
    aiDisclaimer: {
        type: String,
        default: "This AI-generated content is not medical advice."
    }


}, { timestamps: true, collection: "report" });

export default mongoose.model('Report', reportSchema)

