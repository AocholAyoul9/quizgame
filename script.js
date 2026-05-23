
// Base de données des questions bibliques
const QUIZ_SET = [
    {
        question: "Quel est le plus grand désert du monde ?",
        options: ["Sahara", "Gobi", "Kalahari", "Arctique"],
        correct: "Arctique"
    },
    {
        question: "Quel est le plus grand océan du monde ?",
        options: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"],
        correct: "Océan Pacifique"
    },
    {
        question: "Combien de continents existe-t-il sur Terre ?",
        options: ["5", "6", "7", "8"],
        correct: "7"
    },
    {
        question: "Quel animal est connu comme le roi de la jungle ?",
        options: ["Tigre", "Éléphant", "Lion", "Loup"],
        correct: "Lion"
    },
    {
        question: "Quelle planète est surnommée la planète rouge ?",
        options: ["Vénus", "Mars", "Jupiter", "Saturne"],
        correct: "Mars"
    }
];
let currentQuestionsList = [];
let currentIndex = 0, userScore = 0, quizActive = true, selectedAnswer = false, currentQuestionObj = null;

const questionTextEl = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const scoreSpan = document.getElementById("scoreValue");
const qCounterSpan = document.getElementById("questionCounter");
const totalQSpan = document.getElementById("totalQuestions");
const nextButton = document.getElementById("nextButton");
const resetButton = document.getElementById("resetButton");
const feedbackMsgDiv = document.getElementById("feedbackMsg");

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function updateScoreUI() {
    scoreSpan.innerText = userScore;
}

function updateProgressUI() {
    qCounterSpan.innerText = `${currentIndex + 1}`;
    totalQSpan.innerText = `${currentQuestionsList.length}`;
}

function finishQuiz() {
    quizActive = false;
    selectedAnswer = true;
    optionsContainer.innerHTML = "";
    questionTextEl.innerHTML = `<i class="fas fa-hallelujah" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i><br> Tu as terminé le Quiz!`;
    const totalPossible = currentQuestionsList.length * 10;
    feedbackMsgDiv.innerHTML = `<i class="fas fa-flag-checkered"></i> SCORE FINAL : ${userScore} / ${totalPossible} <i class="fas fa-flag-checkered"></i>`;
    nextButton.disabled = true;
}

function renderCurrentQuestion() {
    if (currentIndex >= currentQuestionsList.length) {
        finishQuiz();
        return;
    }

    currentQuestionObj = currentQuestionsList[currentIndex];
    questionTextEl.innerText = currentQuestionObj.question;
    const options = currentQuestionObj.options;
    optionsContainer.innerHTML = "";
    const prefixLetters = ["A", "B", "C", "D"];

    options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "opt-btn";
        btn.setAttribute("data-opt-value", opt);

        const prefixSpan = document.createElement("span");
        prefixSpan.className = "opt-prefix";
        prefixSpan.innerText = prefixLetters[idx];

        const textSpan = document.createElement("span");
        textSpan.innerText = opt;

        btn.appendChild(prefixSpan);
        btn.appendChild(textSpan);

        btn.addEventListener("click", () => {
            if (quizActive && !selectedAnswer) handleAnswer(opt, btn);
        });

        optionsContainer.appendChild(btn);
    });

    feedbackMsgDiv.innerHTML = "<i class='fas fa-lightbulb'></i> Clique sur une réponse pour révéler la vérité ! <i class='fas fa-lightbulb'></i>";
    nextButton.disabled = true;
    updateProgressUI();
    quizActive = true;

    document.querySelectorAll(".opt-btn").forEach(btn => {
        btn.classList.remove("correct-highlight", "wrong-highlight", "disabled-opt");
        btn.disabled = false;
    });
}

function handleAnswer(selectedOpt, targetBtn) {
    if (!quizActive || selectedAnswer) return;

    const correctAnswer = currentQuestionObj.correct;
    const isCorrect = (selectedOpt === correctAnswer);

    if (isCorrect) {
        userScore += 10;
        updateScoreUI();
        feedbackMsgDiv.innerHTML = "<i class='fas fa-check-circle' style='color:#2e7d32;'></i> BONNE RÉPONSE ! +10 points <i class='fas fa-smile-wink'></i>";
    } else {
        feedbackMsgDiv.innerHTML = `<i class='fas fa-times-circle' style='color:#bc5a5a;'></i> Oups ! La bonne réponse était : "${correctAnswer}"<i class='fas fa-grin-tongue-squint'></i>`;
    }

    document.querySelectorAll(".opt-btn").forEach(btn => {
        btn.disabled = true;
        btn.classList.add("disabled-opt");
        const btnValue = btn.getAttribute("data-opt-value");
        if (btnValue === correctAnswer) {
            btn.classList.add("correct-highlight");
        }
        if (btnValue === selectedOpt && selectedOpt !== correctAnswer) {
            btn.classList.add("wrong-highlight");
        }
    });

    if (isCorrect) {
        targetBtn.classList.add("correct-highlight");
    }

    selectedAnswer = true;
    quizActive = false;
    nextButton.disabled = false;
}

function nextQuestion() {
    if (!selectedAnswer) return;
    currentIndex++;
    selectedAnswer = false;
    quizActive = true;
    if (currentIndex >= currentQuestionsList.length) {
        finishQuiz();
    } else {
        renderCurrentQuestion();
    }
}

function resetGame() {
    currentQuestionsList = shuffleArray([...QUIZ_SET]);
    currentIndex = 0;
    userScore = 0;
    selectedAnswer = false;
    quizActive = true;
    updateScoreUI();
    nextButton.disabled = true;
    renderCurrentQuestion();
}

nextButton.addEventListener("click", nextQuestion);
resetButton.addEventListener("click", resetGame);

totalQSpan.innerText = QUIZ_SET.length;
resetGame();
