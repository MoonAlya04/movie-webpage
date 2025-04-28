document.addEventListener('DOMContentLoaded', function () {
    let api_key = "450de2ccb3594f7792ac2434c91755ce";
    const container = document.querySelector(".cards-for-watchlist"); 
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const img_url = "https://image.tmdb.org/t/p/w500"; 

    if (watchlist.length === 0) {
        container.innerHTML = "<p>Your watchlist is empty</p>";
        return;
    }

    function createCards(title, image, id, release, rate) {
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
            window.location.href = `single.html?id=${id}`;
        });
    
        return card;
    }
    
    watchlist.forEach(movieId => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`)
            .then(response => response.json())
            .then(movie => {
                const card = createCards(
                    movie.title,
                    movie.poster_path,
                    movie.id,
                    movie.release_date,
                    movie.vote_average
                );
                container.append(card);
            })
            .catch(error => console.error("Error fetching movie:", error));
    });
});
