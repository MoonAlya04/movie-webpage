let api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
let img_url = "https://image.tmdb.org/t/p/w500";
let img_url_original = "https://image.tmdb.org/t/p/original";
let popular = "https://api.themoviedb.org/3/movie/popular?" + api_key;
let popularAnimation = `https://api.themoviedb.org/3/discover/movie?${api_key}&with_genres=16&sort_by=popularity.desc`;
let popularMovies = `https://api.themoviedb.org/3/discover/movie?${api_key}&with_genres=28&sort_by=popularity.desc`;
let printAllGenres = `https://api.themoviedb.org/3/genre/movie/list?${api_key}`;
let printTVGenres = `https://api.themoviedb.org/3/genre/tv/list?${api_key}`;
let searchUrl = `https://api.themoviedb.org/3/search/multi?${api_key}`;
let popularItems = `https://api.themoviedb.org/3/trending/all/day?language=en-US&${api_key}`
let popularSeries = `https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1&${api_key}`
let trendingTvSeries = `https://api.themoviedb.org/3/trending/tv/day?language=en-US&${api_key}`;
let popularArist = `https://api.themoviedb.org/3/trending/person/day?language=en-US&${api_key}`;



let sweiper = document.querySelector("swiper-container");
let movieCards = document.querySelector(".cards-for-movies");
let cartoonCards = document.querySelector(".cards-for-cartoons");
let tvGenre = document.querySelector(".cards-for-tv-genres");
let movieGenre = document.querySelector(".cards-for-movie-genres");
let searchInp = document.querySelector("#searchInp");
let form = document.querySelector(".search");
let searchResult = document.querySelector(".cards-for-search");
let toggleBtns = document.querySelectorAll(".open");
let searchGenres = document.querySelector(".cards-for-genre-find");
let searchResultContainer = document.querySelector("#search-results");
let GenresResultContainer = document.querySelector("#find-genres-results");
let watchlistResult = document.querySelector("cards-for-watchlist");
let printSeries = document.querySelector(".cards-for-series");
let printTrending = document.querySelector(".cards-for-trending");
let searchResultsContainer = document.querySelector(".search-results");
let printPopularArists = document.querySelector(".popular-artists");

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
    .then((res) => printCartoonCards(res.results))
    .catch((err) => console.error(err));

fetch(popularSeries)
    .then(res => res.json())
    .then(res => creatTv(res.results))
    .catch(err => console.error(err));

fetch(trendingTvSeries)
    .then(res => res.json())
    .then(res => printTrendingSeries(res.results))
    .catch(err => console.error(err));


Promise.all([
    fetch(printAllGenres).then(res => res.json()),
    fetch(printTVGenres).then(res => res.json())
])
    .then(([movieGenres, tvGenres]) => {
        getMovieGenres(movieGenres.genres);
        getTvGenres(tvGenres.genres);
    })
    .catch(err => console.error("Error fetching genres:", err));




const input = document.querySelector('#searchInp');

form.addEventListener('click', (e) => {
    if (!form.classList.contains('expanded')) {
        e.preventDefault();
        form.classList.add('expanded');
        input.focus();
    }
});


document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) {
        form.classList.remove('expanded');
    }
});



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
                <img src="${img_url + e.poster_path}" alt="${e.title || e.name}" />
                <h5>${e.title || e.name}</h5>
                <p>${e.overview}</p>
                <div class="ganre-film-card">
                <span>${e.release_date || e.first_air_date}</span>
                </div>
                <div class="rating-stars"></div>
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
    let isInwatchlist = watchlist.some(item => item.id == id && item.type == type);
    let heartClass = isInwatchlist ? "fa-solid" : "fa-regular";
    card.innerHTML = `
        <div class="image-info">
            <div class="icons">
                <i class="${heartClass} fa-heart" data-id="${id}" data-type="${type}" onclick="togglewatchlist(event)"></i>
            </div>
            <img src="${img_url + image}" alt="${title}" />
        </div>
        <div class="movie-info">
            <h4>${title}</h4>
            <div class="rating-stars"></div>
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
function printTrendingSeries(arr) {
    arr.forEach((e) => {
        let printCards = createCards(e.title || e.name, e.poster_path, e.id, e.release_date || e.first_air_date, e.vote_average, "tv")
        printTrending.append(printCards);
    });
}




form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = searchInp.value.trim();
    if (!searchTerm) {
        if (window.innerWidth <= 768) {
            form.classList.remove("expanded");
        }
        return;
    }

    const url = `${searchUrl}&query=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then((res) => res.json())
        .then((res) => {
            if (res.results.length > 0) {
                showSearchResults(res.results);
            } else {
                searchResultsContainer.innerHTML = "<p>No results found.</p>";
            }
        })
        .catch((err) => console.error("Search error:", err));
});


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

function togglewatchlist(event) {
    event.stopPropagation();
    const icon = event.target;
    const id = icon.getAttribute('data-id');
    const type = icon.getAttribute('data-type');
    const index = watchlist.findIndex(item => item.id == id && item.type == type);
    if (index > -1) {
        watchlist.splice(index, 1);
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    } else {
        watchlist.push({ id: id, type: type });
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    }

    localStorage.setItem('watchlist', JSON.stringify(watchlist));
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




function getGenres(arr, type) {
    const genreContainer = type === 'movie' ? movieGenre : tvGenre;
    genreContainer.innerHTML = arr.map(e => `
        <div class="genres">
            <div onclick="getByGenre(${e.id}, '${type}', this)" class="genres-info">
                ${e.name}
            </div>
        </div>
    `).join('');
}



function getByGenre(genreId, type, element, page = 1) {
    document.querySelectorAll('.genres-info').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');

    const url = `https://api.themoviedb.org/3/discover/${type}?with_genres=${genreId}&page=${page}&${api_key}`;

    fetch(url)
        .then(response => response.json())
        .then(res => {
            if (res.results?.length > 0) {
                showSearchResults(res.results, type);
                renderPagination(res.total_pages, page, (newPage) => getByGenre(genreId, type, null, newPage));
            } else {
                searchGenres.innerHTML = "<p>No results found for this genre.</p>";
                document.getElementById('pagination').innerHTML = '';
            }
        })
        .catch(err => console.error("Error fetching by genre:", err));
}


function renderPagination(totalPages, currentPage, onPageClick) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const maxPagesToShow = 5;
    const resultsContainer = document.querySelector('.genre-results__container');

    const createBtn = (label, page, disabled = false) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.disabled = disabled;
        btn.classList.toggle('active-page', page === currentPage);
        if (!disabled) {
            btn.onclick = () => {
                onPageClick(page);
                resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        }
        return btn;
    };
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    startPage = Math.max(1, endPage - maxPagesToShow + 1);

    if (currentPage > 1) paginationContainer.appendChild(createBtn('‹', currentPage - 1));

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createBtn(i, i));
    }

    if (currentPage < totalPages) paginationContainer.appendChild(createBtn('›', currentPage + 1));
}




function getMovieGenres(arr) {
    getGenres(arr, 'movie');
}

function getTvGenres(arr) {
    getGenres(arr, 'tv');
}

function showSearchResults(results, type) {
    main.innerHTML = "";
    GenresResultContainer.style.display = "block";
    searchGenres.innerHTML = "";
    results.forEach(e => {
        const mediaType = e.media_type || type;
        searchGenres.append(createCards(
            e.title || e.name,
            e.poster_path,
            e.id,
            e.release_date || e.first_air_date,
            e.vote_average,
            mediaType
        ));
    });
}

