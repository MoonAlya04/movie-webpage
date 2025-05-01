const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const movieId = urlParams.get('id');


let api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
let img_url = "https://image.tmdb.org/t/p/w500";
let img_url_original = "https://image.tmdb.org/t/p/original";

let movieGenres = document.querySelector(".movies-genre");
let videoCont = document.querySelector("#video");
let mainSection = document.querySelector(".single__main");
let directorList = document.querySelector(".director-list");

(async function loadDetails() {
    try {
        let res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?${api_key}`);
        if (!res.ok) throw new Error('Not found');
        let data = await res.json();
        handleDetails(data, type);
    } catch (error) {
        console.error('Movie/TV show not found', error);
    }
})();

async function handleDetails(data, type) {
    createMovieCard(data);
    displayGenres(data.genres);
    let videosRes = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/videos?${api_key}`);
    let videosData = await videosRes.json();
    displayVideos(videosData);

    let creditsRes = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}/credits?${api_key}`);
    let creditsData = await creditsRes.json();
    displayCredits(creditsData);
}


function createMovieCard(e) {
    const card = document.createElement("section");
    card.innerHTML = `
        <div class="slider__bg"
            style="background-image: linear-gradient(272deg, rgba(47, 47, 47, 0) 20.14%, #09090b 85.71%), url(${img_url_original + e.backdrop_path});">
            <div class="slider__container">
                <img src="${img_url + e.poster_path}" alt="${e.title || e.name}" />
                <h5>${e.title || e.name}</h5>
                <p>${e.overview}</p>
                <div class="ganre-film-card">
                    <span>${e.release_date || e.first_air_date}</span>
                </div>
                <div class="rating-stars"></div>
            </div>
        </div>
    `;
    const ratingContainer = card.querySelector(".rating-stars");
    const stars = createStars(e.vote_average, 10);
    ratingContainer.append(stars);
    mainSection.prepend(card);
}

function displayGenres(genres) {
    movieGenres.innerHTML = "";
    genres.forEach((genre) => {
        const genreBtn = document.createElement("button");
        genreBtn.className = "genres-info";
        genreBtn.textContent = genre.name;
        movieGenres.append(genreBtn);
    });
}

function displayVideos(videoData) {
    videoCont.innerHTML = "";
    videoData.results.slice(0, 4).forEach((video) => {
        videoCont.innerHTML += `
            <div class="video-box">
                <iframe width="100%" height="315" 
                    src="https://www.youtube.com/embed/${video.key}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
            </div>;`
    });
}

function displayCredits(credits) {
    let castList = document.querySelector(".cast-list");
    castList.innerHTML = "";
    credits.cast.forEach((e) => {
        const artistDiv = document.createElement("div");
        artistDiv.classList.add("artists");
        artistDiv.innerHTML = `
            <div class="artist-img" style="background-image: url(${e.profile_path ? img_url + e.profile_path : "https://via.placeholder.com/500x750?text=No+Image"})"></div>
            <div class="artists-info">${e.name}</div>
        `;
        artistDiv.addEventListener("click", () => {
            window.location.href = `singleForArtists.html?type=person&id=${e.id}`;
        });
        castList.appendChild(artistDiv);
    });

    directorList.innerHTML = "";
    credits.crew
        .filter(member => member.job === "Director")
        .forEach((e) => {
            const directorDiv = document.createElement("div");
            directorDiv.classList.add("artists");
            directorDiv.innerHTML = `
                <div class="artist-img" style="background-image: url(${e.profile_path ? img_url + e.profile_path : "https://via.placeholder.com/500x750?text=No+Image"})"></div>
                <div class="artists-info">${e.name}</div>
            `;
            directorDiv.addEventListener("click", () => {
                window.location.href = `singleForArtists.html?type=person&id=${e.id}`;
            });
            directorList.appendChild(directorDiv);
        });
}


function createStars(rating, maxRating = 10) {
    const starsContainer = document.createElement("div");
    starsContainer.className = "stars";

    const ratingOutOf5 = (rating / maxRating) * 5;
    const fullStars = Math.floor(ratingOutOf5);
    const hasHalfStar = ratingOutOf5 - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement("span");
        star.className = "star full";
        star.innerHTML = "★";
        starsContainer.append(star);
    }

    if (hasHalfStar) {
        const halfStar = document.createElement("span");
        halfStar.className = "star half";
        halfStar.innerHTML = "★";
        starsContainer.append(halfStar);
    }

    for (let i = 0; i < 5 - (fullStars + (hasHalfStar ? 1 : 0)); i++) {
        const emptyStar = document.createElement("span");
        emptyStar.className = "star empty";
        emptyStar.innerHTML = "★";
        starsContainer.append(emptyStar);
    }
    return starsContainer;
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
        mobileMenu.classList.remove("visible"); ԺԺ
        menuOverlay.classList.remove("visible");
    });
})