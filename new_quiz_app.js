// JavaScript Document
var MOD_A_LENGTH = 10;
var MOD_B_LENGTH = 10;
var MOD_C_LENGTH = 10;
var MOD_D_LENGTH = 10;
var MOD_E_LENGTH = 10;
var MOD_F_LENGTH = 10;
var MOD_G_LENGTH = 10;
var MOD_H_LENGTH = 10;

function $(id) {
	"use strict";
	return document.getElementById(id);
}

var rightCount1;
var rightCount2;
var rightCount3;
var rightCount4;
var rightCount5;
var rightCount6;
var wrongCount1;
var wrongCount2;
var wrongCount3;
var wrongCount4;
var wrongCount5;
var wrongCount6;
var greenWidth1;
var greenWidth2;
var greenWidth3;
var greenWidth4;
var greenWidth5;
var greenWidth6;

var moduleList = $("moduleList"),
addModuleList = $("addModuleList"),
question = $("question"),
inputAnswer = $("inputAnswer"),
ratio = $("ratio"),
ratioRed = $("ratioRed"),
ratioGreen = $("ratioGreen"),
submit = $("submit"),
errorMessage = $("errorMessage"),
nextQuestion = $("nextQuestion"),
showAnswer = $("showAnswer"),
dropDownButton = $("dropDownButton"),
dropDownButton2 = $("dropDownButton2"),
B1 = $("B1"),
B2 = $("B2"),
B3 = $("B3"),
B4 = $("B4"),
B5 = $("B5"),
B6 = $("B6"),
quizCont = $("quizCont"),
quizModules = $("pickModules"),
moduleButtons = document.getElementsByClassName("moduleButtons"),
rightCount = 0, 
wrongCount = 0,
answered = false,
questionArray = [];
question.innerHTML = "";
var quizStarted = false;
var loggedIn = false;
var randomModule;
var modulesArray = [];
var modulesLengthArray = [MOD_A_LENGTH, MOD_B_LENGTH, MOD_C_LENGTH, MOD_D_LENGTH, MOD_E_LENGTH, MOD_F_LENGTH,
		                 MOD_G_LENGTH, MOD_H_LENGTH];

var createPOSTParameters = function() {
	"use strict";
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	return "username=" + username + "&password=" + password;
};

var loginAjax = function() {
	"use strict";	
	var postParameters = createPOSTParameters();
	
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === 4 && request.status === 200) {
		    switch(request.responseText) {
				case "1":
					setErrorMessage("red", "Please enter a username.");
					break;
				case "2":
					setErrorMessage("red", "Invalid character in username.");
					break;
				case "3":
					setErrorMessage("red", "Please enter a password.");
					break;
				case "4":
					setErrorMessage("red", "Password entered in invalid format.");
					break;
				case "5":
					setErrorMessage("red", "Unrecognized username.");
					break;
				case "6":
					setErrorMessage("red", "Unrecognized password.");
					break;
				case "7":
					setErrorMessage("red", "Your account has not been verified. Please check your email for the verification link.");
					break;
				default: {
					setErrorMessage("red", "");
					document.getElementById("loginPage").style.display = "none";
					document.getElementById("userPage").style.display = "block";
					loggedIn = true;
					var loginResponse = JSON.parse(request.responseText);
					document.getElementById("welcomeUser").innerHTML = "Welcome back " + loginResponse[1] + ". Your answer stats are as follows...";
					rightCount1 = parseInt(loginResponse[2]);
                    rightCount2 = parseInt(loginResponse[4]);
                    rightCount3 = parseInt(loginResponse[6]);
                    rightCount4 = parseInt(loginResponse[8]);
                    rightCount5 = parseInt(loginResponse[10]);
                    rightCount6 = parseInt(loginResponse[12]);
                    wrongCount1 = parseInt(loginResponse[3]);
                    wrongCount2 = parseInt(loginResponse[5]);
                    wrongCount3 = parseInt(loginResponse[7]);
                    wrongCount4 = parseInt(loginResponse[9]);
                    wrongCount5 = parseInt(loginResponse[11]);
                    wrongCount6 = parseInt(loginResponse[13]);
					greenWidth1 = calculatePercentage(loginResponse[2], loginResponse[3]);
					greenWidth2 = calculatePercentage(loginResponse[4], loginResponse[5]);
					greenWidth3 = calculatePercentage(loginResponse[6], loginResponse[7]);
					greenWidth4 = calculatePercentage(loginResponse[8], loginResponse[9]);
					greenWidth5 = calculatePercentage(loginResponse[10], loginResponse[11]);
					greenWidth6 = calculatePercentage(loginResponse[12], loginResponse[13]);
					myVar1 = setInterval(function(){ setWidth1(); },1000/60);
					myVar2 = setInterval(function(){ setWidth2(); },1000/60);
					myVar3 = setInterval(function(){ setWidth3(); },1000/60);
					myVar4 = setInterval(function(){ setWidth4(); },1000/60);
					myVar5 = setInterval(function(){ setWidth5(); },1000/60);
					myVar6 = setInterval(function(){ setWidth6(); },1000/60);
				}
			}
		}
	};
	request.open("POST", "http://localhost/practicePHP/quiz_app_project/quiz_login.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(postParameters);
};
document.getElementById("loginSubmit").onclick = loginAjax;

var calculatePercentage = function(num1, num2) {
	"use strict";
	var parseNum1 = parseInt(num1, 10);
	var parseNum2 = parseInt(num2, 10);
	var percentage = (parseNum1/(parseNum1+parseNum2))*100;
	if(isNaN(percentage)) {
		return 0;
	} else {
		return Math.round(percentage, 10);
	}
};

var proceedAsGuest = function() {
	"use strict";
	setErrorMessage("red", "");
	document.getElementById("loginPage").style.display = "none";
	document.getElementById("userPage").style.display = "none";
};
document.getElementById("guestSubmit").onclick = proceedAsGuest;

var createGETParameters = function() {
	"use strict";
	var modulesArrayIndex = Math.floor(Math.random()*modulesArray.length);
	randomModule = modulesArray[modulesArrayIndex];
	var moduleLength = modulesLengthArray[modulesArrayIndex];
	var randomQuestion = Math.floor(Math.random()*moduleLength) + 1;
	
	return "http://localhost/practicePHP/quiz_app_project/new_quiz_app.php?val1=" + randomModule + "&val2=" + randomQuestion.toString();
};

var getResponse = function() {
	"use strict";
	var searchUrl = createGETParameters();
	
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === 4 && request.status === 200 && modulesArray.length > 0) {
			var jsonResponse = JSON.parse(request.response);
			var jsonArray = [];
			jsonArray.push(jsonResponse[0][0]);
			jsonArray.push(jsonResponse[0][1]);
			questionArray = jsonArray;
			if(question.innerHTML === "") {
				question.innerHTML = questionArray[0];
			}
		}
	};
	request.open("GET", searchUrl, true);
	request.send();
};

var startQuizFunction = function() {
	"use strict";
		
	if(modulesArray.length === 0) {
		question.innerHTML = "You need to add modules to the question pool, and then click Next Question to start!";
		answered = true;
	} else {
		if(!quizStarted) {
	        getResponse();
		}
	}
	quizModules.style.display = "none";
	quizStarted = true;
};
document.getElementById("startButton").onclick = startQuizFunction;

var incrementRightCount = function() {
	"use strict";
	switch(randomModule) {
		case "moduleA":
			rightCount1 += 1;
			break;
		case "moduleB":
			rightCount2 += 1;
			break;
		case "moduleC":
			rightCount3 += 1;
			break;
		case "moduleD":
			rightCount4 += 1;
			break;
		case "moduleE":
			rightCount5 += 1;
			break;
		case "moduleF":
			rightCount6 += 1;
			break;
	}
};

var incrementWrongCount = function() {
	"use strict";
	switch(randomModule) {
		case "moduleA":
			wrongCount1 += 1;
			break;
		case "moduleB":
			wrongCount2 += 1;
			break;
		case "moduleC":
			wrongCount3 += 1;
			break;
		case "moduleD":
			wrongCount4 += 1;
			break;
		case "moduleE":
			wrongCount5 += 1;
			break;
		case "moduleF":
			wrongCount6 += 1;
			break;
	}
};

var incrementRatioCount = function() {
	"use strict";
	var correctAnswer = questionArray[1].toLowerCase();
    var userAnswer = inputAnswer.value.toLowerCase();
	
	if(userAnswer === correctAnswer) {
	    rightCount = rightCount + 1;
		incrementRightCount();
	    question.innerHTML = "Correct! Well Done.";
	    question.style.color = "green";
	} else {
	    wrongCount = wrongCount + 1;
		incrementWrongCount();
	    question.innerHTML = "Oops! Wrong Answer.";
	    question.style.color = "red";
    }	
}; 
var setRatioBarWidth = function() {
	"use strict";
	 var greenWidth = "0%";
	 greenWidth = Math.round((100/(rightCount + wrongCount)) * rightCount).toString() + "%";
	 ratioGreen.style.width = greenWidth;
	 ratioRed.style.width = "100%";
	 ratio.innerHTML = "Correct/Incorrect ratio: " + rightCount + "/" + wrongCount;
};

var answerValidation = function() {
	"use strict";
	var userAnswer = inputAnswer.value.toLowerCase();
	
	if(answered){
		setErrorMessage("red", "Already Answered!");
	} else {	
	    if(userAnswer === "") {
			setErrorMessage("red", "Question Not Answered!");
	    } else {
		    incrementRatioCount();
	        setRatioBarWidth(); 
	        answered = true;
			setErrorMessage("black", "");
	    }
	}
};
submit.onclick = answerValidation;

var quizControls = function() {
	"use strict";

	var x = event.which;
	if(x === 13) {
	    if(answered) {
			toNextQuestion();
		} else {
			answerValidation();
		}
	}
};
window.onkeypress = quizControls;

var setNextQuestion = function() {
	"use strict";
	if(answered && modulesArray.length > 0) {
		getResponse();
	}
};

var toNextQuestion = function() {
	"use strict";
	
	function resetAnswerInput() {
		inputAnswer.value = "";
	    errorMessage.innerHTML = "";
	}

	function setNextQuestion(color, qText) {
		question.style.color = color;
	    question.innerHTML = qText;
	}
	
	var nextQuestion = questionArray[0];
	
	if (answered) {
	    if(modulesArray.length > 0) {
	        resetAnswerInput();
			setNextQuestion("black", nextQuestion);
		    answered = false;
	    } else {
		    resetAnswerInput();
			setNextQuestion("red", "Add Question Modules to the Question Pool!");
	    }
	} else {
		setErrorMessage("red", "Question Not Answered!");
	}
};
nextQuestion.onmousedown = setNextQuestion;
nextQuestion.onmouseup = toNextQuestion;

/*Function used to display the answer to a question*/

var setErrorMessage = function(color, aText) {
	"use strict";
	errorMessage.style.color = color;
	errorMessage.innerHTML = aText;
};

var removeHtmlTagBrackets = function() {
	"use strict";
	var answerString = questionArray[1];
	var tagOpen = answerString.indexOf("<");
	var tagClose = answerString.indexOf(">");
	var closeTagOpen = answerString.indexOf("</");
	var selfClose = answerString.indexOf("/>");
	
	if(tagOpen > -1 && tagClose > -1) {
		if(closeTagOpen > -1 || selfClose > -1) {
			while(answerString.indexOf("<") > -1) {
				answerString = answerString.replace("<", "&lt;");
			}
			while(answerString.indexOf(">") > -1) {
				answerString = answerString.replace(">", "&gt;");
			}
		}
	}
	return answerString;
};

var displayAnswer = function() {
	"use strict";
	
	var answerString = removeHtmlTagBrackets();
	
	if (answered) {
		setErrorMessage("black", answerString);
	} else {
		setErrorMessage("red", "Question Not Answered!");
	}
};
showAnswer.onclick = displayAnswer;

/*Functions used to change the display values of the drop down boxes*/

var makeBoxDrop = function() {
	"use strict";
	
	if (moduleList.style.display === "block") {
		moduleList.style.display = "none";
		quizCont.style.zIndex = "3";
	} else {
	    moduleList.style.display = "block";
		quizCont.style.overflow = "visible";
		quizCont.style.zIndex = "8";
	}
};
dropDownButton.onclick = makeBoxDrop;

var makeBoxDrop2 = function() {
	"use strict";
	
	if (addModuleList.style.display === "block") {
		addModuleList.style.display = "none";
	} else {
	    addModuleList.style.display = "block";
	}
};
dropDownButton2.onclick = makeBoxDrop2;

/*An object used to move modules into and out of the question pool*/
var moveMod = function(childElId,buttonId,moduleName, modIndex) {
	"use strict";
	
	this.childElId = childElId;
	this.buttonId = buttonId;
	this.moduleName = moduleName;
	this.modIndex = modIndex;
	this.inModulePool = false;
	document.getElementById(buttonId).style.backgroundColor = "#3b9e0e";
	
	this.addMod = function() {
	    var childElement = $(this.childElId);
	    var getButton = $(this.buttonId);
	    var moduleId = modulesArray.indexOf(this.moduleName);
	    var getClass = getButton.getAttribute("class");
	    var getInsertBefore = $("dropDownAddModules");
		var modArray = document.getElementsByClassName("moduleButtons");
		var modButton = modArray[this.modIndex];
    	
	    if (getClass === "Btns1") {
		    moduleList.removeChild(childElement);
		    addModuleList.appendChild(childElement);
		    getButton.classList.remove("Btns1");
		    getButton.classList.add("Btns2"); 
		    getButton.style.backgroundColor = "#3b9e0e";
		    getButton.value = "Add";
		    modulesArray.splice(moduleId, 1);
			this.inModulePool = false;
			modButton.style.borderColor = "rgb(252, 17, 17)";
			modButton.style.color = "rgb(252, 17, 17)";
	    } 
		
		if(getClass === "Btns2"){
		    addModuleList.removeChild(childElement);
	        moduleList.insertBefore(childElement, getInsertBefore);
		    getButton.classList.remove("Btns2");
		    getButton.classList.add("Btns1"); 
		    getButton.style.backgroundColor = "#fc1111";
		    getButton.value = "Remove";
		    modulesArray.splice(modulesArray.length, 0, this.moduleName);
			this.inModulePool = true;
			modButton.style.borderColor = "rgb(59, 158, 14)";
			modButton.style.color =  "rgb(59, 158, 14)" ;
	    }
	};
	this.checkInQuestionPool = function() {
		return this.inModulePool;
	};
};
var AMove = new moveMod("Li1", "B1", "moduleA", 0);
var AFunc = function() {"use strict"; return AMove.addMod();};
B1.onclick = AFunc;
moduleButtons[0].onclick = AFunc;
var BMove = new moveMod("Li2", "B2", "moduleB", 1);
var BFunc = function() {"use strict"; return BMove.addMod();};
B2.onclick = BFunc;
moduleButtons[1].onclick = BFunc;
var CMove = new moveMod("Li3", "B3", "moduleC", 2);
var CFunc = function() {"use strict"; return CMove.addMod();};
B3.onclick = CFunc;
moduleButtons[2].onclick = CFunc;
var DMove = new moveMod("Li4", "B4", "moduleD", 3);
var DFunc = function() {"use strict"; return DMove.addMod();};
B4.onclick = DFunc;
moduleButtons[3].onclick = DFunc;
var EMove = new moveMod("Li5", "B5", "moduleE", 4);
var EFunc = function() {"use strict"; return EMove.addMod();};
B5.onclick = EFunc;
moduleButtons[4].onclick = EFunc;
var FMove = new moveMod("Li6", "B6", "moduleF", 5);
var FFunc = function() {"use strict"; return FMove.addMod();};
B6.onclick = FFunc;
moduleButtons[5].onclick = FFunc;

var backButtonOnClick = function() {
	"use strict";
	document.getElementById("pickModules").style.display = "block";
	if (moduleList.style.display === "block") {
		moduleList.style.display = "none";
		quizCont.style.zIndex = "3";
	}
};
document.getElementById("backButton").onclick = backButtonOnClick;

var backToUserOnClick = function() {
	"use strict";
    if(loggedIn) {
		document.getElementById("userPage").style.display = "block";
	} else {
		document.getElementById("loginPage").style.display = "block";
	}	
};
document.getElementById("backToUser").onclick = backToUserOnClick;

var nextButtonOnClick = function() {
	"use strict";
	document.getElementById("userPage").style.display = "none";
};
document.getElementById("nextButton").onclick = nextButtonOnClick;

var backToLoginOnClick = function() {
	"use strict";
	document.getElementById("loginPage").style.display = "block";
};
document.getElementById("backToLogin").onclick = backToLoginOnClick;

var createSavePOSTParameters = function() {
	"use strict";
	var username = document.getElementById("username").value;
	return "username=" + username + "&R1=" + rightCount1 + "&R2=" + rightCount2 + "&R3=" + rightCount3 +
		"&R4=" + rightCount4 + "&R5=" + rightCount5 + "&R6=" + rightCount6 + "&W1=" + wrongCount1 + "&W2=" +
		wrongCount2 + "&W3=" + wrongCount3 + "&W4=" + wrongCount4 + "&W5=" + wrongCount5 + "&W6=" + wrongCount6;
};

var changeStatsOnSave = function() {
	"use strict";
	var percentage1 = calculatePercentage(rightCount1, wrongCount1);
	document.getElementById("percentage1").innerHTML = percentage1 + "%";
	document.getElementById("greenStat1").style.width = (percentage1*1.8) + "px";
	var percentage2 = calculatePercentage(rightCount2, wrongCount2);
	document.getElementById("percentage2").innerHTML = percentage2 + "%";
	document.getElementById("greenStat2").style.width = (percentage2*1.8) + "px";
	var percentage3 = calculatePercentage(rightCount3, wrongCount3);
	document.getElementById("percentage3").innerHTML = percentage3 + "%";
	document.getElementById("greenStat3").style.width = (percentage3*1.8) + "px";
	var percentage4 = calculatePercentage(rightCount4, wrongCount4);
	document.getElementById("percentage4").innerHTML = percentage4 + "%";
	document.getElementById("greenStat4").style.width = (percentage4*1.8) + "px";
	var percentage5 = calculatePercentage(rightCount5, wrongCount5);
	document.getElementById("percentage5").innerHTML = percentage5 + "%";
	document.getElementById("greenStat5").style.width = (percentage5*1.8) + "px";
	var percentage6 = calculatePercentage(rightCount6, wrongCount6);
	document.getElementById("percentage6").innerHTML = percentage6 + "%";
	document.getElementById("greenStat6").style.width = (percentage6*1.8) + "px";
};

var saveAjax = function() {
	"use strict";	
	var postParameters = createSavePOSTParameters();
	
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(request.readyState === 4 && request.status === 200) {
			var response = request.responseText;
		    if(response === "true") {
		        setErrorMessage("green", "Your answer data has been saved successfully!");
			}
			if(response === "false") {
				setErrorMessage("red", "There was a problem saving your answer data!");
			}
		}
	};
	request.open("POST", "http://localhost/practicePHP/quiz_app_project/quiz_app_save.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(postParameters);
};

var saveOnClick = function() {
	"use strict";
	if(loggedIn) {
		saveAjax();
		changeStatsOnSave();
	} else {
		setErrorMessage("red", "You can only save your score if you're logged in!");
	}
};
document.getElementById("saveButton").onclick = saveOnClick;

var incrementWidth1 = 0;
var myVar1;
var setWidth1 = function() {
	"use strict";	
	if(incrementWidth1 < greenWidth1) {
		incrementWidth1 += 1;
		var statWidth = Math.floor(incrementWidth1*1.8).toString();
		document.getElementById("percentage1").innerHTML = incrementWidth1 + "%";
		document.getElementById("greenStat1").style.width = statWidth + "px";
	} else {
		document.getElementById("percentage1").innerHTML = greenWidth1 + "%";
		clearInterval(myVar1);
		incrementWidth1 = 0;
	}
};

var incrementWidth2 = 0;
var myVar2;
var setWidth2 = function() {
	"use strict";	
	if(incrementWidth2 < greenWidth2) {
		incrementWidth2 += 1;
		var statWidth = Math.floor(incrementWidth2*1.8).toString();
		document.getElementById("percentage2").innerHTML = incrementWidth2 + "%";
		document.getElementById("greenStat2").style.width = statWidth + "px";
	} else {
		document.getElementById("percentage2").innerHTML = greenWidth2 + "%";
		clearInterval(myVar2);
		incrementWidth2 = 0;
	}
};

var incrementWidth3 = 0;
var myVar3;
var setWidth3 = function() {
	"use strict";	
	if(incrementWidth3 < greenWidth3) {
		incrementWidth3 += 1;
		var statWidth = Math.floor(incrementWidth3*1.8).toString();
		document.getElementById("percentage3").innerHTML = incrementWidth3 + "%";
		document.getElementById("greenStat3").style.width = statWidth + "px";
	} else {
		document.getElementById("percentage3").innerHTML = greenWidth3 + "%";
		clearInterval(myVar3);
		incrementWidth3 = 0;
	}
};

var incrementWidth4 = 0;
var myVar4;
var setWidth4 = function() {
	"use strict";	
	if(incrementWidth4 < greenWidth4) {
		incrementWidth4 += 1;
		var statWidth = Math.floor(incrementWidth4*1.8).toString();
		document.getElementById("percentage4").innerHTML = incrementWidth4 + "%";
		document.getElementById("greenStat4").style.width = statWidth + "px";
	} else {
		document.getElementById("percentage4").innerHTML = greenWidth4 + "%";
		clearInterval(myVar4);
		incrementWidth4 = 0;
	}
};

var incrementWidth5 = 0;
var myVar5;
var setWidth5 = function() {
	"use strict";	
	if(incrementWidth5 < greenWidth5) {
		incrementWidth5 += 1;
		var statWidth = Math.floor(incrementWidth5*1.8).toString();
		document.getElementById("percentage5").innerHTML = incrementWidth5 + "%";
		document.getElementById("greenStat5").style.width = statWidth + "px";
	} else {
		document.getElementById("percentage5").innerHTML = greenWidth5 + "%";
		clearInterval(myVar5);
		incrementWidth5 = 0;
	}
};

var incrementWidth6 = 0;
var myVar6;
var setWidth6 = function() {
	"use strict";	
	if(incrementWidth6 < greenWidth6) {
		incrementWidth6 += 1;
		var statWidth = Math.floor(incrementWidth6*1.8).toString();
		document.getElementById("percentage6").innerHTML = incrementWidth6 + "%";
		document.getElementById("greenStat6").style.width = statWidth + "px";
	} else {
		document.getElementById("percentage6").innerHTML = greenWidth6 + "%";
		clearInterval(myVar6);
		incrementWidth6 = 0;
	}
};


