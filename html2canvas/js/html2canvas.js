/*jshint browser: true*/
window.onload = function () {
  var btn = document.getElementById("btn");
  // listen click vent
  btn.addEventListener('click', function () {
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      rect = document.documentElement.getBoundingClientRect();

    // set canvas width and height
    canvas.width = rect.width;
    canvas.height = rect.height;

    document.documentElement.appendChild(canvas);

    // serialize html content and load it to an image
    var se = new XMLSerializer(),
      data =
        '<svg xmlns="http://www.w3.org/2000/svg" width="' + rect.width + '" height="' + rect.height + '">' +
          '<foreignObject width="100%" height="100%">' +
            // se.serializeToString(document.getElementById('holder')) +
            se.serializeToString(document.documentElement) +
          '</foreignObject>' +
        '</svg>',
      svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' }),
      DOMURL = window.URL || window.webkitURL || window,
      url = DOMURL.createObjectURL(svg);

    var img = new Image();
    img.onload = function () {
      // draw svg into canvas
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
    };
    img.onerror = function () {
      alert('error');
    };
    img.src = url;

    // button can only be clicked once
    btn.removeEventListener('click', arguments.callee);
  });
};
