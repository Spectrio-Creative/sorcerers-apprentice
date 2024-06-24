export function padZero(num: number, length: number) {
    let str = String(num);
    while (str.length < length) str = `0${str}`;
    return str;
}

export function getFormattedTimestamp(now = new Date(), options: {includeTime?: boolean; includeDate?: boolean, includeColons?: boolean} =  {includeTime: true, includeDate: true}) {
    const includeTime = options.includeTime ?? true;
    const includeDate = options.includeDate ?? true;
    const includeColons = options.includeColons;

    const year = now.getFullYear();
    const month = padZero(now.getMonth() + 1, 2);
    const day = padZero(now.getDate(), 2);
    const hours = padZero(now.getHours(), 2);
    const minutes = padZero(now.getMinutes(), 2);
    const seconds = padZero(now.getSeconds(), 2);

    const date = includeDate ? `${year}-${month}-${day}` : "";
    let time = includeTime ? `${hours}${minutes}${seconds}` : "";
    if (includeColons) time = `${hours}:${minutes}:${seconds}`;

    if (!includeDate && !includeTime) return "";
    if (includeDate && !includeTime) return date;
    if (!includeDate && includeTime) return time;
    
    return `${date}_${time}`;
}