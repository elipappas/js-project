const wordText = document.querySelector(".word"),
hintText = document.querySelector(".hint span"),
timeText = document.querySelector(".container h2"),
inputField = document.querySelector("input"),
refreshBtn = document.querySelector(".refresh-word"),
checkBtn = document.querySelector(".check-word"),
changeTextBtn = document.querySelector(".hint");
contentBox = document.querySelector(".container .content");
startArea = document.querySelector(".startArea");
scoreArea = document.querySelector(".score");
modalContent = document.querySelector(".modal-content");

// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// Get the text of modal
var modalText = document.getElementById("modalText");

let correctWord, timer;
let score = 0; 
let displayed = 0;

function getDef(WORD) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${WORD}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if the API response contains a definition
            if (Array.isArray(data) && data.length > 0 && data[0].meanings) {
                const definition = data[0].meanings[0].definitions[0].definition;
                hintText.innerText = definition;
            } else {
                // Handle the case when no definition is found
                hintText.innerText = "Definition not found";
            }
        })
        .catch(error => {
            // Handle any errors that occur during the API call
            console.error("Error fetching definition:", error);
            hintText.innerText = "Failed to fetch definition";
        });
}


const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
        if(maxTime > 0) {
            maxTime--;
            return timeText.innerText = maxTime;
        }
        modal.style.display = "block";
        modalContent.classList.add("modal-wrong");
        modalText.innerHTML = `<br>Time off! <b>${correctWord.toUpperCase()}</b> was the correct word`;
        endGame();
    }, 1000);
}

const start = () => {
    contentBox.style.display = "block";
    startArea.style.display = "none";
    initGame(); 
}


const endGame = () => {
    clearInterval(timer);
    contentBox.style.display = "none";
    startArea.style.display = "block";
    modal.style.display = "block";
    modalContent.classList.remove("modal-correct");
    modalContent.classList.add("modal-wrong");
    modalText.innerHTML = `
    <center><br>Time off! <b>${correctWord.toUpperCase()}</b> was the correct word.
    <br>You Lost The Game ! :(</center><br>
    </center>
    `;

}

const winGame = () => {
    clearInterval(timer);
    contentBox.style.display = "none";
    startArea.style.display = "block";
    modal.style.display = "block";
    modalContent.classList.add("modal-correct");
    modalText.innerHTML = `<br><center>Congrats You WIN THE GAME !!!!!!`;
    
}

const initGame = () => {
    initTimer(30);
    let randomObj = words[Math.floor(Math.random() * words.length)];
    let wordArray = randomObj.word.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    
    wordText.innerText = wordArray.join("");
    correctWord = randomObj.word.toLowerCase();
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
    scoreArea.innerHTML = score;

    // Call getDef with the current word
    getDef(correctWord);

    if (score > 9) {
        winGame();
    }

}

changeTextBtn.addEventListener("click", function(){
    hintButton();
})

const hintButton = () => {
    if(displayed === 0){
        var T = document.getElementById("hintSpan");
        T.style.display="block";
        displayed = 1;
    }
    else{
        var T = document.getElementById("hintSpan");
        T.style.display="none";
        displayed = 0;
    }  
}

const checkWord = () => {
    let userWord = inputField.value.toLowerCase();

    if(!userWord) { 
        modal.style.display = "block";
        modalContent.classList.remove("modal-wrong");
        modalContent.classList.remove("modal-correct");
        return modalText.innerHTML = `<br>Please enter the word to check!`;
    }

    if(userWord !== correctWord) { 
        if(score >= 1) {
            score = score - 1; 
            scoreArea.innerHTML = score;
        }
        modal.style.display = "block";
        modalContent.classList.add("modal-wrong");
        return modalText.innerHTML = `<br>Oops! <b>${userWord}</b> is not a correct word`;
    }
    else
    {
        modal.style.display = "block";
        modalContent.classList.remove("modal-wrong");
        modalContent.classList.add("modal-correct");
        modalText.innerHTML = `<br>Congrats! <b>${correctWord.toUpperCase()}</b> is the correct word`;
        score++;
        if(displayed==1){
            hintButton();
        }
    }
  
    initGame();
}



function closeModal() {
    modal.style.display = 'none';
}

refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);

document.addEventListener('keypress', (event)=>{
    if (modal.style.display !== 'none') {
        if (event.key === "Enter") {
            closeModal();
        }  
    }
    else {
        if (event.key === "Enter") {
            // call click function of the buttonn
            checkBtn.click();
        }          
    }
});

// Get the input field
var input = document.getElementById("myInput");

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    closeModal();
}
  
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (modal.style.display !== 'none') {
        if (event.key === "Escape") {
            closeModal();
        } 
    }
});