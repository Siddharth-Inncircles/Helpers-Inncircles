import HelperModel, { IHelper } from "../models/helper.model";
import { DeleteResult, FilterQuery } from "mongoose";

interface HelperPaginationOptions {
    searchQuery?: string;
    type?: string;
    organizations?: string[] | string;
    dateFrom?: string;
    dateTo?: string;
    services?: string[];
}


export class HelperService {
    async CreateHelper(helperData: Partial<IHelper>): Promise<IHelper> {
        const helper = new HelperModel(helperData);
        return await helper.save();
    }


    async getAllHelperPagination(
        page: string,
        limit: string,
        sortField: string,
        options: HelperPaginationOptions = {}
    ) {
        try {
            const pageNo = parseInt(page) || 1;
            const limitNo = parseInt(limit) || 10;
            const skip = (pageNo - 1) * limitNo;
            console.log(sortField);
            
            let filter: FilterQuery<IHelper> = {};

            if (options.searchQuery?.trim()) {
                filter.$or = [
                    { name: { $regex: options.searchQuery, $options: 'i' } },
                    { employeeCode: { $regex: options.searchQuery, $options: 'i' } },
                    { organization: { $regex: options.searchQuery, $options: 'i' } }
                ];
            }

            if (options.organizations?.length) {
                filter.organization = { $in: options.organizations };
            }

            if (options.services?.length) {
                filter.type = { $in: options.services };
            }

            if (options.dateFrom || options.dateTo) {
                filter.joinedOn = {};
                if (options.dateFrom) filter.joinedOn.$gte = new Date(options.dateFrom);
                if (options.dateTo) filter.joinedOn.$lte = new Date(options.dateTo);
            }

            if (options.type) {
                filter.type = options.type;
            }

            const sort: Record<string, 1 | -1> = {};
            sort[sortField || 'employeeCode'] = 1;

            const total = await HelperModel.countDocuments(filter);
            const helpers = await HelperModel.aggregate([
                { $match: filter },
                { $sort: sort },
                { $skip: skip },
                { $limit: limitNo },
            ]);

            return {
                helpers,
                total,
                hasMore: skip + helpers.length < total,
            };
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
        return await HelperModel.aggregate(
            [
                { $match: filter },
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