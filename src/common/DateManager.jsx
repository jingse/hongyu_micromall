
function getDate(date) {
    let Y = date.getFullYear() + '.';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    let D = date.getDate() + ' ';
    return Y + M + D
}

const DateManager = {
    getDate,
};

export default DateManager;
