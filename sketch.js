var canvas;
var clips, orderedClips;
var durations = [];
var totalTime;
var LENGTH_BAR = 400;
var DELTA = 3;
var regions = [];
var valueToDraw;

function setup() {
  canvas = createCanvas(600, 400);
  clips = [
  	[15, 1],
  	[15, 0.5],
  	[20, 0.2],
  	[12, 0.8],
  	[13, 0.5],
  	[17, 0.2],
  	[9, 0.5],
  	[5, 0.8],
  	[12, 0.8]
  	];
  /*totalTime=0;
  for (var i=0;i<clips.length;i++){
 	totalTime+=clips[i][0];
  }*/
  textFont('Helvetica');
  textSize(10);
  textAlign(CENTER);

  orderedClips = clips.slice();
  orderedClips = orderedClips.sort(function(a,b){return b[1]-a[1];});

  durations = sumClips(orderedClips);
  totalTime = durations[durations.length-1][0];

  valueToDraw = durations[durations.length-1][1];

}

function sumClips(data){
	var i, j, it, priority;
	var durations = [];
	priority = data[0][1];
	durations.push([data[0][0], priority]);
	i=1;
	j=0;
	it=1;
	while (i<data.length && it<100){
		if (priority==data[i][1]){
			//print(durations[i-1][0]);
			durations[j][0]+=data[i][0];
			i++;
		} else {
			priority = data[i][1];
			durations.push([(data[i][0]+durations[j][0]), priority]);
			j++;
			i++;
		}
		it++;
	}

	return durations;
}

function drawBar(data, valueToDraw, initX, initY, height, length, totalTime){
  var localTmp, inc;
  noStroke();
  localTmp = 0.0;
  push();
  for (var i=0;i < data.length; i++){
  	fill(50+round(data[i][1]*150));
  	inc = round(length*data[i][0]/totalTime);
  	if (data[i][1]>=valueToDraw){
//  	  rect(initX+localTmp+DELTA,initY,inc-DELTA,height); 		
  	  rect(initX+DELTA,initY,inc-DELTA,height); 		
   	  translate(inc,0);
  	} else {

  	}
//  	localTmp+=inc;
  }
  pop();
}

function drawMarks(data, valueToDraw, initX, initY, height, length, totalTime){
  var localTmp, inc, incPrev;
  var alpha;
  var regions = [];
  stroke(225);
  strokeWeight(2);
  line(initX,initY+height/2,initX+length,initY+height/2);
  //line(initX,initY,initX,initY+height);
  ellipse(initX,initY+height/2,3.5);
  ellipse(initX+length,initY+height/2,3.5)
  strokeWeight(0.5);
  fill(200);
  text("0",initX, initY+1.5*height);
  incPrev = 0.0;
  for (var i=0;i < data.length; i++){
  	inc = round(length*data[i][0]/totalTime);
  	//line(initX+inc,initY,initX+inc,initY+height);
  	noStroke();
  	if (valueToDraw>data[i][1]){
  		fill(150);
  	} else {
  		fill(250);
  	}
  	rect(initX+incPrev+DELTA/2, initY, inc-incPrev-DELTA, height);
  	regions.push([initX+incPrev+DELTA/2, 
  		initY, 
  		initX+incPrev+DELTA/2+inc-incPrev-DELTA, 
  		initY+height, 
  		data[i][1]]);
  	//alpha = asin(height/(2*(inc+10)));
  	//arc(initX-10,initY+height/2,2*(inc+10),2*(inc+10),-alpha, alpha);	
 	var s = sec2minsec(data[i][0]);
 	fill(200);
  	text(s,initX+inc,initY+1.5*height);
  	incPrev = inc;
  }
  return regions;
}

function sec2minsec(value){
	var s, min, sec;
	min = floor(value/60);
	sec = value%60;
	if (sec<10){
		s = min.toString() + ":0" + sec.toString();
	} else {
		s = min.toString() + ":" + sec.toString();
	}
	return s;
}

function draw() {
  background(0);

  drawBar(clips, valueToDraw, 100, 100, 50, LENGTH_BAR, totalTime);

  regions = drawMarks(durations, valueToDraw, 300, 300, 30, LENGTH_BAR/2, totalTime);

}

function mousePressed(){
	for (var i=0;i<regions.length;i++){
		if (mouseX>regions[i][0] && mouseX<regions[i][2] && mouseY>regions[i][1] && mouseY<regions[i][3]){
			valueToDraw = regions[i][4];
			break;
		}
	}
	return false;
}

