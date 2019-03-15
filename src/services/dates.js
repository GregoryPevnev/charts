const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatDate = timestamp => {
    const date = new Date(timestamp);
    const month = monthNames[date.getMonth()];
    return `${month} ${date.getDate()}`;
};

export const formatFullDate = timestamp => {
    const date = formatDate(timestamp);
    const dayName = dayNames[new Date(timestamp).getDay()];
    return `${dayName}, ${date}`;
};
