import { Component, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
    MatSelectModule
],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> CustomSelectComponent),
      multi: true,
    }
  ]
})

export class CustomSelectComponent implements ControlValueAccessor {
  @Input() icon:string = '';
  @Input() options: {value: string, label: string}[] = [];
  @Input() placeholder:string = '';
  @Output() valueChange = new EventEmitter<string>();

  value : any = '';
  onChange = (value:any)=>{};
  onTouch: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onSelectionChange(value : any): void{
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }
}

// @Input() control!:FormControl;