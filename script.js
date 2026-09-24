let recipientName = "Noor";

// 1. Balloon Background Animation
function createBalloons() {
  const container = document.getElementById('balloonContainer');
  const colors = ['#ff4081', '#ff80ab', '#ffccd5', '#ff1744', '#f48fb1'];
  for (let i = 0; i < 15; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * 90 + '%';
    balloon.style.animationDelay = Math.random() * 8 + 's';
    balloon.style.animationDuration = (6 + Math.random() * 4) + 's';
    
    balloon.innerHTML = `<svg width="40" height="50" viewBox="0 0 40 50">
      <path d="M20,0 C31,0 40,9 40,20 C40,31 27,45 20,45 C13,45 0,31 0,20 C0,9 9,0 20,0 Z" fill="${colors[Math.floor(Math.random()*colors.length)]}"/>
      <polygon points="20,43 17,48 23,48" fill="#d81b60"/>
    </svg>`;
    container.appendChild(balloon);
  }
}
createBalloons();

// 2. Navigation Helper
function navigateTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');

  // Trigger quiz init when navigated
  if (screenId === 'screenQuiz' && !quizInitialized) initQuizGame();
}

/* LOCK SCREEN LOGIC */
const CORRECT_PIN = "1100"; // Password ab logically 1100 hai
let currentPin = "";
let wrongAttempts = 0; // Wrong attempts track karne ke liye

const slots = document.querySelectorAll("#slots .slot");
const keys = document.querySelectorAll(".key:not(#backspaceBtn)");

keys.forEach(key => {
  key.addEventListener("click", () => {
    const val = key.getAttribute("data-value");
    if (val && currentPin.length < 4) {
      currentPin += val;
      updateSlots();
      if (currentPin.length === 4) setTimeout(checkPin, 300);
    }
  });
});

document.getElementById("backspaceBtn").addEventListener("click", () => {
  if (currentPin.length > 0) { currentPin = currentPin.slice(0, -1); updateSlots(); }
});

function updateSlots() {
  slots.forEach((slot, i) => {
    if (i < currentPin.length) slot.classList.add("filled");
    else slot.classList.remove("filled");
  });
}

function checkPin() {
  if (currentPin === CORRECT_PIN) {
    navigateTo('screenReveal');
  } else {
    wrongAttempts++; // Ghalat try count karo
    document.getElementById("lockCard").classList.add("shake");
    
    // Agar 3 ya us se zyada dafa ghalat hua, toh direct hint display karo
    if (wrongAttempts >= 1) {
      document.getElementById("wrongHint").style.display = "block";
    }
    
    setTimeout(() => {
      document.getElementById("lockCard").classList.remove("shake");
      currentPin = ""; updateSlots();
    }, 400);
  }
}

/* SURPRISE REVEAL */
document.getElementById('openBtn').addEventListener('click', () => {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  document.getElementById('initialView').style.display = 'none';
  document.getElementById('revealedView').style.display = 'block';
});

/* LETTER CONTROLLER */
function openLetter() {
  document.getElementById('mailCard').style.display = 'none';
  document.getElementById('letterCard').style.display = 'block';
}
function nextLetterPage() {
  document.getElementById('page1').classList.remove('active');
  document.getElementById('page2').classList.add('active');
}
function prevLetterPage() {
  document.getElementById('page2').classList.remove('active');
  document.getElementById('page1').classList.add('active');
}

/* QUIZ GAME LOGIC */
let quizInitialized = false;
const questions = [
  { question: "What comes after G?", options: ["K", "I", "H", "J"], correct: 2 },
  { question: "What comes after A?", options: ["E", "B", "D", "C"], correct: 1 },
  { question: "What comes after C?", options: ["G", "F", "D", "E"], correct: 2 },
  { question: "Put your last three answers together. What do they spell?", options: ["KMW", "HBD", "JOV", "LNZ"], correct: 1 },
  { question: "What does ILY mean?", options: ["HAPPY BIRTH DAY", "HAPPY JANAM DIN", "HAPPY SALGIRAH DAY", "HAPPY CELEBRATION DAY"], correct: 0 }
];
let currentQ = 0;

function initQuizGame() {
  quizInitialized = true;
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQ];
  document.getElementById('questionBox').textContent = q.question;
  document.getElementById('questionFooter').textContent = `Question ${currentQ + 1} of 5`;
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => {
      if (idx === q.correct) btn.classList.add('correct');
      else btn.classList.add('wrong');
      setTimeout(() => {
        currentQ++;
        if (currentQ < questions.length) loadQuestion();
        else {
          document.getElementById('quizCard').style.display = 'none';
          document.getElementById('resultCard').style.display = 'block';
        }
      }, 800);
    };
    container.appendChild(btn);
  });
}

function showFinalWish() {
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('finalWishCard').style.display = 'block';
  confetti({ particleCount: 150, spread: 80 });
}
