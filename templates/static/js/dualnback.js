"use strict";

/*
  TP: True Positive
  TN: True Negative
  FP: False Positive
  FN: False Negative
*/

// GAME VARIABLES
const trialsInput = document.querySelector("#trials-input");
const nBackInput = document.querySelector(".n-back-input");
const dualTask = document.querySelector(".dual-task");
const nElements = document.querySelectorAll(".n");
const hour = document.querySelector(".hour");
const scoreTitle = document.querySelector(".score-title");
const nBackElement = document.querySelector(".n-back");
const trialsElement = document.querySelector(".trials");
const spatialElement = document.querySelector(".spatial");
const auditoryElement = document.querySelector(".auditory");
const totalElement = document.querySelector(".total");
const csrfElement = document.querySelector("#id_csrf_token_input");

// Game State
let interval;
let activeGame = false;
let taskInterval;
const arrowSpeed = 150;

// Spatial
let [spatialTP, spatialTN, spatialFP, spatialFN] = [0, 0, 0, 0];
let spatialMatch = false;
let spatialInput = false;

// Auditory
let [auditoryTP, auditoryTN, auditoryFP, auditoryFN] = [0, 0, 0, 0];
let auditoryMatch = false;
let auditoryInput = false;
const auditoryMap = new Map([
	[1, "h"],
	[2, "j"],
	[3, "k"],
	[4, "l"],
	[5, "q"],
	[6, "r"],
	[7, "s"],
	[8, "t"],
]);
const sounds = {
	h: new Howl({ src: [`static/sounds/h.wav`] }),
	j: new Howl({ src: [`static/sounds/j.wav`] }),
	k: new Howl({ src: [`static/sounds/k.wav`] }),
	l: new Howl({ src: [`static/sounds/l.wav`] }),
	q: new Howl({ src: [`static/sounds/q.wav`] }),
	r: new Howl({ src: [`static/sounds/r.wav`] }),
	s: new Howl({ src: [`static/sounds/s.wav`] }),
	t: new Howl({ src: [`static/sounds/t.wav`] }),
};

// GAME FUNCTIONS AND EVENT LISTENERS

// Random Integer Function
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Score Functions
// const getAlternativeScore = (TP, TN, FP, FN) => (((TP + TN) / (TP + TN + FP + FN)) * 100).toFixed(2);
const getScore = (TP, FP, FN) => (TP ? ((TP / (TP + FP + FN)) * 100).toFixed(2) : FP || FN ? 0.0 : 100.0);

const stopGame = function (n, counter) {
	/* 
		This function sets the active game status to false, 
		resets game status and clear interval, 
		unlocks trials and tasks options, clear UI,
		and shows score results.
	*/

	// Set Active Game and Clear Interval
	interval && clearInterval(interval);
	activeGame = false;

	// Clear UI
	nElements.forEach((item) => (item.innerHTML = "N"));
	document.documentElement.style.setProperty("--active", "red");
	hour.classList.remove("hour-spin");

	// Show Score
	const spatialScore = counter && getScore(spatialTP, spatialFP, spatialFN);
	const auditoryScore = counter && getScore(auditoryTP, auditoryFP, auditoryFN);
	spatialElement.textContent = spatialScore;
	auditoryElement.textContent = auditoryScore;
	const totalScore = [spatialScore, auditoryScore].reduce((acc, item, index, arr) => acc + item / arr.length, 0).toFixed(2);
	totalElement.textContent = totalScore;
	trialsElement.textContent = counter;
	scoreTitle.classList.add("blink");

	// Allow trials input
	trialsInput.disabled = false;

	if (counter >= n * 20) {
		// Send Score to Back-End
		$.ajax({
			type: "POST",
			url: `${mySite}/score/`,
			headers: {
				"X-CSRFToken": csrfElement.value,
			},
			data: {
				n: n,
				trials: counter,
				spatial: spatialScore,
				auditory: auditoryScore,
				total: totalScore,
			},
			cache: true,
			beforeSend: () => {},
			error: (error) => console.log(error),
			success: (response) => (csrfElement.value = response.csrf),
		});
	}
};

const startGame = function (currentBack) {
	/*
		This function starts the game by reseting Sensitivity & Specificity (TP, TN, FP, FN)
		Prepares UI, sets the active game status to true and Trials Counter to 0.
	*/

	// Reseting Sensitivity & Specificity
	let circle;
	const spatial = new Array();
	const auditory = new Array();
	[spatialTP, spatialTN, spatialFP, spatialFN] = [0, 0, 0, 0];
	[auditoryTP, auditoryTN, auditoryFP, auditoryFN] = [0, 0, 0, 0];

	// Set Active Game and Trials Counter to 0
	let trialsCounter = 0;
	activeGame = true;

	// Preparing UI
	nElements.forEach((item) => (item.innerHTML = currentBack));
	nBackInput.textContent = currentBack;
	scoreTitle.classList.remove("blink");
	nBackElement.textContent = currentBack;
	trialsElement.textContent = "0";
	spatialElement.textContent = "0";
	auditoryElement.textContent = "0";
	totalElement.textContent = "0.00";
	document.documentElement.style.setProperty("--active", "green");
	dualTask.innerHTML = `${trialsCounter} /`;
	hour.classList.add("hour-spin");

	// Set Trials
	const trialsInputValue = trialsInput.value;
	let currentTrials = 1;
	if (Number.isFinite(Number(trialsInputValue))) currentTrials = trialsInputValue < 1 ? 1 : trialsInputValue > 1000 ? 1000 : Number(trialsInputValue);
	trialsInput.value = currentTrials;
	trialsInput.disabled = true;

	// Start Game
	interval = setInterval(() => {
		// Remove Spatial Stimuli after 1.5s
		setTimeout(() => circle && (circle.style.backgroundColor = "transparent"), 1500);

		// Update Sensitivity & Specificity (TP, TN, FP, FN)
		if (spatialMatch && spatialInput) spatialTP++;
		else if (spatialMatch && !spatialInput) spatialFN++;
		else if (!spatialMatch && spatialInput) spatialFP++;
		else if (!spatialMatch && !spatialInput) spatialTN++;

		if (auditoryMatch && auditoryInput) auditoryTP++;
		else if (auditoryMatch && !auditoryInput) auditoryFN++;
		else if (!auditoryMatch && auditoryInput) auditoryFP++;
		else if (!auditoryMatch && !auditoryInput) auditoryTN++;

		[spatialMatch, spatialInput, auditoryMatch, auditoryInput] = [false, false, false, false];

		// Stop the game if the number of trials is reached
		if (trialsCounter >= currentTrials || !activeGame) stopGame(currentBack, trialsCounter);

		if (activeGame) {
			/*
				If the game has not been stopped then
				get a random spatial and auditory stimuli
				check if N-Back applies and update arrays.
			*/
			const spatialPlace = randomInt(1, 8);
			const auditorySound = randomInt(1, 8);

			auditory.push(auditorySound);
			spatial.push(spatialPlace);

			if (spatial.length > currentBack) {
				if (spatial[0] === spatial.slice(-1)[0]) spatialMatch = true;
				if (auditory[0] === auditory.slice(-1)[0]) auditoryMatch = true;
				spatial.shift();
				auditory.shift();
			}

			// Show Auditory
			sounds[auditoryMap.get(auditorySound)].play();

			// Show Spatial
			circle = document.querySelector(`.circle-${spatialPlace}`);
			circle.style.backgroundColor = "#e7b616";

			// Update Trials Counter
			trialsCounter++;
			dualTask.innerHTML = `${trialsCounter} /`;
		}
	}, 3000);
};

// LOCAL STORAGE
if (localStorage.getItem("taskNum")) nBackInput.textContent = localStorage.getItem("taskNum");
if (localStorage.getItem("trialNum")) trialsInput.value = localStorage.getItem("trialNum");
