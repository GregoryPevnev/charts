const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatDate = timestamp => {
    const date = new Date(timestamp);
    const month = monthNames[date.getMonth()];
    return `${month} ${date.getDate()}`;
};

export default formatDate;
