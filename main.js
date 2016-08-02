var board = new Quadtree(0, {
    width: parseInt($('#board').width()),
    height: parseInt($('#board').height()),
    x: $('#board').offset().left,
    y: $('#board').offset().top
});
//canvasid, bounds, color
var collisionDetect = function(debug) {
    if (!debug) {
        console.log(circles);
    }
    for (var circle in circles) {
        var matches = board.retrieve(circles[circle]);
        if (!debug) {
            console.log(matches);
        }
        // For all of the matches
        for (var match in matches) {
            // if (!debug) {
            //     console.log('circles',circles[circle]);
            //     console.log('matches',matches[match]);
            //     console.log('equal',circles[circle].id != matches[match].id);
            //     console.log('id',circles[circle.id],matches[match].id);
            // };
            if (circles[circle] && matches[match] && circles[circle].id != matches[match].id) {
                if (!debug) {
                    console.log('ids',circles[circle].id,matches[match].id);
                }
                //Distance formula.
                var ydiff = parseInt($('#'+matches[match].id).attr('cy'))-parseInt($('#'+circles[circle].id).attr('cy')),
                    xdiff = parseInt($('#'+matches[match].id).attr('cx'))-parseInt($('#'+circles[circle].id).attr('cx')),
                    ysqr  = ydiff*ydiff,
                    xsqr  = xdiff*xdiff;
                    if (!debug) {
                        console.log('yDiff:',ydiff, 'xDiff:',xdiff, 'ySqr:',ysqr, 'xSqr:',xsqr);
                    }
                //Actual Distance between two
                var distance = Math.sqrt(ysqr+xsqr);
                if (!debug) {
                    console.log('Distance',distance);
                }
                //distance for touching between the two
                var contactDist = parseInt($('#'+circles[circle].id).attr('r'))+parseInt($('#'+matches[match].id).attr('r'));
                if (!debug) {
                    console.log('ContactDist',contactDist);
                }
                //if touching
                if (distance < contactDist) {
                    circles[circle].explode();
                    matches[match].explode();
                }
            }
        }
        if (!debug) {
            console.log('-------------------------------\n\n\n');
        }
    }
}
var reInsert = function() {
    board.clear();
    for (var i in circles) {
        board.insert(circles[i]);
    }
}
var randomSize = function(min, max) {
    // var rand = Math.floor(Math.random()*max+min);
    return Math.floor(Math.random()*(max-min)+min);
}


var tickrate    = 60,
    interval    = 1000/tickrate,
    clock       = 0,
    newClock    = 20,
    start       = false;
var startSim = function() { start = true; }
var stopSim  = function() { start = false; }

var mainLoop = setInterval(function () {
    if (start) {
        //Clock (global cycle);
        if (clock >= newClock) { clock = 0; } else { clock++; };
        //Clear quadtree and repopulate (needs to repopulate because needs to insert things in areas that we need);
        reInsert();

        //collision detection for all of the circles
        //Pass in true for no logging
        collisionDetect(true);

        //Randomly generate circles
        if (clock == 0) {
            var size = randomSize(5, 20),
                widt = parseInt($(window).width()),
                heig = parseInt($(window).height());
            // console.log(size);
            // console.log('New Circle',circles.length);
            var x = Math.floor(Math.random()*widt);
            var y = Math.floor(Math.random()*heig);
            board.insert(new Circle('board', {width: size, height: size, x: x, y: y}, 'blue'));
            newClock = Math.floor(Math.random()*(100-20)+20);
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
