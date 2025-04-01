let api_key = "api_key=450de2ccb3594f7792ac2434c91755ce";
let img_url_original = "https://image.tmdb.org/t/p/original";
let img_url = "https://image.tmdb.org/t/p/w500";

fetch("https://api.themoviedb.org/3/movie/popular?" + api_key)
    .then((response) => response.json())
    .then((response) => printProducts(response.results))
    .catch((err) => console.error(err));

function printProducts(products) {
    let container = document.querySelector(".__container");
    container.innerHTML = "";

    products.forEach((product) => {
        let div = document.createElement("div");
        div.classList.add("product");

        div.innerHTML = `
            <img src="${img_url_original + product.backdrop_path}" alt="${
            product.title}">
            <h2>${product.title}</h2>
            <p>${product.overview}</p>
            <p>Rating: ${product.vote_average}</p>
            <p>Release Date: ${product.release_date}</p>
        `;

        container.appendChild(div);
    });
}
