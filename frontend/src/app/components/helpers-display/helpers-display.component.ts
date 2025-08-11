import { Component, inject, OnInit, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CustomInputComponent } from '../custom/custom-input/custom-input.component';
import { CustomButtonComponent } from '../custom/custom-button/custom-button.component';
import { IHelper } from '../../helper.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HelperService } from '../../services/heper.service';
import { IdCardComponent } from '../id-card/id-card.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-helpers-display',
  standalone: true,
  imports: [
    MatIconModule,
    CustomInputComponent,
    CustomButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './helpers-display.component.html',
  styleUrl: './helpers-display.component.scss',
})
export class HelpersDisplayComponent implements OnInit {
  router = inject(Router);

  constructor(private fb: FormBuilder, private helperService: HelperService, private dialog: MatDialog) {
    this.helperForm = this.createForm();
    this.updateOrganizationsCache();
  }


  ngOnInit(): void {

    this.helperService.getHelpers().subscribe({
      next: (res) => {
        this.helpers = res.data;
        console.log(this.helpers);
        this.filteredHelpers = [...this.helpers];
      },
      error: (err) => {
        console.error('Error feching helpers', err);
      }
    })
  }
  helpers: IHelper[] = [];
  filteredHelpers: IHelper[] = [];
  selectedHelper: IHelper | null = null;

  showAddForm = false;
  isEditing = false;
  helperForm!: FormGroup;

  searchTerm = '';
  sortBy = 'name';
  filterService = '';
  filterOrganization = '';
  filterDateFrom = '';
  filterDateTo = '';

  showSortDialog = false;
  showServiceOrgDialog = false;
  showDateDialog = false;

  serviceSearchTerm = '';
  organizationSearchTerm = '';

  serviceOptions = [
    { value: '', label: 'All Services' },
    { value: 'Nurse', label: 'Nurse' },
    { value: 'Driver', label: 'Driver' },
    { value: 'Newspaper', label: 'Newspaper' },
    { value: 'Maid', label: 'Maid' },
    { value: 'Plumber', label: 'Plumber' },
    { value: 'Cook', label: 'Cook' }
  ];

  sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'employeeCode', label: 'Sort by Employee Code' },
    { value: 'joinedOn', label: 'Sort by Joining Date' }
  ];




  tempSelectedServices: string[] = [];
  tempSelectedOrganizations: string[] = [];
  selectedServices: string[] = [];
  selectedOrganizations: string[] = [];

  toggleServiceOrgDialog() {
    this.showServiceOrgDialog = !this.showServiceOrgDialog;
    this.closeOtherDialogs('serviceOrg');

    this.tempSelectedServices = [...this.selectedServices];
    this.tempSelectedOrganizations = [...this.selectedOrganizations];

    if (this.showServiceOrgDialog) {
      this.updateOrganizationsCache();
    }
  }

  onServiceSelectionChange(serviceValue: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.tempSelectedServices.includes(serviceValue)) {
        this.tempSelectedServices.push(serviceValue);
      }
    } else {
      this.tempSelectedServices = this.tempSelectedServices.filter(s => s !== serviceValue);
    }
  }

  toggleAllServices(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.tempSelectedServices = this.filteredServiceOptions
        .filter(option => option.value !== '')
        .map(option => option.value);
    } else {
      this.tempSelectedServices = [];
    }
  }

  isAllServicesSelected(): boolean {
    const availableServices = this.filteredServiceOptions.filter(option => option.value !== '');
    return availableServices.length > 0 &&
      availableServices.every(option => this.tempSelectedServices.includes(option.value));
  }

  isSomeServicesSelected(): boolean {
    const availableServices = this.filteredServiceOptions.filter(option => option.value !== '');
    const selectedCount = availableServices.filter(option => this.tempSelectedServices.includes(option.value)).length;
    return selectedCount > 0 && selectedCount < availableServices.length;
  }

  getSelectedServicesCount(): number {
    return this.tempSelectedServices.length;
  }

  onOrganizationSelectionChange(orgValue: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.tempSelectedOrganizations.includes(orgValue)) {
        this.tempSelectedOrganizations.push(orgValue);
      }
    } else {
      this.tempSelectedOrganizations = this.tempSelectedOrganizations.filter(o => o !== orgValue);
    }
  }

  toggleAllOrganizations(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.tempSelectedOrganizations = this.uniqueOrganizations
        .filter(option => option.value !== '')
        .map(option => option.value);
    } else {
      this.tempSelectedOrganizations = [];
    }
  }

  isAllOrganizationsSelected(): boolean {
    const availableOrgs = this.uniqueOrganizations.filter(option => option.value !== '');
    return availableOrgs.length > 0 &&
      availableOrgs.every(option => this.tempSelectedOrganizations.includes(option.value));
  }

  isSomeOrganizationsSelected(): boolean {
    const availableOrgs = this.uniqueOrganizations.filter(option => option.value !== '');
    const selectedCount = availableOrgs.filter(option => this.tempSelectedOrganizations.includes(option.value)).length;
    return selectedCount > 0 && selectedCount < availableOrgs.length;
  }

  getSelectedOrganizationsCount(): number {
    return this.tempSelectedOrganizations.length;
  }

  applyServiceOrgFilters() {
    this.selectedServices = [...this.tempSelectedServices];
    this.selectedOrganizations = [...this.tempSelectedOrganizations];
    this.filterHelpers();
    this.closeAllDialogs();
  }

  resetServiceOrgFilters() {
    this.tempSelectedServices = [];
    this.tempSelectedOrganizations = [];
    this.serviceSearchTerm = '';
    this.organizationSearchTerm = '';
  }

  filterHelpers() {
    let filtered = [...this.helpers];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(helper =>
        helper.name.toLowerCase().includes(term) ||
        helper.employeeCode.toLowerCase().includes(term) ||
        helper.organization.toLowerCase().includes(term)
      );
    }

    if (this.selectedServices.length > 0) {
      filtered = filtered.filter(helper => this.selectedServices.includes(helper.type));
    }

    if (this.selectedOrganizations.length > 0) {
      filtered = filtered.filter(helper => this.selectedOrganizations.includes(helper.organization));
    }

    if (this.filterDateFrom) {
      const fromDate = new Date(this.filterDateFrom);
      filtered = filtered.filter(helper => helper.joinedOn >= fromDate);
    }

    if (this.filterDateTo) {
      const toDate = new Date(this.filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(helper => helper.joinedOn <= toDate);
    }

    this.filteredHelpers = filtered;
    this.sortHelpers();
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.tempSelectedServices.length > 0) count++;
    if (this.tempSelectedOrganizations.length > 0) count++;
    if (this.filterDateFrom || this.filterDateTo) count++;
    return count;
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.selectedServices = [];
    this.selectedOrganizations = [];
    this.tempSelectedServices = [];
    this.tempSelectedOrganizations = [];
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.sortBy = 'name';
    this.filterHelpers();
    this.closeAllDialogs();
  }



  toggleSortDialog() {
    this.showSortDialog = !this.showSortDialog;
    this.closeOtherDialogs('sort');
  }



  toggleDateDialog() {
    this.showDateDialog = !this.showDateDialog;
    this.closeOtherDialogs('date');
  }

  closeOtherDialogs(except: string) {
    if (except !== 'sort') { this.showSortDialog = false; }
    if (except !== 'serviceOrg') this.showServiceOrgDialog = false;
    if (except !== 'date') this.showDateDialog = false;
  }

  closeAllDialogs() {
    this.showSortDialog = false;
    this.showServiceOrgDialog = false;
    this.showDateDialog = false;
  }

  applySorting(sortValue: string) {
    this.sortBy = sortValue;
    this.sortHelpers();
    this.closeAllDialogs();
  }

  get filteredServiceOptions() {
    if (!this.serviceSearchTerm) return this.serviceOptions;
    return this.serviceOptions.filter(option =>
      option.label.toLowerCase().includes(this.serviceSearchTerm.toLowerCase())
    );
  }

  uniqueOrganizations: any[] = [];
  organizationsCache: any[] = [];

  updateOrganizationsCache() {
    const organizations = [...new Set(this.helpers.map(h => h.organization))];
    this.organizationsCache = [
      { value: '', label: 'All Organizations' },
      ...organizations.map(org => ({ value: org, label: org }))
    ];
    this.updateFilteredOrganizations();
  }

  updateFilteredOrganizations() {
    if (!this.organizationSearchTerm) {
      this.uniqueOrganizations = this.organizationsCache;
    } else {
      this.uniqueOrganizations = this.organizationsCache.filter(option =>
        option.label.toLowerCase().includes(this.organizationSearchTerm.toLowerCase())
      );
    }
  }

  onOrganizationSearch() {
    this.updateFilteredOrganizations();
  }

  applyDateFilter() {
    this.filterHelpers();
    this.closeAllDialogs();
  }

  resetDateFilter() {
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.filterHelpers();
    this.closeAllDialogs();
  }

  sortHelpers() {
    this.filteredHelpers.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof IHelper];
      let bValue: any = b[this.sortBy as keyof IHelper];

      if (aValue instanceof Date && bValue instanceof Date) {
        return aValue.getTime() - bValue.getTime();
      }

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      if (Array.isArray(aValue)) aValue = aValue.join(', ');
      if (Array.isArray(bValue)) bValue = bValue.join(', ');

      return String(aValue).localeCompare(String(bValue));
    });
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


  showIdCard(helperData: IHelper) {

    const idDialogRef = this.dialog.open(IdCardComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { helper: helperData },
      panelClass: 'id-card-dialog-panel'
    });

    idDialogRef.afterClosed().subscribe(() => {
      console.log("ID card dialog closed");
    })
  }


  viewDocument(doc: any) {
    console.log(doc);

    const base64 = doc.data;
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.mimetype });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  }


  deleteHelper() {
    if (!this.selectedHelper) return;

    if (confirm(`Are you sure you want to delete ${this.selectedHelper.name}?`)) {
      this.helperService.deleteHelper(this.selectedHelper.employeeCode).subscribe({
        next: (res) => {
          console.log(res);
          this.helpers = this.helpers.filter(h => h.employeeCode !== this.selectedHelper!.employeeCode);
          this.selectedHelper = null;
        }
        ,
        error: (err) => {
          console.error(`Error while deleting helper: `, err);
        }
      })
    }
  }


  saveAsExcel(): void {
    if (confirm(`Do you want to download the filtered helpers in excel sheet format?`)) {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredHelpers);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Helpers': worksheet },
        SheetNames: ['Helpers']
      };
      XLSX.writeFile(workbook, 'selected-helpers.xlsx');
    }
  }

}