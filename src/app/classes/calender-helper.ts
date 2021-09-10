//
// adapted from "http://www.fourmilab.ch/documents/calendar/"
//
// Please note the these functions originally assume that the gregorian  calender
// has a year 0. In PHP however, the gregorian year 0 does not exist!
//

export const calendars = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GREGORIAN: {name: 'Gregorian', n_months: 12},
    // eslint-disable-next-line @typescript-eslint/naming-convention
    JULIAN: {name: 'Julian', n_months: 12},
    // eslint-disable-next-line @typescript-eslint/naming-convention
    JEWISH: {name: 'Jewish', n_months: 13},
};

const J0000 = 1721424.5;                // Julian date of Gregorian epoch: 0000-01-01
const J1970 = 2440587.5;                // Julian date at Unix epoch: 1970-01-01
const JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
const J1900 = 2415020.5;                // Epoch (day 1) of Excel 1900 date system (PC)
const J1904 = 2416480.5;                // Epoch (day 0) of Excel 1904 date system (Mac)

const GREGORIAN_EPOCH = 1721425.5;
const JULIAN_EPOCH = 1721423.5;
const HEBREW_EPOCH = 347995.5;

const NormLeap = new Array('Normal year', 'Leap year');



export class CalenderHelper {
    calendarnames: string[]  = [];

    constructor() {
        this.calendarnames.push('ZERO');
        // eslint-disable-next-line guard-for-in
        for (const calname in calendars) {
            this.calendarnames.push(calname);
        }
    }

    //  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date


    // eslint-disable-next-line @typescript-eslint/naming-convention
    gregorian_to_jd(year: number | string, month: number | string, day: number | string) {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year);
        month = typeof(month) === 'number' ? Math.floor(month) : parseInt(month);
        day = typeof(day) === 'number' ? Math.floor(day) : parseInt(day);
        if (year < 0) year++; // correction for PHP
        return (GREGORIAN_EPOCH - 1) +
            (365 * (year - 1)) +
            Math.floor((year - 1) / 4) +
            (-Math.floor((year - 1) / 100)) +
            Math.floor((year - 1) / 400) +
            Math.floor((((367 * month) - 362) / 12) +
                ((month <= 2) ? 0 : (this.leap_gregorian(year) ? -1 : -2)) + day);
    }

    //  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day

    // eslint-disable-next-line @typescript-eslint/naming-convention
    jd_to_gregorian(jd: number | string): number[] {
        var dyindex;

        const jsd = typeof(jd) === 'number' ? Math.floor(jd) : parseInt(jd);
        const wjd = Math.floor(jsd - 0.5) + 0.5;
        const depoch = wjd - GREGORIAN_EPOCH;
        const quadricent = Math.floor(depoch / 146097);
        const dqc = this.mod(depoch, 146097);
        const cent = Math.floor(dqc / 36524);
        const dcent = this.mod(dqc, 36524);
        const quad = Math.floor(dcent / 1461);
        const dquad = this.mod(dcent, 1461);
        const yindex = Math.floor(dquad / 365);
        let year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
        if (!((cent === 4) || (yindex === 4))) {
            year++;
        }
        const yearday = wjd - this.gregorian_to_jd(year, 1, 1);
        const leapadj = ((wjd < this.gregorian_to_jd(year, 3, 1)) ? 0
                :
                (this.leap_gregorian(year) ? 1 : 2)
        );
        const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
        const day = (wjd - this.gregorian_to_jd(year, month, 1)) + 1;

        if (year <= 0) year--; // correction for PHPvar JULIAN_EPOCH = 1721423.5;

        return new Array(Math.round(year), Math.round(month), Math.round(day));
    }


    // eslint-disable-next-line @typescript-eslint/naming-convention
    leap_julian(year: number | string): boolean {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        return this.mod(year, 4) === ((year > 0) ? 0 : 3);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    julian_to_jd(year: number | string, month: number | string, day: number | string): number {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        month = typeof(month) === 'number' ? Math.floor(month) : parseInt(month, 10);
        day = typeof(day) === 'number' ? Math.floor(day) : parseInt(day, 10);

        /* Adjust negative common era years to the zero-based notation we use.  */

        if (year < 1) {
            year++;
        }

        /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */

        if (month <= 2) {
            year--;
            month += 12;
        }

        return ((Math.floor((365.25 * (year + 4716))) +
            Math.floor((30.6001 * (month + 1))) +
            day) - 1524.5);
    }

    //  JD_TO_JULIAN  --  Calculate Julian calendar date from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    jd_to_julian(td: number | string): number[] {
        let tdn = typeof(td) === 'number' ? Math.floor(td) : parseInt(td, 10); // we want integer!
        tdn += 0.5;
        const z = Math.floor(tdn);

        const a = z;
        const b = a + 1524;
        const c = Math.floor((b - 122.1) / 365.25);
        const d = Math.floor(365.25 * c);
        const e = Math.floor((b - d) / 30.6001);

        const month = Math.floor((e < 14) ? (e - 1) : (e - 13));
        let year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
        const day = b - d - Math.floor(30.6001 * e);

        /*  If year is less than 1, subtract one to convert from
            a zero based date system to the common era system in
            which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */

        if (year < 1) {
            year--;
        }

        return new Array(Math.round(year), Math.round(month), Math.round(day));
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    hebrew_year_months(year: number | string): number {
        year =  typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        return this.hebrew_leap(year) ? 13 : 12;
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    hebrew_year_days(year: number | string): number {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        return this.hebrew_to_jd(year + 1, 7, 1) - this.hebrew_to_jd(year, 7, 1);
    }

    //  How many days are in a given month of a given year

    // eslint-disable-next-line @typescript-eslint/naming-convention
    hebrew_month_days(year: number | string, month: number | string) {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        month = typeof(month) === 'number' ? Math.floor(month) : parseInt(month, 10);
        //  First of all, dispose of fixed-length 29 day months

        if (month === 2 || month === 4 || month === 6 ||
            month === 10 || month === 13) {
            return 29;
        }

        //  If it's not a leap year, Adar has 29 days

        if (month === 12 && !this.hebrew_leap(year)) {
            return 29;
        }

        //  If it's Heshvan, days depend on length of year

        if (month === 8 && !(this.mod(this.hebrew_year_days(year), 10) === 5)) {
            return 29;
        }

        //  Similarly, Kislev varies with the length of year

        if (month === 9 && (this.mod(this.hebrew_year_days(year), 10) === 3)) {
            return 29;
        }

        //  Nope, it's a 30 day month

        return 30;
    }

    //  Finally, wrap it all up into...

    // eslint-disable-next-line @typescript-eslint/naming-convention
    hebrew_to_jd(year: number | string, month: number | string, day: number | string): number {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        month = typeof(month) === 'number' ? Math.floor(month) : parseInt(month, 10);
        day = typeof(day) === 'number' ? Math.floor(day) : parseInt(day, 10);

        let mon;
        const months = this.hebrew_year_months(year);
        let jd = HEBREW_EPOCH + this.hebrew_delay_1(year) +
            this.hebrew_delay_2(year) + day + 1;

        if (month < 7) {
            for (mon = 7; mon <= months; mon++) {
                jd += this.hebrew_month_days(year, mon);
            }
            for (mon = 1; mon < month; mon++) {
                jd += this.hebrew_month_days(year, mon);
            }
        } else {
            for (mon = 7; mon < month; mon++) {
                jd += this.hebrew_month_days(year, mon);
            }
        }

        return jd;
    }

    /*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                          This works by making multiple calls to
                          the inverse function, and is this very
                          slow.  */

    jd_to_hebrew(jd: number |string): number[] {
        jd = typeof(jd) === 'number' ? Math.floor(jd) : parseInt(jd, 10);

        jd = Math.floor(jd) + 0.5;
        const count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
        let year = count - 1;
        for (let i = count; jd >= this.hebrew_to_jd(i, 7, 1); i++) {
            year++;
        }
        const first = (jd < this.hebrew_to_jd(year, 1, 1)) ? 7 : 1;
        let month = first;
        for (let i = first; jd > this.hebrew_to_jd(year, i, this.hebrew_month_days(year, i)); i++) {
            month++;
        }
        const day = (jd - this.hebrew_to_jd(year, month, 1)); // + 1;
        return new Array(Math.round(year), Math.round(month), Math.round(day));
    }

    daycnt(cal: string, year: number | string, month: number | string): {days: number; weekday_first: number} {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        month = typeof(month) === 'number' ? Math.floor(month) : parseInt(month, 10);

        let dc1: number;
        let dc2: number;
        let days: number;

        switch (cal) {
            case 'GREGORIAN':
            case 'gregorian': {
                dc1 = Math.round(this.gregorian_to_jd(year, month, 1));
                if ((month + 1) > calendars[cal].n_months) {
                    month = 1;
                    year++;
                    dc2 = Math.round(this.gregorian_to_jd(year, month, 1));
                }
                else {
                    dc2 = Math.round(this.gregorian_to_jd(year, month + 1, 1));
                }
                days = dc2 - dc1;
                break;
            }
            case 'JULIAN':
            case 'julian': {
                dc1 = Math.round(this.julian_to_jd(year, month, 1));
                if ((month + 1) > calendars[cal].n_months) {
                    month = 1;
                    year++;
                    dc2 = Math.round(this.julian_to_jd(year, month, 1));
                }
                else {
                    dc2 = Math.round(this.julian_to_jd(year, month + 1, 1));
                }
                days = dc2 - dc1;
                break;
            }
            case 'JEWISH':
            case 'jewish': {
                dc1 = Math.round(this.hebrew_to_jd(year, month, 1));
                if ((month + 1) > calendars[cal].n_months) {
                    month = 1;
                    year++;
                    dc2 = Math.round(this.hebrew_to_jd(year, month, 1));
                }
                else {
                    dc2 = Math.round(this.hebrew_to_jd(year, month + 1, 1));
                }
                days = dc2 - dc1;
                break;
            }
            default:
                throw TypeError('Unkown calendar: ' + cal);
        }
        return {
            days: days,
            weekday_first: this.jwday(dc1)
        }
    }

    jdc_to_date(jdc: number | string, cal: string): {year: number; month: number; day: number; weekday: number} {
        jdc = typeof(jdc) === 'number' ? Math.floor(jdc) : parseInt(jdc, 10);
        let tmparr: number[];
        switch (cal) {
            case 'GREGORIAN':
            case 'gregorian': {
                tmparr = this.jd_to_gregorian(jdc);
                break;
            }
            case 'JULIAN':
            case 'julian': {
                tmparr = this.jd_to_julian(jdc);
                break;
            }
            case 'JEWISH':
            case 'jewish': {
                tmparr = this.jd_to_hebrew(jdc);
                break;
            }
            default:
                throw TypeError('Unkown calendar: ' + cal);
        }

        return {year: tmparr[0], month: tmparr[1], day:tmparr[2], weekday: this.jwday(jdc)}
    }

    date_to_jdc(day, month, year, cal, periodpart) {
        let jdc = 0;

        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        month = typeof(month) === 'number' ? Math.floor(month) : parseInt(month, 10);
        day = typeof(day) === 'number' ? Math.floor(day) : parseInt(day, 10);

        if (periodpart === 'END') {
            if (month === 0) month = calendars[cal].n_months;
            if (day === 0) {
                const tmp = this.daycnt(cal, year, month);
                day = tmp.days;
            }
        }
        else {
            if (month === 0) month = 1;
            if (day === 0) day = 1;
        }

        switch (cal) {
            case 'GREGORIAN':
            case 'gregorian': {
                jdc = Math.round(this.gregorian_to_jd(year, month, day));
                break;
            }
            case 'JULIAN':
            case 'julian': {
                jdc = Math.round(this.julian_to_jd(year, month, day));
                break;
            }
            case 'JEWISH':
            case 'jewish': {
                jdc = Math.round(this.hebrew_to_jd(year, month, day));
                break;
            }
            default:
                throw TypeError('Unkown calendar: ' + cal);
        }
        return jdc;
    }


// ----- private -----

    private mod(a: number, b: number): number {
        return a - (b * Math.floor(a / b))
    };

    private jwday(j: number | string): number {
        j = typeof(j) === 'number' ? j as number: Number(j);
        return this.mod(Math.floor((j + 1.5)), 7);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private leap_gregorian(year: number | string): boolean {
        year =  typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        return ((year % 4) === 0) && (!(((year % 100) === 0) && ((year % 400) !== 0)));
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private hebrew_leap(year: number | string ): boolean {
        year =  typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);
        return this.mod(((year * 7) + 1), 19) < 7;
    };

    //  How many months are there in a Hebrew year (12 = normal, 13 = leap)

    //  Test for delay of start of new year and to avoid
    //  Sunday, Wednesday, and Friday as start of the new year.

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private hebrew_delay_1(year: number | string): number {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);

        const months = Math.floor(((235 * year) - 234) / 19);
        const parts = 12084 + (13753 * months);
        let day = (months * 29) + Math.floor(parts / 25920);

        if (this.mod((3 * (day + 1)), 7) < 3) {
            day++;
        }
        return day;
    };

    //  Check for delay in start of new year due to length of adjacent years

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private  hebrew_delay_2(year: number | string): number {
        year = typeof(year) === 'number' ? Math.floor(year) : parseInt(year, 10);

        const last = this.hebrew_delay_1(year - 1);
        const present = this.hebrew_delay_1(year);
        const next = this.hebrew_delay_1(year + 1);

        return ((next - present) === 356) ? 2 :
            (((present - last) === 382) ? 1 : 0);
    };

    //  How many days are in a Hebrew year ?




}
