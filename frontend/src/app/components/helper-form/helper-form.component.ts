import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomSelectComponent } from '../custom/custom-select/custom-select.component';
import { CustomInputComponent } from '../custom/custom-input/custom-input.component';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { IHelper } from '../../helper.model';
import { MatPseudoCheckboxModule } from '@angular/material/core';

@Component({
  selector: 'app-helper-form',
  standalone: true,
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
    MatIconModule
  ],
  templateUrl: './helper-form.component.html',
  styleUrls: ['./helper-form.component.scss']
})
export class HelperFormComponent {
  currentStep = 0;
  constructor(private fb: FormBuilder) { }

  steps = [
    { label: 'Helper Details' },
    { label: 'Doccuments' },
    { label: 'Review' }
  ];

  firstFormGroup: FormGroup = this.fb.group({
    profileImage: [null as File | null],
    type: ['', Validators.required],
    organization: ['', [Validators.required, Validators.minLength(2)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    language: [[], [Validators.required, Validators.minLength(1)]],
    gender: ['', Validators.required],
    mobileNo: ['', Validators.required],
    email: ['', Validators.required],
    vechileType: ['', Validators.required],
    kycDocument: [null, Validators.required],
  });


  secondFormGroup = this.fb.group({
    additionalPdfs: [null as File | null]
  });

  previewImageUrl: string | ArrayBuffer | null = null;

onProfileImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;

  if (file) {
    this.firstFormGroup.get('profileImage')?.setValue(file);
    this.firstFormGroup.get('profileImage')?.markAsTouched();

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
}


  languagesList: string[] = ['English', 'Telugu', 'Hindi'];

  isAllSelected(): boolean {
    const selected = this.firstFormGroup.get('language')?.value || [];
    return selected.length === this.languagesList.length;
  }

  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.firstFormGroup.get('language')?.setValue([]);
    } else {
      this.firstFormGroup.get('language')?.setValue([...this.languagesList]);
    }
  }

  onLanguageSelection(event: MatSelectChange) {
    const selected: string[] = event.value;

    console.log(selected);

  }


  goToStep(index: number) {
    this.currentStep = index;
  }

  selectedFileName: string = '';

  onKycSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0] || null;

    if (file) {
      this.selectedFileName = file.name;
      this.firstFormGroup.get('kycDocument')?.setValue(file);
      this.firstFormGroup.get('kycDocument')?.markAsTouched();
    }
  }

  selectedAddnName: string = '';
  onAddnSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0] || null;

    if (file) {
      this.selectedAddnName = file.name;
      this.secondFormGroup.get('additionalPdfs')?.setValue(file);
      this.secondFormGroup.get('additionalPdfs')?.markAsTouched();
    }
  }


  nextStep() {
    if (this.firstFormGroup.invalid) {
      this.firstFormGroup.markAllAsTouched();
      return;
    }
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  resetSteps() {
    this.currentStep = 0;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
  }
}
