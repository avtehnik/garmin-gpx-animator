


function dateToText(date){
    const month = String(date.getMonth()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return day + '.' + month + '.' + year+ ' ' +  hours + ":" + minutes + ":" + seconds;
}

function arrayDateDiff(arr, name){
    var dif = arr[0][name].getTime() - arr[arr.length-1][name].getTime();
    return Math.abs(dif/1000);
}