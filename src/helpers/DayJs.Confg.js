import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export const currentYear = dayjs();

export const isSameWeek = (start, end) => {
    return dayjs(start).isoWeek() === dayjs(end).isoWeek() && dayjs(start).year() === dayjs(end).year();
};