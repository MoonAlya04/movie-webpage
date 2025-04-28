let api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
let img_url = "https://image.tmdb.org/t/p/w500";
let img_url_original = "https://image.tmdb.org/t/p/original";
let popular = "https://api.themoviedb.org/3/movie/popular?" + api_key;
let popularAnimation = `https://api.themoviedb.org/3/discover/movie?${api_key}&with_genres=16&sort_by=popularity.desc`;
let popularMovies = `https://api.themoviedb.org/3/discover/movie?${api_key}&with_genres=28&sort_by=popularity.desc`;
let printAllGenres = `https://api.themoviedb.org/3/genre/movie/list?${api_key}`;
let searchUrl = `https://api.themoviedb.org/3/search/multi?${api_key}`;
let popularItems = `https://api.themoviedb.org/3/trending/all/day?language=en-US&${api_key}`
let popularSeries = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1&${api_key}`


let sweiper = document.querySelector("swiper-container");
let movieCards = document.querySelector(".cards-for-movies");
let cartoonCards = document.querySelector(".cards-for-cartoons");
let genre = document.querySelector(".cards-for-genres");
let searchInp = document.querySelector("#searchInp");
let form = document.querySelector(".search");
let searchResult = document.querySelector(".cards-for-search");
let toggleBtns = document.querySelectorAll(".open");
let searchGenres = document.querySelector(".cards-for-genre-find");
let searchResultContainer = document.querySelector("#search-results");
let GenresResultContainer = document.querySelector("#find-genres-results");
let watchlistResult = document.querySelector("cards-for-watchlist");
let printSeries = document.querySelector(".cards-for-series");

let main = document.getElementById("main");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];


fetch(popularItems)
    .then(res => res.json())
    .then(res => printSliderMovies(res.results))
    .catch(err => console.error(err));

fetch(popularMovies)
    .then((response) => response.json())
    .then((res) => MovieCards(res.results))
    .catch((err) => console.error(err));

fetch(popularAnimation)
    .then((response) => response.json())
    .then((res) => {
        printCartoonCards(res.results);
    })
    .catch((err) => console.error(err));

fetch(printAllGenres)
    .then((res) => res.json())
    .then((res) => getGenres(res.genres))
    .catch((err) => console.error(err));

fetch(popularSeries)
    .then(res => res.json())
    .then(res => creatTv(res.results))
    .catch(err => console.error(err));


function printSliderMovies(arr) {
    arr.forEach((e) => {
        let card = document.createElement("swiper-slide");
        card.classList.add("slider");
        card.setAttribute("data-id", e.id);
        card.innerHTML = `
            <div class="slider__bg" style="background-image: linear-gradient(272deg, rgba(47, 47, 47, 0) 20.14%, #09090B 85.71%),url(${img_url_original + e.backdrop_path
            })">
            <div class="slider__container" >
                <h4 class="titles">MOST POPULAR IN THIS WEEK</h4>
                <img src="${img_url + e.poster_path}" alt="${e.title}" />
                <h5>${e.title || e.name}</h5>
                <p>${e.overview}</p>
                <div class="ganre-film-card">
                <span>${e.release_date || e.first_air_date}</span>
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
        card.addEventListener("click", () => {
            window.location.href = `single.html?type=${e.media_type}&id=${e.id}`;
        });
        let ratingContainer = card.querySelector(".rating-stars");
        let stars = createStars(e.vote_average, 10);
        ratingContainer.append(stars);
        sweiper.append(card);
    });
}

function createCards(title, image, id, release, rate, type) {
    let card = document.createElement("div");
    card.classList.add("movie-card");
    let isInwatchlist = watchlist.includes(id.toString());
    let heartClass = isInwatchlist ? "fa-solid" : "fa-regular";
    card.innerHTML = `
        <div class="image-info">
            <div class="icons">
                <i class="${heartClass} fa-heart" data-id="${id}" onclick="togglewatchlist(event, icon)"></i>
            </div>
            <img src="${img_url + image}" alt="${title}" />
        </div>
        <div class="movie-info">
            <h4>${title}</h4>
            <div class="rating-stars"></div>
            <span>${release}</span>
        </div>
    `;
    let ratingContainer = card.querySelector(".rating-stars");
    let stars = createStars(rate, 10);
    ratingContainer.append(stars);
    card.addEventListener("click", (event) => {
        if (event.target.classList.contains('fa-heart')) {
            return;
        }
        window.location.href = `single.html?type=${type}&id=${id}`;
    });
    return card;
}

function MovieCards(arr) {
    arr.forEach((e) => {
        let printCards = createCards(e.title, e.poster_path, e.id, e.release_date || e.first_air_date, e.vote_average, "movie")
        movieCards.append(printCards);
    });
}

function creatTv(arr) {
    arr.forEach((e) => {
        let printCards = createCards(e.title || e.name, e.poster_path, e.id, e.release_date || e.first_air_date, e.vote_average, "tv")
        printSeries.append(printCards);
    });
}


function printCartoonCards(arr) {
    arr.forEach((e) => {
        let printCards = createCards(e.title, e.poster_path, e.id, e.release_date || e.first_air_date, e.vote_average, "movie")
        cartoonCards.append(printCards);
    });
}

function getGenres(arr) {
    arr.forEach((e) => {
        let card = document.createElement("div");
        card.classList.add("genres");
        card.innerHTML = `
                <div onclick="getMoviesByGenre(${e.id}, this)" class="genres-info">${e.name}</div>
            `;
        genre.append(card);
    });
}


function getMoviesByGenre(genreId) {
    let url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&${api_key}`;
    fetch(url)
        .then((response) => response.json())
        .then((res) => {
            if (res.results.length > 0) {
                showSearchResults(res.results);
            } else {
                searchResult.innerHTML =
                    "<p>No movies found for this genre.</p>";
            }
        })
        .catch((err) => console.error(err));
}

function showSearchResults(results) {
    main.innerHTML = "";
    GenresResultContainer.style.display = "block";
    searchGenres.innerHTML = "";
    results.forEach((e) => {
        let printCards = createCards(e.title||e.name, e.poster_path, e.id, e.release_date || e.first_air_date, e.vote_average, e.mediaType)
        searchGenres.append(printCards);
    });
}

function toggleCards(btn) {
    let container = btn.closest("[class*='__container']");
    if (!container) return;
    let targetCards = container.querySelector("[class^='cards-for-']");
    if (!targetCards) return;
    let isExpanded = btn.getAttribute("data-expanded") === "true";
    targetCards.classList.toggle("collapsed");
    if (isExpanded) {
        btn.innerHTML = 'View More <i class="fa-solid fa-angle-down"></i>';
        btn.setAttribute("data-expanded", "false");
    } else {
        btn.innerHTML = 'View Less <i class="fa-solid fa-angle-up"></i>';
        btn.setAttribute("data-expanded", "true");
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let searchTerm = searchInp.value.trim();
    if (searchTerm) {
        let url = `${searchUrl}&query=${searchTerm}`;
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                if (res.results.length > 0) {
                    showSearchResults(res.results);
                } else {
                    card.innerHTML = "<p>No results found.</p>";
                }
            })
            .catch((err) => console.error(err));
    }
});

function createStars(rating, maxRating = 10) {
    let starsContainer = document.createElement("div");
    starsContainer.className = "stars";

    let ratingOutOf5 = (rating / maxRating) * 5;
    let fullStars = Math.floor(ratingOutOf5);
    let hasHalfStar = ratingOutOf5 - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        let star = document.createElement("span");
        star.className = "star full";
        star.innerHTML = "★";
        starsContainer.append(star);
    }

    if (hasHalfStar) {
        let halfStar = document.createElement("span");
        halfStar.className = "star half";
        halfStar.innerHTML = "★";
        starsContainer.append(halfStar);
    }
    for (let i = 0; i < 5 - (fullStars + (hasHalfStar ? 1 : 0)); i++) {
        let emptyStar = document.createElement("span");
        emptyStar.className = "star empty";
        emptyStar.innerHTML = "★";
        starsContainer.append(emptyStar);
    }
    return starsContainer;
}


document.addEventListener('click', function (event) {
    let heartIcon = event.target.closest('.fa-heart');
    if (heartIcon) {
        event.stopPropagation();
        togglewatchlist(heartIcon);
    }
});
function togglewatchlist(icon) {
    let movieId = icon.getAttribute('data-id');
    let index = watchlist.indexOf(movieId);
    if (index > -1) {
        watchlist.splice(index, 1);
        icon.classList.replace('fa-solid', 'fa-regular');
    } else {
        watchlist.push(movieId);
        icon.classList.replace('fa-regular', 'fa-solid');
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}
