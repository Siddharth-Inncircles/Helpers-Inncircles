import { fileURLToPath } from "url";
import HelperModel, { IHelper } from "../models/helper.model";
import { DeleteResult, FilterQuery } from "mongoose";

export class HelperService {
    async CreateHelper(helperData: Partial<IHelper>): Promise<IHelper> {
        const helper = new HelperModel(helperData);
        return await helper.save();
    }


    async getAllHelperPagination(page: string, limit: string, sortFeild: string, searchQuery?: string, type?: string, organizations?: string[],
        dateFrom?: string, dateTo?: string, services?: string[]
    ) {
        try {
            const pageNo: number = parseInt(page as string) || 1;
            const limitNo: number = parseInt(limit as string) || 10;
            let filter: FilterQuery<IHelper> = {};
            // console.log(searchQuery);
            
            const skip: number = (pageNo - 1) * limitNo;

            if (searchQuery?.trim()) {
                filter.$or = [
                    { name: { $regex: searchQuery, $options: 'i' } },
                    { employeeCode: { $regex: searchQuery, $options: 'i' } },
                    { organization: { $regex: searchQuery, $options: 'i' } }
                ]
            }

            if (organizations) {
                const orgArray = Array.isArray(organizations)
                    ? organizations
                    : (organizations as string).split(',').map(o => o.trim());

                filter.organization = { $in: orgArray };
            }

            if (services) {
                const serviceArray = Array.isArray(services)
                    ? services
                    : (services as string).split(',').map(s => s.trim());                
                filter.type = { $in: serviceArray };
            }

            if (dateFrom || dateTo) {
                filter.joinedOn = {};
                if (dateFrom) filter.joinedOn.$gte = new Date(dateFrom);
                if (dateTo) filter.joinedOn.$lte = new Date(dateTo);
            }

            if (type) {
                filter.type = type;
            }

            const sort: Record<string, 1 | -1> = {};
            sort[sortFeild || 'employeeCode'] = 1;

            const total = await HelperModel.countDocuments(filter);

            const helpers = await HelperModel.aggregate([
                { $match: filter },
                { $sort: sort },
                {
                    $project: {
                        _id: 1, employeeCode: 1, name: 1, type: 1, organization: 1, gender: 1,
                        language: 1, mobileNo: 1, emailId: 1, joinedOn: 1, households: 1, kycDocument: 1, identificationCard: 1,
                        additionalPdfs: 1, profileImage: 1, createdAt: 1, updatedAt: 1
                    }
                },
                { $skip: skip },
                { $limit: limitNo },

            ]);

            return {
                helpers,
                total,
                hasMore: skip + helpers.length < total,
            }
        } catch (error) {
            console.error("Pagination error: ", error);
        }
    }

    async getAllHelper(searchQuery?: string, type?: string): Promise<IHelper[]> {
        let filter: FilterQuery<IHelper> = {};
        if (searchQuery) {

            filter.$or = [
                { name: { $regex: searchQuery, $options: 'i', } },
                { employeeCode: { $regex: searchQuery, $options: 'i', } },
            ]
        }
        if (type) {
            filter.type = type;
        }
        return HelperModel.aggregate(
            [
                { $match: filter },
                {
                    $project: {
                        _id: 1,
                        employeeCode: 1,
                        name: 1,
                        type: 1,
                        organization: 1,
                        gender: 1,
                        language: 1,
                        mobileNo: 1,
                        emailId: 1,
                        joinedOn: 1,
                        households: 1,
                        kycDocument: 1,
                        identificationCard: 1,
                        additionalPdfs: 1,
                        profileImage: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                },
                { $sort: { createdAt: -1 } }
            ]
        )
    }

    async getHelperss(req: any) {
        try {
            const helpers = await HelperModel.find({});
            const helpersWithBase64 = helpers.map((helper) => {
                const helperObj: any = helper.toObject();
                if (helper.profileImage?.data) {
                    helperObj.profilePic = `data:${helper.profileImage.mimetype};base64,${helper.profileImage.data.toString('base64')}`;
                } else {
                    helperObj.profilePic = null;
                }
                return helperObj;
            });
            return helpersWithBase64;
        } catch (err) {
            return { error: 'Failed to fetch helpers', details: err };
        }
    };

    async getHelperById(id: string): Promise<IHelper | null> {
        // console.log(id);

        return await HelperModel.findOne({
            employeeCode: id,
        })
    }

    async updateHelper(id: string, updateData: Partial<IHelper>): Promise<IHelper | null> {
        return await HelperModel.findOneAndUpdate({ employeeCode: id }, updateData, { new: true });
    }

    async deleteHelper(id: string): Promise<IHelper | null> {
        return await HelperModel.findOneAndDelete({
            employeeCode: id,
        });
    }


    async getHelperStats(): Promise<any> {
        return await HelperModel.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalHouseholds: { $sum: '$households' }
                }
            }
        ])
    }

    async GetLastEmployeeCode(): Promise<string> {
    let code: string = '12345';
    let exists = true;

    while (exists) {
        code = Math.floor(10000 + Math.random() * 90000).toString();
        const duplicate = await HelperModel.findOne({ employeeCode: code }).lean();
        if (!duplicate) {
            exists = false; 
        }
    }
    return code;
}

}