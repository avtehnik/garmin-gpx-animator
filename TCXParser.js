/**
 * TCX file parser
 *
 * @constructor
 */
let TCXParser = function () {};

/**
 * Parse a gpx formatted string to a TCXParser Object
 *
 * @param {string} tcxstring - A GPX formatted String
 *
 * @return {TCXParser} A TCXParser object
 */
TCXParser.prototype.parse = function (tcxstring) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(tcxstring, "text/xml");
    let trackPoints = this.getTrackPoints(doc);
    let latLngs = [];
    let startTime = this.getTime(trackPoints[0]);
    trackPoints.map((el) => {
        let position = this.getElement(el, "Position");
        if (position === null) {
            return;
        }
        let time = this.getTime(el);
        let p = {
            time,
            alt: this.getElementIntValue(el, "AltitudeMeters"),
            dist: this.getElementIntValue(el, "DistanceMeters"),
            lat: this.getLatLon(el, "LatitudeDegrees"),
            lng: this.getLatLon(el, "LongitudeDegrees"),
            hr: this.getElementIntValue(el, "HeartRateBpm"),
            speed: this.getSpeed(el),
            offset: (time - startTime) / 1000
        }
        latLngs.push(p);
    })
    return latLngs;
};

/**
 * Get value from a XML DOM element
 *
 * @param  {Element} parent - Parent DOM Element
 * @param  {string} needle - Name of the searched element
 *
 * @return {} The element value
 */
TCXParser.prototype.getElementIntValue = function (el, needle) {
    let els = el.getElementsByTagName(needle);
    if (els.length === 1) {
        return parseInt(els[0].textContent);
    }
    return null
};
TCXParser.prototype.getElementFloatValue = function (el, needle) {
    let els = el.getElementsByTagName(needle);
    if (els.length === 1) {
        return parseFloat(els[0].textContent);
    }
    return null
};
TCXParser.prototype.getElementValue = function (el, needle) {
    let els = el.getElementsByTagName(needle);
    if (els.length === 1) {
        return els[0].textContent;
    }
    return null
};

TCXParser.prototype.getElement = function (el, needle) {
    let els = el.getElementsByTagName(needle);
    if (els.length === 1) {
        return els[0];
    }
    return null
};
TCXParser.prototype.getTime = function (el) {
    return new Date(this.getElementValue(el, "Time"));
};
TCXParser.prototype.getLatLon = function (el, needle) {
    return parseFloat(this.getElementValue(el, needle)).toFixed(5);
};

TCXParser.prototype.getTrackPoints = function (el) {
    return Array.from(el.getElementsByTagName("Trackpoint"));
};

TCXParser.prototype.getSpeed = function (el) {
    let extension = this.getElement(el, "Extensions");
    if (extension) {
        let speed = parseFloat(this.getElementValue(extension, "ns3:Speed"));
        return parseInt(speed * 3.6);
    }
    return null
};
