import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CustomInputComponent } from '../custom/custom-input/custom-input.component';
import { CustomSelectComponent } from '../custom/custom-select/custom-select.component';
import { CustomButtonComponent } from '../custom/custom-button/custom-button.component';
import { IHelper } from '../../helper.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-helpers-display',
  standalone: true,
  imports: [
    MatIconModule,
    CustomInputComponent,
    CustomSelectComponent,
    CustomButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

  ],
  templateUrl: './helpers-display.component.html',
  styleUrl: './helpers-display.component.scss'
})
export class HelpersDisplayComponent {
  private router = inject(Router);
  initializeSampleData() {
    this.helpers = [
      {
        id: '3',
        employeeCode: 'EMP001',
        name: 'Priya Sharma',
        type: 'Maid',
        organization: 'CleanCorp Services',
        gender: 'Female',
        language: ['Hindi', 'English'],
        mobileNo: '9876543210',
        emailId: 'priya.sharma@email.com',
        joinedOn: new Date('2023-01-15'),
        households: 5,
        vechileType: 'Cycle',
        vechileNumber: '',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      },
      {
        id: '2',
        employeeCode: 'EMP002',
        name: 'Rajesh Kumar',
        type: 'Driver',
        organization: 'Safe Drive Co.',
        gender: 'Male',
        language: ['Hindi', 'Telugu', 'English'],
        mobileNo: '9876543211',
        emailId: 'rajesh.kumar@email.com',
        joinedOn: new Date('2023-02-20'),
        households: 8,
        vechileType: 'Car',
        vechileNumber: 'TS09ER1234',
        createdAt: new Date('2023-02-20'),
        updatedAt: new Date('2023-02-20')
      },
      {
        id: '1',
        employeeCode: 'EMP003',
        name: 'Sneha Reddy',
        type: 'Nurse',
        organization: 'HealthCare Plus',
        gender: 'Female',
        language: ['Telugu', 'English'],
        mobileNo: '9876543212',
        emailId: 'sneha.reddy@email.com',
        joinedOn: new Date('2023-03-10'),
        households: 3,
        vechileType: 'Bike',
        vechileNumber: 'TS09AB5678',
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date('2023-03-10')
      },
      
    ];
  }
  helpers: IHelper[] = [];
  filteredHelpers: IHelper[] = [];
  selectedHelper: IHelper | null = null;

  // Form and UI states
  showAddForm = false;
  isEditing = false;
  helperForm!: FormGroup;

  // Filter and Seach Properties
  searchTerm = '';
  sortBy = 'name';
  filterService = '';
  filterOrganization = '';
  filterDateFrom = '';
  filterDateTo = '';

  constructor(private fb: FormBuilder) {
    this.helperForm = this.createForm();
    this.initializeSampleData();
  }

  ngOnInit(): void {
    this.filteredHelpers = [...this.helpers];
  }

  createForm(): FormGroup {
    return this.fb.group({
      employeeCode: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      organization: ['', Validators.required],
      gender: ['', Validators.required],
      language: [''],
      mobileNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      emailId: ['', Validators.email],
      joinedOn: ['', Validators.required],
      households: [0, [Validators.required, Validators.min(0)]],
      vechileType: [''],
      vechileNumber: ['']
    })
  }

  openAddHelperForm() {
    this.router.navigate(['/add-helper']);

  }

  selectHelper(helper: IHelper) {
    this.selectedHelper = helper;
    this.showAddForm = false;
    this.isEditing = false;
  }

  trackByHelper(index: number, helper: IHelper): string {
    return helper.id || index.toString();
  }

  editHelper() {
    if (!this.selectedHelper) return;

    this.isEditing = true;
    this.showAddForm = false;

    const languageString = this.selectedHelper.language.join(', ');
    this.helperForm.patchValue({
      ...this.selectedHelper,
      language: languageString,
      joinedOn: this.formatDateForInput(this.selectedHelper.joinedOn)
    })
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  cancelForm() {
    this.showAddForm = false;
    this.isEditing = false;
    this.helperForm.reset();
  }

  saveHelper() {
    if (!this.helperForm.valid) return;

    const formValue = this.helperForm.value;
    const languageArray = formValue.language ?
      formValue.language.split(',').map((lang: string) => lang.trim()) : [];

    const helperData: IHelper = {
      ...formValue,
      language: languageArray,
      joinedOn: new Date(formValue.joinedOn),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.isEditing && this.selectedHelper) {
      // Update existing helper
      helperData.id = this.selectedHelper.id;
      helperData.createdAt = this.selectedHelper.createdAt;
      const index = this.helpers.findIndex(h => h.id === this.selectedHelper!.id);
      if (index !== -1) {
        this.helpers[index] = helperData;
        this.selectedHelper = helperData;
      }
    } else {
      // Add new helper
      helperData.id = Date.now().toString();
      this.helpers.push(helperData);
      this.selectedHelper = helperData;
    }

    this.filterHelpers();
    this.cancelForm();
  }


  deleteHelper() {
    if (!this.selectedHelper) return;

    if (confirm(`Are you sure you want to delete ${this.selectedHelper.name}?`)) {
      this.helpers = this.helpers.filter(h => h.id !== this.selectedHelper!.id);
      this.selectedHelper = null;
      this.filterHelpers();
    }
  }

  // Filtering and sorting
  filterHelpers() {
    let filtered = [...this.helpers];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(helper =>
        helper.name.toLowerCase().includes(term) ||
        helper.employeeCode.toLowerCase().includes(term) ||
        helper.organization.toLowerCase().includes(term)
      )
    }

    // Service filter
    if (this.filterService) {
      filtered = filtered.filter(helper => helper.type === this.filterService);
    }

    // Organization Filter
    if (this.filterOrganization) {
      const org = this.filterOrganization.toLowerCase();
      filtered = filtered.filter(helper =>
        helper.organization.toLowerCase().includes(org)
      )
    }

    // Date range filter
    if (this.filterDateFrom) {
      const fromDate = new Date(this.filterDateFrom);
      filtered = filtered.filter(helper => helper.joinedOn >= fromDate);
    }

    if (this.filterDateTo) {
      const toDate = new Date(this.filterDateTo);
      filtered = filtered.filter(helper => helper.joinedOn <= toDate);
    }

    this.filteredHelpers = filtered;
    this.sortHelpers();
  }

  sortHelpers() {
    this.filteredHelpers.sort((a, b) => {
      const aValue = a[this.sortBy as keyof IHelper];
      const bValue = b[this.sortBy as keyof IHelper];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      return String(aValue).localeCompare(String(bValue));
    });
  }
}