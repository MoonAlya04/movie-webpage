document.addEventListener('DOMContentLoaded', function () {
    let api_key = "450de2ccb3594f7792ac2434c91755ce";
    const container = document.querySelector(".cards-for-watchlist");
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const img_url = "https://image.tmdb.org/t/p/w500";

    if (watchlist.length === 0) {
        container.innerHTML = "<p>Your watchlist is empty</p>";
        return;
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
            toggleWatchlist(heartIcon);
        }
    });

    function toggleWatchlist(icon) {
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

    function createCards(title, image, id, release, rate, type) {
        let card = document.createElement("div");
        card.classList.add("movie-card");
        let isInWatchlist = watchlist.some(w => w.id == id && w.type == type);
        let heartClass = isInWatchlist ? "fa-solid" : "fa-regular";

        card.innerHTML = `
            <div class="image-info">
                <div class="icons">
                    <i class="${heartClass} fa-heart" data-id="${id}" data-type="${type}"></i>
                </div>
                <img src="${image ? img_url + image : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${title}" />
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

    watchlist.forEach(item => {
        fetch(`https://api.themoviedb.org/3/${item.type}/${item.id}?api_key=${api_key}`)
            .then(response => response.json())
            .then(movie => {
                const card = createCards(
                    movie.title || movie.name,
                    movie.poster_path,
                    movie.id,
                    movie.release_date || movie.first_air_date || "Unknown",
                    movie.vote_average,
                    item.type
                );
                container.append(card);
            })
            .catch(error => console.error("Error fetching movie:", error));
    });
});

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