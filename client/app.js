
var i = 0;
var speed = 50;
function askQuestion() {
    var txt = 'Hello, I am your AMA bot. Ask me anything and I will answer you.';
  if (i < txt.length) {
    document.getElementById("response").innerHTML += txt.charAt(i);
    i++;
    setTimeout(askQuestion, speed);
  }
}

function addQuestionToList() {
    var userInput = document.getElementById("userInput").value;
    var questionList = document.getElementById("questionList");
    var newQuestion = document.createElement("li");
    newQuestion.textContent = userInput;
    questionList.appendChild(newQuestion);
}

function respondToQuestion() {
    var userInput = document.getElementById("userInput").value;
    var responseLabel = document.getElementById("response");
    // Here you can implement your logic to generate a response based on the user's question
    var response = "You asked: " + userInput;
    responseLabel.textContent = response;
}