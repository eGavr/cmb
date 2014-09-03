require('colors');

/**
 * Returns current time in an appropriate form
 * @example 00:00:00.000
 */
function getCurrTime() {
    var now = new Date(),
        _hours = now.getHours() + '',
        _minutes = now.getMinutes() + '',
        _seconds = now.getSeconds() + '',
        _milliseconds = now.getMilliseconds() + '',
        hours = (_hours.length < 2 ? '0' :  '') + _hours,
        minutes = (_minutes.length < 2 ? '0' : '') + _minutes,
        seconds = (_seconds.length < 2 ? '0' : '') + _seconds,
        milliSecLen = _milliseconds.length,
        milliseconds = (milliSecLen < 3 ? (milliSecLen === 2 ? '0' : '00') : '') +  _milliseconds;

    return (hours + ':' + minutes + ':' + seconds + '.' + milliseconds).grey;
}

/**
 * Logs the text
 * @param {String} - type
 * @param {String} - text
 * @param {String} - description
 */
module.exports = function (type, text, description) {
    if (type === 'o') {
        console.log(text);
    } else if (type === 'i' || type === 'e') {
        console.log(getCurrTime() + ' - ' + (type === 'i' ? 'info'.green : 'error'.red) + ': ' + text + description.grey);
    }
}
