import { Component, ElementRef, EventEmitter, forwardRef, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Calendar } from 'primeng/calendar';
import { ImportsModule } from '../../Imports/imports';

export const INLINE_CALENDAR_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineCalendarComponent),
  multi: true
};

@Component({
  selector: 'app-inline-calendar',
  templateUrl: './inline-calendar.component.html',
  styleUrls: ['./inline-calendar.component.scss'],
  standalone: true,
  imports: [ImportsModule],
  providers: [INLINE_CALENDAR_CONTROL_VALUE_ACCESSOR],
})
export class InlineCalendarComponent implements ControlValueAccessor, OnInit {
  date1: FormControl;

  @ViewChild(Calendar) private _calendar: Calendar;
  validInputMapping: Map<string, Date> = new Map<string, Date>();
  private onChange = (_: any) => { };
  private onTouched = () => { };
  DateFormat: string;

  date_value: any;
  current_value: any;

  @Output() onDatePicked = new EventEmitter<any>();
  hourFormat: string = 'hh:mm';

  constructor(private el: ElementRef) { }
  ngOnInit() {
    this.DateFormat = localStorage.getItem("DateFormat");
    this.date1 = new FormControl();

    this.setvalidInputSet();
    if (this._calendar) {
      const origOnInput = this._calendar.onUserInput;
      this._calendar.onUserInput = (event) => {
        this.onInput(event);
        origOnInput.call(this._calendar, event);
      };
    }
  }

  onSelect(event) {
    this.onDatePicked.emit(event);
    alert(event);
  }

  writeValue(value: any) {
    if (value) {
      this.date1.setValue(value);
    }
  }

  onYearDropdownChange(y: string) {
    alert();
  }

  setvalidInputSet() {
    const today: Date = new Date();
    this.validInputMapping.set('T', new Date());
    const tomorrow: Date = new Date();
    tomorrow.setDate(today.getDate() + 1);
    this.validInputMapping.set('W', tomorrow);
    const yesterday: Date = new Date();
    yesterday.setDate(today.getDate() - 1);
    this.validInputMapping.set('Y', yesterday);
  }
  private onInput(event) {
    if (this.validInputMapping.has(event.target.value)) {
      const mapValue = this.validInputMapping.get(event.target.value);
      this.date1.setValue(mapValue);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
    this._calendar.yearOptions.sort().reverse();
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
