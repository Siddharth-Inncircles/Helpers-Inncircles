import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

export interface IHelper extends Document {
    employeeCode: string;
    name: string;
    type: 'Nurse' | 'Driver' | 'Newspaper' | 'Laundry' | 'Maid' | 'Plumber' | 'Cook';
    organization: string;
    gender: 'Male' | 'Female' | 'Other';
    language: string[];
    mobileNo: string;
    emailId?: string;
    joinedOn: Date;
    households: number;
    vechileType: 'Bike' | 'Car' | 'Cycle' | 'Bus' | 'Other';
    vechileNumber?: string;
    kycDocument?: Buffer;
    additionalPdfs?: Buffer[];
    identificationCard?: string;
    createdAt: Date;
    updatedAt: Date;
}


const HelperSchema: Schema = new Schema({
    employeeCode: {
        type: String,
        require: true,
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
        match: /^[6-9]\d{9}$/
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
        enum: ['Bike', 'Car', 'Cycle', 'Bus', 'Other']
    },
    vechileNumber: {
        type: String,
        trim: true,
    },
    kycDocument :{
        type: Buffer,
    },
    additionalPdfs: [{
        type: Buffer
    }],
    identificationCard: {
        type: Buffer,
    }
}, {timestamps:true});


export default mongoose.model<IHelper>('Helper', HelperSchema);
