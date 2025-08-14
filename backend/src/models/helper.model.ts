import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

export interface IHelper extends Document {
    employeeCode: string;
    name: string;
    type: 'Nurse' | 'Driver' | 'Newspaper' | 'Laundry' | 'Maid' | 'Plumber' | 'Cook';
    organization: 'ASBL' | 'Springs' | 'Springs Helpers';
    gender: 'Male' | 'Female' | 'Other';
    language: string[];
    mobileNo: string;
    emailId?: string;
    joinedOn: Date;
    households: number;
    vechileType: 'Bike' | 'Car' | 'Cycle' | 'Bus' | 'Other' | 'None';
    vechileNumber?: string;
    kycDocument?: {
        data: Buffer,
        filename: string,
        mimetype: string,
    };
    additionalPdfs?: {
        data: Buffer,
        filename: string,
        mimetype: string,
    }[];
    profileImage?: {
        data: Buffer,
        filename: string,
        mimetype: string,
    };
    identificationCard?: string;
    createdAt: Date;
    updatedAt: Date;
}


const HelperSchema: Schema = new Schema({
    employeeCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    type: {
        type: String,
        required: true,
        enum: ['Nurse', 'Driver', 'Newspaper', 'Laundry', 'Maid', 'Plumber', 'Cook']
    },
    organization: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    language: [{
        type: String,
        required: true
    }],
    mobileNo: {
        type: String,
        required: true,
        // match: /^[6-9]\d{9}$/
    },
    emailId: {
        type: String,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    joinedOn: {
        type: Date,
        required: true
    },
    households: {
        type: Number,
        default: 0,
        min: 0
    },
    vechileType: {
        type: String,
        enum: ['Bike', 'Car', 'Cycle', 'Bus', 'Other', 'None']
    },
    vechileNumber: {
        type: String,
        trim: true,
    },

    kycDocument: {
        data: {
            type: Buffer,
            // required: true
        },
        filename: {
            type: String,
            // required: true
        },
        mimetype: {
            type: String,
            // required: true
        }
    },

    additionalPdfs: [{
        data: Buffer,
        filename: String,
        mimetype: String
    }],

    profileImage: {
        data: Buffer,
        filename: String,
        mimetype: String
    },

    identificationCard: {
        type: String,
    },

}, { timestamps: true });



export default mongoose.model<IHelper>('Helper', HelperSchema);
