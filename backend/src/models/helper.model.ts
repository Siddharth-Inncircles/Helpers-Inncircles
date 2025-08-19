import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

export enum HelperType {
    NURSE = 'Nurse',
    DRIVER = 'Driver',
    NEWSPAPER = 'Newspaper',
    LAUNDRY = 'Laundry',
    MAID = 'Maid',
    PLUMBER = 'Plumber',
    COOK = 'Cook'
}

export enum OrganizationType {
    ASBL = 'ASBL',
    SPRINGS = 'Springs',
    SPRINGS_HELPERS = 'Springs Helpers'
}

export enum VehicleType {
    BIKE = 'Bike',
    CAR = 'Car',
    CYCLE = 'Cycle',
    BUS = 'Bus',
    OTHER = 'Other',
    NONE = 'None'
}

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other'
}


export interface IHelper extends Document {
    employeeCode: string;
    name: string;
    type: HelperType;
    organization: OrganizationType;
    gender: Gender;
    language: string[];
    mobileNo: string;
    emailId?: string;
    joinedOn: Date;
    households: number;
    vechileType: VehicleType;
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
        enum: Object.values(HelperType),
    },
    organization: {
        type: String,
        required: true,
        trim: true,
        enum: Object.values(OrganizationType),
    },
    gender: {
        type: String,
        required: true,
        enum: Object.values(Gender),
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
        enum: Object.values(VehicleType),
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
