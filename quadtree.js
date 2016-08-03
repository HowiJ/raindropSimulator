//Quadtree Class Declaration
var Quadtree = function(level, bounds) {
    this.maxObj = 5;
    this.maxLvl = 2;
    //{width, height, x, y}
    this.bounds     = bounds;
    //current level
    this.level      = level;
    //objects in this node
    this.objects    = [];
    //Child Quadtrees
    //  1 0
    //  2 3
    this.nodes      = [null, null, null, null];
}
//Clears out all objects from all nodes.
Quadtree.prototype.clear = function() {
    this.objects = [];
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i]) {
            this.nodes[i].clear();
        }
    }
}
//Splits the node into further quadtrees
Quadtree.prototype.split = function() {
    var subWidth    = this.bounds.width/2,
        subHeight   = this.bounds.height/2,
        x           = this.bounds.x,
        y           = this.bounds.y;

    this.nodes[0] = new Quadtree(this.level+1, {width: subWidth, height: subHeight, x: x+subWidth,  y: y});
    this.nodes[1] = new Quadtree(this.level+1, {width: subWidth, height: subHeight, x: x,           y: y});
    this.nodes[2] = new Quadtree(this.level+1, {width: subWidth, height: subHeight, x: x,           y: y+subHeight});
    this.nodes[3] = new Quadtree(this.level+1, {width: subWidth, height: subHeight, x: x+subWidth,  y: y+subHeight});
}
//Index the object
//obj must have properties x, y, width, height
Quadtree.prototype.getIndex = function(obj) {
    //Belongs to the parent node because it doesn't fit completely in this current one.
    var index   = -1;

    //Double Values
    var vertMid = this.bounds.x+this.bounds.width/2,        //Line that goes |
        horiMid = this.bounds.y+this.bounds.height/2,       //Line that goes --
        compensation = 100;


    var isTop = obj.y+compensation < horiMid && obj.y+obj.height+compensation < horiMid,  //Is within Top
        isBot = obj.y+compensation > horiMid,                                //Is within Bottom
        isLef = obj.x+compensation < vertMid && obj.x+compensation+obj.width < vertMid,   //Is within Left
        isRig = obj.x+compensation > vertMid;                                //Is within Right

    if (isTop) {
        if (isRig) { index = 0; }
        if (isLef) { index = 1; }   }
    if (isBot) {
        if (isLef) { index = 2; }
        if (isRig) { index = 3; }   }

    return index;
}
//Inserting Objs into the tree
Quadtree.prototype.insert = function(obj) {
    // console.log('Insert');
    if (this.nodes[0] != null) {
        var index = this.getIndex(obj);

        if (index != -1) {
            this.nodes[index].insert(obj);

            return ;
        }
    }

    this.objects.push(obj);
    if (this.objects.length > this.maxObj && this.level < this.maxLvl) {
        // console.log('In IF');
        if (this.nodes[0] == null) {
            this.split();
        }

        var i = 0;
        while (i < this.objects.length) {
            var index = this.getIndex(this.objects[i]);
            if (index != -1) {
                var insert = this.objects.splice(i, 1)[0];
                this.nodes[index].insert(insert);
            } else {
                i++;
            }
        }
    }
}
//Get all possible hits
Quadtree.prototype.retrieve = function(obj, arr) {
    if (arr === undefined) { arr = []; }

    var index = this.getIndex(obj);
    if (index != -1 && this.nodes[0] != null) {
        this.nodes[index].retrieve(obj, arr);
    }
    for (var i = 0; i < this.objects.length; i++) {
        arr.push(this.objects[i]);
    }
    return arr;
}
//Just to see.. Not really working lol.
Quadtree.prototype.visualize = function() {
    var tree = '-';
    for (var i = 0; i < this.level; i++) {
        tree = tree+'--|';
    }
    console.log(tree,'>>',this.level);
    if (this.objects.length > 0) {
        for (var i = 0; i < this.objects.length; i++) {
            console.log(tree+' '+this.objects[i].id);
        }
    }
    if (this.nodes[0]!= null) {
        this.nodes[0].visualize();
        this.nodes[1].visualize();
        this.nodes[2].visualize();
        this.nodes[3].visualize();
    }
}
