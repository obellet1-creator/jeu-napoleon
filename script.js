document.addEventListener("DOMContentLoaded", function () {

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

  // 🔊 Audio timer (musique douce)
  const timerAudio = new Audio("sounds/tick.mp3");
  timerAudio.loop = true;
  timerAudio.volume = 0.4;

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
      loadNewQuestion(false);
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
    timerAudio.play();

    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showAnswer();
        timerAudio.pause();
        timerAudio.currentTime = 0;
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    timerNumber.textContent = timeLeft;
    const offset =
      circumference - (timeLeft / timerDuration) * circumference;
    circle.style.strokeDashoffset = offset;
  }

  // ==========================
  // 🎲 DÉ ANIMÉ + ÉCLAT FINAL
  // ==========================
  function rollDice() {
    const diceResult = document.getElementById("dice-result");
    const finalValue = Math.floor(Math.random() * 6) + 1;
    let count = 0;

    diceResult.classList.remove("dice-final");

    const interval = setInterval(() => {
      diceResult.textContent = Math.floor(Math.random() * 6) + 1;
      count++;

      if (count >= 12) {
        clearInterval(interval);
        diceResult.textContent = finalValue;

        // ✨ effet victoire
        diceResult.classList.add("dice-final");
        setTimeout(() => {
          diceResult.classList.remove("dice-final");
        }, 600);
      }
    }, 50);
  }

  // ==========================
  // BOUTONS
  // ==========================
  document.getElementById("rollDice").addEventListener("click", rollDice);
  document.getElementById("nextQuestion").addEventListener("click", () => loadNewQuestion(true));
  document.getElementById("showAnswer").addEventListener("click", showAnswer);

});
