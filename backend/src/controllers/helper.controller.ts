import { Express, Request, Response } from "express";
import { HelperService } from "../services/helper.service";
import { validationResult } from "express-validator";

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

export class HelperController {
    helperService: HelperService;

    constructor() {
        this.helperService = new HelperService();
    }


    createHelper = async (req: Request, res: Response): Promise<void> => {
        try {
            // console.log('BODY:', req.body);
            // console.log('FILES:', req.files);

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
                return;
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const lastCode = await this.helperService.GetLastEmployeeCode();

            let newEmployeeCode = 'EMP001';
            if (lastCode) {
                const num = parseInt(lastCode.replace('EMP', ''), 10);
                const nextNum = num + 1;
                newEmployeeCode = `EMP${nextNum.toString().padStart(3, '0')}`;
            }

            const helper = await this.helperService.CreateHelper({
                ...req.body,
                employeeCode: newEmployeeCode,

                profileImage: files?.profileImage?.[0] ? {
                    data: files.profileImage[0].buffer,
                    filename: files.profileImage[0].originalname,
                    mimetype: files.profileImage[0].mimetype
                } : undefined,

                kycDocument: files?.kycDocument?.[0] ? {
                    data: files.kycDocument[0].buffer,
                    filename: files.kycDocument[0].originalname,
                    mimetype: files.kycDocument[0].mimetype
                } : undefined,

                additionalPdfs: files?.additionalPdfs?.map((file) => ({
                    data: file.buffer,
                    filename: file.originalname,
                    mimetype: file.mimetype
                })) || []
            });

            res.status(201).json({
                success: true,
                message: 'Helper created successfully',
                data: helper
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error,
            });
        }
    };



    getAllHelpers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { search, type } = req.query;
            const helpers = await this.helperService.getAllHelper(
                search as string,
                type as string
            )

            res.status(200).json({
                success: true,
                message: 'Helpers retrieved successfully',
                data: helpers,
                count: helpers.length
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error while retreiving helpers',
                error: error.message
            });
        }
    }

    getHelperByID = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const helper = await this.helperService.getHelperById(id);
            if (!helper) {
                res.status(404).json({
                    success: false,
                    message: 'Helper not found!',
                })
                return;
            }
            res.status(201).json({
                success: true,
                message: 'Helper retrieved successfully',
                data: helper,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Failed to retreive helper',
                error: error.message,
            })
        }
    }


    updateHelper = async (req: Request, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
                return;
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const updatePayload = {
                ...req.body,

                profileImage: files?.profileImage?.[0] ? {
                    data: files.profileImage[0].buffer,
                    filename: files.profileImage[0].originalname,
                    mimetype: files.profileImage[0].mimetype
                } : undefined,

                kycDocument: files?.kycDocument?.[0] ? {
                    data: files.kycDocument[0].buffer,
                    filename: files.kycDocument[0].originalname,
                    mimetype: files.kycDocument[0].mimetype
                } : undefined,

                additionalPdfs: files?.additionalPdfs?.map((file) => ({
                    data: file.buffer,
                    filename: file.originalname,
                    mimetype: file.mimetype
                })) || []
            };

            const helper = await this.helperService.updateHelper(req.params.id, updatePayload);

            if (!helper) {
                res.status(404).json({
                    success: false,
                    message: 'Helper not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Helper updated successfully',
                data: helper
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error updating helper',
                error: error.message
            });
        }
    };




    deleteHelper = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const helper = this.helperService.deleteHelper(id as string);
            if (!helper) {
                res.status(404).json({
                    success: false,
                    message: 'Helper not found!',
                })
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Helper deleted successfully',
                data: helper,
            })
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Error updating helper',
                error: error.message
            });
        }

    }
}