let api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
let img_url = "https://image.tmdb.org/t/p/w500";
let img_url_original = "https://image.tmdb.org/t/p/original";
let sweiper = document.querySelector("swiper-container");
let animationURL = `https://api.themoviedb.org/3/discover/movie?${api_key}&with_genres=16&sort_by=popularity.desc`;
let movieCards = document.querySelector(".cards-for-movies");
let cartoonCards = document.querySelector(".cards-for-cartoons");
let genre = document.querySelector(".cards-for-genres");
let searchInp = document.querySelector("#searchInp");
let form = document.querySelector(".search");
let popupBody = document.querySelector(".card-popups");
let main = document.getElementById("#main");
let baseUrl = "https://api.themoviedb.org/3/";
let searchUrl = baseUrl + "search/movie?" + api_key;

fetch("https://api.themoviedb.org/3/movie/popular?" + api_key)
    .then((response) => response.json())
    .then((res) => printSliderMovies(res.results))
    .catch((err) => console.error(err));

function printSliderMovies(arr) {
    arr.forEach((e) => {
        let card = document.createElement("swiper-slide");
        card.classList.add("slider");
        card.innerHTML = `
            <div class="slider__bg" style="background-image: linear-gradient(272deg, rgba(47, 47, 47, 0) 20.14%, #09090B 85.71%),url(${
                img_url_original + e.backdrop_path
            })">
            <div class="slider__container" >
                <h4 class="titles">MOST POPULAR IN THIS WEEK</h4>
                <img src="${img_url + e.poster_path}" alt="${e.title}" />
                <h5>${e.title}</h5>
                <p>${e.overview}</p>
                <div class="ganre-film-card">
                    <span>${e.release_date}</span>
                </div>
                <div class="rating-stars"></div>
                <div class="btns">
                    <button class="red-btn btn">Watch Trailer</button>
                    <button class="btn transparent-btn">Add Watchlist</button>
                </div>
                </div>
            </div>
            </div>
        `;
        let ratingContainer = card.querySelector(".rating-stars");
        let stars = createStars(e.vote_average, 10);
        ratingContainer.append(stars);
        sweiper.append(card);
    });
}

fetch("https://api.themoviedb.org/3/movie/popular?" + api_key)
    .then((response) => response.json())
    .then((res) => MovieCards(res.results.slice(0, 6)))
    .catch((err) => console.error(err));

function MovieCards(arr) {
    arr.forEach((e) => {
        let card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
                            <div class="image-info">
                                <div class="icons">
                                    <i class="fa-regular fa-thumbs-up"></i>
                                    <i class="fa-regular fa-eye"></i>
                                    <i class="fa-solid fa-indent"></i>
                                </div>
                                <img
                                    src="${img_url + e.poster_path}"
                                    alt=""
                                />
                            </div>
                            <div class="movie-info">
                                <h4>${e.title}</h4>
                                <div class="rating-stars"></div>
                                <span>${e.release_date}</span>
                            </div>
            `;
        let ratingContainer = card.querySelector(".rating-stars");
        let stars = createStars(e.vote_average, 10);
        ratingContainer.append(stars);
        movieCards.append(card);
    });
}

fetch(animationURL)
    .then((response) => response.json())
    .then((res) => {
        printCartoonCards(res.results.slice(0, 6));
    })
    .catch((err) => console.error(err));

function printCartoonCards(arr) {
    arr.forEach((e) => {
        let card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
                                <div class="image-info">
                                    <div class="icons">
                                        <i class="fa-regular fa-thumbs-up"></i>
                                        <i class="fa-regular fa-eye"></i>
                                        <i class="fa-solid fa-indent"></i>
                                    </div>
                                    <img
                                        src="${img_url + e.poster_path}"
                                        alt=""
                                    />
                                </div>
                                <div class="movie-info">
                                    <h4>${e.title}</h4>
                                    <div class="rating-stars"></div>
                                    <span>${e.release_date}</span>
                                </div>
                `;
        let ratingContainer = card.querySelector(".rating-stars");
        let stars = createStars(e.vote_average, 10);
        ratingContainer.append(stars);
        cartoonCards.append(card);
    });
}

let timerId;
searchInp.addEventListener("input", (e) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        fetch(`https://api.themoviedb.org/3/search/movie?${api_key}=&query
            =${searchInp.value}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.results.length === 0) {
                    main.innerHTML = `There isn't from that products`;
                } else {
                    MovieCards(res.results);
                }
            });
    }, 1000);
});

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
        starsContainer.appendChild(star);
    }

    if (hasHalfStar) {
        const halfStar = document.createElement("span");
        halfStar.className = "star half";
        halfStar.innerHTML = "★";
        starsContainer.appendChild(halfStar);
    }

    for (let i = 0; i < 5 - (fullStars + (hasHalfStar ? 1 : 0)); i++) {
        const emptyStar = document.createElement("span");
        emptyStar.className = "star empty";
        emptyStar.innerHTML = "★";
        starsContainer.appendChild(emptyStar);
    }

    return starsContainer;
}

fetch("https://api.themoviedb.org/3/genre/movie/list?" + api_key)
    .then((response) => response.json())
    .then((res) => getGanres(res.genres.slice(0, 8)))
    .catch((err) => console.error(err));

function getGanres(arr) {
    arr.forEach((e) => {
        let card = document.createElement("div");
        card.classList.add("genres");
        card.innerHTML = `
                <div class="genres-img"></div>
                <div class="genres-info">${e.name}</div>
                    `;
        genre.append(card);
    });
}
