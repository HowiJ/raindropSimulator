var board = new Quadtree(0, {
    width: parseInt($('#board').width()),
    height: parseInt($('#board').height()),
    x: $('#board').offset().left,
    y: $('#board').offset().top
});
//canvasid, bounds, color

var interval    = 1000/fps,
    fps         = 60,
    clock       = 0;

var mainLoop = setInterval(function () {
    //Clock
    if (clock >= 500) { clock = 0; } else { clock++; };
    //Clear quadtree and repopulate
    board.clear();
    for (var circle in circles) {
        board.insert(circles[circle]);
    }

    //collision detection
    // console.log(circles);
    for (var circle in circles) {
        var matches = board.retrieve(circle);
            // console.log(circle);
            for (var match in matches) {
                // console.log('Circle: ',circle.id);
                // console.log('Match: ',match.id);
                if (circles[circle].id != matches[match].id) {
                    // sqrt(  (y2-y1)*(y2-y1) + (x2-x1)*(x2-x1)  );
                    // console.log('MatchY:', $('#'+matches[match].id).attr('cy'));
                    // console.log('MatchX:', $('#'+matches[match].id).attr('cx'));

                    var ydiff = parseInt($('#'+matches[match].id).attr('cy'))-parseInt($('#'+circles[circle].id).attr('cy')),
                        xdiff = parseInt($('#'+matches[match].id).attr('cx'))-parseInt($('#'+circles[circle].id).attr('cx')),
                        ysqr  = ydiff*ydiff,
                        xsqr  = xdiff*xdiff;

                    var distance = Math.sqrt(ysqr+xsqr);
                    var contactDist = parseInt($('#'+circles[circle].id).attr('r'))+parseInt($('#'+matches[match].id).attr('r'));
                    // console.log(ydiff);
                    // console.log(xdiff);
                    // console.log(ysqr);
                    // console.log(xsqr);
                    // console.log('Distance:',distance);
                    // console.log('contactD:',contactDist);

                    if (distance < contactDist) {
                        circles[circle].explode();
                        matches[match].explode();
                    }
                }


            }
    }

    //Randomly generate circles
    if (clock == 0) {
        var x = Math.floor(Math.random()*400+8);
        var y = Math.floor(Math.random()*400+8);
        // board.insert(new Circle('board', {width: 10, height: 10, x: x, y: y}, 'blue'));
    }
}, interval);

$('#board').click(function(e) {
    console.log(e.pageX);
    console.log(e.pageY);
    board.insert(new Circle('board', {width: 10, height: 10, x: e.pageX-10, y: e.pageY-10}, 'blue'));
    // console.log(board);
    console.log("----------");
    board.visualize();
})
