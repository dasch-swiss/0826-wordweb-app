import { Component, OnInit } from '@angular/core';

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
  octobre,
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
      const monthStart = DateMonth[parseInt(found[3], 10)];
      const dayStart = parseInt(found[4], 10);
      let periodStart: DatePeriod;
      switch(found[5]) {
        case DatePeriod.BCE: periodStart = DatePeriod.BCE; break;
        case DatePeriod.CE: periodStart = DatePeriod.CE; break;
        default: throw TypeError('Invalid period string: ' + found[5]);
      }
      const yearEnd = parseInt(found[6], 10);
      const monthEnd = DateMonth[parseInt(found[7], 10)];
      const dayEnd = parseInt(found[8], 10);
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
  selector: 'app-date-value',
  template: `
    <p>
      date-value works!
    </p>
  `,
  styles: [
  ]
})
export class DateValueComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
