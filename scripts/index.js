const year = document.querySelector("#currentyear");
const today = new Date();
const day = today.getDay();
const msToDays = 86400000;

const cards = document.querySelector('.cards');
const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");

const url = "https://www.themealdb.com/api/json/v1/1/search.php?f=b";


const options = {
    method: 'GET',
    headers: {

    }
};

async function apiFetch(url) {
    try {
        const response = await fetch(url, options);
        console.log(response);
        const result = await response.json();
        console.log(result);
        displayResults(result);
        return result;
    } catch (error) {
        console.error(error);
    }
};

apiFetch(url);

function displayResults(data) {
    let recipes = '';
    (data.meals || []).forEach(recipe => {
        let card = document.createElement('section');
        let name = document.createElement('h3');
        let description = document.createElement('p');
        let recipeImg = document.createElement('img');
        let recipeButton = document.createElement('button');
        let addToCalendarButton = document.createElement('button');
        addToCalendarButton.textContent = 'Add to Calendar';
        addToCalendarButton.classList.add('addToCalendarButton');

        card.appendChild(addToCalendarButton);


        card.setAttribute('class', 'recipeSection');
        name.textContent = `${recipe.strMeal}`;
        description.textContent = `${recipe.strCategory}`;
        recipeButton.textContent = 'view full recipe';
        recipeButton.classList.add('recipeButton');

        recipeImg.setAttribute('src', recipe.strMealThumb);
        recipeImg.setAttribute('alt', 'thumbnail_alt_text');
        recipeImg.setAttribute('loading', 'lazy');
        recipeImg.setAttribute('width', '340');
        recipeImg.setAttribute('height', '440');
        recipeImg.setAttribute('class', 'memberImg');


        card.appendChild(name);
        card.appendChild(recipeImg);
        card.appendChild(description);
        card.appendChild(recipeButton);



        if (cards) {
            cards.appendChild(card);
        }


        recipeButton.addEventListener('click', () => {
            showModal(recipe);
        });
    });

};

function showModal(recipe) {
    const modal = document.querySelector('#recipeModal');
    const modalContent = document.querySelector('#modalContent');

    let ingredientsList = '<ul>';
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredientsList += `<li>${measure ? measure : ''} ${ingredient}</li>`;
        }
    }
    ingredientsList += '</ul>';

    modalContent.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
        <p><strong>Area:</strong> ${recipe.strArea}</p>
        <p><strong>Ingredients:</strong></p>
        ${ingredientsList}
        <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
        <a href="${recipe.strYoutube}" target="_blank">Watch on YouTube</a>
    `;
    modal.style.display = 'block';
}


window.addEventListener('click', (e) => {
    const modal = document.querySelector('#recipeModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});



const mainnav = document.querySelector('.navigation');
const hamburger = document.querySelector('#menu');

hamburger.addEventListener('click', () => {
    mainnav.classList.toggle('show');
    hamburger.classList.toggle('show');
})



if (document.querySelector(".bannerClose")) {
    document.querySelector(".bannerClose").addEventListener("click", function () {
        this.closest(".banner").setAttribute('id', 'hide');
    })
}




if (gridbutton) {
    gridbutton.addEventListener("click", () => {

        cards.classList.add("grid");
        cards.classList.remove("list");
    })
};

if (listbutton) {
    listbutton.addEventListener("click", showList);

    function showList() {
        cards.classList.add("list");
        cards.classList.remove("grid");
    }
}



let selectedDay = null;

// Highlight selected day
document.querySelectorAll('.day').forEach(day => {
    day.addEventListener('click', () => {
        document.querySelectorAll('.day').forEach(d => d.classList.remove('selected-day'));
        day.classList.add('selected-day');
        selectedDay = day;
    });
});

// Add recipe to selected day
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('addToCalendarButton')) {
        if (!selectedDay) {
            alert("Please select a day on the calendar first.");
            return;
        }

        const recipeCard = e.target.closest('.recipeSection').cloneNode(true);

        // Remove unnecessary buttons
        recipeCard.querySelector('.recipeButton')?.remove();
        recipeCard.querySelector('.addToCalendarButton')?.remove();

        selectedDay.appendChild(recipeCard);
    }
});

