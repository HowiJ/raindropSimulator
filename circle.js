var circles = [];
if (!window.jQuery) {
    console.log('Circle.js requires jQuery');
} else {
    var Circle = function( canvasid, bounds, color ) {
    	var makeSVG = function(tag, attrs) {
            var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs)
            {
                el.setAttribute(k, attrs[k]);
            }
            return el;
        }

        this.x = bounds.x;
        this.y = bounds.y;
        this.width  = bounds.width;
        this.height = bounds.height;

        this.id = 'circle_'+circles.length;
        this.class = 'circle';
        this.idle = true;

        var attr = {
            cx      : bounds.x,
            cy      : bounds.y,
            r       : 1,
            stroke  : color,
            id      : this.id,
            fill    : 'transparent',
            class   : 'circle',
            idle    : this.idle,
            lineWidth: '2px'
        }
        var circle = makeSVG('circle', attr);
        circles.push(this);
        document.getElementById(canvasid).appendChild(circle);

        var current = this;
        var ignition = setInterval(function () {
            if (parseInt($('#'+current.id).attr('r')) >= bounds.width) {
                clearInterval(ignition);
            } else {
                $('#'+current.id).attr('r', parseInt($('#'+current.id).attr('r'))+1);
            }
        }, 1000/60);
    }
}
Circle.prototype.explode = function() {
    if (this.idle) {
        this.idle = false;
        var count           = 0;
        var currentCircle   = this;
        var interval    = setInterval(function () {
            if (count >= 20) {
                clearInterval(interval);
                $('#'+currentCircle.id).remove();
                circles.splice(circles.indexOf(currentCircle), 1);
            };
            $('#'+currentCircle.id).attr('r', parseInt($('#'+currentCircle.id).attr('r'))+3);
            $('#'+currentCircle.id).animate({opacity: 0}, 300);
            count++;
        }, 1000/60);
    }
}