export enum DateCalendar {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    GREGORIAN = 'GREGORIAN',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    JULIAN = 'JULIAN',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    JEWISH = 'JEWISH',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ISLAMIC = 'ISLAMIC'
}

export class Calendar {
    /*
       JavaScript functions for the Fourmilab Calendar Converter

                  by John Walker  --  September, MIM
              http://www.fourmilab.ch/documents/calendar/

                This program is in the public domain.
*/

    /*  You may notice that a variety of array variables logically local
        to functions are declared globally here.  In JavaScript, construction
        of an array variable from source code occurs as the code is
        interpreted.  Making these variables pseudo-globals permits us
        to avoid overhead constructing and disposing of them in each
        call on the function in which whey are used.  */

    // public static jd_to_gregorian(jd: number): number[]
    // public static iso_to_julian(year: number, week: number, day: number): number
    // public static jd_to_iso(jd: number): number[]
    // public static jd_to_iso_day(jd: number): number[]
    // public static julian_to_jd(year: number, month: number, day: number): number
    // public static jd_to_julian(td: number): number[]
    // public static hebrew_year_months(year: number): number
    // public static hebrew_month_days(year: number, month: number)
    // public static hebrew_to_jd(year: number, month: number, day: number): number
    // public static jd_to_hebrew(jd: number): number[]
    // public static jd_to_french_revolutionary(jd: number): number[]
    // public static french_revolutionary_to_jd(an: number, mois: number, decade: number, jour: number): number
    // public static islamic_to_jd(year: number, month: number, day: number): number
    // public static jd_to_islamic(jd: number): number[]
    // public static jd_to_persiana(jd: number): number[]
    // public static persiana_to_jd(year: number, month: number, day: number): number
    // public static persian_to_jd(year: number, month: number, day: number): number
    // public static jd_to_persian(jd: number): number[]
    // public static mayan_count_to_jd(baktun: number, katun: number, tun: number, uinal: number, kin: number)
    // public static jd_to_mayan_count(jd: number): number[
    // public static jd_to_mayan_haab(jd: number): number[]
    // public static jd_to_mayan_tzolkin(jd: number): number[]
    // public static indian_civil_to_jd(year: number, month: number, day: number): number
    // public static jd_to_indian_civil(jd: number): number[] {
    //

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly ISLAMIC_WEEKDAYS = ['al-\'ahad', 'al-\'ithnayn', 'ath-thalatha\'', 'al-\'arb`a\'',
        'al-khamis', 'al-jum`a', 'as-sabt'];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly PERSIAN_WEEKDAYS = ['Yekshanbeh', 'Doshanbeh',
        'Seshhanbeh', 'Chaharshanbeh',
        'Panjshanbeh', 'Jomeh', 'Shanbeh'];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly MAYAN_HAAB_MONTHS = ['Pop', 'Uo', 'Zip', 'Zotz', 'Tzec', 'Xul',
        'Yaxkin', 'Mol', 'Chen', 'Yax', 'Zac', 'Ceh',
        'Mac', 'Kankin', 'Muan', 'Pax', 'Kayab', 'Cumku', 'Uayeb'];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly MAYAN_TZOLKIN_MONTHS = ['Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan',
        'Cimi', 'Manik', 'Lamat', 'Muluc', 'Oc',
        'Chuen', 'Eb', 'Ben', 'Ix', 'Men',
        'Cib', 'Caban', 'Etznab', 'Cauac', 'Ahau'];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly INDIAN_CIVIL_WEEKDAYS = ['ravivara', 'somavara', 'mangalavara', 'budhavara',
        'brahaspativara', 'sukravara', 'sanivara'];


    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly J0000 = 1721424.5;                // Julian date of Gregorian epoch: 0000-01-01
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly J1970 = 2440587.5;                // Julian date at Unix epoch: 1970-01-01
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly J1900 = 2415020.5;                // Epoch (day 1) of Excel 1900 date system (PC)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly J1904 = 2416480.5;                // Epoch (day 0) of Excel 1904 date system (Mac)

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly J2000             = 2451545.0;              // Julian day of J2000 epoch
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly JulianCentury     = 36525.0;                // Days in Julian century
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly JulianMillennium  = (Calendar.JulianCentury * 10);   // Days in Julian millennium
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly AstronomicalUnit  = 149597870.0;            // Astronomical unit in kilometres
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly TropicalYear      = 365.24219878;           // Mean solar tropical year

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly  GREGORIAN_EPOCH = 1721425.5;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly JULIAN_EPOCH = 1721423.5;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly  HEBREW_EPOCH = 347995.5;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly FRENCH_REVOLUTIONARY_EPOCH = 2375839.5;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly ISLAMIC_EPOCH = 1948439.5;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly PERSIAN_EPOCH = 1948320.5;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly MAYAN_COUNT_EPOCH = 584282.5;


    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly EquinoxpTerms = [
        485, 324.96,   1934.136,
        203, 337.23,  32964.467,
        199, 342.08,     20.186,
        182,  27.85, 445267.112,
        156,  73.14,  45036.886,
        136, 171.52,  22518.443,
        77, 222.54,  65928.934,
        74, 296.72,   3034.906,
        70, 243.58,   9037.513,
        58, 119.81,  33718.147,
        52, 297.17,    150.678,
        50,  21.02,   2281.226,
        45, 247.54,  29929.562,
        44, 325.15,  31555.956,
        29,  60.93,   4443.417,
        18, 155.12,  67555.328,
        17, 288.79,   4562.452,
        16, 198.04,  62894.029,
        14, 199.76,  31436.921,
        12,  95.39,  14577.848,
        12, 287.11,  31931.756,
        12, 320.81,  34777.259,
        9, 227.73,   1222.114,
        8,  15.45,  16859.074
    ];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly JDE0tab1000 = [
        [1721139.29189, 365242.13740,  0.06134,  0.00111, -0.00071],
        [1721233.25401, 365241.72562, -0.05323,  0.00907,  0.00025],
        [1721325.70455, 365242.49558, -0.11677, -0.00297,  0.00074],
        [1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006]
    ];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static readonly JDE0tab2000 = [
        [2451623.80984, 365242.37404,  0.05169, -0.00411, -0.00057],
        [2451716.56767, 365241.62603,  0.00325,  0.00888, -0.00030],
        [2451810.21715, 365242.01767, -0.11575,  0.00337,  0.00078],
        [2451900.05952, 365242.74049, -0.06223, -0.00823,  0.00032]
    ];

    private static readonly oterms = [
        -4680.93,
        -1.55,
        1999.25,
        -51.38,
        -249.67,
        -39.05,
        7.12,
        27.87,
        5.79,
        2.45
    ];

    /* Periodic terms for nutation in longiude (delta \Psi) and
   obliquity (delta \Epsilon) as given in table 21.A of
   Meeus, "Astronomical Algorithms", first edition. */

    private static readonly nutArgMult = [
        0,  0,  0,  0,  1,
        -2,  0,  0,  2,  2,
        0,  0,  0,  2,  2,
        0,  0,  0,  0,  2,
        0,  1,  0,  0,  0,
        0,  0,  1,  0,  0,
        -2,  1,  0,  2,  2,
        0,  0,  0,  2,  1,
        0,  0,  1,  2,  2,
        -2, -1,  0,  2,  2,
        -2,  0,  1,  0,  0,
        -2,  0,  0,  2,  1,
        0,  0, -1,  2,  2,
        2,  0,  0,  0,  0,
        0,  0,  1,  0,  1,
        2,  0, -1,  2,  2,
        0,  0, -1,  0,  1,
        0,  0,  1,  2,  1,
        -2,  0,  2,  0,  0,
        0,  0, -2,  2,  1,
        2,  0,  0,  2,  2,
        0,  0,  2,  2,  2,
        0,  0,  2,  0,  0,
        -2,  0,  1,  2,  2,
        0,  0,  0,  2,  0,
        -2,  0,  0,  2,  0,
        0,  0, -1,  2,  1,
        0,  2,  0,  0,  0,
        2,  0, -1,  0,  1,
        -2,  2,  0,  2,  2,
        0,  1,  0,  0,  1,
        -2,  0,  1,  0,  1,
        0, -1,  0,  0,  1,
        0,  0,  2, -2,  0,
        2,  0, -1,  2,  1,
        2,  0,  1,  2,  2,
        0,  1,  0,  2,  2,
        -2,  1,  1,  0,  0,
        0, -1,  0,  2,  2,
        2,  0,  0,  2,  1,
        2,  0,  1,  0,  0,
        -2,  0,  2,  2,  2,
        -2,  0,  1,  2,  1,
        2,  0, -2,  0,  1,
        2,  0,  0,  0,  1,
        0, -1,  1,  0,  0,
        -2, -1,  0,  2,  1,
        -2,  0,  0,  0,  1,
        0,  0,  2,  2,  1,
        -2,  0,  2,  0,  1,
        -2,  1,  0,  2,  1,
        0,  0,  1, -2,  0,
        -1,  0,  1,  0,  0,
        -2,  1,  0,  0,  0,
        1,  0,  0,  0,  0,
        0,  0,  1,  2,  0,
        -1, -1,  1,  0,  0,
        0,  1,  1,  0,  0,
        0, -1,  1,  2,  2,
        2, -1, -1,  2,  2,
        0,  0, -2,  2,  2,
        0,  0,  3,  2,  2,
        2, -1,  0,  2,  2
    ];

    private static readonly nutArgCoeff = [
        -171996,   -1742,   92095,      89,          /*  0,  0,  0,  0,  1 */
        -13187,     -16,    5736,     -31,          /* -2,  0,  0,  2,  2 */
        -2274,      -2,     977,      -5,          /*  0,  0,  0,  2,  2 */
        2062,       2,    -895,       5,          /*  0,  0,  0,  0,  2 */
        1426,     -34,      54,      -1,          /*  0,  1,  0,  0,  0 */
        712,       1,      -7,       0,          /*  0,  0,  1,  0,  0 */
        -517,      12,     224,      -6,          /* -2,  1,  0,  2,  2 */
        -386,      -4,     200,       0,          /*  0,  0,  0,  2,  1 */
        -301,       0,     129,      -1,          /*  0,  0,  1,  2,  2 */
        217,      -5,     -95,       3,          /* -2, -1,  0,  2,  2 */
        -158,       0,       0,       0,          /* -2,  0,  1,  0,  0 */
        129,       1,     -70,       0,          /* -2,  0,  0,  2,  1 */
        123,       0,     -53,       0,          /*  0,  0, -1,  2,  2 */
        63,       0,       0,       0,          /*  2,  0,  0,  0,  0 */
        63,       1,     -33,       0,          /*  0,  0,  1,  0,  1 */
        -59,       0,      26,       0,          /*  2,  0, -1,  2,  2 */
        -58,      -1,      32,       0,          /*  0,  0, -1,  0,  1 */
        -51,       0,      27,       0,          /*  0,  0,  1,  2,  1 */
        48,       0,       0,       0,          /* -2,  0,  2,  0,  0 */
        46,       0,     -24,       0,          /*  0,  0, -2,  2,  1 */
        -38,       0,      16,       0,          /*  2,  0,  0,  2,  2 */
        -31,       0,      13,       0,          /*  0,  0,  2,  2,  2 */
        29,       0,       0,       0,          /*  0,  0,  2,  0,  0 */
        29,       0,     -12,       0,          /* -2,  0,  1,  2,  2 */
        26,       0,       0,       0,          /*  0,  0,  0,  2,  0 */
        -22,       0,       0,       0,          /* -2,  0,  0,  2,  0 */
        21,       0,     -10,       0,          /*  0,  0, -1,  2,  1 */
        17,      -1,       0,       0,          /*  0,  2,  0,  0,  0 */
        16,       0,      -8,       0,          /*  2,  0, -1,  0,  1 */
        -16,       1,       7,       0,          /* -2,  2,  0,  2,  2 */
        -15,       0,       9,       0,          /*  0,  1,  0,  0,  1 */
        -13,       0,       7,       0,          /* -2,  0,  1,  0,  1 */
        -12,       0,       6,       0,          /*  0, -1,  0,  0,  1 */
        11,       0,       0,       0,          /*  0,  0,  2, -2,  0 */
        -10,       0,       5,       0,          /*  2,  0, -1,  2,  1 */
        -8,       0,       3,       0,          /*  2,  0,  1,  2,  2 */
        7,       0,      -3,       0,          /*  0,  1,  0,  2,  2 */
        -7,       0,       0,       0,          /* -2,  1,  1,  0,  0 */
        -7,       0,       3,       0,          /*  0, -1,  0,  2,  2 */
        -7,       0,       3,       0,          /*  2,  0,  0,  2,  1 */
        6,       0,       0,       0,          /*  2,  0,  1,  0,  0 */
        6,       0,      -3,       0,          /* -2,  0,  2,  2,  2 */
        6,       0,      -3,       0,          /* -2,  0,  1,  2,  1 */
        -6,       0,       3,       0,          /*  2,  0, -2,  0,  1 */
        -6,       0,       3,       0,          /*  2,  0,  0,  0,  1 */
        5,       0,       0,       0,          /*  0, -1,  1,  0,  0 */
        -5,       0,       3,       0,          /* -2, -1,  0,  2,  1 */
        -5,       0,       3,       0,          /* -2,  0,  0,  0,  1 */
        -5,       0,       3,       0,          /*  0,  0,  2,  2,  1 */
        4,       0,       0,       0,          /* -2,  0,  2,  0,  1 */
        4,       0,       0,       0,          /* -2,  1,  0,  2,  1 */
        4,       0,       0,       0,          /*  0,  0,  1, -2,  0 */
        -4,       0,       0,       0,          /* -1,  0,  1,  0,  0 */
        -4,       0,       0,       0,          /* -2,  1,  0,  0,  0 */
        -4,       0,       0,       0,          /*  1,  0,  0,  0,  0 */
        3,       0,       0,       0,          /*  0,  0,  1,  2,  0 */
        -3,       0,       0,       0,          /* -1, -1,  1,  0,  0 */
        -3,       0,       0,       0,          /*  0,  1,  1,  0,  0 */
        -3,       0,       0,       0,          /*  0, -1,  1,  2,  2 */
        -3,       0,       0,       0,          /*  2, -1, -1,  2,  2 */
        -3,       0,       0,       0,          /*  0,  0, -2,  2,  2 */
        -3,       0,       0,       0,          /*  0,  0,  3,  2,  2 */
        -3,       0,       0,       0           /*  2, -1,  0,  2,  2 */
    ];

    /*  Table of observed Delta T values at the beginning of
    even numbered years from 1620 through 2002.  */

    private static readonly deltaTtab = [
        121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46,
        44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12,
        11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10,
        10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13,
        13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16,
        16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12,
        11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6,
        5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7,
        1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6,
        -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16,
        18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7,
        24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2,
        33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5,
        52.2, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 65, 66.6
    ];

    //=============================================================================================

    //  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static gregorian_to_jd(year: number, month: number, day: number): number {
        return (Calendar.GREGORIAN_EPOCH - 1) +
            (365 * (year - 1)) +
            Math.floor((year - 1) / 4) +
            (-Math.floor((year - 1) / 100)) +
            Math.floor((year - 1) / 400) +
            Math.floor((((367 * month) - 362) / 12) +
                ((month <= 2) ? 0 :
                        (Calendar.leap_gregorian(year) ? -1 : -2)
                ) +
                day);
    }

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_gregorian(jd: number): number[] {
        const wjd = Math.floor(jd - 0.5) + 0.5;
        const depoch = wjd - Calendar.GREGORIAN_EPOCH;
        const quadricent = Math.floor(depoch / 146097);
        const dqc = Calendar.mod(depoch, 146097);
        const cent = Math.floor(dqc / 36524);
        const dcent = Calendar.mod(dqc, 36524);
        const quad = Math.floor(dcent / 1461);
        const dquad = Calendar.mod(dcent, 1461);
        const yindex = Math.floor(dquad / 365);
        let year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
        if (!((cent === 4) || (yindex === 4))) {
            year++;
        }
        const yearday = wjd - Calendar.gregorian_to_jd(year, 1, 1);
        const leapadj = ((wjd < Calendar.gregorian_to_jd(year, 3, 1)) ? 0
                :
                (Calendar.leap_gregorian(year) ? 1 : 2)
        );
        const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
        const day = (wjd - Calendar.gregorian_to_jd(year, month, 1)) + 1;

        return [year, month, day];
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static iso_to_julian(year: number, week: number, day: number): number {
        return day + Calendar.n_weeks(0, Calendar.gregorian_to_jd(year - 1, 12, 28), week);
    }

//  JD_TO_ISO  --  Return array of ISO (year, week, day) for Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_iso(jd: number): number[] {
        let year = Calendar.jd_to_gregorian(jd - 3)[0];
        if (jd >= Calendar.iso_to_julian(year + 1, 1, 1)) {
            year++;
        }
        const week = Math.floor((jd - Calendar.iso_to_julian(year, 1, 1)) / 7) + 1;
        let day = Calendar.jwday(jd);
        if (day === 0) {
            day = 7;
        }
        return [year, week, day];
    }

    //  ISO_DAY_TO_JULIAN  --  Return Julian day of given ISO year, and day of year
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static iso_day_to_julian(year: number, day: number): number {
        return (day - 1) + Calendar.gregorian_to_jd(year, 1, 1);
    }

//  JD_TO_ISO_DAY  --  Return array of ISO (year, day_of_year) for Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_iso_day(jd: number): number[] {
        const year = Calendar.jd_to_gregorian(jd)[0];
        const day = Math.floor(jd - Calendar.gregorian_to_jd(year, 1, 1)) + 1;
        return [year, day];
    }

//  JULIAN_TO_JD  --  Determine Julian day number from Julian calendar date

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static julian_to_jd(year: number, month: number, day: number): number {

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
    public static jd_to_julian(td: number): number[] {
        td += 0.5;

        const a = Math.floor(td);
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

        return [year, month, day];
    }

    //  How many months are there in a Hebrew year (12 = normal, 13 = leap)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static hebrew_year_months(year: number): number {
        return Calendar.hebrew_leap(year) ? 13 : 12;
    }

//  How many days are in a given month of a given year
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static hebrew_month_days(year: number, month: number) {
        //  First of all, dispose of fixed-length 29 day months

        if (month === 2 || month === 4 || month === 6 ||
            month === 10 || month === 13) {
            return 29;
        }

        //  If it's not a leap year, Adar has 29 days

        if (month === 12 && !Calendar.hebrew_leap(year)) {
            return 29;
        }

        //  If it's Heshvan, days depend on length of year

        if (month === 8 && !(Calendar.mod(Calendar.hebrew_year_days(year), 10) === 5)) {
            return 29;
        }

        //  Similarly, Kislev varies with the length of year

        if (month === 9 && (Calendar.mod(Calendar.hebrew_year_days(year), 10) === 3)) {
            return 29;
        }

        //  Nope, it's a 30 day month

        return 30;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static hebrew_to_jd(year: number, month: number, day: number): number {
        let mon: number;

        const months = Calendar.hebrew_year_months(year);
        let jd = Calendar.HEBREW_EPOCH + Calendar.hebrew_delay_1(year) +
            Calendar.hebrew_delay_2(year) + day + 1;

        if (month < 7) {
            for (mon = 7; mon <= months; mon++) {
                jd += Calendar.hebrew_month_days(year, mon);
            }
            for (mon = 1; mon < month; mon++) {
                jd += Calendar.hebrew_month_days(year, mon);
            }
        } else {
            for (mon = 7; mon < month; mon++) {
                jd += Calendar.hebrew_month_days(year, mon);
            }
        }

        return jd;
    }

    /*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
                          This works by making multiple calls to
                          the inverse function, and is this very
                          slow.  */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_hebrew(jd: number): number[] {
        jd = Math.floor(jd) + 0.5;
        const count = Math.floor(((jd - Calendar.HEBREW_EPOCH) * 98496.0) / 35975351.0);
        let year = count - 1;
        for (let i = count; jd >= Calendar.hebrew_to_jd(i, 7, 1); i++) {
            year++;
        }
        const first = (jd < Calendar.hebrew_to_jd(year, 1, 1)) ? 7 : 1;
        let month = first;
        for (let i = first; jd > Calendar.hebrew_to_jd(year, i, Calendar.hebrew_month_days(year, i)); i++) {
            month++;
        }
        const day = (jd - Calendar.hebrew_to_jd(year, month, 1)) + 1;
        return [year, month, day];
    }

    /*  JD_TO_FRENCH_REVOLUTIONARY  --  Calculate date in the French Revolutionary
                                    calendar from Julian day.  The five or six
                                    "sansculottides" are considered a thirteenth
                                    month in the results of this function.  */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_french_revolutionary(jd: number): number[] {
        jd = Math.floor(jd) + 0.5;
        const adr = Calendar.annee_da_la_revolution(jd);
        const an = adr[0];
        const equinoxe = adr[1];
        const mois = Math.floor((jd - equinoxe) / 30) + 1;
        let jour = (jd - equinoxe) % 30;
        const decade = Math.floor(jour / 10) + 1;
        jour = (jour % 10) + 1;

        return [an, mois, decade, jour];
    }

    /*  FRENCH_REVOLUTIONARY_TO_JD  --  Obtain Julian day from a given French
                                        Revolutionary calendar date.  */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static french_revolutionary_to_jd(an: number, mois: number, decade: number, jour: number): number {
        let guess = Calendar.FRENCH_REVOLUTIONARY_EPOCH + (Calendar.TropicalYear * ((an - 1) - 1));
        let adr = [an - 1, 0];

        while (adr[0] < an) {
            adr = Calendar.annee_da_la_revolution(guess);
            guess = adr[1] + (Calendar.TropicalYear + 2);
        }
        const equinoxe = adr[1];

        return equinoxe + (30 * (mois - 1)) + (10 * (decade - 1)) + (jour - 1);
    }

//  ISLAMIC_TO_JD  --  Determine Julian day from Islamic date
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static islamic_to_jd(year: number, month: number, day: number): number {
        return (day +
            Math.ceil(29.5 * (month - 1)) +
            (year - 1) * 354 +
            Math.floor((3 + (11 * year)) / 30) +
            Calendar.ISLAMIC_EPOCH) - 1;
    }

//  JD_TO_ISLAMIC  --  Calculate Islamic date from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_islamic(jd: number): number[] {
        jd = Math.floor(jd) + 0.5;
        const year = Math.floor(((30 * (jd - Calendar.ISLAMIC_EPOCH)) + 10646) / 10631);
        const month = Math.min(12,
            Math.ceil((jd - (29 + Calendar.islamic_to_jd(year, 1, 1))) / 29.5) + 1);
        const day = (jd - Calendar.islamic_to_jd(year, month, 1)) + 1;
        return [year, month, day];
    }

    /*  JD_TO_PERSIANA  --  Calculate date in the Persian astronomical
                        calendar from Julian day.  */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_persiana(jd: number): number[] {

        jd = Math.floor(jd) + 0.5;
        const adr = Calendar.persiana_year(jd);
        const year = adr[0];
        const yday = (Math.floor(jd) - Calendar.persiana_to_jd(year, 1, 1)) + 1;
        const month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
        const day = (Math.floor(jd) - Calendar.persiana_to_jd(year, month, 1)) + 1;

        return [year, month, day];
    }

    /*  PERSIANA_TO_JD  --  Obtain Julian day from a given Persian
                            astronomical calendar date.  */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static persiana_to_jd(year: number, month: number, day: number): number {
        let guess = (Calendar.PERSIAN_EPOCH - 1) + (Calendar.TropicalYear * ((year - 1) - 1));
        let adr = [year - 1, 0];

        while (adr[0] < year) {
            adr = Calendar.persiana_year(guess);
            guess = adr[1] + (Calendar.TropicalYear + 2);
        }
        const equinox = adr[1];

        return equinox +
            ((month <= 7) ?
                    ((month - 1) * 31) :
                    (((month - 1) * 30) + 6)
            ) +
            (day - 1);
    }

    //  PERSIAN_TO_JD  --  Determine Julian day from Persian date
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static persian_to_jd(year: number, month: number, day: number): number
    {
        const epbase = year - ((year >= 0) ? 474 : 473);
        const epyear = 474 + Calendar.mod(epbase, 2820);

        return day +
            ((month <= 7) ?
                    ((month - 1) * 31) :
                    (((month - 1) * 30) + 6)
            ) +
            Math.floor(((epyear * 682) - 110) / 2816) + (epyear - 1) * 365 +
            Math.floor(epbase / 2820) * 1029983 + (Calendar.PERSIAN_EPOCH - 1);
    }

//  JD_TO_PERSIAN  --  Calculate Persian date from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_persian(jd: number): number[] {
        jd = Math.floor(jd) + 0.5;

        const depoch = jd - Calendar.persian_to_jd(475, 1, 1);
        const cycle = Math.floor(depoch / 1029983);
        const cyear = Calendar.mod(depoch, 1029983);
        let ycycle: number;
        if (cyear === 1029982) {
            ycycle = 2820;
        } else {
            const aux1 = Math.floor(cyear / 366);
            const aux2 = Calendar.mod(cyear, 366);
            ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) +
                aux1 + 1;
        }
        let year = ycycle + (2820 * cycle) + 474;
        if (year <= 0) {
            year--;
        }
        const yday = (jd - Calendar.persian_to_jd(year, 1, 1)) + 1;
        const month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
        const day = (jd - Calendar.persian_to_jd(year, month, 1)) + 1;
        return [year, month, day];
    }

    //  MAYAN_COUNT_TO_JD  --  Determine Julian day from Mayan long count
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static mayan_count_to_jd(baktun: number, katun: number, tun: number, uinal: number, kin: number) {
        return Calendar.MAYAN_COUNT_EPOCH +
            (baktun * 144000) +
            (katun  *   7200) +
            (tun    *    360) +
            (uinal  *     20) +
            kin;
    }

//  JD_TO_MAYAN_COUNT  --  Calculate Mayan long count from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_mayan_count(jd: number): number[] {
        jd = Math.floor(jd) + 0.5;
        let d = jd - Calendar.MAYAN_COUNT_EPOCH;
        const baktun = Math.floor(d / 144000);
        d = Calendar.mod(d, 144000);
        const katun = Math.floor(d / 7200);
        d = Calendar.mod(d, 7200);
        const tun = Math.floor(d / 360);
        d = Calendar.mod(d, 360);
        const uinal = Math.floor(d / 20);
        const kin = Calendar.mod(d, 20);

        return [baktun, katun, tun, uinal, kin];
    }

    //  JD_TO_MAYAN_HAAB  --  Determine Mayan Haab "month" and day from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_mayan_haab(jd: number): number[] {
        jd = Math.floor(jd) + 0.5;
        const lcount = jd - Calendar.MAYAN_COUNT_EPOCH;
        const day = Calendar.mod(lcount + 8 + ((18 - 1) * 20), 365);

        return [Math.floor(day / 20) + 1, Calendar.mod(day, 20)];
    }

//  JD_TO_MAYAN_TZOLKIN  --  Determine Mayan Tzolkin "month" and day from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_mayan_tzolkin(jd: number): number[] {
        jd = Math.floor(jd) + 0.5;
        const lcount = jd - Calendar.MAYAN_COUNT_EPOCH;
        return [Calendar.amod(lcount + 20, 20), Calendar.amod(lcount + 4, 13)];
    }


//  INDIAN_CIVIL_TO_JD  --  Obtain Julian day for Indian Civil date
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static indian_civil_to_jd(year: number, month: number, day: number): number {
        const gyear = year + 78;
        const leap = Calendar.leap_gregorian(gyear);     // Is this a leap year ?
        const start = Calendar.gregorian_to_jd(gyear, 3, leap ? 21 : 22);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Caitra = leap ? 31 : 30;

        let jd: number;
        if (month === 1) {
            jd = start + (day - 1);
        } else {
            jd = start + Caitra;
            let m = month - 2;
            m = Math.min(m, 5);
            jd += m * 31;
            if (month >= 8) {
                m = month - 7;
                jd += m * 30;
            }
            jd += day - 1;
        }

        return jd;
    }

//  JD_TO_INDIAN_CIVIL  --  Calculate Indian Civil date from Julian day
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static jd_to_indian_civil(jd: number): number[] {

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Saka = 79 - 1;                    // Offset in years from Saka era to Gregorian epoch
        const start = 80;                       // Day offset between Saka and Gregorian

        jd = Math.floor(jd) + 0.5;
        const greg = Calendar.jd_to_gregorian(jd);       // Gregorian date for Julian day
        const leap = Calendar.leap_gregorian(greg[0]);   // Is this a leap year?
        let year = greg[0] - Saka;            // Tentative year in Saka era
        const greg0 = Calendar.gregorian_to_jd(greg[0], 1, 1); // JD at start of Gregorian year
        let yday = jd - greg0;                // Day number (0 based) in Gregorian year
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Caitra = leap ? 31 : 30;          // Days in Caitra this year

        if (yday < start) {
            //  Day is at the end of the preceding Saka year
            year--;
            yday += Caitra + (31 * 5) + (30 * 3) + 10 + start;
        }

        let month: number;
        let day: number;
        yday -= start;
        if (yday < Caitra) {
            month = 1;
            day = yday + 1;
        } else {
            let mday = yday - Caitra;
            if (mday < (31 * 5)) {
                month = Math.floor(mday / 31) + 2;
                day = (mday % 31) + 1;
            } else {
                mday -= 31 * 5;
                month = Math.floor(mday / 30) + 7;
                day = (mday % 30) + 1;
            }
        }

        return [year, month, day];
    }

    public static daycnt(cal: string, year: number, month: number): number {
        year = Math.floor(year);
        month = Math.floor(month);

        let dc1: number;
        let dc2: number;
        let days: number;
        switch (cal) {
            case 'GREGORIAN':
            case 'gregorian': {
                dc1 = Math.round(Calendar.gregorian_to_jd(year, month, 1));
                if ((month + 1) > 12) {
                    month = 1;
                    year++;
                    dc2 = Math.round(Calendar.gregorian_to_jd(year, month, 1));
                }
                else {
                    dc2 = Math.round(Calendar.gregorian_to_jd(year, month + 1, 1));
                }
                days = dc2 - dc1;
                break;
            }
            case 'JULIAN':
            case 'julian': {
                dc1 = Math.round(Calendar.julian_to_jd(year, month, 1));
                if ((month + 1) > 12) {
                    month = 1;
                    year++;
                    dc2 = Math.round(Calendar.julian_to_jd(year, month, 1));
                }
                else {
                    dc2 = Math.round(Calendar.julian_to_jd(year, month + 1, 1));
                }
                days = dc2 - dc1;
                break;
            }
            case 'JEWISH':
            case 'jewish': {
                const nmonths = Calendar.hebrew_year_months(year);
                dc1 = Math.round(Calendar.hebrew_to_jd(year, month, 1));
                if ((month + 1) > nmonths) {
                    month = 1;
                    year++;
                    dc2 = Math.round(Calendar.hebrew_to_jd(year, month, 1));
                }
                else {
                    dc2 = Math.round(Calendar.hebrew_to_jd(year, month + 1, 1));
                }
                days = dc2 - dc1;
                break;
            }
            case 'ISLAMIC':
            case 'islamic': {
                dc1 = Math.round(Calendar.islamic_to_jd(year, month, 1));
                if ((month + 1) > 12) {
                    month = 1;
                    year++;
                    dc2 = Math.round(Calendar.islamic_to_jd(year, month, 1));
                }
                else {
                    dc2 = Math.round(Calendar.islamic_to_jd(year, month + 1, 1));
                }
                days = dc2 - dc1;
                break;
            }
        }
        return days;
    }


    //=============================================================================================
    /*  DTR  --  Degrees to radians.  */
    private static dtr(d: number): number {
        return (d * Math.PI) / 180.0;
    }

    /*  RTD  --  Radians to degrees.  */
    private static rtd(r: number): number {
        return (r * 180.0) / Math.PI;
    }

    /*  FIXANGLE  --  Range reduce angle in degrees.  */
    private static fixangle(a: number): number {
        return a - 360.0 * (Math.floor(a / 360.0));
    }

    /*  FIXANGR  --  Range reduce angle in radians.  */
    private static fixangr(a: number): number {
        return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
    }

//  DSIN  --  Sine of an angle in degrees
    private static dsin(d: number): number {
        return Math.sin(Calendar.dtr(d));
    }

//  DCOS  --  Cosine of an angle in degrees
    private static dcos(d: number): number {
        return Math.cos(Calendar.dtr(d));
    }

    /*  MOD  --  Modulus function which works for non-integers.  */
    private static mod(a: number, b: number): number
    {
        return a - (b * Math.floor(a / b));
    }

//  AMOD  --  Modulus function which returns numerator if modulus is zero
    private static amod(a: number, b: number) {
        return Calendar.mod(a - 1, b) + 1;
    }

//  JWDAY  --  Calculate day of week from Julian day
    private static jwday(j: number) {
        return Calendar.mod(Math.floor((j + 1.5)), 7);
    }

    /*  OBLIQEQ  --  Calculate the obliquity of the ecliptic for a given
                     Julian date.  This uses Laskar's tenth-degree
                     polynomial fit (J. Laskar, Astronomy and
                     Astrophysics, Vol. 157, page 68 [1986]) which is
                     accurate to within 0.01 arc second between AD 1000
                     and AD 3000, and within a few seconds of arc for
                     +/-10000 years around AD 2000.  If we're outside the
                     range in which this fit is valid (deep time) we
                     simply return the J2000 value of the obliquity, which
                     happens to be almost precisely the mean.  */
    private static obliqeq(jd: number): number {
        let v = (jd - Calendar.J2000) / (Calendar.JulianCentury * 100);
        const u = v;

        let eps = 23 + (26 / 60.0) + (21.448 / 3600.0);

        if (Math.abs(u) < 1.0) {
            for (let i = 0; i < 10; i++) {
                eps += (Calendar.oterms[i] / 3600.0) * v;
                v *= u;
            }
        }
        return eps;
    }

    /*  NUTATION  --  Calculate the nutation in longitude, deltaPsi, and
                      obliquity, deltaEpsilon for a given Julian date
                      jd.  Results are returned as a two element Array
                      giving (deltaPsi, deltaEpsilon) in degrees.  */
    private static nutation(jd: number): number[] {
        let dp = 0;
        let de = 0;
        const t = (jd - 2451545.0) / 36525.0;
        const t2 = t*t;
        const t3 = t * t2;

        /* Calculate angles.  The correspondence between the elements
           of our array and the terms cited in Meeus are:

           ta[0] = D  ta[0] = M  ta[2] = M'  ta[3] = F  ta[4] = \Omega

        */
        const ta: number[] = [];

        ta[0] = Calendar.dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2 +
            t3 / 189474.0);
        ta[1] = Calendar.dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2 -
            t3 / 300000.0);
        ta[2] = Calendar.dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2 +
            t3 / 56250.0);
        ta[3] = Calendar.dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2 +
            t3 / 327270);
        ta[4] = Calendar.dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2 +
            t3 / 450000.0);

        /* Range reduce the angles in case the sine and cosine functions
           don't do it as accurately or quickly. */

        for (let i = 0; i < 5; i++) {
            ta[i] = Calendar.fixangr(ta[i]);
        }

        const to10 = t / 10.0;
        for (let i = 0; i < 63; i++) {
            let ang = 0;
            for (let j = 0; j < 5; j++) {
                if (Calendar.nutArgMult[(i * 5) + j] !== 0) {
                    ang += Calendar.nutArgMult[(i * 5) + j] * ta[j];
                }
            }
            dp += (Calendar.nutArgCoeff[(i * 4) + 0] + Calendar.nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
            de += (Calendar.nutArgCoeff[(i * 4) + 2] + Calendar.nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
        }

        /* Return the result, converting from ten thousandths of arc
           seconds to radians in the process. */

        const deltaPsi = dp / (3600.0 * 10000.0);
        const deltaEpsilon = de / (3600.0 * 10000.0);

        return [deltaPsi, deltaEpsilon];
    }



    /*  DELTAT  --  Determine the difference, in seconds, between
                    Dynamical time and Universal time.  */
    private static deltat(year: number): number {
        let dt: number;
        if ((year >= 1620) && (year <= 2000)) {
            const i = Math.floor((year - 1620) / 2);
            const f = ((year - 1620) / 2) - i;  /* Fractional part of year */
            dt = Calendar.deltaTtab[i] + ((Calendar.deltaTtab[i + 1] - Calendar.deltaTtab[i]) * f);
        } else {
            const t = (year - 2000) / 100;
            if (year < 948) {
                dt = 2177 + (497 * t) + (44.1 * t * t);
            } else {
                dt = 102 + (102 * t) + (25.3 * t * t);
                if ((year > 2000) && (year < 2100)) {
                    dt += 0.37 * (year - 2100);
                }
            }
        }
        return dt;
    }

    /*  EQUINOX  --  Determine the Julian Ephemeris Day of an
                     equinox or solstice.  The "which" argument
                     selects the item to be computed:

                        0   March equinox
                        1   June solstice
                        2   September equinox
                        3   December solstice

    */
    private static equinox(year: number, which: number): number {
        /*  Initialise terms for mean equinox and solstices.  We
            have two sets: one for years prior to 1000 and a second
            for subsequent years.  */
        // eslint-disable-next-line @typescript-eslint/naming-convention
        let JDE0tab: number[][];
        let Y: number;
        if (year < 1000) {
            JDE0tab = Calendar.JDE0tab1000;
            Y = year / 1000;
        } else {
            JDE0tab = Calendar.JDE0tab2000;
            Y = (year - 2000) / 1000;
        }

        const JDE0 =  JDE0tab[which][0] +
            (JDE0tab[which][1] * Y) +
            (JDE0tab[which][2] * Y * Y) +
            (JDE0tab[which][3] * Y * Y * Y) +
            (JDE0tab[which][4] * Y * Y * Y * Y);

        const T = (JDE0 - 2451545.0) / 36525;
        const W = (35999.373 * T) - 2.47;
        const deltaL = 1 + (0.0334 * Calendar.dcos(W)) + (0.0007 * Calendar.dcos(2 * W));

        //  Sum the periodic terms for time T

        let S = 0;
        let i: number;
        let j: number;
        for (i = j = 0; i < 24; i++) {
            S += Calendar.EquinoxpTerms[j] * Calendar.dcos(Calendar.EquinoxpTerms[j + 1] + (Calendar.EquinoxpTerms[j + 2] * T));
            j += 3;
        }

        return JDE0 + ((S * 0.00001) / deltaL);
    }

    /*  SUNPOS  --  Position of the Sun.  Please see the comments
                    on the return statement at the end of this function
                    which describe the array it returns.  We return
                    intermediate values because they are useful in a
                    variety of other contexts.  */
    private static sunpos(jd: number): number[] {

        const T = (jd - Calendar.J2000) / Calendar.JulianCentury;
        //document.debug.log.value += "Sunpos.  T = " + T + "\n";
        const T2 = T * T;
        let L0 = 280.46646 + (36000.76983 * T) + (0.0003032 * T2);
        //document.debug.log.value += "L0 = " + L0 + "\n";
        L0 = Calendar.fixangle(L0);
        //document.debug.log.value += "L0 = " + L0 + "\n";
        let M = 357.52911 + (35999.05029 * T) + (-0.0001537 * T2);
        //document.debug.log.value += "M = " + M + "\n";
        M = Calendar.fixangle(M);
        //document.debug.log.value += "M = " + M + "\n";
        const e = 0.016708634 + (-0.000042037 * T) + (-0.0000001267 * T2);
        const C = ((1.914602 + (-0.004817 * T) + (-0.000014 * T2)) * Calendar.dsin(M)) +
            ((0.019993 - (0.000101 * T)) * Calendar.dsin(2 * M)) +
            (0.000289 * Calendar.dsin(3 * M));
        const sunLong = L0 + C;
        const sunAnomaly = M + C;
        const sunR = (1.000001018 * (1 - (e * e))) / (1 + (e * Calendar.dcos(sunAnomaly)));
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Omega = 125.04 - (1934.136 * T);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Lambda = sunLong + (-0.00569) + (-0.00478 * Calendar.dsin(Omega));
        const epsilon0 = Calendar.obliqeq(jd);
        const epsilon = epsilon0 + (0.00256 * Calendar.dcos(Omega));
        // eslint-disable-next-line @typescript-eslint/naming-convention
        let Alpha = Calendar.rtd(Math.atan2(Calendar.dcos(epsilon0) * Calendar.dsin(sunLong), Calendar.dcos(sunLong)));
        Alpha = Calendar.fixangle(Alpha);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const Delta = Calendar.rtd(Math.asin(Calendar.dsin(epsilon0) * Calendar.dsin(sunLong)));
        // eslint-disable-next-line @typescript-eslint/naming-convention
        let AlphaApp = Calendar.rtd(Math.atan2(Calendar.dcos(epsilon) * Calendar.dsin(Lambda), Calendar.dcos(Lambda)));
        AlphaApp = Calendar.fixangle(AlphaApp);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const DeltaApp = Calendar.rtd(Math.asin(Calendar.dsin(epsilon) * Calendar.dsin(Lambda)));

        return [L0,                           //  [0] Geometric mean longitude of the Sun
            M,                            //  [1] Mean anomaly of the Sun
            e,                            //  [2] Eccentricity of the Earth's orbit
            C,                            //  [3] Sun's equation of the Centre
            sunLong,                      //  [4] Sun's true longitude
            sunAnomaly,                   //  [5] Sun's true anomaly
            sunR,                         //  [6] Sun's radius vector in AU
            Lambda,                       //  [7] Sun's apparent longitude at true equinox of the date
            Alpha,                        //  [8] Sun's true right ascension
            Delta,                        //  [9] Sun's true declination
            AlphaApp,                     // [10] Sun's apparent right ascension
            DeltaApp];
    }

    /*  EQUATIONOFTIME  --  Compute equation of time for a given moment.
                            Returns the equation of time as a fraction of
                            a day.  */
    private static equationOfTime(jd: number): number {
        const tau = (jd - Calendar.J2000) / Calendar.JulianMillennium;
        let L0 = 280.4664567 + (360007.6982779 * tau) +
            (0.03032028 * tau * tau) +
            ((tau * tau * tau) / 49931) +
            (-((tau * tau * tau * tau) / 15300)) +
            (-((tau * tau * tau * tau * tau) / 2000000));
        L0 = Calendar.fixangle(L0);
        const alpha = Calendar.sunpos(jd)[10];
        const deltaPsi = Calendar.nutation(jd)[0];
        const epsilon = Calendar.obliqeq(jd) + Calendar.nutation(jd)[1];
        let E = L0 + (-0.0057183) + (-alpha) + (deltaPsi * Calendar.dcos(epsilon));
        E = E - 20.0 * (Math.floor(E / 20.0));
        E = E / (24 * 60);

        return E;
    }


    // var NormLeap = new Array("Normal year", "Leap year"); Todo: delete

    /*  WEEKDAY_BEFORE  --  Return Julian date of given weekday (0 = Sunday)
                            in the seven days ending on jd.  */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static weekday_before(weekday: number, jd: number): number {
        return jd - Calendar.jwday(jd - weekday);
    }

    /*  SEARCH_WEEKDAY  --  Determine the Julian date for:

                weekday      Day of week desired, 0 = Sunday
                jd           Julian date to begin search
                direction    1 = next weekday, -1 = last weekday
                offset       Offset from jd to begin search
    */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static search_weekday(weekday: number, jd: number, direction: number, offset: number): number {
        return Calendar.weekday_before(weekday, jd + (direction * offset));
    }

//  Utility weekday functions, just wrappers for search_weekday
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static next_weekday(weekday: number, jd: number): number {
        return Calendar.search_weekday(weekday, jd, 1, 7);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static previous_weekday(weekday: number, jd: number) {
        return Calendar.search_weekday(weekday, jd, -1, 1);
    }
//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static  leap_gregorian(year: number): boolean {
        return ((year % 4) === 0) &&
            (!(((year % 100) === 0) && ((year % 400) !== 0)));
    }


//  ISO_TO_JULIAN  --  Return Julian day of given ISO year, week, and day

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static n_weeks(weekday: number, jd: number, nthweek: number): number {
        let j = 7 * nthweek;

        if (nthweek > 0) {
            j += Calendar.previous_weekday(weekday, jd);
        } else {
            j += Calendar.next_weekday(weekday, jd);
        }
        return j;
    }





    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static leap_julian(year: number): boolean {
        return Calendar.mod(year, 4) === ((year > 0) ? 0 : 3);
    }

//  HEBREW_TO_JD  --  Determine Julian day from Hebrew date


//  Is a given Hebrew year a leap year ?
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static hebrew_leap(year: number): boolean {
        return Calendar.mod(((year * 7) + 1), 19) < 7;
    }

//  Test for delay of start of new year and to avoid
//  Sunday, Wednesday, and Friday as start of the new year.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static hebrew_delay_1(year: number): number {

        const months = Math.floor(((235 * year) - 234) / 19);
        const parts = 12084 + (13753 * months);
        let day = (months * 29) + Math.floor(parts / 25920);

        if (Calendar.mod((3 * (day + 1)), 7) < 3) {
            day++;
        }
        return day;
    }

//  Check for delay in start of new year due to length of adjacent years
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static hebrew_delay_2(year: number): number {
        const last = Calendar.hebrew_delay_1(year - 1);
        const present = Calendar.hebrew_delay_1(year);
        const next = Calendar.hebrew_delay_1(year + 1);

        return ((next - present) === 356) ? 2 :
            (((present - last) === 382) ? 1 : 0);
    }

//  How many days are in a Hebrew year ?

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static hebrew_year_days(year: number): number {
        return Calendar.hebrew_to_jd(year + 1, 7, 1) - Calendar.hebrew_to_jd(year, 7, 1);
    }


//  Finally, wrap it all up into...

    /*  EQUINOXE_A_PARIS  --  Determine Julian day and fraction of the
                              September equinox at the Paris meridian in
                              a given Gregorian year.  */

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static equinoxe_a_paris(year: number): number {

        //  September equinox in dynamical time
        const equJED = Calendar.equinox(year, 2);

        //  Correct for delta T to obtain Universal time
        const equJD = equJED - (Calendar.deltat(year) / (24 * 60 * 60));

        //  Apply the equation of time to yield the apparent time at Greenwich
        const equAPP = equJD + Calendar.equationOfTime(equJED);

        /*  Finally, we must correct for the constant difference between
            the Greenwich meridian and that of Paris, 2�20'15" to the
            East.  */

        const dtParis = (2 + (20 / 60.0) + (15 / (60 * 60.0))) / 360;
        return equAPP + dtParis;
    }

    /*  PARIS_EQUINOXE_JD  --  Calculate Julian day during which the
                               September equinox, reckoned from the Paris
                               meridian, occurred for a given Gregorian
                               year.  */

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static paris_equinoxe_jd(year: number): number {
        const ep = Calendar.equinoxe_a_paris(year);
        return Math.floor(ep - 0.5) + 0.5;
    }

    /*  ANNEE_DE_LA_REVOLUTION  --  Determine the year in the French
                                    revolutionary calendar in which a
                                    given Julian day falls.  Returns an
                                    array of two elements:

                                        [0]  Ann�e de la R�volution
                                        [1]  Julian day number containing
                                             equinox for this year.
    */

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static annee_da_la_revolution(jd: number): number[] {
        let guess = Calendar.jd_to_gregorian(jd)[0] - 2;
        let lasteq = Calendar.paris_equinoxe_jd(guess);
        while (lasteq > jd) {
            guess--;
            lasteq = Calendar.paris_equinoxe_jd(guess);
        }
        let nexteq = lasteq - 1;
        while (!((lasteq <= jd) && (jd < nexteq))) {
            lasteq = nexteq;
            guess++;
            nexteq = Calendar.paris_equinoxe_jd(guess);
        }
        const adr = Math.round((lasteq - Calendar.FRENCH_REVOLUTIONARY_EPOCH) / Calendar.TropicalYear) + 1;

        return [adr, lasteq];
    }


//  LEAP_ISLAMIC  --  Is a given year a leap year in the Islamic calendar ?
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static leap_islamic(year: number): boolean {
        return (((year * 11) + 14) % 30) < 11;
    }



    /*  TEHRAN_EQUINOX  --  Determine Julian day and fraction of the
                            March equinox at the Tehran meridian in
                            a given Gregorian year.  */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static tehran_equinox(year: number): number {
        //  March equinox in dynamical time
        const equJED = Calendar.equinox(year, 0);

        //  Correct for delta T to obtain Universal time
        const equJD = equJED - (Calendar.deltat(year) / (24 * 60 * 60));

        //  Apply the equation of time to yield the apparent time at Greenwich
        const equAPP = equJD + Calendar.equationOfTime(equJED);

        /*  Finally, we must correct for the constant difference between
            the Greenwich meridian andthe time zone standard for
        Iran Standard time, 52�30' to the East.  */

        const dtTehran = (52 + (30 / 60.0) + (0 / (60.0 * 60.0))) / 360;
        return  equAPP + dtTehran;
    }


    /*  TEHRAN_EQUINOX_JD  --  Calculate Julian day during which the
                               March equinox, reckoned from the Tehran
                               meridian, occurred for a given Gregorian
                               year.  */

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static tehran_equinox_jd(year: number): number {
        const ep = Calendar.tehran_equinox(year);
        return Math.floor(ep);
    }

    /*  PERSIANA_YEAR  --  Determine the year in the Persian
                           astronomical calendar in which a
                           given Julian day falls.  Returns an
                            array of two elements:

                                [0]  Persian year
                                [1]  Julian day number containing
                                     equinox for this year.
    */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static persiana_year(jd: number): number[] {
        let guess = Calendar.jd_to_gregorian(jd)[0] - 2;

        let lasteq = Calendar.tehran_equinox_jd(guess);
        while (lasteq > jd) {
            guess--;
            lasteq = Calendar.tehran_equinox_jd(guess);
        }
        let nexteq = lasteq - 1;
        while (!((lasteq <= jd) && (jd < nexteq))) {
            lasteq = nexteq;
            guess++;
            nexteq = Calendar.tehran_equinox_jd(guess);
        }
        const adr = Math.round((lasteq - Calendar.PERSIAN_EPOCH) / Calendar.TropicalYear) + 1;

        return [adr, lasteq];
    }


    /*  LEAP_PERSIANA  --  Is a given year a leap year in the Persian
                           astronomical calendar ?  */

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static leap_persiana(year: number): boolean {
        return (Calendar.persiana_to_jd(year + 1, 1, 1) -
            Calendar.persiana_to_jd(year, 1, 1)) > 365;
    }

//  LEAP_PERSIAN  --  Is a given year a leap year in the Persian calendar ?

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private static leap_persian(year: number) {
        return ((((((year - ((year > 0) ? 474 : 473)) % 2820) + 474) + 38) * 682) % 2816) < 682;
    }
}
