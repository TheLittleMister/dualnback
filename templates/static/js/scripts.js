"use strict";

// DARK MODE VARIABLES
let darkMode = false;
const switchMode = document.querySelector(".switch-checkbox");
const slider = document.querySelector(".slider");

// MODAL VARIABLES
const signupModal = document.querySelector(".sign-up");
const signupBtn = document.querySelector(".sign-up-button");
const signupSpan = document.getElementsByClassName("sign-up-close")[0];

const dynamicModal = document.querySelector(".dynamic");
const dynamicBtns = document.querySelectorAll(".dynamic-button");
const dynamicSpan = document.getElementsByClassName("dynamic-close")[0];

const sessionButtons = document.querySelector(".session-buttons");
const accountButton = document.querySelector(".account");
const dropdown = document.querySelector(".dropdown");

const statisticsDiv = document.querySelector(".statistics-div");
const statisticsCheckButton = document.querySelector("#statistics-submit-button");
const nStatisticsElement = document.querySelector(".stats-n-back");
const trialsStatisticsElement = document.querySelector(".stats-trials");
const spatialStatisticsElement = document.querySelector(".stats-spatial");
const auditoryStatisticsElement = document.querySelector(".stats-auditory");
const totalStatisticsElement = document.querySelector(".stats-total");

// FORM VARIABLES
const dynamicForm = document.querySelector(".dynamic-form");
const myDynamicForm = document.querySelector("#my-dynamic-form");
const h2Dynamic = document.querySelector(".h2-dynamic");
const csrfInput = dynamicForm.querySelector("input");

// GENERAL VARIABLES
const arrows = [...document.querySelectorAll(".up"), ...document.querySelectorAll(".down")];
const codes = ["KeyA", "KeyL", "KeyQ", "KeyS", "task-up", "task-down", 1, 3];
const buttons = document.querySelectorAll("button");

// DARK MODE FUNCTIONS AND EVENT LISTENERS
const darkModeFunc = function () {
	/* 
		This function adds/removes darkMode.css file to/from <head></head>
		based on user's preference.
	*/

	darkMode ? loadJsCssFile("static/css/darkMode.css", "css") : removeJsCssFile("static/css/darkMode.css", "css");
	darkMode ? document.documentElement.style.setProperty("--clock-day", "#444") : document.documentElement.style.setProperty("--clock-day", "#e7b616");
	darkMode ? document.documentElement.style.setProperty("--clock-night", "#e7b616") : document.documentElement.style.setProperty("--clock-night", "#444");
	localStorage.setItem("isDarkMode", darkMode);

	/*
		loadjscssfile("myscript.js", "js"); // Dynamically load and add this .js file
		loadjscssfile("javascript.php", "js"); // Dynamically load "javascript.php" as a JavaScript file
		loadjscssfile("mystyle.css", "css"); // Dynamically load and add this .css file
		removejscssfile("somescript.js", "js"); // Remove all occurences of "somescript.js" on page though in most browser this does not unload the script
		removejscssfile("somestyle.css", "css"); // Remove all occurences "somestyle.css" on page
	*/
};

switchMode.addEventListener("change", function (e) {
	/*
		This Event Listener changes dark mode state.
	*/
	darkMode = e.target.checked;
	unpressBtn();
	darkModeFunc();
});

// UI FUNCTIONS AND EVENT LISTENERS
const pressBtn = (e) => {
	taskInterval && clearInterval(taskInterval);

	if (e.target === slider || e.target.closest("button")?.classList.contains("account") || e.target.closest("button")?.classList.contains("sign-up-button") || e.target.closest("button")?.classList.contains("dynamic-button") || e.target.closest(".modal") || e.target.closest("input") || e.target.closest(".social") || e.target.closest(".session"))
		return false;
	let code = e.code || e.target.id || e.which;
	code = code === 1 ? "KeyA" : code === 3 ? "KeyL" : code;

	if (codes.includes(code)) {
		const key = document.getElementById(code);
		key.style.color = "#bdb7af";

		const svgEl = key.querySelector("svg");
		if (svgEl) svgEl.querySelector("path").style.fill = "#bdb7af";

		if (activeGame) {
			if (code === "KeyQ") {
				key.style.backgroundColor = "#444";
				activeGame = false;
			} else if (code === "KeyA") {
				spatialInput = true;

				if (spatialMatch) key.style.backgroundColor = "green";
				else key.style.backgroundColor = "darkred";
			} else if (code === "KeyL") {
				auditoryInput = true;

				if (auditoryMatch) key.style.backgroundColor = "green";
				else key.style.backgroundColor = "darkred";
			} else codes.slice(0, 4).includes(code) && (key.style.backgroundColor = "#444");
		} else {
			if (code === "task-up") {
				nBackInput.textContent = Number(nBackInput.textContent) > 0 && Number(nBackInput.textContent) < 100 ? Number(nBackInput.textContent) + 1 : 1;

				taskInterval = setInterval(() => {
					nBackInput.textContent = Number(nBackInput.textContent) > 0 && Number(nBackInput.textContent) < 100 ? Number(nBackInput.textContent) + 1 : 1;
					localStorage.setItem("taskNum", nBackInput.textContent);
				}, arrowSpeed);

				localStorage.setItem("taskNum", nBackInput.textContent);
			} else if (code === "task-down") {
				nBackInput.textContent = Number(nBackInput.textContent) > 1 ? Number(nBackInput.textContent) - 1 : 1;

				taskInterval = setInterval(() => {
					nBackInput.textContent = Number(nBackInput.textContent) > 1 ? Number(nBackInput.textContent) - 1 : 1;
					localStorage.setItem("taskNum", nBackInput.textContent);
				}, arrowSpeed);

				localStorage.setItem("taskNum", nBackInput.textContent);
			}

			if (code === "KeyS") startGame(Number(nBackInput.textContent) > 0 && Number(nBackInput.textContent) < 101 ? Number(nBackInput.textContent) : 1);
			codes.slice(0, 4).includes(code) && (key.style.backgroundColor = "#444");
		}
	}
};

const unpressBtn = (e) => {
	taskInterval && clearInterval(taskInterval);

	localStorage.setItem("trialNum", Number.isFinite(Number(trialsInput.value)) ? (trialsInput.value < 1 ? 1 : trialsInput.value > 1000 ? 1000 : Number(trialsInput.value)) : 100);

	buttons.forEach((item) => {
		item.style.backgroundColor = "transparent";
		item.style.color = darkMode ? "#bdb7af" : "#444";

		const svgEl = item.querySelector("svg");
		if (svgEl) svgEl.querySelector("path").style.fill = darkMode ? "#bdb7af" : "#444";
	});

	arrows.forEach((item) => (item.classList.contains("up") ? (item.style.borderBottomColor = "#555") : (item.style.borderTopColor = "#555")));
};

const prevention = (e) => e.preventDefault();

arrows.forEach((item) => {
	item.addEventListener("mousedown", function (e) {
		item.classList.contains("up") ? (item.style.borderBottomColor = "lightgrey") : (item.style.borderTopColor = "lightgrey");
	});
});
[...document.querySelectorAll("a"), ...document.querySelectorAll("input")].forEach((item, index, arr) => (item.ondragstart = prevention));

document.addEventListener("contextmenu", prevention);
document.addEventListener("keypress", pressBtn);
document.addEventListener("mousedown", pressBtn);
document.addEventListener("keyup", unpressBtn);
document.addEventListener("mouseup", unpressBtn);

// LOCAL STORAGE
if (localStorage.getItem("isDarkMode") === "true") {
	darkMode = true;
	switchMode.checked = true;
	darkModeFunc();
}

if (localStorage.getItem("statsN")) document.querySelector("#nback").value = localStorage.getItem("statsN");
if (localStorage.getItem("sets")) $("#sets").val(localStorage.getItem("sets"));

// Footer Year
const todayDate = new Date();
document.querySelector(".year").innerHTML = todayDate.getFullYear();

// Default statistics date
const statsDate = document.querySelector("#stats-date");
statsDate.valueAsDate = todayDate;
todayDate.setDate(todayDate.getDate() + 1);
statsDate.setAttribute("max", todayDate.toISOString().split("T")[0]);

//////////////////////////////////////////////////////////////

$(document).keydown(function (event) {
	if (event.keyCode == 123) {
		// Prevent F12
		return false;
	} else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
		// Prevent Ctrl+Shift+I
		return false;
	}
});

/////////////////////////* MODAL FROM W3 SCHOOLS *//////////////////////////

// When the user clicks the button, open the modal
dynamicBtns.forEach((item, index, arr) => {
	item.onclick = function (e) {
		/*
			This Event Listener handles Dynamic Form
		*/
		h2Dynamic.innerHTML = "";
		statisticsDiv.style.display = "none";
		dynamicModal.style.display = "block";
		myDynamicForm.classList.remove("chart-container");
		beforeFunc("dynamic-submit-button", "dynamic-loader-div", "dynamic-formMessages", "my-dynamic-form");

		if (e.target.classList.contains("login")) {
			fetch(`${mySite}/login`)
				.then((response) => response.json())
				.then((response) => {
					dynamicForm.setAttribute("action", `${mySite}/login/`);

					myDynamicForm.innerHTML = response.form;
					myDynamicForm.insertAdjacentHTML("beforeend", `<a href="${mySite}/reset_password/">Forgot Password?</a>`);
					h2Dynamic.innerHTML = "Log In";

					const dynamicLabel = document.querySelector(".dynamic-form")?.querySelectorAll("label");
					if (dynamicLabel[0]) dynamicLabel[0].innerHTML = "Username/Email :";
					if (dynamicLabel[1]) dynamicLabel[1].innerHTML = "Password :";
				})
				.catch((error) => {
					location.reload();
				});
			afterFunc("dynamic-submit-button", "dynamic-loader-div");
		}

		if (e.target.classList.contains("my-account")) {
			fetch(`${mySite}/account`)
				.then((response) => response.json())
				.then((response) => {
					csrfInput.value = response.csrf;
					dynamicForm.setAttribute("action", `${mySite}/account/`);
					myDynamicForm.innerHTML = response.form;
					myDynamicForm.insertAdjacentHTML("beforeend", `<a href="${mySite}/change-password/">Change Password</a>`);
					h2Dynamic.innerHTML = `<a style="font-size: x-small; color: crimson; float: left;" href="${mySite}/delete/">[Delete]</a><p>Account</p>`;
				})
				.catch((error) => {
					location.reload();
				});
			afterFunc("dynamic-submit-button", "dynamic-loader-div");
		}

		if (e.target.classList.contains("statistics")) statisticsCheckButton.click();
	};
});

// When the user clicks on <span> (x), close the modal
dynamicSpan.onclick = function () {
	dynamicModal.style.display = "none";
};

//////////////////////////// SIGN UP FORM

if (signupBtn) {
	// When the user clicks the button, open the modal
	signupBtn.onclick = function () {
		signupModal.style.display = "block";
	};

	// When the user clicks on <span> (x), close the modal
	signupSpan.onclick = function () {
		signupModal.style.display = "none";
	};
}

///////////////////////

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == signupModal || event.target == dynamicModal) {
		if (signupModal) signupModal.style.display = "none";
		dynamicModal.style.display = "none";
	}
};

//////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

const beforeFunc = function (buttonID = null, loaderID, ulElementID = null, formBodyID = null) {
	/*
		FUNCTION TO MAKE EASIER BEFORESEND AJAX
	*/
	buttonID && (document.getElementById(buttonID).style.display = "none");
	document.getElementById(loaderID).classList.add("loader");

	if (ulElementID) {
		const ulElement = document.getElementById(ulElementID);
		ulElement.classList.remove("ul-danger");
		ulElement.classList.remove("ul-success");
		ulElement.innerHTML = "";
	}

	if (formBodyID) document.getElementById(formBodyID).innerHTML = "";
};

const afterFunc = function (buttonID = null, loaderID, ulElementID = null, messages = null, success = false) {
	/*
		FUNCTION TO MAKE EASIER AFTERSEND(SUCCESS/ERROR) AJAX 
	*/
	if (ulElementID) {
		const ulElement = document.getElementById(ulElementID);

		if (messages.length > 0) {
			if (success) ulElement.classList.add("ul-success");
			else ulElement.classList.add("ul-danger");
			for (let messageID in messages) ulElement.insertAdjacentHTML("afterbegin", `<li class="ml-2">${messages[messageID]}</li>`);
		}
	}

	document.getElementById(loaderID).classList.remove("loader");
	buttonID && (document.getElementById(buttonID).style.display = "inline-block");
};

const updateUI = function (username, csrf) {
	if (sessionButtons) sessionButtons.remove();
	accountButton.innerHTML = `${username} <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewbox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>`;
	dropdown.style.display = "block";
	csrfElement.value = csrf;
};

$(".sign-up-form").submit(function (e) {
	/*
		THIS AJAX FUNCTION SUBMITS SIGN UP FORM
	*/
	e.preventDefault();
	const form = $(this);
	const action = form.attr("action");

	if (action) {
		$.ajax({
			type: "POST",
			url: `${mySite}${action}`,
			data: form.serialize(),
			beforeSend: beforeFunc("sign-up-submit-button", "sign-up-loader-div", "sign-up-formMessages"),
			error: (error) => location.reload(),
			success: function (response) {
				if (response.created) {
					signupModal.remove();
					updateUI(response.username, response.csrf);
				} else afterFunc("sign-up-submit-button", "sign-up-loader-div", "sign-up-formMessages", response.messages, response.created);
			},
		});
	}
});

$(".dynamic-form").submit(function (e) {
	/*
		THIS AJAX FUNCTION SUBMITS DYNAMIC FORM
	*/
	e.preventDefault();
	const form = $(this);
	const action = form.attr("action");

	if (action) {
		$.ajax({
			type: "POST",
			url: `${action}`,
			data: form.serialize(),
			beforeSend: beforeFunc("dynamic-submit-button", "dynamic-loader-div", "dynamic-formMessages"),
			error: (error) => location.reload(),
			success: function (response) {
				if (response.done) {
					dynamicModal.style.display = "none";
					updateUI(response.username, response.csrf);
				}
				afterFunc("dynamic-submit-button", "dynamic-loader-div", "dynamic-formMessages", response.messages, response.done);
			},
		});
	}
});

$(".statistics-form").submit(function (e) {
	/*
		THIS AJAX FUNCTION SUBMITS STATISTICS FORM
	*/
	e.preventDefault();
	const form = $(this);
	const action = form.attr("action");
	statisticsDiv.style.display = "none";

	if (action) {
		$.ajax({
			type: "GET",
			url: `${action}`,
			data: form.serialize(),
			beforeSend: beforeFunc("statistics-submit-button", "dynamic-loader-div"),
			error: (error) => location.reload(),
			success: function (response) {
				dynamicForm.setAttribute("action", `#`);
				const canvas = document.createElement("canvas");
				canvas.setAttribute("id", "myChart");
				myDynamicForm.classList.add("chart-container");
				myDynamicForm.innerHTML = ``;
				myDynamicForm.appendChild(canvas);
				h2Dynamic.innerHTML = "Statistics";

				nStatisticsElement.innerHTML = response.n;
				trialsStatisticsElement.innerHTML = response.trials;
				spatialStatisticsElement.innerHTML = response.spatial;
				auditoryStatisticsElement.innerHTML = response.auditory;
				totalStatisticsElement.innerHTML = response.total;

				localStorage.setItem("statsN", response.n);
				localStorage.setItem("sets", response.sets);

				if (response.data) {
					response.created_list.forEach((item, index, arr) => (response.created_list[index] = [prettyDate(item), ` (${response.trials_list[index]} trials)`]));

					const ctx = canvas.getContext("2d");
					const myChart = new Chart(ctx, {
						type: "line",
						data: {
							labels: response.created_list,
							datasets: [
								{
									label: "Spatial",
									data: response.spatial_list,
									backgroundColor: ["rgba(231, 182, 22, 0.5)"],
									borderColor: ["rgba(231, 182, 22, 1)"],
									borderWidth: 1,
								},
								{
									label: "Auditory",
									data: response.auditory_list,
									backgroundColor: ["rgba(70, 130, 180, 0.5)"],
									borderColor: ["rgba(70, 130, 180, 1)"],
									borderWidth: 1,
								},
								{
									label: "Total",
									data: response.total_list,
									backgroundColor: ["rgba(219, 20, 60, 0.5)"],
									borderColor: ["rgba(219, 20, 60, 1)"],
									borderWidth: 1,
								},
							],
						},
						options: {
							scales: {
								y: {
									beginAtZero: true,
								},
							},
							maintainAspectRatio: false,
						},
					});
				} else {
					myDynamicForm.innerHTML = "No data.";
				}

				statisticsDiv.style.display = "flex";
				afterFunc("statistics-submit-button", "dynamic-loader-div");
			},
		});
	}
});
