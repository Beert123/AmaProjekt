var i = 0;
var speed = 50;


//Event listner?


async function askQuestion() {
    var userInput = document.getElementById("userInput").value;
    if (userInput.trim() === "") {
        return;
    }

    var responseLabel = document.getElementById("response");

    addQuestionToList(userInput);

    const response = await fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: userInput })
    });

    const data = await response.json();

    typeWriter(data.answer, responseLabel);

    document.getElementById("userInput").value = "";

}

function typeWriter(txt, responseLabel) {
    var i = 0;
    function write() {
        if (i < txt.length) {
            responseLabel.textContent += txt.charAt(i);
            i++;
            setTimeout(write, speed);
        }
    }

    write();
}

function addQuestionToList(question) {
    var questionList = document.getElementById("questionList");
    var newQuestion = document.createElement("li");
    newQuestion.textContent = question;
    questionList.appendChild(newQuestion);
}
