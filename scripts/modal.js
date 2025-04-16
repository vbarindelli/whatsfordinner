// modal.js
export function showModal(recipe) {
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
