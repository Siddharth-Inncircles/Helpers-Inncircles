import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { HelperFormReusableComponent, HelperFormData } from '../helper-form-reusable/helper-form-reusable.component';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { IdCardComponent } from '../id-card/id-card.component';
import { IHelper } from '../../helper.model';
import { HelperService } from '../../services/heper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-helper-form',
  standalone: true,
  imports: [
    CommonModule,
    HelperFormReusableComponent,
    HttpClientModule
  ],
  templateUrl: 'helper-form.component.html',
  styleUrl: 'helper-form.component.scss'
})
export class HelperFormComponent {
  private dialog = inject(MatDialog);

  constructor(private http: HttpClient, private helperService: HelperService, private router: Router) { }

  onFormSubmit(formData: HelperFormData) {
    // console.log('Form submitted with data:', formData);
    this.processFormData(formData);
  }

  onFormCancel() {
    this.router.navigate(['/'])
  }

  onStepChanged(step: number) {
    // console.log('Current step:', step);
  }

  private processFormData(formData: HelperFormData) {
    const processedFormData = new FormData();

    processedFormData.append('type', formData.type || '');
    processedFormData.append('organization', formData.organization || '');
    processedFormData.append('name', formData.name || '');
    processedFormData.append('gender', formData.gender || '');
    processedFormData.append('mobileNo', formData.mobileNo || '');
    processedFormData.append('emailId', formData.email || '');
    processedFormData.append('vechileType', formData.vehicleType === '' ? 'None' : (formData.vehicleType || ''));
    if (formData.vehicleType !== 'None' && formData.vehicleType !== '') {
      processedFormData.append('vechileNumber', formData.vehicleNumber || '');
    }
    processedFormData.append('joinedOn', new Date().toISOString());

    if (formData.language && Array.isArray(formData.language)) {
      formData.language.forEach((lang: string, index: number) => {
        processedFormData.append(`language[${index}]`, lang);
      });
    }

    if (formData.profileImage && formData.profileImage instanceof File) {
      processedFormData.append('profileImage', formData.profileImage);
    }

    if (formData.kycDocument && formData.kycDocument instanceof File) {
      processedFormData.append('kycDocument', formData.kycDocument);
    }

    if (formData.additionalPdfs) {
      if (Array.isArray(formData.additionalPdfs)) {
        formData.additionalPdfs.forEach((pdf: File) => {
          processedFormData.append('additionalPdfs', pdf);
        });
      } else if (formData.additionalPdfs instanceof File) {
        processedFormData.append('additionalPdfs', formData.additionalPdfs);
      }
    }

    this.submitHelper(processedFormData);
  }

  private submitHelper(formData: FormData) {
    this.helperService.addHelper(formData).subscribe({
      next: (res) => {
        if (res.success) {
          // console.log('Helper added successfully', res.data);
          this.showSuccessFlow(res.data);
        } else {
          console.error('Failed to add helper:', res);
        }
      },
      error: (err) => {
        console.error('Error adding helper: ', err);
      }
    });
  }


  private showSuccessFlow(helperData: any) {
    const successDialogRef = this.dialog.open(SuccessDialogComponent, {
      width: '400px',
      disableClose: true,
      panelClass: 'success-dialog-panel'
    });
    // console.log(helperData);

    setTimeout(() => {
      successDialogRef.close();
      this.showIdCard(helperData);
    }, 3000);
  }

  private showIdCard(helperData: IHelper) {
    const idDialogRef = this.dialog.open(IdCardComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { helper: helperData },
      panelClass: 'id-card-dialog-panel'
    });

    idDialogRef.afterClosed().subscribe(() => {
      // console.log("ID card dialog closed");
      this.router.navigate(['/']);
    });
  }
}