var board = new Quadtree(0, {
    width: parseInt($('#board').width()),
    height: parseInt($('#board').height()),
    x: $('#board').offset().left,
    y: $('#board').offset().top
});
//canvasid, bounds, color
var collisionDetect = function(debug) {
    for (var circle in circles) {
        var matches = board.retrieve(circles[circle]);
        // For all of the matches
        for (var match in matches) {
            if (circles[circle] && matches[match] && circles[circle].id != matches[match].id) {
                //Distance formula.
                var ydiff = parseInt($('#'+matches[match].id).attr('cy'))-parseInt($('#'+circles[circle].id).attr('cy')),
                    xdiff = parseInt($('#'+matches[match].id).attr('cx'))-parseInt($('#'+circles[circle].id).attr('cx')),
                    ysqr  = ydiff*ydiff,
                    xsqr  = xdiff*xdiff;
                //Actual Distance between two
                var distance = Math.sqrt(ysqr+xsqr);
                //distance for touching between the two
                var contactDist = parseInt($('#'+circles[circle].id).attr('r'))+parseInt($('#'+matches[match].id).attr('r'));
                //if touching
                if (distance < contactDist) {
                    circles[circle].explode();
                    matches[match].explode();
                }
            }
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
var randomColor = function() {
    var r = Math.floor(Math.random()*250+6),
        g = Math.floor(Math.random()*250+6),
        b = Math.floor(Math.random()*250+6);
    return 'rgb('+r+', '+g+', '+b+')';
}


var tickrate    = 60,
    interval    = 1000/tickrate,
    clock       = 0,
    newClock    = 20,
    start       = true;
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
        if (clock == 0 && numCir < 60) {
            var size = randomSize(5, 20),
                stro = randomColor(),
                widt = parseInt($(window).width()),
                heig = parseInt($(window).height());
            // console.log(size);
            // console.log('New Circle',circles.length);
            var x = Math.floor(Math.random()*widt);
            var y = Math.floor(Math.random()*heig);
            board.insert(new Circle('board', {width: size, height: size, x: x, y: y}, stro, 'white'));
            numCir++;
            newClock = Math.floor(Math.random()*(70-20)+20);
        }
    }
}, interval);

// $('#board').click(function(e) {
//     // console.log(e.pageX);
//     // console.log(e.pageY);
//     board.insert(new Circle('board', {width: 10, height: 10, x: e.pageX-10, y: e.pageY-10}, 'blue'));
//     // console.log(board);
//     // console.log("----------");
//     // board.visualize();
//     board.retrieve(circles[circles.length-1]);
// })
var prev     = false,
    now      = false,
    moveDist = 30;

$('#board').click(function(e) {
    if (!prev) { prev = {x:e.pageX, y: e.pageY} };
    now = {x: e.pageX, y: e.pageY};
    // if (  Math.abs(Math.abs(now.x)-Math.abs(prev.x))>moveDist || Math.abs(Math.abs(now.y)-Math.abs(prev.y)) > moveDist  ) {
        var size = 1;

        board.insert(new Circle('board', {width: size, height: size, x: now.x, y: now.y}, 'transparent', 'white'));
        numCir++;
        circles[circles.length-1].explode();

        prev = {x: e.pageX, y: e.pageY}
    // }
})
