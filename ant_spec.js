describe("langton", function(){

	describe("plane", function() {

		beforeEach(function() {
			document.getElementById("plane").innerHTML = "";
		});

		it("should be defined", function() {
			expect(Plane).toBeDefined();
		});

		it("should generate plane html based on number", function(){
			var html  = Plane.generateTableHtml(2);
			expect(html).toEqual('<tr><td id="td_0_0"></td><td id="td_0_1"></td></tr><tr><td id="td_1_0"></td><td id="td_1_1"></td></tr>');
		});

		it("should allow to populate", function() {
			Plane.generate(2);
			expect(document.getElementById("plane").innerHTML).not.toEqual("");
		});

		it("should allow to query cell is black or white", function() {
			Plane.generate(2);
			document.getElementById("td_0_0").className = "black";
			expect(Plane.isBlack([0,0])).toBeTruthy();
			expect(Plane.isBlack([0,1])).toBeFalsy();
		});

		it("should allow to flip color", function() {
			Plane.generate(2);
			Plane.flip([0, 0]);
			expect(document.getElementById("td_0_0").className).toEqual("black");
			Plane.flip([0, 0]);
			expect(document.getElementById("td_0_0").className).toEqual("");
		});

		it("should allow to query current dimension", function() {
			Plane.generate(2);
			expect(Plane.size).toEqual(2);
		});

		it("should gives right point", function() {
			Plane.generate(2);
			expect(Plane.rightOf([0, 0])).toEqual([0, 1]);
			expect(Plane.rightOf([0, 1])).toEqual([0, 0]);
		});

		it("should give left point", function() {
			Plane.generate(2);
			expect(Plane.leftOf([0, 1])).toEqual([0, 0]);
			expect(Plane.leftOf([0, 0])).toEqual([0, 1]);
		});

		it("should give 'up' point", function() {
			Plane.generate(2);
			expect(Plane.upOf([0, 0])).toEqual([1, 0]);
			expect(Plane.upOf([1, 0])).toEqual([0, 0]);
		});

		it("should give 'down' point", function() {
			Plane.generate(2);
			expect(Plane.downOf([0, 0])).toEqual([1, 0]);
			expect(Plane.downOf([1, 0])).toEqual([0, 0]);
		});

		it("should allow to reset plane", function() {
			Plane.generate(2);
			Plane.flip([0, 0]);
			expect(document.querySelectorAll('	.black').length).toEqual(1);
			Plane.clean();
			expect(document.querySelectorAll('.black').length).toEqual(0);
		});

	});

	describe("ant", function() {

		it("should be defined", function() {
			expect(Ant).toBeDefined();
		});

		function checkTurn(turnDir, dir, expectedDir, xy, expectedXy, method){
			spyOn(Plane, method).andReturn(expectedXy);
			spyOn(Plane, 'flip');
			Ant.init([0, 0], dir, Plane);
			Ant['turn'+turnDir]();
			expect(Ant.dir).toEqual(expectedDir);
			expect(Ant.xy).toEqual(expectedXy);
			expect(Plane[method]).toHaveBeenCalled();
			expect(Plane.flip).toHaveBeenCalledWith(xy);
		}

		it("should turn 90 right facing n", function() {
			checkTurn('Right', 'n', 'e', [0, 0], [0, 1], 'rightOf');
		});

		it("should turn 90 right facing e", function(){
			checkTurn('Right', 'e', 's', [0, 0], [1, 0], 'downOf');
		});

		it("should turn 90 right facing s", function() {
			checkTurn('Right', 's', 'w', [0, 0], [0, 1], 'leftOf');
		});

		it("should turn 90 right facing w", function() {
			checkTurn("Right", 'w', 'n', [0, 0], [1, 0], 'upOf');
		});

		it("should turn 90 left facing n", function() {
			checkTurn("Left", 'n', 'w', [0, 0], [0, 1], 'leftOf');
		});

		it("should turn 90 left facing e", function() {
			checkTurn("Left", 'e', 'n', [0, 0], [1, 0], 'upOf');
		});

		it("should turn 90 left facing s", function() {
			checkTurn("Left", 's', 'e', [0, 0], [0, 1], 'rightOf');
		});

		it("should turn 90 left facing w", function() {
			checkTurn("Left", 'w', 's', [0, 0], [1, 0], 'downOf');
		});

		it("should turn left on white square", function(){
			spyOn(Plane, 'isBlack').andReturn(false);
			spyOn(Ant, 'turnRight');
			Ant.init([0, 0], 'n', Plane);
			Ant.walk();
			expect(Plane.isBlack).toHaveBeenCalledWith([0, 0]);
			expect(Ant.turnRight).toHaveBeenCalled();
		});

		it("should turn right on black square", function() {
			spyOn(Plane, 'isBlack').andReturn(true);
			spyOn(Ant, 'turnLeft');
			Ant.init([0, 0], 'n', Plane);
			Ant.walk();
			expect(Plane.isBlack).toHaveBeenCalledWith([0, 0]);
			expect(Ant.turnLeft).toHaveBeenCalled();
		});

	});

	describe("App", function() {

		it("should be defined", function() {
			expect(App).toBeDefined();
		});

		it("should kick start", function() {
			jasmine.Clock.useMock();
			spyOn(Ant, 'init');
			spyOn(Ant, 'walk');
			App.start([0, 0]);
			expect(Ant.init).toHaveBeenCalledWith([0, 0], 'n', Plane);
			expect(Ant.walk).toHaveBeenCalled();
			expect(App.timer).toBeDefined();
			jasmine.Clock.tick(101);
			expect(Ant.walk.calls.length).toEqual(2);

			App.stop();
			jasmine.Clock.tick(101);
			expect(Ant.walk.calls.length).toEqual(2);
		});

	});

	describe("util", function() {

		it("should getId", function() {
			spyOn(document, 'querySelectorAll');
			util.$('abc');
			expect(document.querySelectorAll).toHaveBeenCalledWith('abc');
		});

		it("should detect td from event", function() {
			var ev = { target: {tagName:'TD'}};
			expect(util.isTd(ev)).toBeTruthy();
		});

		it("should get xy from id", function() {
			var ev = { target: {id: 'td_1_2'}};
			expect(util.getXy(ev)).toEqual([1,2]);
		});

	});

});