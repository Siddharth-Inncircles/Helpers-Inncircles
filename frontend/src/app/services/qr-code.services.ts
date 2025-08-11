import { Injectable } from "@angular/core";
import * as QRCode from "qrcode";

@Injectable({
    providedIn: 'root',
})
export class QrCodeService{
    async generateQRCode(data: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
    try {
      const defaultOptions: QRCode.QRCodeToDataURLOptions = {
        width: 200,
        // height: 200,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        ...options
      };

      return await QRCode.toDataURL(data, defaultOptions);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  generateHelperQRData(helper: any): string {
    const qrData = {
      id: helper._id,
      employeeCode: helper.employeeCode,
      name: helper.name,
      type: helper.type,
      organization: helper.organization,
      mobileNo: helper.mobileNo,
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(qrData);
}
}