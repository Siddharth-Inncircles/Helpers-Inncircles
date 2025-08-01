import { Express, Request, Response } from "express";
import { HelperService } from "../services/helper.service";
import { validationResult } from "express-validator";


export class HelperController {
    helperService: HelperService;

    constructor() {
        this.helperService = new HelperService();
    }

    createHelper = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log(req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                })
                return;
            }

            const helper = await this.helperService.CreateHelper(req.body);
            res.status(201).json({
                success: true,
                message: 'Helper created successfully',
                data: helper
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Validation errors',
                error,
            })
        }
    }

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
            const helper = await this.helperService.updateHelper(req.params.id, req.body);
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
        } catch (error : any) {
            res.status(500).json({
                success: false,
                message: 'Error updating helper',
                error: error.message
            });
        }

    }
}