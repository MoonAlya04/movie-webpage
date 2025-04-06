let productId = location.href.split("=")[1];
let api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
let img_url = "https://image.tmdb.org/t/p/w500";
let img_url_original = "https://image.tmdb.org/t/p/original";
let baseUrl = "https://api.themoviedb.org/3";
let movieDetailsUrl = `${baseUrl}/movie/${productId}?${api_key}`;
let movieGenres = document.querySelector(".movies-genre");
let videoCont = document.querySelector("#video");
let mainSection = document.querySelector(".single__main");
let directorList = document.querySelector(".director-list");

fetch(movieDetailsUrl)
    .then((res) => res.json())
    .then((data) => createMovieCard(data))
    .catch((err) => console.error(err));

function createMovieCard(e) {
    const card = document.createElement("section");
    card.innerHTML = `
        <div class="slider__bg"
            style="background-image: linear-gradient(272deg, rgba(47, 47, 47, 0) 20.14%, #09090b 85.71%), url(${
                img_url_original + e.backdrop_path
            });">
            <div class="slider__container">
                <img src="${img_url + e.poster_path}" alt="${e.title}" />
                <h5>${e.title}</h5>
                <p>${e.overview}</p>
                <div class="ganre-film-card">
                    <span>${e.release_date}</span>
                </div>
                <div class="rating-stars"></div>
                <div class="btns">
                    <button class="btn transparent-btn">Add Watchlist</button>
                </div>
            </div>
        </div>
    `;
    const ratingContainer = card.querySelector(".rating-stars");
    const stars = createStars(e.vote_average, 10);
    ratingContainer.append(stars);
    mainSection.prepend(card);
}

fetch(movieDetailsUrl)
    .then((res) => res.json())
    .then((e) => {
        displayGenres(e.genres);
        fetch(`${baseUrl}/movie/${productId}/videos?${api_key}`)
            .then((res) => res.json())
            .then((res) => displayVideos(res));
        fetch(`${baseUrl}/movie/${productId}/credits?${api_key}`)
            .then((res) => res.json())
            .then((res) => displayCredits(res));
    })
    .catch((err) => console.error(err));

function displayGenres(genres) {
    movieGenres.innerHTML = "";
    genres.forEach((e) => {
        const genreBtn = document.createElement("button");
        genreBtn.className = "genres-info";
        genreBtn.textContent = e.name;
        movieGenres.append(genreBtn);
    });
}

function displayVideos(videoData) {
    videoCont.innerHTML = "";
    videoData.results.slice(0, 1).forEach((video) => {
        videoCont.innerHTML += `
            <div class="video-box">
                <iframe width="100%" height="315" 
                    src="https://www.youtube.com/embed/${video.key}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
            </div>`;
    });
}

function displayCredits(credits) {
    const castList = document.querySelector(".cast-list");
    castList.innerHTML = "";
    credits.cast.forEach((e) => {
        castList.innerHTML += `
            <div class="artists">
                <div class="artist-img" style="background-image: url(${
                    e.profile_path
                        ? img_url + e.profile_path
                        : "https://via.placeholder.com/500x750?text=No+Image"
                })"></div>
                <div class="artists-info">${e.name}</div>
            </div>`;
    });
    directorList.innerHTML = "";
    credits.crew
        .filter((member) => member.job === "Director")
        .forEach((e) => {
            directorList.innerHTML += `
                <div class="artists">
                    <div class="artist-img" style="background-image: url(${
                        e.profile_path
                            ? img_url + e.profile_path
                            : "https://via.placeholder.com/500x750?text=No+Image"
                    })"></div>
                    <div class="artists-info">${e.name}</div>
                </div>`;
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
