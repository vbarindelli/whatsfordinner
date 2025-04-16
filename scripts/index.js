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
    modal.innerHTML = ''; // clear previous content

    const modalContent = document.createElement('div');
    modalContent.setAttribute('id', 'modalContent');

    let closeButton = document.createElement('button');
    let name = document.createElement('h2');
    let category = document.createElement('p');
    let area = document.createElement('p');
    let instructions = document.createElement('p');
    let ingredients = document.createElement('p');
    let video = document.createElement('a');

    let ingredientsList = '<ul>';
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredientsList += `<li>${measure ? measure : ''} ${ingredient}</li>`;
        }
    }
    ingredientsList += '</ul>';
    ingredients.innerHTML = ingredientsList;

    name.textContent = recipe.strMeal;
    category.textContent = `Category: ${recipe.strCategory}`;
    area.textContent = `Area: ${recipe.strArea}`;
    instructions.textContent = recipe.strInstructions;
    video.textContent = "Watch Video";
    video.setAttribute('href', recipe.strYoutube);
    video.setAttribute('target', '_blank');

    closeButton.textContent = 'X';
    closeButton.classList.add('closeButton');

    closeButton.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(name);
    modalContent.appendChild(category);
    modalContent.appendChild(area);
    modalContent.appendChild(ingredients);
    modalContent.appendChild(instructions);
    modalContent.appendChild(video);

    modal.appendChild(modalContent);
    modal.classList.add('show');

}



window.addEventListener('click', (e) => {
    const modal = document.querySelector('#recipeModal');
    if (e.target === modal) {
        modal.classList.remove('show');
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
        // if (!selectedDay) {
        //     alert("Please select a day on the calendar first.");
        //     return;
        // }

        const recipeCard = e.target.closest('.recipeSection');
        const recipeData = {
            name: recipeCard.querySelector('h3').textContent,
            category: recipeCard.querySelector('p').textContent,
            img: recipeCard.querySelector('img').src,
            dayId: selectedDay.id // e.g. "day-monday"
        };

        let savedRecipes = JSON.parse(localStorage.getItem('selectedRecipes')) || [];
        savedRecipes.push(recipeData);
        localStorage.setItem('selectedRecipes', JSON.stringify(savedRecipes));

        alert(`${recipeData.name} added to ${selectedDay.id.replace('day-', '')}!`);
    }
});


window.addEventListener('DOMContentLoaded', () => {
    const savedRecipes = JSON.parse(localStorage.getItem('selectedRecipes')) || [];

    savedRecipes.forEach(recipe => {
        const card = document.createElement('section');
        card.classList.add('recipeSection');

        const name = document.createElement('h3');
        const category = document.createElement('p');
        const img = document.createElement('img');
        const removeButton = document.createElement('button');

        name.textContent = recipe.name;
        category.textContent = recipe.category;
        img.src = recipe.img;
        img.width = 200;

        removeButton.textContent = 'X';
        removeButton.classList.add('removeButton');

        card.appendChild(name);
        card.appendChild(img);
        card.appendChild(category);
        card.appendChild(removeButton);

        // Find the correct day in the calendar using the dayId
        const dayContainer = document.getElementById(recipe.dayId);
        if (dayContainer) {
            dayContainer.appendChild(card);
        } else {
            console.warn(`Day container "${recipe.dayId}" not found.`);
        }

        // Remove recipe from UI + localStorage
        removeButton.addEventListener('click', () => {
            card.remove();
            const updatedRecipes = savedRecipes.filter(r => {
                return !(r.name === recipe.name && r.dayId === recipe.dayId);
            });
            localStorage.setItem('selectedRecipes', JSON.stringify(updatedRecipes));
        });
    });
});

function clearDay(dayId) {
    const savedRecipes = JSON.parse(localStorage.getItem('selectedRecipes')) || [];
    const updatedRecipes = savedRecipes.filter(recipe => recipe.dayId !== dayId);
    localStorage.setItem('selectedRecipes', JSON.stringify(updatedRecipes));
    location.reload(); // or remove from DOM manually
}

document.querySelector('#clearMeals').addEventListener('click', () => {
    localStorage.removeItem('selectedRecipes');
    location.reload(); // or manually remove cards from DOM
});