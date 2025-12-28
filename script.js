let mode, innings = 1;
let runs = 0, wickets = 0, balls = 0;
let firstInningsScore = 0;
let target = 0;
let maxBalls = Infinity;
let maxWickets = 10;
let userBatting = true;

function doToss() {
  mode = document.getElementById("mode").value;

  if (mode === "t20") maxBalls = 120;
  else if (mode === "odi") maxBalls = 300;
  else maxBalls = Infinity;

  userBatting = Math.random() < 0.5;

  document.getElementById("screen-menu").classList.add("hidden");
  document.getElementById("screen-game").classList.remove("hidden");

  setupButtons();
  updateUI();

  document.getElementById("status").innerText =
    userBatting ? "You Bat First" : "Computer Bats First";
}

function setupButtons() {
  let btns = document.getElementById("buttons");
  btns.innerHTML = "";

  let max = (mode === "simple" || mode === "crazy") ? 10 : 6;
  for (let i = 1; i <= max; i++) {
    let b = document.createElement("button");
    b.innerText = i;
    b.onclick = () => playBall(i);
    btns.appendChild(b);
  }
}

function playBall(user) {
  if (wickets >= maxWickets || balls >= maxBalls) {
    endInnings();
    return;
  }

  balls++;
  let computer =
    (mode === "simple" || mode === "crazy")
      ? Math.floor(Math.random() * 10) + 1
      : Math.floor(Math.random() * 6) + 1;

  let out = false;
  let scored = 0;

  if (mode === "simple") {
    out = user === computer;
    scored = out ? 0 : user;
  }
  else if (mode === "crazy") {
    out = Math.abs(user - computer) === 1 ||
          (user === 1 && computer === 10) ||
          (user === 10 && computer === 1);
    scored = out ? 0 : user;
  }
  else {
    out = user === computer;
    scored = (!out && user <= 6) ? user : 0;
  }

  if (out) wickets++;
  else runs += scored;

  document.getElementById("log").innerText =
    `You: ${user} | Computer: ${computer} → ` +
    (out ? "OUT" : scored + " runs");

  if (innings === 2 && runs >= target) {
    endMatch(true);
    return;
  }

  updateUI();

  if (wickets >= maxWickets || balls >= maxBalls)
    endInnings();
}

function endInnings() {
  if (innings === 1) {
    firstInningsScore = runs;
    target = firstInningsScore + 1;

    innings = 2;
    runs = wickets = balls = 0;
    userBatting = !userBatting;

    document.getElementById("target").innerText =
      "Target: " + target;

    document.getElementById("status").innerText =
      userBatting ? "You Chase" : "Computer Chases";

    updateUI();
  } else {
    endMatch(false);
  }
}

function endMatch(chased) {
  document.getElementById("screen-game").classList.add("hidden");
  document.getElementById("screen-result").classList.remove("hidden");

  let result = "";

  if (chased) {
    result = userBatting
      ? "You won by wickets!"
      : "Computer won by wickets!";
  } else {
    let diff = firstInningsScore - runs;
    result = diff > 0
      ? (userBatting ? "Computer won by " + diff + " runs"
                     : "You won by " + diff + " runs")
      : "Match Tied";
  }

  document.getElementById("finalResult").innerText = result;
}

function updateUI() {
  let over = Math.floor(balls / 6);
  let ballInOver = balls % 6;

  document.getElementById("score").innerText =
    `Score: ${runs}/${wickets}`;

  document.getElementById("over").innerText =
    `Over: ${over}.${ballInOver}`;
}
