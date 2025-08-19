import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { QrCodeService } from '../../services/qr-code.services';
import { IHelper } from '../../helper.model';

@Component({
  selector: 'app-id-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './id-card.component.html',
  styleUrl: './id-card.component.scss'
})
export class IdCardComponent implements OnInit {
  helperData: IHelper;
  qrCodeUrl: string = '';
  profileImageUrl: string = '';
  currentDate = new Date();
  securityCode: string;

  constructor(
    public dialogRef: MatDialogRef<IdCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { helper: any },
    private qrCodeService: QrCodeService
  ) {
    // console.log(JSON.stringify(data));
    
    this.helperData = data?.helper;
    this.securityCode = this.generateSecurityCode();
  }

  async ngOnInit() {
    await this.generateQRCode();
    this.loadProfileImage();
    // console.log("aubcbscbs",this.helperData);
    
  }

  private async generateQRCode() {
  try {
    let qrData = this.qrCodeService.generateHelperQRData(this.helperData);
    if (typeof qrData !== 'string') {
      qrData = JSON.stringify(qrData);
    }

    console.log("Final QR String:", qrData);

    this.qrCodeUrl = await this.qrCodeService.generateQRCode(qrData, { width: 80 });
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}


  private loadProfileImage() {
    if (this.helperData.profileImage && this.helperData.profileImage.data) {
      const base64String = this.bufferToBase64(this.helperData.profileImage.data);
      this.profileImageUrl = `data:${this.helperData.profileImage.mimetype};base64,${base64String}`;
    }
  }

  private bufferToBase64(buffer: any): string {
    if (typeof buffer === 'string') {
      return buffer;
    }
    
    if (Array.isArray(buffer) || buffer.data) {
      const bytes = new Uint8Array(buffer.data || buffer);
      let binary = '';
      bytes.forEach((byte) => binary += String.fromCharCode(byte));
      return btoa(binary);
    }
    
    return '';
  }

  private generateSecurityCode(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-avatar.png';
  }

  downloadCard() {
    window.print();
  }

  printCard() {
    window.print();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
