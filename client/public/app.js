
let stringLength = "";
let input = document.querySelector('input')
let charCounter = document.getElementById("char-count");

input.addEventListener('input', function (event) {
    stringLength = event.target.value.length;
    charCounter.innerHTML = stringLength;
    if (stringLength >= 10 && stringLength <= 20){
        charCounter.classList.toggle('warning');
    }
    else if(stringLength >= 20 && stringLength <= 30 ){
        charCounter.style.color = "red";
    }
    else{
        charCounter.style.color = "black";
    }
    console.log('Value:', stringLength)
})
/*
let form = document.querySelector('form')
form.addEventListener('submit', function (event) {
    event.preventDefault() // Stop form submission
    console.log('Form blev submittet')
    console.log('Form data:', new FormData(form))
})
    */
