import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormGroup} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {calendars} from "../../classes/calender-helper";

// https://material.angular.io/guide/creating-a-custom-form-field-control
export enum DateCalendar {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GREGORIAN = 'GREGORIAN',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JULIAN = 'JULIAN'
}

export enum DatePeriod {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BCE = 'BCE',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CE = 'CE'
}

export type DayRange = 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31;

export enum DateMonth {
  undefinedMonth,
  january,
  february,
  march,
  april,
  may,
  june,
  july,
  august,
  september,
  october,
  november,
  december
}



class DateValue {
  constructor(public calendar: DateCalendar,
              public yearStart: number,
              public monthStart: DateMonth,
              public dayStart: DayRange,
              public periodStart: DatePeriod,
              public yearEnd: number,
              public monthEnd: DateMonth,
              public dayEnd: DayRange,
              public periodEnd: DatePeriod) {
  }

  parseDateValueFromKnora(datestr: string): DateValue {
    let calendar = DateCalendar.GREGORIAN;
    const regex = '(GREGORIAN|JULIAN):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE)';
    const found = datestr.match(datestr);
    if (found) {
      switch(found[1]) {
        case DateCalendar.JULIAN: calendar = DateCalendar.JULIAN; break;
        case DateCalendar.GREGORIAN: calendar = DateCalendar.GREGORIAN; break;
        default: throw TypeError('Invalid calendar string: ' + found[1]);
      }
      const yearStart = parseInt(found[2], 10);
      const monthStart = parseInt(found[3], 10);
      const dayStart = parseInt(found[4], 10) as DayRange;
      let periodStart: DatePeriod;
      switch(found[5]) {
        case DatePeriod.BCE: periodStart = DatePeriod.BCE; break;
        case DatePeriod.CE: periodStart = DatePeriod.CE; break;
        default: throw TypeError('Invalid period string: ' + found[5]);
      }
      const yearEnd = parseInt(found[6], 10);
      const monthEnd = parseInt(found[7], 10);
      const dayEnd = parseInt(found[8], 10) as DayRange;
      let periodEnd: DatePeriod;
      switch(found[9]) {
        case DatePeriod.BCE: periodStart = DatePeriod.BCE; break;
        case DatePeriod.CE: periodStart = DatePeriod.CE; break;
        default: throw TypeError('Invalid period string: ' + found[1]);
      }
      return new DateValue(calendar, yearStart, monthStart, dayStart, periodStart, yearEnd, monthEnd, dayEnd, periodEnd);
    }
  }
}

@Component({
  selector: 'knora-date-value',
  template: `
    <div [formGroup]="parts" class="knora-string-input-container">
      <mat-select formControlName="calendar"
                  aria-label="Calendar"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let dispNode in calendarNames" [value]="dispNode">{{dispNode}}</mat-option>
      </mat-select>
      <mat-select formControlName="startPeriod"
                  aria-label="Period"
                  (selectionChange)="_handleInput()">
        <mat-option value="CE">BC</mat-option>
        <mat-option value="BCE">BCE</mat-option>
      </mat-select>
      <mat-select formControlName="startDay"
                  aria-label="Start day"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d in days" [value]="d">d</mat-option>
      </mat-select>
      <mat-select formControlName="startMonth"
                  aria-label="Start day"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d in months" [value]="d">d</mat-option>
      </mat-select>
      <input formControlName="startYear" aria-label="Start year" (input)="_handleInput()">
    </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: DateValueComponent}],
  styles: [
  ]
})

export class DateValueComponent
    implements ControlValueAccessor, MatFormFieldControl<DateValue>, OnDestroy, OnInit {
  @Input()
  valueLabel: string;
  calendarNames = ['GREGORIAN', 'JULIAN', 'JEWISH'];
  days = ['-', '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',
    '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
  months = ['-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];


  static nextId = 0;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'knora-date-value';
  id = `knora-date-value-${DateValueComponent.nextId++}`;
  describedBy = '';

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {value, comment}} = this.parts;
    return !value && !comment;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  @Input()
  get value(): KnoraStringVal | null {
    const {value: {value, comment}} = this.parts;
    return new KnoraStringVal(value, comment);
  }
  set value(knoraVal: KnoraStringVal | null) {
    const {value, comment} = knoraVal || new KnoraStringVal('', '');
    this.parts.setValue({value, comment});
    this.stateChanges.next();
  }


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }

  writeValue(knoraVal: KnoraListVal | null): void {
    this.value = knoraVal;
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.remove('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.remove('bg');
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.add('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.add('bg');
    }
  }

  _handleInput(): void {
    this.onChange(this.parts.value);
  }

}
