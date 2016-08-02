var board = new Quadtree(0, {
    width: parseInt($('#board').width()),
    height: parseInt($('#board').height()),
    x: $('#board').offset().left,
    y: $('#board').offset().top
});
//canvasid, bounds, color
var collisionDetect = function(yes) {
    for (var circle in circles) {
        var matches = board.retrieve(circle);
        // For all of the matches
        for (var match in matches) {
            if (circles[circle].id != matches[match].id) {
                //Distance formula.
                var ydiff = parseInt($('#'+matches[match].id).attr('cy'))-parseInt($('#'+circles[circle].id).attr('cy')),
                    xdiff = parseInt($('#'+matches[match].id).attr('cx'))-parseInt($('#'+circles[circle].id).attr('cx')),
                    ysqr  = ydiff*ydiff,
                    xsqr  = xdiff*xdiff;
                    if (!yes) {
                        console.log(ydiff, xdiff, ysqr, xsqr);
                    }
                //Actual Distance between two
                var distance = Math.sqrt(ysqr+xsqr);
                if (!yes) {
                    console.log(distance);
                }
                //distance for touching between the two
                var contactDist = parseInt($('#'+circles[circle].id).attr('r'))+parseInt($('#'+matches[match].id).attr('r'));
                if (!yes) {
                    console.log(contactDist);
                }
                //if touching
                if (distance < contactDist) {
                    circles[circle].explode();
                    matches[match].explode();
                }
            }
        }
        if (!yes) {
            console.log('-------------------------------\n\n\n');
        }
    }
}


var fps         = 60,
    interval    = 1000/fps,
    clock       = 0,
    newClock    = 20,
    start       = true;
var start = function() { start = true; }
var stop  = function() { start = false; }

var mainLoop = setInterval(function () {
    if (start) {
        // console.log('Clock');
        //Clock (global cycle);
        if (clock >= newClock) { clock = 0; } else { clock++; };
        //Clear quadtree and repopulate (needs to repopulate because needs to insert things in areas that we need);
        board.clear();
        for (var i = 0; i < circles.length; i++ ) {
            board.insert(circles[i]);
        }

        //collision detection
        //For all of the circles
        collisionDetect(true);
        //Pass in true for no logging


        //Randomly generate circles
        if (clock == 0) {
            // console.log('New Circle',circles.length);
            var x = Math.floor(Math.random()*400+8);
            var y = Math.floor(Math.random()*400+8);
            board.insert(new Circle('board', {width: 10, height: 10, x: x, y: y}, 'blue'));
        }
    }
}, interval);

$('#board').click(function(e) {
    // console.log(e.pageX);
    // console.log(e.pageY);
    board.insert(new Circle('board', {width: 10, height: 10, x: e.pageX-10, y: e.pageY-10}, 'blue'));
    // console.log(board);
    // console.log("----------");
    // board.visualize();
    board.retrieve(circles[circles.length-1]);
})

// var arr =
