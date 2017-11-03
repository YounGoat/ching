
const FORMATS = {
    'dash.date': d => `${d.year}-${d.month}-${d.monthday}`,
};

/**
 * @param  {Date}   [date]
 * @param  {string} [format=dash.date] - format name
 */
function dateformat(date, format) {
    if (arguments.length == 1 && typeof arguments[0] == 'string') {
        date = null;
        format = arguments[0];
    }
    if (!date) date = new Date();
    if (!format) format = 'dash.date';

    let formatter = FORMATS[format];
    if (!formatter) {
        throw new Error(`Invalid format: ${format}`);
    }

    const year = date.getYear() + 1900;
    const month = date.getMonth() + 1;
    const monthday = date.getDate();
    const weekday = date.getDay(); // 1 means it is Monday.

    const info = { 
        year, 
        month, 
        monthday,
        weekday,
    };

    return formatter(info);
}

module.exports = dateformat;