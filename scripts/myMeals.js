
window.addEventListener('DOMContentLoaded', () => {
    const savedRecipes = JSON.parse(localStorage.getItem('selectedRecipes')) || [];

    const ingredientsMap = {};

    savedRecipes.forEach(recipe => {
        // Insert recipe into the correct day
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

        const dayContainer = document.getElementById(recipe.dayId);
        if (dayContainer) {
            dayContainer.appendChild(card);
        }

        removeButton.addEventListener('click', () => {
            card.remove();
            const updatedRecipes = savedRecipes.filter(r => !(r.name === recipe.name && r.dayId === recipe.dayId));
            localStorage.setItem('selectedRecipes', JSON.stringify(updatedRecipes));
            location.reload(); // Refresh ingredients list too
        });

        // Fetch full data from TheMealDB for ingredients (based on recipe name)
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(recipe.name)}`)
            .then(res => res.json())
            .then(data => {
                const meal = data.meals && data.meals[0];
                if (!meal) return;

                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient && ingredient.trim() !== "") {
                        const key = ingredient.trim().toLowerCase();
                        const parsed = parseMeasure(measure);
                        if (!ingredientsMap[key]) {
                            ingredientsMap[key] = {};
                        }
                        if (parsed.unit in ingredientsMap[key]) {
                            ingredientsMap[key][parsed.unit] += parsed.amount;
                        } else {
                            ingredientsMap[key][parsed.unit] = parsed.amount;
                        }
                    }
                }

                displayIngredientsList(ingredientsMap);
            });
    });
});


function displayIngredientsList(ingredientsMap) {
    const listSection = document.querySelector(".ingredientsList .card");
    listSection.innerHTML = "<h2>List of Ingredients</h2>";

    const ul = document.createElement("ul");

    for (const ingredient in ingredientsMap) {
        const units = ingredientsMap[ingredient];
        for (const unit in units) {
            const amount = units[unit];
            const li = document.createElement("li");
            li.textContent = `${roundAmount(amount)} ${unit} ${ingredient}`;
            ul.appendChild(li);
        }
    }

    listSection.appendChild(ul);
}

function roundAmount(n) {
    return Math.round(n * 100) / 100;
}


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


//ingredients list 
function parseMeasure(measure) {
    const result = {
        amount: 0,
        unit: ''
    };

    if (!measure) return result;

    const parts = measure.trim().split(" ");
    let amount = 0;

    // Handle fraction + whole number, e.g., "1 1/2"
    if (parts.length >= 2 && isFraction(parts[1])) {
        amount = parseFloat(parts[0]) + fractionToDecimal(parts[1]);
        result.unit = parts.slice(2).join(" ") || parts[1];
    } else if (isFraction(parts[0])) {
        amount = fractionToDecimal(parts[0]);
        result.unit = parts.slice(1).join(" ");
    } else if (!isNaN(parts[0])) {
        amount = parseFloat(parts[0]);
        result.unit = parts.slice(1).join(" ");
    } else {
        result.unit = measure;
        amount = 1;
    }

    result.amount = amount;
    result.unit = result.unit.trim().toLowerCase();
    return result;
}

function isFraction(str) {
    return /^\d+\/\d+$/.test(str);
}

function fractionToDecimal(str) {
    const [numerator, denominator] = str.split("/").map(Number);
    return numerator / denominator;
}


document.addEventListener("DOMContentLoaded", () => {
    const storedWeek = JSON.parse(localStorage.getItem("currentWeek"));
    const today = new Date();

    let startOfWeek;

    if (storedWeek && new Date(storedWeek.monday) >= getStartOfWeek(today)) {
        startOfWeek = new Date(storedWeek.monday);
    } else {
        startOfWeek = getStartOfWeek(today);
        const weekData = {};

        // Generate and store date for each day
        ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach((day, index) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + index);
            weekData[day] = date.toISOString();
        });

        localStorage.setItem("currentWeek", JSON.stringify(weekData));
    }

    labelCalendarDays();
});

function getStartOfWeek(date) {
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(date.setDate(diff));
}

function labelCalendarDays() {
    const weekData = JSON.parse(localStorage.getItem("currentWeek"));

    for (const [day, isoDate] of Object.entries(weekData)) {
        const container = document.querySelector(`#day-${day}`);
        if (container) {
            const label = container.querySelector(".date-label");
            const date = new Date(isoDate);
            label.textContent = `(${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
        }
    }
}
