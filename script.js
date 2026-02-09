document.addEventListener("DOMContentLoaded", function() {
  // ==========================
  // VARIABLES GLOBALES
  // ==========================
  let questions = [];
  let currentQuestion = null;

  let timerDuration = 30;
  let timeLeft = timerDuration;
  let timerInterval = null;

  const circle = document.getElementById("timer-circle");
  const timerNumber = document.getElementById("timer-number");
  const circumference = 2 * Math.PI * 50;

  // Audio pour le timer
  const timerAudio = new Audio("sounds/tick.mp3");
  timerAudio.loop = true; // joue en boucle

  // ==========================
  // INITIALISATION TIMER
  // ==========================
  circle.style.strokeDasharray = circumference;

  // ==========================
  // CHARGEMENT DES QUESTIONS
  // ==========================
  fetch("questions.json")
    .then(response => response.json())
    .then(data => {
      questions = data;
      loadNewQuestion(false); // charge première question sans démarrer le timer
    })
    .catch(error => {
      document.getElementById("question").textContent =
        "Erreur de chargement des questions";
      console.error(error);
    });

  // ==========================
  // FONCTIONS QUESTIONS
  // ==========================
  function loadNewQuestion(startTimerFlag = true) {
    if (questions.length === 0) return;

    currentQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    document.getElementById("question").textContent =
      currentQuestion.question;
    document.getElementById("answer").textContent = "";

    if (startTimerFlag) {
      resetTimer();
      startTimer();
    }
  }

  function showAnswer() {
    if (!currentQuestion) return;
    document.getElementById("answer").textContent =
      "Réponse : " + currentQuestion.answer;
  }

  // ==========================
  // TIMER
  // ==========================
  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = timerDuration;
    updateTimerDisplay();
    timerAudio.pause();
    timerAudio.currentTime = 0;
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerAudio.currentTime = 0;
    timerAudio.play(); // démarre la musique en boucle

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showAnswer();
        timerAudio.pause();
        timerAudio.currentTime = 0; // stoppe la musique
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    timerNumber.textContent = timeLeft;
    const offset = circumference - (timeLeft / timerDuration) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  // ==========================
  // DÉ VIRTUEL
  // ==========================
  function rollDice() {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById("dice-result").textContent = diceValue;
    // le dé est indépendant, ne déclenche pas de question ni de timer
  }

  // ==========================
  // BOUTONS
  // ==========================
  document.getElementById("rollDice").addEventListener("click", rollDice);
  document.getElementById("nextQuestion").addEventListener("click", () => loadNewQuestion(true));
  document.getElementById("showAnswer").addEventListener("click", showAnswer);
});
