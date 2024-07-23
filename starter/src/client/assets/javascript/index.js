const cars = [
  {
    name: "Green lightning",
    image:
      "https://cdn.pixabay.com/photo/2023/02/07/17/49/supercar-7774683_1280.jpg",
  },
  {
    name: "Yellow racer",
    image:
      "https://cdn.pixabay.com/photo/2020/11/06/19/09/car-5718685_1280.jpg",
  },
  {
    name: "Purple Racer",
    image:
      "https://cdn.pixabay.com/photo/2020/05/05/13/38/corvette-5133147_1280.jpg",
  },
  {
    name: "Red Racer",
    image:
      "https://cdn.pixabay.com/photo/2024/02/29/13/03/ai-generated-8604396_1280.png",
  },
  {
    name: "Blue Racer",
    image:
      "https://cdn.pixabay.com/photo/2016/02/19/05/58/cars-1208767_1280.jpg",
  },
];
const race_tracks = [
  {
    name: "Executioner",
    image: "https://live.staticflickr.com/2905/14727795194_21e547c95d_b.jpg",
  },
  {
    name: "Sebulba's Legacy",
    image:
      "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6419/6419956_sd.jpg;maxHeight=640;maxWidth=550",
  },
  {
    name: "Grabvine Gateway",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx9HkCv4KD2xufbbfu5-lOH0fEMZ8s-gENdQ&s",
  },
  {
    name: "Mountain Run",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGHglCHePAUjygpDCRK9pkZgP0DeC4C3Qytw&s",
  },
  {
    name: "Dark Revenge",
    image:
      "https://athlonsports.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTkxNDcyMzMzNjU4MDA3MTM4/220058-hungarian-gp-race-recap.jpg",
  },
  {
    name: "The Classic",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR32Lig37Sqqc77kaHx713I-5TTC8Dpoq_REw&s",
  },
];
// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
  track_id: undefined,
  track_name: undefined,
  player_id: undefined,
  player_name: undefined,
  race_id: undefined,
};

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  onPageLoad();
  setupClickHandlers();
});

async function onPageLoad() {
  console.log("Getting form info for dropdowns!");
  try {
    getTracks().then((tracks) => {
      const html = renderTrackCards(tracks);
      renderAt("#tracks", html);
    });

    getRacers().then((racers) => {
      const html = renderRacerCars(racers);
      renderAt("#racers", html);
    });
  } catch (error) {
    console.log("Problem getting tracks and racers ::", error.message);
    console.error(error);
  }
}

function setupClickHandlers() {
  if (!store.track_id || !store.player_id) {
    document
      .querySelector("#submit-create-race")
      .setAttribute("disabled", "true");
  }
  document.addEventListener(
    "click",
    function (event) {
      const { target } = event;

      // Race track form field
      if (target.matches(".card.track")) {
        handleSelectTrack(target);
        store.track_id = target.id;
        store.track_name = target.innerHTML;
      }

      // Racer form field
      if (target.matches(".card.racer")) {
        handleSelectRacer(target);
        store.player_id = target.id;
        store.player_name = target.innerHTML;
      }

      // Submit create race form
      if (target.matches("#submit-create-race")) {
        event.preventDefault();

        // start race
        handleCreateRace().then((item) => (store.race_id = item));
      }

      // Handle acceleration click
      if (target.matches("#gas-peddle")) {
        handleAccelerate();
      }

      if (store.track_id && store.player_id && !store.race_id) {
        document.querySelector("#submit-create-race")
          ? document
              .querySelector("#submit-create-race")
              .removeAttribute("disabled")
          : null;
      }

      console.log("Store updated :: ", store);
    },
    false
  );
}

async function delay(ms) {
  try {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  } catch (error) {
    console.log("an error shouldn't be possible here");
    console.log(error);
  }
}

// ^ PROVIDED CODE ^ DO NOT REMOVE

// BELOW THIS LINE IS CODE WHERE STUDENT EDITS ARE NEEDED ----------------------------
// TIP: Do a full file search for TODO to find everything that needs to be done for the game to work

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
  console.log("in create race server: ", `${SERVER}/api/`);
  renderAt("#race", renderRaceStartView(store.track_name));
  const race = await createRace(store.player_id, store.player_id);
  console.log("RACE: ", race);
  store.race_id = parseInt(race.ID - 1);

  try {
    await runCountdown().then(async () => await startRace(store.race_id));
    await runRace(store.race_id);
    return store.race_id;
  } catch (err) {
    console.log("Error-->", err.message);
  }
}

function runRace(raceID) {
  return new Promise((resolve, reject) => {
    // TODO - use Javascript's built in setInterval method to get race info (getRace function) every 500ms
    try {
      const updateRace = setInterval(async () => {
        await getRace(raceID).then((item) => {
          if (item.status === "in-progress")
            renderAt("#leaderBoard", raceProgress(item.positions));
          else if (item.status === "finished") {
            clearInterval(updateRace);
            renderAt("#race", resultsView(item.positions));
          } else {
            resolve(item);
          }
        });
      }, 500);
    } catch (error) {
      reject(error);
    }
  });
}

async function runCountdown() {
  try {
    // wait for the DOM to load
    await delay(1000);
    let timer = 3;

    return new Promise((resolve) => {
      // TODO - use Javascript's built in setInterval method to count down once per second
      const countDown = setInterval(() => {
        document.getElementById("big-numbers").innerHTML = --timer;
        if (timer === -1) {
          clearInterval(countDown);
          document.getElementById("big-numbers").innerHTML = "Start";
          resolve();
        }
      }, 1000);

      // run this DOM manipulation inside the set interval to decrement the countdown for the user

      // TODO - when the setInterval timer hits 0, clear the interval, resolve the promise, and return
    });
  } catch (error) {
    console.log(error);
  }
}

function handleSelectRacer(target) {
  console.log("selected a racer", target.id);

  // remove class selected from all racer options
  const selected = document.querySelector("#racers .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.classList.add("selected");
}

function handleSelectTrack(target) {
  console.log("selected track", target.id);

  const selected = document.querySelector("#tracks .selected");
  if (selected) {
    selected.classList.remove("selected");
  }

  // add class selected to current target
  target.parentNode.classList.add("selected");
}

async function handleAccelerate() {
  console.log("accelerate button clicked");
  // TODO - Invoke the API call to accelerate
  await accelerate(store.race_id);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
  if (!racers.length) {
    return `
			<h4>Loading Racers...</4>
		`;
  }

  const results = racers.map(renderRacerCard).join("");

  return `
			${results}
	`;
}

function renderRacerCard(racer) {
  const { id, driver_name, top_speed, acceleration, handling } = racer;
  const image = cars.find((item) => item.name === driver_name).image;
  return `<figure>
            <img src="${image}" alt="${driver_name}">
            <figcaption  class="card racer" id="${id}">${driver_name}</figcaption>
          </figure>`;
}

function renderTrackCards(tracks) {
  if (!tracks.length) {
    return `
			<h4>Loading Tracks...</4>
		`;
  }

  const results = tracks.map(renderTrackCard).join("");

  return `
			${results}
	`;
}

function renderTrackCard(track) {
  const { id, name } = track;
  const image = race_tracks.find((item) => item.name === name).image;

  return `<div id="${id}" class="card-track track">
  <img id="${id}" src="${image}" alt="${name}" class="card__img card track">
  <span class="card__footer">
    <span>${name}</span>
  </span>
  <span class="card__action">
    <svg viewBox="0 0 448 512" title="play">
      <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
    </svg>
  </span>
</div>`;
}

function renderCountdown(count) {
  return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`;
}

function renderRaceStartView(track) {
  return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`;
}

function resultsView(positions) {
  let userPlayer = positions.find((e) => e.id === parseInt(store.player_id));
  userPlayer.driver_name += " (you)";

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main class='container-result'>
			<h3 class='results'>Race Results</h3>
			<p class='results-subtitle'>The race is done! Here are the final results:</p>
			${results.join("")}
			<a href="/race" class='results-link'>Start a new race</a>
		</main>
	`;
}

function raceProgress(positions) {
  let userPlayer = positions.find((e) => e.id === parseInt(store.player_id));
  userPlayer.driver_name += " (you)";

  positions = positions.sort((a, b) => (a.segment > b.segment ? -1 : 1));
  let count = 1;

  const results = positions.map((p) => {
    return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`;
  });

  return `
		<table>
			${results.join("")}
		</table>
	`;
}

function renderAt(element, html) {
  const node = document.querySelector(element);

  node.innerHTML = html;
}

// ^ Provided code ^ do not remove

// API CALLS ------------------------------------------------

const SERVER = "http://localhost:3001";

function defaultFetchOpts() {
  return {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": SERVER,
    },
  };
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints

async function getTracks() {
  console.log(`calling server :: ${SERVER}/api/tracks`);
  try {
    const response = await fetch(`${SERVER}/api/tracks`).then((res) =>
      res.json()
    );
    return response;
  } catch (err) {
    console.log("Problem with get tracks request::", err);
  }
  // TIP: Don't forget a catch statement!
}

async function getRacers() {
  console.log("GET request to" + `${SERVER}/api/cars`);
  try {
    const response = await fetch(`${SERVER}/api/cars`).then((res) =>
      res.json()
    );
    return response;
  } catch (err) {
    console.log("Problem with get tracks request::", err);
  }
}

async function createRace(player_id, track_id) {
  console.log("Create race: ", `${SERVER}/api/races`);
  player_id = parseInt(player_id);
  track_id = parseInt(track_id);
  const body = { player_id, track_id };

  return await fetch(`${SERVER}/api/races`, {
    method: "POST",
    ...defaultFetchOpts(),
    dataType: "jsonp",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Problem with createRace request::", err));
}

async function getRace(id) {
  console.log("GET request to", `${SERVER}/api/races/${id}`);
  try {
    const response = await fetch(`${SERVER}/api/races/${id}`).then((res) =>
      res.json()
    );
    return response;
  } catch (err) {
    console.log("Problem with get tracks request::", err);
  }
}

async function startRace(id) {
  return await fetch(`${SERVER}/api/races/${id}/start`, {
    method: "POST",
    ...defaultFetchOpts(),
  })
    .then((res) => res.json())
    .catch((err) => console.log("Problem with getRace request::", err));
}

async function accelerate(id) {
  try {
    return await fetch(`${SERVER}/api/races/${id}/accelerate`, {
      method: "POST",
      ...defaultFetchOpts(),
    });
  } catch (err) {
    console.log(err);
  }
}
