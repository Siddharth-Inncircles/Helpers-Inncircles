import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CustomDialogComponent } from '../custom/custom-dialog/custom-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomSelectComponent } from '../custom/custom-select/custom-select.component';
import { CustomInputComponent } from '../custom/custom-input/custom-input.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { CustomButtonComponent } from "../custom/custom-button/custom-button.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface ReturnData {
  file: File;
  type?: string;
}

export interface HelperFormData {
  profileImage?: File | string | null;
  type?: string;
  organization?: string;
  name?: string;
  language?: string[];
  gender?: string;
  mobileNo?: string;
  email?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  identificationCard?: string;
  kycDocument?: File | string | null;
  additionalPdfs?: File | string | null;
}

@Component({
  selector: 'app-helper-form-reusable',
  templateUrl: './helper-form-reusable.component.html',
  styleUrls: ['./helper-form-reusable.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CustomSelectComponent,
    CustomInputComponent,
    FormsModule,
    MatSelectModule,
    MatPseudoCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
    CustomButtonComponent,
    MatProgressSpinnerModule
  ],
  standalone: true,
})
export class HelperFormReusableComponent implements OnInit, OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData: HelperFormData | null = null;
  @Input() submitButtonText: string = 'Submit';
  @Input() showCancelButton: boolean = true;
  @Input() enableSteps: boolean = true;

  @Output() formSubmit = new EventEmitter<HelperFormData>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formDataChange = new EventEmitter<HelperFormData>();
  @Output() stepChanged = new EventEmitter<number>();

  private dialog = inject(MatDialog);

  currentStep = 0;
  private isInitializing = false;

  steps = [
    { label: 'Helper Details' },
    { label: 'Documents' },
    { label: 'Review' }
  ];

  edit_steps = [
    { label: 'Helper Details' , icon: 'construction'},
    { label: 'Documents', icon: 'assignment' },
  ]

  previewImageUrl: string | ArrayBuffer | null = null;
  kycDocumentUrl: string | ArrayBuffer | null = null;
  additionalPdfUrl: string | ArrayBuffer | null = null;
  imageSrc: string | null = null;
  selectedFileName: string = '';
  selectedAddnName: string = '';

  languagesList: string[] = ['English', 'Telugu', 'Hindi'];

  constructor(private fb: FormBuilder) { }

  minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (Array.isArray(value) && value.length >= min) {
        return null;
      }
      return { minArrayLength: { requiredLength: min, actualLength: value?.length || 0 } };
    };
  }

  firstFormGroup: FormGroup = this.fb.group({
    profileImage: [null as File | null],
    type: ['', Validators.required],
    organization: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    language: [[], [Validators.required, this.minArrayLength(1)]],
    gender: ['', Validators.required],
    mobileNo: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      ]
    ],
    vehicleType: [''],
    vehicleNumber: [''],
    identificationCard: [''],
    kycDocument: [null as File | null, Validators.required],
  });

  secondFormGroup = this.fb.group({
    additionalPdfs: [null as File | string | null]
  });

  ngOnInit() {
    this.setupFormSubscriptions();

    if (this.initialData) {
      this.populateFormData(this.initialData);
    }

    setTimeout(() => {
      this.setupFormValidation();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && changes['initialData'].currentValue && !changes['initialData'].firstChange) {
      this.populateFormData(changes['initialData'].currentValue);
      this.setupFormValidation();
    }

    if (changes['mode']) {
      this.setupFormValidation();
    }
  }

  private setupFormValidation() {
    this.firstFormGroup.enable();
    this.secondFormGroup.enable();

    if (this.mode === 'edit') {
      if (this.hasExistingKycDocument()) {
        this.firstFormGroup.get('kycDocument')?.clearValidators();
      } else {
        this.firstFormGroup.get('kycDocument')?.setValidators([Validators.required]);
      }
      this.firstFormGroup.get('kycDocument')?.updateValueAndValidity();
    } else if (this.mode === 'create') {
      this.firstFormGroup.get('kycDocument')?.setValidators([Validators.required]);
      this.firstFormGroup.get('kycDocument')?.updateValueAndValidity();
    }
  }

  private hasExistingKycDocument(): boolean {
    return !!(this.initialData?.kycDocument &&
      (typeof this.initialData.kycDocument === 'string' ||
        (typeof this.initialData.kycDocument === 'object' && this.initialData.kycDocument !== null)));
  }

  private setupFormSubscriptions() {
    this.firstFormGroup.valueChanges.subscribe(() => {
      if (!this.isInitializing) {
        this.emitFormDataChange();
      }
    });

    this.secondFormGroup.valueChanges.subscribe(() => {
      if (!this.isInitializing) {
        this.emitFormDataChange();
      }
    });
  }

  private populateFormData(data: HelperFormData) {
    this.isInitializing = true;

    this.firstFormGroup.patchValue({
      type: data.type || '',
      organization: data.organization || '',
      name: data.name || '',
      language: data.language || [],
      gender: data.gender || '',
      mobileNo: data.mobileNo || '',
      email: data.email || '',
      vehicleType: data.vehicleType || '',
      vehicleNumber: data.vehicleNumber || '',
      identificationCard: data.identificationCard || ''
    });

    if (data.profileImage) {
      this.handleProfileImage(data.profileImage);
    }

    if (data.kycDocument) {
      this.handleKycDocument(data.kycDocument);
    }

    if (data.additionalPdfs) {
      this.handleAdditionalPdfs(data.additionalPdfs);
    }

    setTimeout(() => {
      this.isInitializing = false;
      console.log('Form population complete. Current state:', {
        imageSrc: this.imageSrc,
        selectedFileName: this.selectedFileName,
        selectedAddnName: this.selectedAddnName
      });
    }, 200);
  }

  arrayBufferToBase64(buffer: number[]): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private handleProfileImage(profileImage: any) {
    if (typeof profileImage === 'object' && profileImage !== null) {
      const imageUrl = profileImage.filename;
      if (imageUrl) {
        const byteArray = profileImage.data?.data;
        if (Array.isArray(byteArray)) {
          const base64String = this.arrayBufferToBase64(byteArray);
          this.imageSrc = `data:${profileImage.mimetype};base64,${base64String}`;
        }
        this.previewImageUrl = imageUrl;
        this.firstFormGroup.patchValue({ profileImage: imageUrl });
      }
    }
  }

  private handleKycDocument(kycDocument: any) {
    if (typeof kycDocument === 'object' && kycDocument !== null) {
      const docUrl = kycDocument.url || kycDocument.path || kycDocument.filename;
      if (docUrl) {
        const byteArray = kycDocument.data?.data;
        if (Array.isArray(byteArray)) {
          const base64String = this.arrayBufferToBase64(byteArray);
          this.kycDocumentUrl = `data:${kycDocument.mimetype};base64,${base64String}`;
        } else {
          this.kycDocumentUrl = docUrl;
        }

        const docName = kycDocument.fileName ;
        this.selectedFileName = docName || 'Document';

        this.firstFormGroup.patchValue({ kycDocument: docUrl });
      }
    }
  }

  private handleAdditionalPdfs(additionalPdfs: any) {
    if (typeof additionalPdfs === 'object' && additionalPdfs !== null) {
      const pdfUrl = additionalPdfs.url || additionalPdfs.path || additionalPdfs.filename;
      if (pdfUrl) {
        const byteArray = additionalPdfs.data?.data;
        if (Array.isArray(byteArray)) {
          const base64String = this.arrayBufferToBase64(byteArray);
          this.additionalPdfUrl = `data:${additionalPdfs.mimetype};base64,${base64String}`;
        } else {
          this.additionalPdfUrl = pdfUrl;
        }

        const pdfName = additionalPdfs.fileName ;
        this.selectedAddnName = pdfName || 'Document';

        this.secondFormGroup.patchValue({ additionalPdfs: pdfUrl });
      }
    }
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (file) {
      this.firstFormGroup.get('profileImage')?.setValue(file);
      this.firstFormGroup.get('profileImage')?.markAsTouched();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result;
        this.imageSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private emitFormDataChange() {
    const formData = this.getFormData();
    this.formDataChange.emit(formData);
  }

  private getFormData(): HelperFormData {
    return {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value
    };
  }

  openDialogForKyc() {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: {
        header: 'Upload KYC Documents',
        lists: [
          { value: 'adhaar', label: 'Adhaar Card' },
          { value: 'pan', label: 'Pan Card' },
          { value: 'voter', label: 'Voter ID' },
          { value: 'passport', label: 'Passport' },
        ]
      }
    });

    dialogRef.afterClosed().subscribe((retVal: ReturnData | null) => {
      if (retVal?.file) {
        this.firstFormGroup.get('kycDocument')?.setValue(retVal?.file);
        this.firstFormGroup.get('kycDocument')?.markAsTouched();
        this.selectedFileName = retVal?.file.name;
        this.firstFormGroup.get('identificationCard')?.setValue(retVal?.type)

        const reader = new FileReader();
        reader.onload = () => {
          this.kycDocumentUrl = reader.result;
        }
        reader.readAsDataURL(retVal?.file);
      }
    })
  }

  openDialogForAddnPdfs() {
    const dialogRef = this.dialog.open(CustomDialogComponent, {
      data: {
        header: 'Upload Additional Documents'
      }
    });

    dialogRef.afterClosed().subscribe((retVal: ReturnData | null) => {
      if (retVal?.file) {
        this.selectedAddnName = retVal?.file.name;
        this.secondFormGroup.get('additionalPdfs')?.setValue(retVal?.file);
        this.secondFormGroup.get('additionalPdfs')?.markAsTouched();

        const reader = new FileReader();
        reader.onload = () => {
          this.additionalPdfUrl = reader.result;
        }
        reader.readAsDataURL(retVal?.file);
      }
    })
  }

  onLanguageSelection(event: MatSelectChange) {
    const selected: string[] = event.value;
  }

  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.firstFormGroup.get('language')?.setValue([]);
    } else {
      this.firstFormGroup.get('language')?.setValue([...this.languagesList]);
    }
  }

  isAllSelected(): boolean {
    const selected = this.firstFormGroup.get('language')?.value || [];
    return selected.length === this.languagesList.length+1;
  }

  goToStep(index: number) {
    if (!this.enableSteps) return;

    this.currentStep = index;
    this.stepChanged.emit(index);
  }

  nextStep() {
    if (this.currentStep === 0) {
      this.firstFormGroup.markAllAsTouched();

      console.log('Form validity check:', {
        isValid: this.firstFormGroup.valid,
        errors: this.getFormErrors(this.firstFormGroup)
      });

      if (this.firstFormGroup.invalid) {
        console.log('Form is invalid, cannot proceed');
        return;
      }
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.stepChanged.emit(this.currentStep);
    }
  }

  private getFormErrors(form: FormGroup): any {
    let formErrors: any = {};

    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.stepChanged.emit(this.currentStep);
    }
  }

  resetForm() {
    this.currentStep = 0;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.imageSrc = null;
    this.selectedFileName = '';
    this.selectedAddnName = '';
    this.previewImageUrl = null;
    this.kycDocumentUrl = null;
    this.additionalPdfUrl = null;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  onSubmit() {
    if (this.firstFormGroup.valid) {
      const formData = this.getFormData();
      this.formSubmit.emit(formData);
    } else {
      this.markFormGroupTouched(this.firstFormGroup);
      this.markFormGroupTouched(this.secondFormGroup);

      if (this.firstFormGroup.invalid) {
        this.currentStep = 0;
        this.stepChanged.emit(0);
      }
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  isImage(fileUrl: string | ArrayBuffer | null): boolean {
    if (!fileUrl || typeof fileUrl !== 'string') return false;
    return fileUrl.startsWith('data:image/') ||
      fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
  }

  trackByLanguage(index: number, language: string): string {
    return language;
  }

  get formTitle(): string {
    switch (this.mode) {
      case 'create': return 'Add Helper';
      case 'edit': return 'Edit Helper';
      default: return 'Helper Form';
    }
  }

  get isFormValid(): boolean {
    return this.firstFormGroup.valid && this.secondFormGroup.valid;
  }
}