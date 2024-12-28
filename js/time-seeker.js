"use strict";

//full range = 1000
//window range = 100
//window pixels = 1000/100 = 10


let TimeSeeker = function (elId) {

    let self = {};
    let privateScope = {
        seek: 0,
        cursor: 0,
        offset: 0,
        realOffset: 0,
        start: 0,
        stop: 0,
        selectWindow: {
            start: 0,
            stop: 0
        },
        scaleFactor: 1,
    };

    privateScope.convertToTime = function (seconds, decimal = false) {
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        // Округлюємо секунди до мікросекунд (6 знаків після коми)
        const secondsInt = Math.floor(seconds);
        const microseconds = Math.round((seconds - secondsInt) * 1e6);

        // Форматуємо час у вигляді "години:хвилини:секунди.мікросекунди"
        if (decimal) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsInt).padStart(2, '0')}.${String(microseconds).padStart(6, '0')}`;
        }

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secondsInt).padStart(2, '0')}`;
        }

        return `${String(minutes).padStart(2, '0')}:${String(secondsInt).padStart(2, '0')}`;
    }

    self.setTimeRange = function (start, stop) {
        privateScope.start = start;
        privateScope.stop = stop + 1;
        privateScope.uiRange = privateScope.el.width;
        privateScope.dataWindowRatio = privateScope.uiRange / privateScope.stop;
        privateScope.scaleFactor = privateScope.dataWindowRatio;
    };

    privateScope.el = document.getElementById(elId);
    privateScope.ctx = privateScope.el.getContext("2d");
    privateScope.el.width = privateScope.el.clientWidth;
    privateScope.el.height = privateScope.el.clientHeight;
    privateScope.ctx.reset();
    privateScope.ctx.beginPath();
    privateScope.ctx.fillText("Ready", 5, 15);
    privateScope.ctx.stroke();

    privateScope.update = false;

    privateScope.el.addEventListener("mousedown", function (e) {
        privateScope.selectWindow.start = privateScope.realOffset;
        privateScope.selectWindow.stop = 0;
        privateScope.update = true;
    });
    privateScope.el.addEventListener("mouseup", function (e) {
        privateScope.selectWindow.stop = privateScope.realOffset;
        if (privateScope.selectWindow.stop !== privateScope.selectWindow.start) {
            console.log('select', privateScope.selectWindow);
            if (privateScope.onSelectCb !== undefined) {
                privateScope.onSelectCb(privateScope.selectWindow.start, privateScope.selectWindow.stop);
            }
        } else {
            if (privateScope.onClickCb !== undefined) {
                privateScope.onClickCb(privateScope.realOffset);
            }
            console.log('click', privateScope.realOffset);
        }
        privateScope.update = true;
    });

    privateScope.el.addEventListener("mousemove", function (e) {
        privateScope.cursor = e.offsetX;
        privateScope.update = true;
        privateScope.realOffset = ((privateScope.offset * privateScope.scaleFactor) + privateScope.cursor) / privateScope.scaleFactor;
        if (privateScope.onMoveCb !== undefined) {
            privateScope.onMoveCb(privateScope.realOffset);
        }
    });

    privateScope.scale = function (x) {
        return x * privateScope.scaleFactor;
    };


    privateScope.getOffset = function (x) {

        if (privateScope.dataWindowRatio > 1) {
            return privateScope.offset;
        }
        if (x !== 0) {
            if (x > 0) {
                privateScope.offset += 1;
            } else {
                privateScope.offset -= 1;
            }
        }
        if (privateScope.offset < 0) {
            privateScope.offset = 0;
        }
        let lengthForScale = (privateScope.stop - privateScope.start) * privateScope.scaleFactor;

        if (privateScope.offset * privateScope.scaleFactor > lengthForScale - privateScope.uiRange) {
            privateScope.offset = (lengthForScale - privateScope.uiRange) / privateScope.scaleFactor;
        }
        return privateScope.offset;
    }
    privateScope.getZoom = function (y) {
        if (privateScope.dataWindowRatio > 1) {
            return privateScope.scaleFactor;
        }

        if (y !== 0) {
            if (y > 0) {
                privateScope.scaleFactor -= 0.01;
            } else {
                privateScope.scaleFactor += 0.01;
            }
        }
        if (privateScope.scaleFactor < 1) {
            privateScope.scaleFactor = 1;
        }
        if (privateScope.scaleFactor > 10) {
            privateScope.scaleFactor = 10;
        }
        return privateScope.scaleFactor;
    };

    privateScope.el.addEventListener("wheel", function (e) {
        e.preventDefault();
        let zoom = privateScope.getZoom(e.deltaY);
        let offset = privateScope.getOffset(e.deltaX);
        privateScope.update = true;
    });

    privateScope.draw = function () {

        requestAnimationFrame(privateScope.draw);
        if (Math.abs(privateScope.start - privateScope.stop) === 0) {
            return;
        }
        if (privateScope.update === false) {
            return;
        }
        privateScope.update = false;

        privateScope.ctx.reset();
        privateScope.ctx.beginPath();
        let x = (privateScope.offset + privateScope.cursor) * privateScope.scaleFactor;
        privateScope.ctx.moveTo(privateScope.cursor, 0);
        privateScope.ctx.lineTo(privateScope.cursor, 50);
        privateScope.ctx.fillText(privateScope.convertToTime(privateScope.realOffset, true), privateScope.cursor + 5, 10);
        privateScope.ctx.fillText(privateScope.realOffset, privateScope.cursor + 5, 20);
        privateScope.ctx.stroke();

        privateScope.ctx.beginPath();
        privateScope.ctx.translate(0, 0);


        for (let step = 0; step < privateScope.uiRange; step++) {
            // Runs 5 times, with values of step 0 through 4.
            let x = (step - privateScope.offset) * privateScope.scaleFactor;

            if (step % 10 === 0) {
                if (step % 60 === 0) {
                    privateScope.ctx.moveTo(x, 30);
                } else {
                    privateScope.ctx.moveTo(x, 40);
                }
                privateScope.ctx.lineTo(x, 50);
            }
            if (step % 60 === 0) {
                privateScope.ctx.fillText(privateScope.convertToTime(step), x + 5, 35);
            }
        }
        privateScope.ctx.stroke();

    };


    self.onClick = function (cb) {
        privateScope.onClickCb = cb;
    };
    self.onSelect = function (cb) {
        privateScope.onSelectCb = cb;
    };
    self.onMove = function (cb) {
        privateScope.onMoveCb = cb;
    };
    privateScope.update = true;
    privateScope.draw();
    return self;
};

