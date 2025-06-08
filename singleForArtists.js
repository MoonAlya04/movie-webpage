const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const personId = urlParams.get('id');

const api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
const img_url = "https://image.tmdb.org/t/p/w500";

const mainSection = document.querySelector(".single__main");
const filmsFor = document.querySelector(".films-for-list");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

(async function loadDetails() {
    if (type !== "person") return;

    try {
        const personRes = await fetch(`https://api.themoviedb.org/3/person/${personId}?${api_key}`);
        if (!personRes.ok) throw new Error('Person not found');
        const person = await personRes.json();
        createPersonCard(person);

        const creditsRes = await fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?${api_key}`);
        const credits = await creditsRes.json();
        displayFilmography(credits.cast);
    } catch (err) {
        console.error('Error loading person data:', err);
    }
})();

function createPersonCard(person) {
    const img = person.profile_path ? img_url + person.profile_path : 'https://via.placeholder.com/300x450';
    const bio = person.biography;
    const birthPlace = person.place_of_birth;

    const card = document.createElement("section");
    
    card.innerHTML = `
        <div class="slider__bg--for-person" style="background-color:#17171d;">
            <div class="slider__container" id="for-single">
                <div>
                    <img src="${img}" alt="${person.name}" />
                    <h5>${person.name}</h5>
                    <span>${birthPlace}</span>
                </div>
                <div>
                    <div class="about-person">${bio}</div>
                </div>
            </div>
        </div>
    `;
    mainSection.prepend(card);
}



function displayFilmography(movies) {
    if (!movies?.length) return;

    const uniqueMovies = {};
    movies.forEach(movie => {
        if (!uniqueMovies[movie.id]) uniqueMovies[movie.id] = movie;
    });

    const wrapper = document.createElement("div");
    wrapper.classList.add("filmography-container", "card-wrapper");

    Object.values(uniqueMovies).forEach(movie => {
        const card = createMovieCard({
            title: movie.title || movie.name,
            image: movie.poster_path,
            id: movie.id,
            release: movie.release_date || movie.first_air_date,
            rate: movie.vote_average,
            type: "movie"
        });
        wrapper.appendChild(card);
    });

    filmsFor.appendChild(wrapper);
}

function createMovieCard({ title, image, id, rate, type }) {
    const isInWatchlist = watchlist.some(item => item.id == id && item.type == type);
    const heartClass = isInWatchlist ? "fa-solid" : "fa-regular";
    const poster = image ? img_url + image : 'https://via.placeholder.com/300x450';

    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
        <div class="image-info">
            <div class="icons">
                <i class="${heartClass} fa-heart" data-id="${id}" data-type="${type}" onclick="togglewatchlist(event)"></i>
            </div>
            <img src="${poster}" alt="${title}" />
        </div>
        <div class="movie-info">
            <h4>${title}</h4>
            <div class="rating-stars"></div>
           
        </div>
    `;

    const stars = createStars(rate, 10);
    card.querySelector(".rating-stars").appendChild(stars);

    card.addEventListener("click", (e) => {
        if (!e.target.classList.contains('fa-heart')) {
            window.location.href = `single.html?type=${type}&id=${id}`;
        }
    });

    return card;
}

function createStars(rating = 0, max = 10) {
    const container = document.createElement("div");
    container.className = "stars";

    const score = (rating / max) * 5;
    const full = Math.floor(score);
    const half = score % 1 >= 0.5;

    for (let i = 0; i < full; i++) {
        container.innerHTML += `<span class="star full">★</span>`;
    }
    if (half) container.innerHTML += `<span class="star half">★</span>`;
    for (let i = full + half; i < 5; i++) {
        container.innerHTML += `<span class="star empty">★</span>`;
    }

    return container;
}

function togglewatchlist(e) {
    e.stopPropagation();
    const icon = e.target;
    const id = icon.dataset.id;
    const type = icon.dataset.type;

    const index = watchlist.findIndex(item => item.id == id && item.type == type);
    if (index > -1) {
        watchlist.splice(index, 1);
        icon.classList.replace("fa-solid", "fa-regular");
    } else {
        watchlist.push({ id, type });
        icon.classList.replace("fa-regular", "fa-solid");
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));
}



document.addEventListener("DOMContentLoaded", () => {
    let burgerBtn = document.getElementById("burgerBtn");
    let mobileMenu = document.getElementById("mobileMenu");
    let menuOverlay = document.getElementById("menuOverlay");
    let closeBtn = document.getElementById("closeBtn");

    burgerBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("visible");
        menuOverlay.classList.toggle("visible");
    });

    menuOverlay.addEventListener("click", () => {
        mobileMenu.classList.remove("visible");
        menuOverlay.classList.remove("visible");
    });

    closeBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("visible"); 
        menuOverlay.classList.remove("visible");
    });
})



