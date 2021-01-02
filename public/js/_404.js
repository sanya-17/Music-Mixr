setInterval(function () {
    var r = Math.floor(Math.random() * 255)
    var g = Math.floor(Math.random() * 255)
    var b = Math.floor(Math.random() * 255)
    document.querySelector('h1').style.color = 'rgb( ' + r + ',' + g + ',' + b + ')';
}, 500)