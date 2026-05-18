
    // Base de données des questions bibliques
      const QUIZ_SET = [
        { question: "Dans la parabole des talents (Matthieu 25), que représentent les talents ?", options: ["Des pièces d'argent confiées par un maître", "Des instruments de musique", "Des dons de chant et de danse", "Des tableaux précieux"], correct: "Des pièces d'argent confiées par un maître" },
        { question: "Après la traversée de la mer Rouge, qui a dansé et chanté pour célébrer Dieu ?", options: ["Débora", "Marie (la sœur de Moïse)", "Anne", "Esther"], correct: "Marie (la sœur de Moïse)" },
        { question: "Qui Dieu a-t-il rempli de son Esprit pour créer des œuvres d'art pour le Tabernacle ?", options: ["Moïse", "Aaron", "Bezalel", "Josué"], correct: "Bezalel" },
        { question: "Quel talent Bézalel a-t-il reçu de Dieu ?", options: ["Le chant", "La danse", "L'art et l'habileté manuelle", "Le théâtre"], correct: "L'art et l'habileté manuelle" },
        { question: "Qui dans la Bible est connu pour avoir dansé devant l'Arche de Dieu ?", options: ["David", "Salomon", "Josué", "Pierre"], correct: "David" },
        { question: "Qui a utilisé son talent de couturière pour fabriquer des vêtements pour les veuves ?", options: ["Lydie", "Priscille", "Dorcas (Tabitha)", "Euodie"], correct: "Dorcas (Tabitha)" },
        { question: "Selon 1 Corinthiens 12, qui donne les talents et les dons spirituels ?", options: ["Les apôtres", "Les anges", "Le même Esprit (Dieu)", "Les prophètes"], correct: "Le même Esprit (Dieu)" },
        { question: "Que doit faire un serviteur fidèle avec ses talents selon Matthieu 25 ?", options: ["Les cacher", "Les utiliser et les faire fructifier", "Les donner aux pauvres", "Les détruire"], correct: "Les utiliser et les faire fructifier" },
        { question: "Quel livre de la Bible est principalement un recueil de chants et de poèmes ?", options: ["Proverbes", "Psaumes", "Job", "Ecclésiaste"], correct: "Psaumes" },
        { question: "Qui a joué de la harpe pour apaiser le roi Saül ?", options: ["David", "Asaph", "Héman", "Salomon"], correct: "David" }
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
        questionTextEl.innerHTML = `<i class="fas fa-hallelujah" style="font-size: 2rem; display: block; margin-bottom: 10px;"></i> ALLÉLUIA !<br> Tu as terminé le Quiz Biblique FJU LYON !`;
        const totalPossible = currentQuestionsList.length * 10;
        feedbackMsgDiv.innerHTML = `<i class="fas fa-flag-checkered"></i> SCORE FINAL : ${userScore} / ${totalPossible} <i class="fas fa-flag-checkered"></i><br>📖 Continue à lire la Parole ! 📖`;
        nextButton.disabled = true;
        optionsContainer.innerHTML = `<div style="background:#eef3ff; border-radius: 48px; padding: 20px; text-align:center;">
        <div style="font-size: 2rem;"><i class="fas fa-heart" style="color:#0c2f6c;"></i> <i class="fas fa-star" style="color:#d4a11e;"></i></div>
        <strong>Merci FJU LYON !</strong><br><br>
        <span style="font-size:0.9rem;"><i class="fas fa-bible"></i> « Ta parole est une lampe à mes pieds »<br>Psaume 119:105</span>
        </div>`;
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
            feedbackMsgDiv.innerHTML = `<i class='fas fa-times-circle' style='color:#bc5a5a;'></i> Oups ! La bonne réponse était : "${correctAnswer}". Continue d'apprendre ! <i class='fas fa-grin-tongue-squint'></i>`; 
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
        feedbackMsgDiv.innerHTML = "<i class='fas fa-heart' style='color:#0c2f6c;'></i> Nouveau départ ! Que Dieu bénisse ta connaissance ! <i class='fas fa-heart' style='color:#0c2f6c;'></i>"; 
        renderCurrentQuestion(); 
    }

    nextButton.addEventListener("click", nextQuestion);
    resetButton.addEventListener("click", resetGame);
    
    totalQSpan.innerText = QUIZ_SET.length;
    resetGame();
