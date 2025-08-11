import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { HelperFormReusableComponent, HelperFormData } from '../helper-form-reusable/helper-form-reusable.component';
import { IHelper } from '../../helper.model';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-helper-edit',
  standalone: true,
  imports: [
    CommonModule,
    HelperFormReusableComponent,
    HttpClientModule
  ],
  templateUrl: 'helper-edit.component.html',
  styleUrl: 'helper-edit.component.scss'
})
export class HelperEditComponent implements OnInit, OnDestroy {
  @Input() helperId!: string;

  helperData: HelperFormData | null = null;
  loading = true;
  private routeSubscription?: Subscription;
  private isFormInitialized = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code && code !== this.helperId) {
        console.log('Code:', code);
        this.helperId = code;
        this.loadHelperData();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadHelperData() {
    if (!this.helperId) {
      console.error('No helper ID provided');
      this.loading = false;
      return;
    }

    console.log('Loading helper data for ID:', this.helperId);

    this.http.get<{ data: any }>(`${environment.apiUrl}/helper/${this.helperId}`)
      .subscribe({
        next: (response) => {
          const helper = response.data;
          console.log('Helper data loaded:', helper);
          
          console.log('Profile image structure:', helper.profileImage);
          console.log('KYC document structure:', helper.kycDocument);
          console.log('Additional PDFs structure:', helper.additionalPdfs);
          
          this.helperData = {
            profileImage: helper.profileImage,
            type: helper.type,
            organization: helper.organization,
            name: helper.name,
            language: Array.isArray(helper.language) ? helper.language : [],
            gender: helper.gender,
            mobileNo: helper.mobileNo,
            email: helper.email || helper.emailId,
            vehicleType: helper.vehicleType,
            vehicleNumber: helper.vehicleNumber,
            identificationCard: helper.identificationCard,
            kycDocument: helper.kycDocument,
            additionalPdfs: helper.additionalPdfs,
          };
          
          console.log('Processed helper data:', this.helperData);
          this.loading = false;
          
          setTimeout(() => {
            this.isFormInitialized = true;
          }, 100);
        },
        error: (err) => {
          console.error('Error loading helper data:', err);
          this.loading = false;
        }
      });
  }

  onFormSubmit(formData: HelperFormData) {
    console.log('Updating helper with data:', formData);
    this.updateHelper(formData);
    this.router.navigate(['/']);
  }

  onFormCancel() {
    this.router.navigate(['/']);
  }

  onFormDataChange(formData: HelperFormData) {
    if (this.isFormInitialized) {
      console.log('Form data changed:', formData);
    }
  }

  
private updateHelper(formData: HelperFormData) {
  console.log("This is the updated helper data: ", formData);
  
  const processedFormData = new FormData();

  processedFormData.append('type', formData.type || '');
  processedFormData.append('organization', formData.organization || '');
  processedFormData.append('name', formData.name || '');
  processedFormData.append('gender', formData.gender || '');
  processedFormData.append('mobileNo', formData.mobileNo || '');
  processedFormData.append('emailId', formData.email || '');
  processedFormData.append('vechileType', formData.vehicleType === '' ? 'None' : (formData.vehicleType || ''));
  processedFormData.append('vechileNumber', formData.vehicleNumber || '');
  processedFormData.append('identificationCard', formData.identificationCard || '');

  if (formData.language && Array.isArray(formData.language)) {
    formData.language.forEach((lang: string, index: number) => {
      processedFormData.append(`language[${index}]`, lang);
    });
  }

  // Handle profile image - only append if it's a new File
  if (formData.profileImage instanceof File) {
    console.log('Uploading new profile image file');
    processedFormData.append('profileImage', formData.profileImage);
  } else if (typeof formData.profileImage === 'string') {
    console.log('Keeping existing profile image:', formData.profileImage);
    // Don't append to FormData if it's a URL - the server should keep the existing one
    // Or if your API requires it, you can append the URL:
    // processedFormData.append('profileImageUrl', formData.profileImage);
  }

  // Handle KYC document - only append if it's a new File
  if (formData.kycDocument instanceof File) {
    console.log('Uploading new KYC document file');
    processedFormData.append('kycDocument', formData.kycDocument);
  } else if (typeof formData.kycDocument === 'string') {
    console.log('Keeping existing KYC document:', formData.kycDocument);
    // Don't append to FormData if it's a URL
    // Or append the URL if your API needs it:
    // processedFormData.append('kycDocumentUrl', formData.kycDocument);
  }

  // Handle additional PDFs - only append if it's a new File
  if (formData.additionalPdfs instanceof File) {
    console.log('Uploading new additional PDF file');
    processedFormData.append('additionalPdfs', formData.additionalPdfs);
  } else if (typeof formData.additionalPdfs === 'string') {
    console.log('Keeping existing additional PDF:', formData.additionalPdfs);
    // Don't append to FormData if it's a URL
    // Or append the URL if your API needs it:
    // processedFormData.append('additionalPdfsUrl', formData.additionalPdfs);
  }

  // Debug: Log what's being sent
  console.log('FormData contents:');
  for (let [key, value] of (processedFormData as any).entries()) {
    console.log(key, ':', value instanceof File ? `File: ${value.name}` : value);
  }
  
  this.http.put<IHelper>(`${environment.apiUrl}/helper/${this.helperId}`, processedFormData)
    .subscribe({
      next: (res) => {
        console.log('Helper updated successfully', res);
        // Optionally navigate back or show success message
        // this.router.navigate(['/helpers']);
      },
      error: (err) => {
        console.error('Error updating helper: ', err);
        // Handle error appropriately
      }
    });
}
}