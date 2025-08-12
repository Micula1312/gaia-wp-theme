if (/Mobi|Android/i.test(navigator.userAgent)) {
    // If mobile device, prevent loading of p5.js and sketch.js
    var scripts = document.querySelectorAll('script[src*="sketch.js"]');
    scripts.forEach(function(script) {
        script.parentNode.removeChild(script);
    });
}
