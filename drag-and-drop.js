let DragAndDrop = function (holder, status, cb) {

    var holder = document.getElementById(holder),
        state = document.getElementById(status);

    if (typeof window.FileReader === 'undefined') {
        state.className = 'fail';
    } else {
        state.className = 'success';
    }

    holder.ondragover = function () {
        this.className = 'hover';
        return false;
    };
    holder.ondragend = function () {
        this.className = '';
        return false;
    };
    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();

        cb(e.dataTransfer.files);
        return false;
    };
}

