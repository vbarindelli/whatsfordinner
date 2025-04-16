
//header navigation

const mainnav = document.querySelector('.navigation');
const hamburger = document.querySelector('#menu');

hamburger.addEventListener('click', () => {
    mainnav.classList.toggle('show');
    hamburger.classList.toggle('show');
})

//banner

if (document.querySelector(".bannerClose")) {
    document.querySelector(".bannerClose").addEventListener("click", function () {
        this.closest(".banner").setAttribute('id', 'hide');
    })
}

window.addEventListener("DOMContentLoaded", () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

    if (favorites.length === 0) {
        document.querySelector(".featured").innerHTML = "<p>No favorites added yet!</p>";
        return;
    }

    // Pick a random favorite
    const randomRecipe = favorites[Math.floor(Math.random() * favorites.length)];

    // Create spotlight card
    const spotlightCard = document.createElement("section");
    spotlightCard.classList.add("spotlight");

    spotlightCard.innerHTML = `
        <h3>${randomRecipe.name}</h3>
        <img src="${randomRecipe.img}" alt="${randomRecipe.name}" width="200" />
        <p><strong>Category:</strong> ${randomRecipe.category}</p>
        <p><strong>Planned for:</strong> ${randomRecipe.dayId}</p>
    `;

    // Append to the spotlight container
    document.querySelector(".featured").appendChild(spotlightCard);
});















