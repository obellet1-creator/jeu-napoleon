document.addEventListener("DOMContentLoaded", function() {

  // ==========================
  // VARIABLES GLOBALES
  // ==========================
  let questions = [];
  let currentQuestion = null;

  const timerDuration = 30;
  let timeLeft = timerDuration;
  let timerInterval = null;

  const circle = document.getElementById("timer-circle");
  const timerNumber = document.getElementById("timer-number");
  const circumference = 2 * Math.PI * 50;

  // 🔊 Sons
  const tickSound = new Audio("sounds/tick.mp3");
  tickSound.volume = 0.3;

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
      loadNewQuestion(false); // première question sans démarrer le timer
    })
    .catch(error => {
      document.getElementById("question").textContent =
        "Erreur de chargement des questions";
      console.error(error);
    });

  // ==========================
  // QUESTIONS
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
  // TIMER AVEC ACCÉLÉRATION
  // ==========================
  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = timerDuration;
    updateTimerDisplay();
  }

  function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      // 🔊 Tick normal
      if (timeLeft > 10) {
        playTick();
      }

      // 🔥 Accélération dans les 10 dernières secondes
      if (timeLeft <= 10 && timeLeft > 0) {
        playTick();
        setTimeout(playTick, 300); // second tick rapide
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showAnswer();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    timerNumber.textContent = timeLeft;
    const offset =
      circumference - (timeLeft / timerDuration) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  function playTick() {
    tickSound.currentTime = 0;
    tickSound.play();
  }

  // ==========================
  // DÉ (INDÉPENDANT)
  // ==========================
  function rollDice() {
    const diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById("dice-result").textContent = diceValue;
  }

  // ==========================
  // BOUTONS
  // ==========================
  document.getElementById("rollDice").addEventListener("click", rollDice);
  document.getElementById("nextQuestion").addEventListener("click", () => loadNewQuestion(true));
  document.getElementById("showAnswer").addEventListener("click", showAnswer);

});
