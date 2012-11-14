

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function( callback ){window.setTimeout(callback, 1000 / 60);};
})();

var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 480;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

var canvasMinX;
var canvasMaxX;
var canvasMinY;
var canvasMaxY;
var mouseX = 0;
var mouseY = 0;

var sC = 0;	// second count
var uC = 0;
var dC = 0;	// draw count

setTimeout("timer()",1000);
function timer() {
	sC++;
	setTimeout("timer()",1000);
}

document.onmousemove = onMouseMove;
document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;

init_mouse();
window.onresize = function() {init_mouse();}

function init_mouse() {
  canvasMinY = $("canvas").offset().top;
  canvasMaxY = canvasMinY + CANVAS_HEIGHT;
  canvasMinX = $("canvas").offset().left;
  canvasMaxX = canvasMinX + CANVAS_WIDTH;
}

function onMouseMove(evt) {
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) mouseX = evt.pageX - canvasMinX;
  if (evt.pageY > canvasMinY && evt.pageY < canvasMaxY) mouseY = evt.pageY - canvasMinY;
}

function onMouseDown(evt) {
	for (var i = 0; i < OBJECT_NUM; i++) object_arr[i].mousedown();
}

function onMouseUp(evt) {
	for (var i = 0; i < OBJECT_NUM; i++) object_arr[i].mouseup();
}

var FPS = 32;
var PARTICLE_NUM = 100
var OBJECT_NUM = 3;

// Object array initialization
var object_arr = [];
for (var i = 0; i < 1; i++) object_arr[i] = new g_object(CANVAS_WIDTH*0.8*Math.random(),CANVAS_HEIGHT*0.8*Math.random(), 50, i%2?-500:500);
for (var i = 1; i < OBJECT_NUM-2; i++) object_arr[i] = new l_object(CANVAS_WIDTH*0.8*Math.random(),CANVAS_HEIGHT*0.8*Math.random(), 30, Math.random()*2*Math.PI);
for (var i = OBJECT_NUM-2; i < OBJECT_NUM; i++) object_arr[i] = new c_object(CANVAS_WIDTH/2,i%2?100:0+CANVAS_HEIGHT/2,60);


// Particle array initialization
var par_arr = [];
for (var i = 0; i < PARTICLE_NUM; i++)
 par_arr[i] = new particle(Math.random()*CANVAS_WIDTH, Math.random()*CANVAS_HEIGHT, 100, i%3==0?100:(i%3==1?300:500),i%3==0?"black":(i%3==1?"purple":"lime")/*i%2?100:300,i%2?"black":"lime"*/,4);


// Button functions
function addGreen() {
	object_arr[OBJECT_NUM] = new g_object(CANVAS_WIDTH*0.8*Math.random(),CANVAS_HEIGHT*0.8*Math.random(), 50, 500);
	OBJECT_NUM++;
}
function addRed() {
	object_arr[OBJECT_NUM] = new g_object(CANVAS_WIDTH*0.8*Math.random(),CANVAS_HEIGHT*0.8*Math.random(), 50, -500);
	OBJECT_NUM++;
}

function addLaser() {
	object_arr[OBJECT_NUM] = new l_object(CANVAS_WIDTH*0.8*Math.random(),CANVAS_HEIGHT*0.8*Math.random(), 30, Math.random()*2*Math.PI);
	OBJECT_NUM++;
}

function addCounter() {
	object_arr[OBJECT_NUM] = new c_object(CANVAS_WIDTH*0.8*Math.random(),CANVAS_HEIGHT*0.8*Math.random(),60);
	OBJECT_NUM++;
}

function subtractLast() {
	if (OBJECT_NUM != 0)
	{
		delete object_arr[OBJECT_NUM-1];
		OBJECT_NUM--;
	}
}
	
function changeParCount() {
	PARTICLE_NUM = Number(document.getElementById('i1').value);
	//PARTICLE_NUM = pn;
	par_arr = [];
	for (var i = 0; i < PARTICLE_NUM; i++) par_arr[i] = new particle(Math.random()*CANVAS_WIDTH, Math.random()*CANVAS_HEIGHT, 100, i%3==0?100:(i%3==1?300:500),i%3==0?"black":(i%3==1?"purple":"lime")/*i%2?100:300,i%2?"black":"lime"*/,4);
}

// Counter object class
function c_object(xpos, ypos, side)
{
	this.X = xpos-side/2;
	this.Y = ypos-side/2;
	this.side = side;
	this.grd = canvas.createLinearGradient(this.X,this.Y,this.side,this.side);
	
	this.flipStage = 0;
	this.flipDir = -1;
	
	this.grabbedBody = false;
	//this.grabbedRad = false;
				
	var grabX = 0, grabY = 0;
	var drawSide = 1;
	var drawSideCol = "gray";
	
	var parCountB = 0;
	var parCountP = 0;
	var parCountL = 0;
	
	var percentageB = 0;
	var percentageP = 0;
	var percentageL = 0;
				
	var parCountBR = 0;
	var parCountPR = 0;
	var parCountLR = 0;
	var total = 0;
				
	var parCountBArr = [];
	var parCountPArr = [];
	var parCountLArr = [];
	var arrSize = 1*FPS;
	var arrCounter = 0;
	for (var i = 0; i < arrSize; i++) parCountBArr[i] = parCountPArr[i] = parCountLArr[i] = 0;
	
	var cMax = 50;
	//var drawRadius = 1;
	//var drawRadCol = "gray";
	
	this.mousedown = function ()
	{
		if (mouseX > this.X && mouseX < this.X+this.side && mouseY > this.Y && mouseY < this.Y+this.side)
		{
			this.grabbedBody = true;
			grabX = this.X - mouseX;
			grabY = this.Y - mouseY;
		}
	}
	
	this.mouseup = function ()
	{
		this.grabbedBody = false;
	}
	
	this.update_object = function(par_arr)
	{
		var dis = Math.sqrt(Math.pow(this.X-mouseX,2) + Math.pow(this.Y-mouseY,2));
		
		if (mouseX > this.X && mouseX < this.X+this.side && mouseY > this.Y && mouseY < this.Y+this.side) this.flipDir = 1;
		else this.flipDir = -1;
		
		if (mouseX > this.X && mouseX < this.X+this.side && mouseY > this.Y && mouseY < this.Y+this.side)
		{drawSideCol = "black"; drawSide = 2;}
		else {drawSideCol = "black"; drawSide = 2;}
		
		if (this.grabbedBody == true) {this.X = mouseX+grabX; this.Y = mouseY+grabY; this.flipDir = 1;}
		/*else if (this.grabbedRad == true)
		{
			this.radius = Math.sqrt(Math.pow(this.X-mouseX,2) + Math.pow(this.Y-mouseY,2));
			if (this.radius < 10) this.radius = 10;
			else if (this.radius > 200) this.radius = 200;
			//else this.radius = Math.sqrt((mouseX+grabX)*(mouseX+grabX) + (mouseY+grabY)*(mouseY+grabY));
		}*/
		
		if (this.flipDir > 0 && this.flipStage < 1)
		{
			this.flipStage += 5/FPS;
			if (this.flipStage >= 1) this.flipStage = 1;
		}
		else if (this.flipDir < 0 && this.flipStage > 0)
		{
			this.flipStage -= 5/FPS;
			if (this.flipStage <= 0) this.flipStage = 0;
		}
		
		var disX, disY;
		parCountB = 0;
		parCountP = 0;
		parCountL = 0;
		
		for (var i = 0; i < PARTICLE_NUM; i++)
		{
			//disX = par_arr[i].X - this.X;
			//disY = par_arr[i].Y - this.Y;
			
			if (par_arr[i].X > this.X && par_arr[i].X < this.X+this.side && par_arr[i].Y > this.Y && par_arr[i].Y < this.Y+this.side)
			{
				switch (par_arr[i].pcolor)
				{
					case "black": parCountB++; break;
					case "purple": parCountP++; break;
					case "lime": parCountL++; break;
				}
				//par_arr[i].pcolor=="black"?parCountB++:(par_arr[i].pcolor=="purple"?parCountP++:parCountL++);
			}					
		}
	
		if (arrCounter == arrSize) arrCounter = 0;
		parCountBArr[arrCounter] = parCountB>cMax?cMax:parCountB;
		parCountPArr[arrCounter] = parCountP>cMax?cMax:parCountP;
		parCountLArr[arrCounter] = parCountL>cMax?cMax:parCountL;
		arrCounter++;
		
		parCountBR = parCountPR = parCountLR = 0;
		for (var i = 0; i < arrSize; i++)
		{
			parCountBR += parCountBArr[i];
			parCountPR += parCountPArr[i];
			parCountLR += parCountLArr[i];
		}
		
		parCountB = parCountBR/arrSize;
		parCountP = parCountPR/arrSize;
		parCountL = parCountLR/arrSize;
		
		
		/*total = parCountBR + parCountPR + parCountLR;
		if (total != 0){
			percentageB = 100*parCountBR/total;
			percentageP = 100*parCountPR/total;
			percentageL = 100*parCountLR/total;
		}
		else percentageB = percentageP = percentageL = 0;*/
	}
	
	this.draw_object = function ()
	{
		this.grd = canvas.createLinearGradient(this.X + this.flipStage*this.side,this.Y,this.side+this.X-this.flipStage*this.side,this.Y + this.side);
		this.grd.addColorStop(0,"black");
		this.grd.addColorStop(.5,this.flipDir==-1?"gray":"transparent");
		this.grd.addColorStop(1,"black");
		
		/*this.grd.addColorStop(0, "transparent")
		this.grabbedBody ? this.grd.addColorStop(0.3+this.flipStage*.6, this.color) :
		this.grd.addColorStop(0.3+this.flipStage*.6, this.color);
		this.grd.addColorStop(1, "transparent");*/
		
		canvas.beginPath();
		canvas.rect(this.X,this.Y,this.side,this.side);
		canvas.fillStyle = this.grd;
		canvas.fill();
		canvas.lineWidth = drawSide;
		canvas.strokeStyle = drawSideCol;
		canvas.stroke();
		
		
		canvas.beginPath();
		canvas.fillStyle = "black";
		//canvas.fillText(parCountB,5+this.X,35+this.Y);
		canvas.rect(this.X+5,this.Y+5,parCountB>cMax?cMax:parCountB,10);
		canvas.fill();
		canvas.lineWidth = 1;
		canvas.strokeStyle = "black";
		canvas.stroke();
		//canvas.fillText(percentageB.toFixed(0) + "%",30+this.X,35+this.Y);
		
		canvas.beginPath();
		canvas.fillStyle = "purple";
		//canvas.fillText(parCountP,5+this.X,15+this.Y);
		canvas.rect(this.X+5,this.Y+25,parCountP>cMax?cMax:parCountP,10);
		canvas.fill();
		canvas.lineWidth = 1;
		canvas.strokeStyle = "black";
		canvas.stroke();
		//canvas.fillText(percentageP.toFixed(0) + "%",30+this.X,15+this.Y);
		
		canvas.beginPath();
		canvas.fillStyle = "lime";
		//canvas.fillText(parCountL,5+this.X,55+this.Y);
		canvas.rect(this.X+5,this.Y+45,parCountL>cMax?cMax:parCountL,10);
		canvas.fill();
		canvas.lineWidth = 1;
		canvas.strokeStyle = "black";
		canvas.stroke();
		//canvas.fillText(percentageL.toFixed(0) + "%",30+this.X,55+this.Y);
	}
	
	return this;
}

// Laser object class
function l_object(xpos, ypos, rad, angle)
{
	this.X = xpos;
	this.Y = ypos;
	this.radius = rad;
	this.color = "purple";
	this.grd = canvas.createRadialGradient(this.X, this.Y, 0, this.X, this.Y, 2*this.radius);
	
	this.flipStage = 0;
	this.flipDir = -1;
	
	this.grabbedBody = false;
	this.grabbedRad = false;
	
	this.storeCharge = this.charge;
	
	var grabX = 0, grabY = 0;
	var drawRadius = 1;
	var drawRadCol = "gray";
	
	var l_angle = angle;
	var rad_over = false;
	
	var shoot_speed = 10;
	var line_length = 200;
	
	this.mousedown = function ()
	{
		grabX = this.X - mouseX;
		grabY = this.Y - mouseY;
		var dis = Math.sqrt(Math.pow(this.X-mouseX,2) + Math.pow(this.Y-mouseY,2));
		if (dis < this.radius-5) this.grabbedBody = true;
		else if (dis < this.radius+5 && dis > this.radius - 5) this.grabbedRad = true;
	}
	
	this.mouseup = function ()
	{
		this.grabbedBody = false;
		this.grabbedRad = false;
		drawRadius = 1;
		drawRadCol = "gray";
	}
	
	
	this.update_object = function(par_arr)
	{
		var dis = Math.sqrt(Math.pow(this.X-mouseX,2) + Math.pow(this.Y-mouseY,2));
		
		if (!this.grabbedRad && dis < this.radius - 5) this.flipDir = 1;
		else this.flipDir = -1;
		
		if (!this.grabbedBody && dis < this.radius+5 && dis > this.radius - 5) {drawRadCol = "purple"; drawRadius = 3;rad_over=true;}
		else {drawRadCol = "gray"; drawRadius = 1;rad_over=false;}
		
		if (this.grabbedBody == true) {this.X = mouseX+grabX; this.Y = mouseY+grabY; this.flipDir = 1;}
		else if (this.grabbedRad == true)
		{
			l_angle = 3*Math.PI/2-Math.atan2(this.X-mouseX,this.Y-mouseY);
			//line_length = dis-this.radius;
			//if(line_length>200)line_length=200;else if(line_length<20)line_length=20;
			//shoot_speed = line_length/20;
			//if(shoot_speed>10)shoot_speed=10;else if(shoot_speed<2)shoot_speed=2;
		}
		
		if (this.flipDir > 0 && this.flipStage < 1)
		{
			this.flipStage += 5/FPS;
			if (this.flipStage >= 1) this.flipStage = 1;
		}
		else if (this.flipDir < 0 && this.flipStage > 0)
		{
			this.flipStage -= 5/FPS;
			if (this.flipStage <= 0) this.flipStage = 0;
		}
		
		//this.X += .01*Math.random()-.005;
		//this.Y += .01*Math.random()-.005;
		
		var disX, disY, distance2, distance, force;
		for (var i = 0; i < PARTICLE_NUM; i++)
		{
			disX = this.X - par_arr[i].X;
			disY = this.Y - par_arr[i].Y;
			if (Math.abs(disX) < this.radius && Math.abs(disY) < this.radius)
			{
				distance2 = disX*disX + disY*disY;
				if (distance2 < this.radius*this.radius)
				{
					par_arr[i].X = this.X+this.radius*Math.cos(l_angle) + 5*Math.random() - 2.5;
					par_arr[i].Y = this.Y+this.radius*Math.sin(l_angle) + 5*Math.random() - 2.5;
					par_arr[i].vX = shoot_speed*Math.cos(l_angle) + .4*Math.random() - .2;
					par_arr[i].vY = shoot_speed*Math.sin(l_angle) + .4*Math.random() - .2;
				}
			}
		}
	}
	
	this.draw_object = function ()
	{
		this.grd = canvas.createRadialGradient(this.X, this.Y, 0, this.X, this.Y, 1*this.radius);
		this.grd.addColorStop(0, "black")
		this.grabbedBody ? this.grd.addColorStop(0.3+this.flipStage*.6, "transparent") :
		this.grd.addColorStop(0.3+this.flipStage*.6, this.flipDir < 1 ? this.color : "transparent");
		this.grd.addColorStop(1, "black");
		
		canvas.beginPath();
		canvas.arc(this.X,this.Y,this.radius,0,2*Math.PI,false);
		canvas.fillStyle = this.grd;
		canvas.fill();
		canvas.lineWidth = drawRadius;
		canvas.strokeStyle = drawRadCol;
		//canvas.strokeStyle = "transparent";
		canvas.stroke();
						
		canvas.beginPath();
		canvas.arc(this.X+this.radius*Math.cos(l_angle),this.Y+this.radius*Math.sin(l_angle),5,0,2*Math.PI,false);
		canvas.fillStyle = "black";
		canvas.fill();
		canvas.lineWidth = 1;
		canvas.strokeStyle = "gray";
		//canvas.strokeStyle = "transparent";
		canvas.stroke();
		
		if (rad_over || this.grabbedRad || this.grabbedBody)
		{
			canvas.beginPath();
			canvas.moveTo(this.X+this.radius*Math.cos(l_angle),this.Y+this.radius*Math.sin(l_angle));
			canvas.lineTo(this.X+(line_length+this.radius)*Math.cos(l_angle),this.Y+(line_length+this.radius)*Math.sin(l_angle));
			canvas.lineWidth = 1;
			canvas.strokeStyle = "black";
			canvas.stroke();
			/*canvas.beginPath();
			canvas.moveTo(100,100);
			canvas.lineTo(150,150);
			canvas.lineWidth = 3;
			canvas.strokeStyle = "gray";
			canvas.stroke();*/
		}
	}
	
	return this;
}

// Gravity object class
function g_object(xpos, ypos, rad, charge)
{
	this.X = xpos;
	this.Y = ypos;
	this.charge = charge;
	this.radius = rad;
	this.color = charge>0?"green":"red";
	this.grd = canvas.createRadialGradient(this.X, this.Y, 0, this.X, this.Y, 2*this.radius);
	
	this.flipStage = 0;
	this.flipDir = -1;
	
	this.grabbedBody = false;
	this.grabbedRad = false;
	
	this.storeCharge = this.charge;
	
	var grabX = 0, grabY = 0;
	var drawRadius = 1;
	var drawRadCol = "gray";
	
	var C_ROTATION = 0.001;
	var C_FRICTION = 0.98;
	
	var lX = xpos;
	var lY = ypos;
	var vX = 0;
	var vY = 0;
	
	this.mousedown = function ()
	{
		grabX = this.X - mouseX;
		grabY = this.Y - mouseY;
		var dis = Math.sqrt(Math.pow(this.X-mouseX,2) + Math.pow(this.Y-mouseY,2));
		if (dis < this.radius - 5) this.grabbedBody = true;
		else if (dis < this.radius+5 && dis > this.radius - 5) this.grabbedRad = true;
	}
	
	this.mouseup = function ()
	{
		this.grabbedBody = false;
		this.grabbedRad = false;
		drawRadius = 1;
		drawRadCol = "gray";
	}
	/*
	this.chargeup = function()
	{
		if (this.charge < 0) if (this.charge > -10000) this.charge -= 100;
		if (this.charge > 0) if (this.charge < 10000) this.charge += 100;
	}
	
	this.chargedown = function()
	{
		if (this.charge < 0) if (this.charge < -100) this.charge += 100;
		if (this.charge > 0) if (this.charge > 100) this.charge -= 100;
	}
				
	this.radiusup = function() {if (this.radius < 500) this.radius += 1;}
	this.radiusdown = function() {if (this.radius > 5) this.radius -= 1;}
	*/
	this.update_object = function(par_arr)
	{
		var dis = Math.sqrt(Math.pow(this.X-mouseX,2) + Math.pow(this.Y-mouseY,2));
		//if (!this.grabbedRad && Math.abs(this.X - mouseX) < this.radius/2 && Math.abs(this.Y - mouseY) < this.radius/2) this.flipDir = 1;
		
		if (!this.grabbedRad && dis < this.radius - 5) this.flipDir = 1;
		else this.flipDir = -1;
		
		if (!this.grabbedBody && dis < this.radius + 5 && dis > this.radius - 5) {drawRadCol = "black"; drawRadius = 3;}
		else {drawRadCol = "gray"; drawRadius = 1;}
		
		if (this.grabbedBody == true) {this.X = mouseX+grabX; this.Y = mouseY+grabY; this.flipDir = 1; vX = this.X-lX; vY = this.Y-lY;}
		else if (this.grabbedRad == true)
		{
			this.radius = Math.sqrt(Math.pow(this.X-mouseX,2) + Math.pow(this.Y-mouseY,2));
			if (this.radius < 20) this.radius = 20;
			else if (this.radius > 100) this.radius = 100;
			//else this.radius = Math.sqrt((mouseX+grabX)*(mouseX+grabX) + (mouseY+grabY)*(mouseY+grabY));
		}
		else
		{
			if ((this.X + this.radius) >= CANVAS_WIDTH){this.X = CANVAS_WIDTH-this.radius; vX = -vX/2;}
			else if ((this.X - this.radius) <= 0) {this.X = this.radius; vX = -vX/2;}
			
			if ((this.Y+this.radius) >= CANVAS_HEIGHT){this.Y = CANVAS_HEIGHT-this.radius; vY = -vY/2;}
			else if ((this.Y - this.radius) <= 0) {this.Y = this.radius; vY = -vY/2;}
			
			this.X += vX;
			this.Y += vY;
		}
		
		if (this.flipDir > 0 && this.flipStage < 1)
		{
			this.flipStage += 5/FPS;
			if (this.flipStage >= 1) this.flipStage = 1;
		}
		else if (this.flipDir < 0 && this.flipStage > 0)
		{
			this.flipStage -= 5/FPS;
			if (this.flipStage <= 0) this.flipStage = 0;
		}
		
		var disX, disY, distance2, distance, force;
		for (var i = 0; i < PARTICLE_NUM; i++)
		{
			disX = this.X - par_arr[i].X;
			disY = this.Y - par_arr[i].Y;
			//distance2 = Math.pow(disX,2) + Math.pow(disY,2);
			distance2 = disX*disX + disY*disY;
			if (distance2 > this.radius*this.radius)
			{
				distance = Math.sqrt(distance2);
				force = this.charge*par_arr[i].charge/distance2;
				par_arr[i].vX += disX*force/distance/par_arr[i].mass;
				par_arr[i].vY += disY*force/distance/par_arr[i].mass;
			}
			else
			{
				//	par_arr[i].vX += 0.00001*disX*par_arr[i].mass;
				//	par_arr[i].vY += 0.00001*disY*par_arr[i].mass;
				par_arr[i].vX += C_ROTATION*(disX-disY);//-0.001*disY + 0.001*disX;
				par_arr[i].vY += C_ROTATION*(disX+disY);//0.001*disX + 0.001*disY;
				par_arr[i].vX *= C_FRICTION;
				par_arr[i].vY *= C_FRICTION;
			}
		}
		
		lX = this.X;
		lY = this.Y;
	}
	
	this.draw_object = function ()
	{
		this.grd = canvas.createRadialGradient(this.X, this.Y, 0, this.X, this.Y, 1*this.radius);
		this.grd.addColorStop(0, "transparent")
		this.grabbedBody ? this.grd.addColorStop(0.3+this.flipStage*.6, this.color) :
		this.grd.addColorStop(0.3+this.flipStage*.6, this.color);
		this.grd.addColorStop(1, "transparent");
		
		canvas.beginPath();
		canvas.arc(this.X,this.Y,this.radius,0,2*Math.PI,false);
		canvas.fillStyle = this.grd;
		canvas.fill();
		canvas.lineWidth = drawRadius;
		canvas.strokeStyle = drawRadCol;
		//canvas.strokeStyle = "transparent";
		canvas.stroke();
	}
	
	return this;
}

// Particle class
function particle(xpos,ypos,mass,charge,pcolor,psize)
{
	this.X=xpos;
	this.Y=ypos;
	this.mass=mass;
	this.charge=charge;
	this.pcolor=pcolor;
	this.psize=psize;
	this.halfpsize = psize/2;
	this.vX = 0;
	this.vY = 0;
	
	var C_FRICTION = .99;
	var C_RAND_MOV = 0.04;
	var C_WALL_LOSS = .5;
	
	this.updatep = function() {
		if(this.X >= CANVAS_WIDTH) {
			this.X = CANVAS_WIDTH - 1;
			this.vX = -this.vX*C_WALL_LOSS;
		}
		else if(this.X <= 0) {
			this.X = 1;
			this.vX = -this.vX*C_WALL_LOSS;
		}
		
		if(this.Y >= CANVAS_HEIGHT) {
			this.Y = CANVAS_HEIGHT - 1;
			this.vY = -this.vY*C_WALL_LOSS;
		}
		else if(this.Y <= 0) {
			this.Y = 1;
			this.vY = -this.vY*C_WALL_LOSS;
		}
		this.vX = C_FRICTION*this.vX + C_RAND_MOV*(Math.random() - .5);
		this.vY = C_FRICTION*this.vY + C_RAND_MOV*(Math.random() - .5);
		
		this.X += this.vX;
		this.Y += this.vY;
	}
	
	this.drawp = function() {
		canvas.fillStyle = this.pcolor;
		canvas.fillRect(this.X-this.halfpsize,this.Y-this.halfpsize,this.psize,this.psize);
	}
	
	return this;
}

function update()
{
	uC++;
	/*if (keydown.d) player1.radiusup();
	if (keydown.a) player1.radiusdown();
	if (keydown.w) player1.chargeup();
	if (keydown.s) player1.chargedown();
	*/
	for (var i = 0; i < PARTICLE_NUM; i++) par_arr[i].updatep();
	for (var i = 0; i < OBJECT_NUM; i++) object_arr[i].update_object(par_arr);
}

var canvas_grd = canvas.createLinearGradient(CANVAS_WIDTH/2-CANVAS_HEIGHT*CANVAS_HEIGHT/CANVAS_WIDTH/2,0,CANVAS_WIDTH/2+CANVAS_HEIGHT*CANVAS_HEIGHT/CANVAS_WIDTH/2,CANVAS_HEIGHT);
canvas_grd.addColorStop(0,"white");
canvas_grd.addColorStop(0.5,"gray");
canvas_grd.addColorStop(1,"white");

function draw()
{
	requestId = window.requestAnimFrame(draw);
	dC++;
	canvas.beginPath();
	//canvas.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	canvas.rect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	//canvas.fillStyle = "white";
	canvas.fillStyle = canvas_grd;
	canvas.fill();
	canvas.lineWidth = 1;
	canvas.strokeStyle = "black";
	canvas.stroke();

	for (var i = 0; i < PARTICLE_NUM; i++) par_arr[i].drawp();
	for (var i = 0; i < OBJECT_NUM; i++) object_arr[i].draw_object();

	canvas.fillStyle = "#000";
	canvas.fillText("Second count: " + sC,10,10);
	canvas.fillText("Draw iteration count: " + dC,10,20);
	canvas.fillText("Update count: " + uC,10,30);
	canvas.fillText("Frame rate: " + (dC/sC).toFixed(2),10,40);
	canvas.fillText("uC - dC: " + (uC-dC),10,50);
}

setInterval(function() {update();/*draw();*/}, 1000/FPS);
var requestId = 0;
requestId = window.requestAnimFrame(draw);

