let api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
let img_url = "https://image.tmdb.org/t/p/w500";
let img_url_original = "https://image.tmdb.org/t/p/original";
let sweiper = document.querySelector("swiper-container");

fetch("https://api.themoviedb.org/3/movie/popular?" + api_key)
    .then((response) => response.json())
    .then((data) => printCards(data.results))
    .catch((err) => console.error(err));

function printCards(arr) {
    arr.forEach((e) => {
        let card = document.createElement("swiper-slide");
        card.classList.add("slider");
        card.innerHTML = `
            <div class="slider__bg" style="background-image: linear-gradient(272deg, rgba(47, 47, 47, 0) 20.14%, #09090B 85.71%),url(${
                img_url_original + e.backdrop_path
            })">
            <div class="slider__container" >
                <h4>MOST POPULAR IN THIS WEEK</h4>
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

// Աստղիկների գեներացման ֆունկցիա
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
