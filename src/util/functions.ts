import Chalk from "chalk";
import fs from "fs";
import path from "path";
const table = {
    0: Chalk.black,
    1: Chalk.blue,
    2: Chalk.green,
    3: Chalk.cyan,
    4: Chalk.red,
    5: Chalk.magenta,
    6: Chalk.yellow,
    7: Chalk.gray,
    8: Chalk.white,
    9: Chalk.bgBlue,
    a: Chalk.greenBright,
    b: Chalk.cyanBright,
    c: Chalk.redBright,
    d: Chalk.bgRedBright,
    e: Chalk.yellowBright,
    f: Chalk.white
}


export function getAllFiles(dirPath, arrayOfFiles?) {
    const files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        else arrayOfFiles.push(path.join(dirPath, "/", file))
    })
    return arrayOfFiles;
}

export function parseMessageCodes(msg) {
    if (typeof msg !== "string") return msg;
    msg = '&f' + msg;
    let codes = msg.match(/&[0-9a-f]/g) || [];

    let ary = Array.from(msg);
    let parts: any = [];
    codes.forEach((char, i) => {
        let nextCodeStart = msg.indexOf(codes[i + 1]) != -1 ? msg.indexOf(codes[i + 1]) : ary.length;
        let index = msg.indexOf(char);
        let part = msg.slice(index, nextCodeStart);

        parts.push(table[char[1]](part.replace(char, '')))
        msg = msg.replace(part, '');
    })

    return parts.join('')
}

export function parseTime(string: string) {
    let list = string.split(' ');
    let ms = 0;
    list.forEach(str => {
        if (str.length < 2) return;
        let suffix = str.slice(str.length - 1);
        let time = parseInt(str.slice(0, str.length - 1));
        console.log(suffix)
        if (isNaN(time)) return 0;
        if (suffix == 's') {
            ms += (time * 1000);
        } else if (suffix == 'm') {
            ms += (time * 60 * 1000)
        } else if (suffix == 'h') {
            ms += (time * 60 * 60 * 1000)
        } else if (suffix == 'd') {
            ms += (time * 24 * 60 * 60 * 1000)
        } else if (suffix == 'w') {
            ms += (time * 7 * 24 * 60 * 60 * 1000)
        }
    })
    let dateString = getDateString(ms);
    return !ms ? false : { ms: ms, string: dateString };
}
export function getDateString(ms: number, format = "%year% %yearStr% %month% %monthStr% %week% %weekStr% %day% %dayStr% %hour% %hourStr% %min% %minStr% %sec% %secStr%") {
    if (!ms) return "0 minutes and 0 seconds";
    let seconds = Math.floor(ms / 1000 % 60);
    let secondsStr = seconds.toString() && getPlural(seconds, 'second');
    let minutes = Math.floor(ms / 1000 / 60 % 60);
    let minutesStr = minutes.toString() && getPlural(minutes, 'minute');
    let hours = Math.floor(ms / 1000 / 60 / 60 % 24);
    let hoursStr = hours.toString() && getPlural(hours, 'hour');
    let days = Math.floor(ms / 1000 / 60 / 60 / 24 % 7);
    let daysStr = days.toString() && getPlural(days, 'day');
    let weeks = Math.floor(ms / 1000 / 60 / 60 / 24 / 7 % 31);
    let weeksStr = weeks.toString() && getPlural(weeks, 'week');
    let months = Math.floor(ms / 1000 / 60 / 60 / 24 / 7 / 31 % 365);
    let monthsStr = months.toString() && getPlural(months, 'month');
    let years = Math.floor(ms / 1000 / 60 / 60 / 24 / 7 / 31 / 365);
    let yearsStr = years.toString() && getPlural(years, 'year');

    let dateString = format
        .replace('%SEC%', seconds.toString())
        .replace('%SECSTR%', secondsStr)
        .replace('%MIN%', minutes.toString())
        .replace('%MINSTR%', minutesStr)
        .replace('%HOUR%', hours.toString())
        .replace('%HOURSTR%', hoursStr)
        .replace('%DAY%', days.toString())
        .replace('%DAYSTR%', daysStr)
        .replace('%WEEK%', weeks.toString())
        .replace('%WEEKSTR%', weeksStr)
        .replace('%MONTH%', months.toString())
        .replace('%MONTHSTR%', monthsStr)
        .replace('%YEAR%', years.toString())
        .replace('%YEARSTR%', yearsStr)
        .replace('%sec%', String(seconds ?? ''))
        .replace('%secStr%', secondsStr || '')
        .replace('%min%', String(minutes || ''))
        .replace('%minStr%', minutesStr || '')
        .replace('%hour%', String(hours || ''))
        .replace('%hourStr%', hoursStr || '')
        .replace('%day%', String(days || ''))
        .replace('%dayStr%', daysStr || '')
        .replace('%week%', String(weeks || ''))
        .replace('%weekStr%', weeksStr || '')
        .replace('%month%', String(months || ''))
        .replace('%monthStr%', monthsStr || '')
        .replace('%year%', String(years || ''))
        .replace('%yearStr%', yearsStr || '')
    // let dateString = `${years ? years + getPlural(years, ' year') : ''} ${months ? months + getPlural(months, ' month') : ''} ${weeks ? weeks + getPlural(weeks, ' week') : ''} ${days ? days + getPlural(days, ' day') : ''} ${hours ? hours + getPlural(hours, ' hour') : ''} ${minutes ? minutes + getPlural(minutes, ' minute') : ''} ${seconds ? seconds + getPlural(seconds, 'second') : ''}`.trim();
    return dateString.trim();
}
function getPlural(num: number, string: string) {
    if (num == 1) return string;
    return string + 's';
}
