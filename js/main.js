/**
 * 五子棋小游戏
 */
var chessboard = document.getElementById('chessboard');
var cxt = chessboard.getContext('2d');
var myTurn = true;
var over = false;
//棋子落点坐标集合
var spots = [];
for(var i=0;i<15;i++){
	spots[i] = [];
	for(var j=0;j<15;j++){
		spots[i][j] = 0;
	}
}

/**
 * 算法参考 http://www.imooc.com/video/11633
 */
// 赢法数组
var wins = [];
// 赢法统计数组
var myWin = [];
var computerWin = [];

for(var i=0;i<15;i++){
	wins[i] = [];
	for(var j=0;j<15;j++){
		wins[i][j] = [];
	}
}
var count = 0;
//纵向线s
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
//横向线s
for(var i=0;i<15;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
//正斜线s
for(var i=0;i<11;i++){
	for(var j=0;j<11;j++){
		for(var k=0;k<5;k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
//反斜线s
for(var i=0;i<11;i++){
	for(var j=14;j>3;j--){
		for(var k=0;k<5;k++){
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}

for(var i=0;i<count;i++){
	myWin[i] = 0;
	computerWin[i] = 0;
}



var bgImg = new Image();
bgImg.src = "img/bg.jpg";
bgImg.onload = function(){
	cxt.drawImage(bgImg,0,0,900,900);
	createLine();
	
//	createChess(0,0,true);
//	createChess(1,1,false);
}

/**
 * 创建纵横线
 */
function createLine(){
	for(var i=0;i<15;i++){
		//横
		cxt.moveTo(30,30+i*60);
		cxt.lineTo(870,30+i*60);
		cxt.stroke();
		//纵
		cxt.moveTo(30+i*60,30);
		cxt.lineTo(30+i*60,870);
		cxt.stroke();
	}
}

/**
 * 创建黑白棋子
 * @param {Number} i
 * @param {Number} j
 * @param {Boolean} myTurn
 */
function createChess(i,j,myTurn){
	cxt.beginPath();
	cxt.arc(30+i*60,30+j*60,28,0,2*Math.PI);
	cxt.closePath();
	var grd = cxt.createRadialGradient(30+i*60,30+j*60,28,30+i*60+5,30+j*60-5,5);
	//我方为黑子,对方为白子
	if(myTurn){
		grd.addColorStop(0,"#0A0A0A");
		grd.addColorStop(1,"#636766");
	}else{
		grd.addColorStop(0,"#D1D1D1");
		grd.addColorStop(1,"#F9F9F9");
	}
	cxt.fillStyle = grd;
	cxt.fill();
}

/**
 * 通过鼠标点击时的坐标来确定落点
 * @param {Object} e
 */
chessboard.onclick = function(e){
	if(over || !myTurn){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/60);
	var j = Math.floor(y/60);
	if(spots[i][j] == 0){
		createChess(i,j,myTurn);
//		if(myTurn){
//			spots[i][j] = 1;
//		}else{
//			spots[i][j] = 2;
//		}
		spots[i][j] = 1;
		
		for(var k=0;k<count;k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k] = 6;
				if(myWin[k] == 5){
					window.alert("You Win!");
					over = true;
				}
			}
		}
		if(!over){
			myTurn = !myTurn;
			computerAI();
		}
	}
}

function computerAI(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0,v = 0;
	for(var i=0;i<15;i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0;j<15;j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(spots[i][j] == 0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k] == 1){
							myScore[i][j] += 200;
						}else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}else if(myWin[k] == 3){
							myScore[i][j] += 2000;
						}else if(myWin[k] == 4){
							myScore[i][j] += 10000;
						}
						
						if(computerWin[k] == 1){
							computerScore[i][j] += 220;
						}else if(computerWin[k] == 2){
							computerScore[i][j] += 420;
						}else if(computerWin[k] == 3){
							computerScore[i][j] += 2100;
						}else if(computerWin[k] == 4){
							computerScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	createChess(u,v,false);
	spots[u][v] = 2;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k] == 5){
				window.alert("You Lose!");
				over = true;
			}
		}
	}
	if(!over){
		myTurn = !myTurn;
	}
}
