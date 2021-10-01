"use strict";

/*
  TP: True Positive
  TN: True Negative
  FP: False Positive
  FN: False Negative
*/

// DARK MODE VARIABLES
let darkMode = false;
const switchMode = document.querySelector(".switch-checkbox");
const slider = document.querySelector(".slider");

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
const practiceAuditory = document.querySelector(".practice-auditory");
const practiceSpatial = document.querySelector(".practice-spatial");
const practiceDiv = document.querySelector(".practice-div");
const keyAButton = document.querySelector("#KeyA");
const keyLButton = document.querySelector("#KeyL");

// Game State
let interval;
let activeGame = false;
let taskInterval;
const arrowSpeed = 150;

// Spatial
let spatialMatch = false;
let spatialInput = false;

// Auditory
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

const spatialMap = new Map([
	[1, "↖"],
	[2, "↑"],
	[3, "↗"],
	[4, "←"],
	[5, "→"],
	[6, "↙"],
	[7, "↓"],
	[8, "↘"],
]);

const sounds = {
	h: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/h.wav`] }),
	j: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/j.wav`] }),
	k: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/k.wav`] }),
	l: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/l.wav`] }),
	q: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/q.wav`] }),
	r: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/r.wav`] }),
	s: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/s.wav`] }),
	t: new Howl({ preload: true, autoplay: false, html5: true, buffer: true, src: [`static/sounds/t.wav`] }),
};

// GAME FUNCTIONS AND EVENT LISTENERS

// Random Integer Function
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Score Functions
// const getAlternativeScore = (TP, TN, FP, FN) => (((TP + TN) / (TP + TN + FP + FN)) * 100).toFixed(2);
const getScore = (TP, FP, FN) => (TP ? ((TP / (TP + FP + FN)) * 100).toFixed(2) : FP || FN ? 0.0 : 100.0);

const practiceFunc = function (place, element, type = null, match = false, currentBack = null, stimuli = null) {
	let element2;

	if (place === "start") {
		if (element) {
			element.removeAttribute("style");
			element.style.marginRight = "5px";

			if (type === "Spatial") keyAButton.classList.remove("blink");
			else keyLButton.classList.remove("blink");
		}
	} else if (place === "middle") {
		element.lastElementChild.classList.remove("span-show");
		element.lastElementChild.classList.add("span-hide");

		element.lastElementChild.addEventListener("animationend", () => {
			element.lastElementChild.remove();
		});
	} else if (place === "end") {
		element.classList.add("span-show");
		element.innerHTML = type === "Auditory" ? auditoryMap.get(stimuli).toUpperCase() : spatialMap.get(stimuli);
		element.style.marginRight = "5px";
		type === "Auditory" ? practiceAuditory.prepend(element) : practiceSpatial.prepend(element);

		if (match) {
			element2 = type === "Auditory" ? practiceAuditory.querySelectorAll("span")[currentBack] : practiceSpatial.querySelectorAll("span")[currentBack];
			element2.style.fontWeight = "bold";
			element2.style.color = "green";
			element.style.fontWeight = "bold";
			element.style.color = "green";
			type === "Spatial" ? keyAButton.classList.add("blink") : keyLButton.classList.add("blink");
		}
	}
	return element2;
};

const stopGame = function (practice, n, counter, spatialTP, spatialTN, spatialFP, spatialFN, auditoryTP, auditoryTN, auditoryFP, auditoryFN) {
	/* 
		This function sets the active game status to false, 
		resets game status and clear interval, 
		unlocks trials and tasks options, clear UI,
		and shows score results.
	*/

	// Set Active Game and Clear Interval
	interval && clearInterval(interval);
	interval = null;
	activeGame = false;

	// Clear UI
	nElements.forEach((item) => (item.innerHTML = "N"));
	document.documentElement.style.setProperty("--active", "red");
	hour.classList.remove("hour-spin");
	practiceDiv.classList.remove("practice-div-show");
	if (practice) practiceDiv.classList.add("practice-div-hide");

	const clearPracticeDiv = () => {
		practiceAuditory.innerHTML = "";
		practiceSpatial.innerHTML = "";

		practiceDiv.removeEventListener("animationend", clearPracticeDiv);
	};

	practiceDiv.addEventListener("animationend", clearPracticeDiv);

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

	if (!practice && counter >= n * 20) {
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

const startGame = function (currentBack, practice = false) {
	/*
		This function starts the game by reseting Sensitivity & Specificity (TP, TN, FP, FN)
		Prepares UI, sets the active game status to true and Trials Counter to 0.
	*/
	if (interval) return;

	// Reseting Sensitivity & Specificity
	let circle;
	let lastAuditory;
	let firstAuditory;
	let lastSpatial;
	let firstSpatial;
	const spatial = new Array();
	const auditory = new Array();
	let [spatialTP, spatialTN, spatialFP, spatialFN] = [0, 0, 0, 0];
	let [auditoryTP, auditoryTN, auditoryFP, auditoryFN] = [0, 0, 0, 0];

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
	practiceDiv.classList.remove("practice-div-hide");
	if (practice) practiceDiv.classList.add("practice-div-show");

	// Set Trials
	const trialsInputValue = trialsInput.value;
	let currentTrials = 1;
	if (Number.isFinite(Number(trialsInputValue))) currentTrials = trialsInputValue < 1 ? 1 : trialsInputValue > 1000 ? 1000 : Number(trialsInputValue);
	trialsInput.value = currentTrials;
	trialsInput.disabled = true;

	// Start Game
	interval = setInterval(() => {
		// Remove hour-spin in order to avoid duplication
		hour.classList.remove("hour-spin");

		// Remove Spatial Stimuli after 1.5s
		setTimeout(() => circle && (circle.style.backgroundColor = "transparent"), 1500);

		if (practice) {
			practiceFunc("start", firstAuditory, "Auditory");
			practiceFunc("start", firstSpatial, "Spatial");
		}

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
		if (trialsCounter >= currentTrials || !activeGame) stopGame(practice, currentBack, trialsCounter, spatialTP, spatialTN, spatialFP, spatialFN, auditoryTP, auditoryTN, auditoryFP, auditoryFN);

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

			if (practice && practiceAuditory.children.length > currentBack) {
				practiceFunc("middle", practiceAuditory);
				practiceFunc("middle", practiceSpatial);
			}

			// console.log(auditory);
			// console.log(spatial);

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

			if (practice) {
				firstAuditory = document.createElement("span");
				lastAuditory = practiceFunc("end", firstAuditory, "Auditory", auditoryMatch, currentBack, auditorySound);

				firstSpatial = document.createElement("span");
				lastSpatial = practiceFunc("end", firstSpatial, "Spatial", spatialMatch, currentBack, spatialPlace);
			}

			// Update Trials Counter
			trialsCounter++;
			dualTask.innerHTML = `${trialsCounter} /`;

			// Add hour-spin and remove after 2900ms (Firefox fix)
			hour.classList.add("hour-spin");
			setTimeout(() => hour.classList.contains("hour-spin") && hour.classList.remove("hour-spin"), 2900);
		}
	}, 3000);
};

// LOCAL STORAGE
if (localStorage.getItem("taskNum")) nBackInput.textContent = localStorage.getItem("taskNum");
if (localStorage.getItem("trialNum")) trialsInput.value = localStorage.getItem("trialNum");
