import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export const currentYear = dayjs();

export const isSameWeek = (start, end) => {
    const sameWeek = dayjs(start).isoWeek() === dayjs(end).isoWeek() && dayjs(start).year() === dayjs(end).year();
    const monthDifference = dayjs(end).diff(dayjs(start), 'month');    

    return sameWeek && monthDifference <= 1;
};