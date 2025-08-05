import { Component, Input, forwardRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() type:string = 'text';
  @Input() name:string = '';
  // @Input() control!: FormControl;

  @Input() value: any = '';
  private onChange = (value:any)=>{};
  private onTouched = ()=>{};


  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: any){
    this.value = event.target.value;
    this.onChange(this.value);
  }
}
