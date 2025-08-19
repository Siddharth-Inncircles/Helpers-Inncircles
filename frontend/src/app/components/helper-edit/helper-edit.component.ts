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
  private originalHelperData: HelperFormData | null = null;

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

    // console.log('Loading helper data for ID:', this.helperId);

    this.http.get<{ data: any }>(`${environment.apiUrl}/helper/${this.helperId}`)
      .subscribe({
        next: (response) => {
          const helper = response.data;
          // console.log('Helper data loaded:', helper);
          
          // console.log('Profile image structure:', helper.profileImage);
          // console.log('KYC document structure:', helper.kycDocument);
          // console.log('Additional PDFs structure:', helper.additionalPdfs);
          
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
          
          // console.log('Processed helper data:', this.helperData);
          this.originalHelperData = { ...this.helperData };
          this.loading = false;
          
          setTimeout(() => {
            this.isFormInitialized = true;
          }, 100);
        },
        error: (err) => {
          // console.error('Error loading helper data:', err);
          this.loading = false;
        }
      });
  }

  onFormSubmit(formData: HelperFormData) {
    // console.log('Updating helper with data:', formData);
    this.updateHelper(formData);
    this.router.navigate(['/']);
  }

  onFormCancel() {
    this.router.navigate(['/']);
  }

  onFormDataChange(formData: HelperFormData) {
    if (this.isFormInitialized) {
      // console.log('Form data changed:', formData);
    }
  }

  
private updateHelper(formData: HelperFormData) {
  if (!this.originalHelperData) {
    console.error('No original data to compare');
    return;
  }

  const processedFormData = new FormData();
  let hasChanges = false;

  if (formData.type !== this.originalHelperData.type) {
    processedFormData.append('type', formData.type || '');
    hasChanges = true;
  }

  if (formData.organization!= this.originalHelperData.organization) {
    processedFormData.append('organization', formData.organization ?? '');
    hasChanges = true;
  }

  if (formData.name !== this.originalHelperData.name) {
    processedFormData.append('name', formData.name ?? '');
    hasChanges = true;
  }

  if (formData.gender !== this.originalHelperData.gender) {
    processedFormData.append('gender', formData.gender || '');
    hasChanges = true;
  }

  if (formData.mobileNo !== this.originalHelperData.mobileNo) {
    processedFormData.append('mobileNo', formData.mobileNo || '');
    hasChanges = true;
  }

  if (formData.email != this.originalHelperData.email) {
    processedFormData.append('emailId', formData.email || '');
    hasChanges = true;
  }

  if (formData.identificationCard !== this.originalHelperData.identificationCard) {
    processedFormData.append('identificationCard', formData.identificationCard || '');
    hasChanges = true;
  }
  if (formData.vehicleType !== this.originalHelperData.vehicleType) {
    processedFormData.append('vechileType', formData.vehicleType === '' ? 'None' : (formData.vehicleType || ''));
    hasChanges = true;
  }
  
  if (formData.vehicleNumber !== this.originalHelperData.vehicleNumber && formData.vehicleType !== 'None' && formData.vehicleType !== '') {
    processedFormData.append('vechileNumber', formData.vehicleNumber || '');
    hasChanges = true;
  }
  
  this.http.put<IHelper>(`${environment.apiUrl}/helper/${this.helperId}`, processedFormData)
    .subscribe({
      next: (res) => {
        console.log('Helper updated successfully', res);
      },
      error: (err) => {
        console.error('Error updating helper: ', err);
      }
    });
}
}