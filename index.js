// TODO: I COULD paste the data in this file rather than reading from a separate JSON file?

// fetchJSONData() is purely to render category options + redirect user to the correct page, depending on chosen categories
function fetchJSONData() {
	fetch("./data.json")
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP error! Status: ${res.status}`);
			}

			return res.json();
		})
		.then((data) => {
			console.log(window.location.pathname);

			// If on homepage (main), render the main categories onto the page
			const mainCategories = Object.keys(data);
			const mainCategoryDiv = document.getElementById("mainCategoryDiv");
			if (mainCategoryDiv) {
				for (const category of mainCategories) {
					mainCategoryDiv.innerHTML += `<div class="btn" onclick="mainCatSelect('${category}')">${category}</div>`;
				}
				/* TODO: Hide "All" option till the basic game func has been completed 
          + to allow the "All" option, "category choosing" logiic needs to be reworked */
				// if (!document.getElementById("allOption")) {
				// 	mainCategoryDiv.innerHTML += `<div class="btn" id="allOption" onclick="mainCatSelect('All')">All</div>`;
				// }
			}

			// If categories page, render the sub categories onto the page
			// Note: A main category SHOULD be chosen at this point, if not, redirect them back to main page
			const subCategoryDiv = document.getElementById("subCategoriesDiv");
			const mainCategoryTitle = document.getElementById("mainCategoryTitle");
			if (subCategoryDiv && mainCategoryTitle) {
				const chosenCat = localStorage.getItem("mainCategory");
				if (chosenCat) {
					mainCategoryTitle.innerHTML = chosenCat;
					for (const subCategory of Object.keys(data[chosenCat])) {
						subCategoryDiv.innerHTML += `<div class="btn" onclick="subCatSelect('${subCategory}')">${subCategory}</div>`;
					}
					if (!document.getElementById("allOption")) {
						subCategoryDiv.innerHTML += `<div class="btn" id="allOption" onclick="subCatSelect('All')">All</div>`;
					}
				} else {
					console.log("Main category hasn't been chosen. Redirecting to homepage");
					window.location.pathname = "/index.html";
				}
			}

			// On some reload - If a main + sub category is selected, redirect user to games page (if they're not in it already)
			const chosenMainCategory = localStorage.getItem("mainCategory");
			const chosenSubCategory = localStorage.getItem("subCategory");
			if (chosenMainCategory && chosenSubCategory) {
				const gameTitle = document.getElementById("gameTitle");
				if (gameTitle) {
					gameTitle.innerHTML = chosenMainCategory + " : " + chosenSubCategory;
				} else {
					// If the user is in a diff page WITH chosen main and sub categories, redirect user to the game
					console.log(`Resume game for chosen categories: ${chosenMainCategory} - ${chosenSubCategory}`);
					window.location.pathname = "/game.html";
				}
			}
		})
		.catch((error) => console.error("Unable to fetch data", error));
}

// Store Main category + redirect
function mainCatSelect(category) {
	console.log("chosen Main Category: ", category);
	localStorage.setItem("mainCategory", category);
	window.location.pathname = "/categories.html";
}

// Store Sub category + redirect
function subCatSelect(subCateory) {
	console.log("chosen Sub Category: ", subCateory);
	localStorage.setItem("subCategory", subCateory);
	window.location.pathname = "/game.html";
}

// Read and Render category options
fetchJSONData();

function backToHome() {
	localStorage.clear();
	window.location.pathname = "/index.html";
}

// Listener: On Webpage title click, redirect to homepage
document.getElementById("titleHeading").addEventListener("click", () => {
	backToHome();
});

// Game Logic
/* 
1. Load in choices
2. Make random pairs, non-repeating
3. Load a pair one at a time - change pair on card click
  3.1. Add some kind of animation on card click
*/
function createPairs() {
	fetch("./data.json")
		.then((res) => {
			if (!res.ok) {
				throw new Error(`HTTP error! Status: ${res.status}`);
			}

			return res.json();
		})
		.then((data) => {
			console.log("Creating pairs...");

			// On some reload - If a main + sub category is selected, redirect user to games page (if they're not in it already)
			const mainCategory = localStorage.getItem("mainCategory");
			const subCategory = localStorage.getItem("subCategory");

			// If the categories (somehow) hasn't been chosen, redirect user to homepage.
			if (!mainCategory || !subCategory) {
				console.log("Categories hasn't been chosen. Redirecting to homepage", { mainCategory, subCategory });
				window.location.pathname = "/index.html";
			}

			// Get options
			const options = data[mainCategory][subCategory];
			if (!options) {
				console.log("No options found", { mainCategory, subCategory });
				backToHome();
				return;
			}

			// TODO: check if options have been formatted - load them instead of remaking options...

			const pairs = [];
			// Create random pairs, non-repeating
			if (options.length % 2 != 0) {
				alert("You must have an even number of options. You currently have " + options.length + " options.");
				backToHome();
				return;
			}

			// Create arr to keep track of which options have been used already
			const seenOptions = [];

			// Copy and shuffle the options
			const shuffledOptions = options.slice();
			shuffledOptions.sort(() => 0.5 - Math.random()); // shuffle arrays
			console.log(shuffledOptions);

			// Create pairs
			for (const o of shuffledOptions) {
				// Check if options has been used already
				if (seenOptions.find((f) => f === o)) {
					continue;
				}
				seenOptions.push(o);

				// Get pair value
				let pairVal = undefined;
				while (pairVal === undefined) {
					// Get a random option
					const randomIndex = [Math.floor(Math.random() * shuffledOptions.length)];
					const randomOpt = shuffledOptions[randomIndex];
					if (seenOptions.find((f) => f === randomOpt)) {
						continue;
					}
					pairVal = randomOpt;
					seenOptions.push(randomOpt);
					// TODO: Remove the option from shuffledOptions? to optimise logic - not needed tho
				}

				// Store pair
				pairs.push([o, pairVal]);
			}

			console.log(pairs);
		})
		.catch((error) => console.error("Unable to create pairs", error));
}

function gameLogic() {
	console.log("Game Logic!");
	// TODO: load in pairs into UI
	// use localStorage to keep track of which pair is to be shown
	// onClick listeners to change the pairs shown + animation on the card that was clicked?
}

document.getElementById("topCard").addEventListener("click", () => {
	console.log("topCard");
});

document.getElementById("bottomCard").addEventListener("click", () => {
	console.log("bottomCard");
});

if (window.location.pathname.includes("game.html")) {
	createPairs();
	gameLogic();
}
