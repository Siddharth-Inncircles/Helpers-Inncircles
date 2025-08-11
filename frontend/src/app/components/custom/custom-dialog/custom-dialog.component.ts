import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Option {
  value: string;
  label: string;
}

interface CustomDialogData {
  header: string;
  lists: Option[];
}

interface ReturnData {
  file: File;
  type?: string;
}

@Component({
  selector: 'app-custom-dialog',
  templateUrl: 'custom-dialog.component.html',
  styleUrl: './custom-dialog.component.scss',
  imports: [MatDialogModule, MatButtonModule, CommonModule, CustomSelectComponent, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CustomDialogComponent {
  header: string;
  lists: Option[] = [];

  selectedFile: File | null = null;
  selectedFileName: string = '';
  selectedType: string | null = null;
  retVal: ReturnData | null = null;

  constructor(
    private dialogRef: MatDialogRef<CustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CustomDialogData
  ) {
    this.header = data.header;
    this.lists = data.lists;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }


  onTypeSelected(value: string): void {
    this.selectedType = value;
  }


  closeDialogWithFile(): void {
    if (this.selectedFile) {
      const retVal: ReturnData = {
        file: this.selectedFile,
        type: this.selectedType || undefined,
      };
      this.dialogRef.close(retVal);
    }else{
      // console.log("jnfkjs");
      
    }
  }

}
