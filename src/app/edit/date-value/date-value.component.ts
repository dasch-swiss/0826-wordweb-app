import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {calendars} from '../../classes/calender-helper';
import {IBaseDateValue} from "@dasch-swiss/dsp-js/src/models/v2/resources/values/type-specific-interfaces/base-date-value";
import {KnoraService} from "../../services/knora.service";
import {FocusMonitor} from "@angular/cdk/a11y";

// https://material.angular.io/guide/creating-a-custom-form-field-control
export enum DateCalendar {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GREGORIAN = 'GREGORIAN',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JULIAN = 'JULIAN'
}

export enum DateEra {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BCE = 'BCE',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CE = 'CE'
}

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

export class DateValue {
  calendar: string;
  startDay: string;
  startMonth: string;
  startYear: string;
  startEra: string;
  endDay: string;
  endMonth: string;
  endYear: string;
  endEra: string;

  constructor(calendar?: string | undefined,
              startDay?: number | string | undefined,
              startMonth?: number | string | undefined,
              startYear?: number | string | undefined,
              startEra?: string | undefined,
              endDay?: number | string | undefined,
              endMonth?: number | string | undefined,
              endYear?: number | string | undefined,
              endEra?: string | undefined) {
    if (calendar === undefined) {
      this.calendar = 'GREGORIAN';
    } else {
      switch (calendar.toUpperCase()) {
        case 'JULIAN': this.calendar = 'JULIAN'; break;
        case 'GREGORIAN': this.calendar = 'GREGORIAN'; break;
        case 'JEWISH': this.calendar = 'JEWISH'; break;
        default: throw TypeError('Invalid calendar: ' + calendar);
      }
    }
    this.startDay = DateValue.getRange(startDay, 1, 31);
    this.startMonth = DateValue.getRange(startMonth, 1, 12);
    let sY = typeof startYear === 'string' ? parseInt(startYear, 10) : startYear;
    if ((sY === undefined) || isNaN(sY)) {
      const now = new Date();
      sY = now.getFullYear();
    }
    this.startYear = sY.toString(10);
    this.startEra = DateValue.getEra(startEra);
    this.endDay = DateValue.getRange(endDay, 1, 31);
    this.endMonth = DateValue.getRange(endMonth, 1, 12);
    let eY = typeof endYear === 'string' ? parseInt(endYear, 10) : endYear;
    if ((eY === undefined) || isNaN(eY)) {
      this.endYear = '';
    }
    else {
      this.endYear = sY.toString(10);
    }
    this.endEra = DateValue.getEra(endEra);
  }

  static parseDateValueFromKnora(datestr: string): DateValue {
    let calendar = DateCalendar.GREGORIAN;
    //const regex = '(GREGORIAN|JULIAN):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE)';
    const regex = '(GREGORIAN:|JULIAN:)?([0-9]{4})(-[0-9]{2})?(-[0-9]{2})?( BCE| CE)?(:[0-9]{4})?(-[0-9]{2})?(-[0-9]{2})?( BCE| CE)?';
    const found = datestr.match(datestr);
    if (found) {
      switch(found[1]) {
        case DateCalendar.JULIAN: calendar = DateCalendar.JULIAN; break;
        case DateCalendar.GREGORIAN: calendar = DateCalendar.GREGORIAN; break;
        case undefined: calendar = DateCalendar.GREGORIAN; break;
        default: throw TypeError('Invalid calendar string: ' + found[1]);
      }
      const startYear = typeof found[2] === 'string' ? parseInt(found[2], 10) : undefined;
      const startMonth = DateValue.getRange(found[3], 1, 12);
      const startDay = DateValue.getRange(found[4], 1, 31);
      const startEra = DateValue.getEra(found[5]);

      const endYear = typeof found[6] === 'string' ? parseInt(found[6], 10) : undefined;
      const endMonth = DateValue.getRange(found[7], 1, 12);
      const endDay = DateValue.getRange(found[8], 1, 31);
      const endEra = DateValue.getEra(found[9]);

      return new DateValue(calendar, startYear, startMonth, startDay, startEra, endYear, endMonth, endDay, endEra);
    }
  }

  private static getRange(value: number | string | undefined, from: number, to: number): string {
    if (value === undefined) {
      return '-';
    }
    let v: number;
    if (typeof value === 'string') {
      if (value === '-') {
        return '-';
      }
      v = parseInt(value, 10);
      if (isNaN(v)) {
        throw new TypeError('Invalid range: ' + value);
      }
    }
    else if (typeof value === 'number') {
      v = value;
    }
    if (v < from || v > to) {
      throw new TypeError('Invalid range: ' + value);
    }
    else {
      return v.toString(10);
    }
  }

  private static getEra(era: string | undefined): string {
    if (era === undefined) {
      return 'CE';
    }
    switch(era.toUpperCase()) {
      case 'CE': return 'CE';
      case 'BCE': return 'BCE';
      case 'BC': return 'BCE';
      case 'AD': return 'CE';
    }
    throw TypeError('Invalid era: ' + era);
  }

}

@Component({
  selector: 'knora-date-value',
  template: `
    <div [formGroup]="parts" class="knora-string-input-container">
      <mat-select matNativeControl
                  formControlName="calendar"
                  aria-label="Calendar"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let dispNode of calendarNames" [value]="dispNode">{{dispNode}}</mat-option>
      </mat-select>
      <br>
      <mat-select matNativeControl
                  formControlName="startDay"
                  aria-label="Start day"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d of days" [value]="d">{{d}}</mat-option>
      </mat-select>
      <mat-select matNativeControl
                  formControlName="startMonth"
                  aria-label="Start month"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d of months" [value]="d">{{d}}</mat-option>
      </mat-select>
      <input matInput formControlName="startYear" aria-label="Start year" (input)="_handleInput()">
      <mat-select matNativeControl
                  formControlName="startEra"
                  aria-label="Start era"
                  (selectionChange)="_handleInput()">
        <mat-option value="CE">BC</mat-option>
        <mat-option value="BCE">BCE</mat-option>
      </mat-select>
      <br>
      <mat-select matNativeControl
                  formControlName="endDay"
                  aria-label="End day"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d of days" [value]="d">{{d}}</mat-option>
      </mat-select>
      <mat-select matNativeControl
                  formControlName="endMonth"
                  aria-label="End month"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d of months" [value]="d">{{d}}</mat-option>
      </mat-select>
      <input matInput formControlName="endYear" aria-label="End year" (input)="_handleInput()">
      <mat-select matNativeControl
                  formControlName="endEra"
                  aria-label="End era"
                  (selectionChange)="_handleInput()">
        <mat-option value="CE">BC</mat-option>
        <mat-option value="BCE">BCE</mat-option>
      </mat-select>
    </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: DateValueComponent}],
  styles: [
    '.bg {background-color: lightgrey;}'
  ]
})

export class DateValueComponent
    implements ControlValueAccessor, MatFormFieldControl<DateValue>, OnDestroy, OnInit {
  static nextId = 0;

  @Input()
  valueLabel: string;
  calendarNames = ['GREGORIAN', 'JULIAN', 'JEWISH'];
  days = ['-', '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',
    '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
  months = ['-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

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
    console.log('--> empty()');
    const {value: {calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod}} = this.parts;
    return !startYear;
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
  get value(): DateValue | null {
    console.log('-->get value()');
    const {value: {calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod}} = this.parts;
    return new DateValue(calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod);
  }
  set value(knoraVal: DateValue | null) {
    console.log('-->value():1 ::', knoraVal);
    const now = new Date();
    console.log('-->value():2');
    const {calendar, startDay, startMonth, startYear, startEra, endDay, endMonth, endYear, endEra} = knoraVal ||
    new DateValue(DateCalendar.GREGORIAN,
        now.getFullYear(), now.getMonth() + 1, now.getDate(), 'CE',
        now.getFullYear(), now.getMonth() + 1, now.getDate(), 'CE');
    console.log('-->value():3 ::', startDay);
    this.parts.setValue({calendar, startDay, startMonth, startYear,
        startEra, endDay, endMonth, endYear, endEra});
    console.log('-->value():4');
    this.stateChanges.next();
  }

  constructor(private formBuilder: FormBuilder,
              private knoraService: KnoraService,
              private _focusMonitor: FocusMonitor,
              private _elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl: NgControl) {
    console.log('days:', this.days);
    this.parts = this.formBuilder.group({
      calendar: ['GREGORIAN', []],
      startDay: ['1', []],
      startMonth: ['1', []],
      startYear: ['2022', []],
      startEra: ['CE', []],
      endDay: '-',
      endMonth: '-',
      endYear: '',
      endEra: '-'
    });
    console.log('-->formBuilder.goup() ended')

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    console.log('-->ngOnInit()');
    if (!this.valueLabel) { this.valueLabel = 'Value'; }
    this.parts.controls.startDay.setValue('-');
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

  writeValue(knoraVal: DateValue | null): void {
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
    console.log('-->_handleInput()');
    this.onChange(this.parts.value);
  }

}
