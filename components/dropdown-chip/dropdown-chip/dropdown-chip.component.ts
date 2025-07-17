import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ImportsModule } from "../../Imports/imports";
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: "dropdown-chip",
  templateUrl: "./dropdown-chip.component.html",
  styleUrls: ["./dropdown-chip.component.scss"],
  standalone: true,
  imports: [ImportsModule,DropdownModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownChipComponent),
      multi: true,
    },
  ],
})
export class DropdownChipComponent implements ControlValueAccessor {
  @Input() dropdownLabel = "";
  @Input() chipContainerLabel = "";
  @Input() options: any[] = [];
  @Input() value: any;
  // @Input() chipEnabled: (value: any) => boolean;
  @Input() chipEnabled: boolean;
  @Input() multiSelect = false;
  disable: boolean = false;


  constructor() { }

  @Output() onChipClick = new EventEmitter<any>();

  _onChipClick(data: any) {
    if (!this.chipEnabled) return;  // Now checks boolean directly
    this.onChipClick.emit(data);
  }

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(obj: any): void {
    if (!this.multiSelect) {
      let v = this.options.find(o => o === obj)
      this.onChange(v ? v.Value : this.options[0].Value);
      return;
    }
    this.value = obj;
    this.onChange(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = (value) => {
      this.value = value;
      if (!this.multiSelect) {
        value = this.options.find((o) => o.Value === value);
      }
      fn(value);
    };
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void { }

  getLabel() {
    return this.options.find((v) => v.Value === this.value)?.Text;
  }
}
