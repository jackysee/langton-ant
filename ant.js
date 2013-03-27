var Plane = {

	getPlane: function(){
		this.el = this.el || util.$('plane');
		return this.el;
	},

	generate: function(num){
		this.size =  num;
		this.getPlane().innerHTML = this.generateTableHtml(num);
	},

	generateTableHtml: function(num){
		var html = [];
		for(var i=0; i<num; i++){
			html.push("<tr>");
			for(var j=0; j<num; j++){
				html.push('<td id="'+i+'-'+j+'"></td>');
			}
			html.push("</tr>");
		}
		return html.join("");
	},

	isBlack: function(xy){
		return util.$(xy.join("-")).className === "black";
	},

	flip: function(xy){
		util.$(xy.join("-")).className = this.isBlack(xy)? "":"black";
	},

	rightOf: function(xy){
		var row = xy[0];
		var col = xy[1]+1 >= this.size? xy[1]+1-this.size : xy[1]+1;
		return [row, col];
	},

	leftOf: function(xy){
		var row = xy[0];
		var col = xy[1]-1 < 0? this.size-1 : xy[1]-1;
		return [row, col];
	},

	upOf: function(xy){
		var row = xy[0]-1 < 0? this.size-1 : xy[0]-1;
		var col = xy[1];
		return [row, col];
	},

	downOf: function(xy){
		var row = xy[0]+1 >= this.size? xy[0]+1-this.size : xy[0]+1;
		var col = xy[1];
		return [row, col];

	}


};

var Ant = {

	rightOf:{n:'e', e:'s', s:'w', w:'n' },
	leftOf:{n:'w', w:'s', s:'e', e:'n'},
	rightOfCell: {n:'rightOf', e:'downOf', s:'leftOf', w:'upOf'},
	leftOfCell: {n:'leftOf', e:'upOf', s:'rightOf', w:'downOf'},

	init: function(xy, dir, plane){
		this.xy = xy;
		this.dir = dir;
		this.plane = plane;
	},

	turnRight: function(){
		this.plane.flip(this.xy);
		this.xy = this.plane[this.rightOfCell[this.dir]](this.xy);
		this.dir = this.rightOf[this.dir];
	},

	turnLeft: function(){
		this.plane.flip(this.xy);
		this.xy = this.plane[this.leftOfCell[this.dir]](this.xy);
		this.dir = this.leftOf[this.dir];
	},

	walk: function(){
		if(Plane.isBlack(this.xy))
			this.turnLeft();
		else
			this.turnRight();

	}
};

var App = {
	timer: null,
	start: function(xy){
		Ant.init(xy, 'n', Plane);
		Ant.walk();
		this.timer = setInterval(function(){ Ant.walk(); }, 100);
	},
	stop: function(){
		clearInterval(this.timer);
	}
};

var util = {
	$: function(id){
		return document.getElementById(id);
	},
	isTd: function(ev){
		return ev.target.tagName.toLowerCase() === 'td';
	},
	getXy: function(ev){
		return ev.target.id.split("-").map(function(num){
			return parseInt(num, 10);
		});
	}
};
