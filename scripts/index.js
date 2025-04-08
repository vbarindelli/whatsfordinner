const year = document.querySelector("#currentyear");
const today = new Date();
const day = today.getDay();
const msToDays = 86400000;
const murl = 'https://vbarindelli.github.io/wdd230/chamber/data/members.json';
const cards = document.querySelector('.cards');
const gridbutton = document.querySelector("#grid");
const listbutton = document.querySelector("#list");
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const forecast1 = document.querySelector('#forecast1');
const forecast2 = document.querySelector('#forecast2');
const forecast3 = document.querySelector('#forecast3');

const premium_cards = document.querySelector('.featured');
// const featured1 = document.querySelector('#featured1');
// const featured2 = document.querySelector('#featured2');
// const featured3 = document.querySelector('#featured3');


const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;

const url = "https://api.openweathermap.org/data/2.5/weather?lat=36.71&lon=4.48&appid=f5802e6878f8d1e3b7f6bf77fba44d13";
const forecastUrl = "https://api.openweathermap.org/data/3.0/onecall?lat=36.71&lon=4.42&exclude=minutely,hourly,alerts&appid=f5802e6878f8d1e3b7f6bf77fba44d13";

const lastModified = document.querySelector("#lastModified");
let modified = new Date(document.lastModified);
lastModified.innerHTML = `Last Modification: ${modified}</span>`;

const mainnav = document.querySelector('.navigation');
const hamburger = document.querySelector('#menu');

hamburger.addEventListener('click', () => {
    mainnav.classList.toggle('show');
    hamburger.classList.toggle('show');
})

let welcomeMsg = "Welcome! Let us know if you have any questions.";
lastVisitObj = window.localStorage.getItem("lastVisitDate");


if (lastVisitObj) {
    let lastVisitDate = new Date(Number(lastVisitObj));
    let todayDate = Date.now();
    let daysDiff = (todayDate - lastVisitDate) / msToDays;
    if (daysDiff < 1) {
        welcomeMsg = "Back so soon! Awesome!";
    }
    else {
        welcomeMsg = `You last visited ${daysDiff.toFixed(0)} days ago.`;
    }
}

const welcomeMsgElement = document.querySelector("#lastVisit");
if (welcomeMsgElement) {
    welcomeMsgElement.innerHTML = welcomeMsg;
}


localStorage.setItem("lastVisitDate", Date.now());

// let tmps = document.querySelector("#timeS");
// tmps.value = today;



getMemberData(murl);


const displayMembers = (members) => {
    members.forEach((member) => {
        let card = document.createElement('section');
        let name = document.createElement('h3');
        let memberImg = document.createElement('img');
        let address = document.createElement('p');
        let phone = document.createElement('p');
        let memberUrl = document.createElement('a');

        card.setAttribute('class', 'memberSection');
        memberImg.setAttribute('src', member.image);
        memberImg.setAttribute('alt', `corporate image of ${member.name}`);
        memberImg.setAttribute('loading', 'lazy');
        memberImg.setAttribute('width', '340');
        memberImg.setAttribute('height', '440');
        memberImg.setAttribute('class', 'memberImg');

        memberUrl.setAttribute('id', 'cardUrl');

        name.textContent = `${member.name}`
        address.textContent = `${member.address}`;
        phone.textContent = `${member.phone}`;
        memberUrl.setAttribute('href', member.url);
        memberUrl.innerText = `${member.url}`;

        card.appendChild(memberImg);
        card.appendChild(name);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(memberUrl);
        if (cards) {
            cards.appendChild(card);
        }
        if (premium_cards) {
            premium_cards.appendChild(card);
        }
    })

}

function get_random(list) {
    return list[Math.floor((Math.random() * list.length))];
}


async function getMemberData(murl) {
    const response = await fetch(murl);
    const data = await response.json();

    if (cards) {
        displayMembers(data.members);
    }
    if (premium_cards) {
        var filtered_members = data.members.filter(function (member) {
            return member.level == "Gold" ||
                member.level == "Silver";
        });
        var randomized_members = [];
        for (let i = 1; i < 4; i++) {
            var item = get_random(filtered_members);
            const index = filtered_members.indexOf(item);
            if (index > -1) {
                filtered_members.splice(index, 1);
            }
            randomized_members.push(item);
        }
        displayMembers(randomized_members);
    }
}

if (gridbutton) {
    gridbutton.addEventListener("click", () => {
        // example using arrow function
        cards.classList.add("grid");
        cards.classList.remove("list");
    })
};

if (listbutton) {
    listbutton.addEventListener("click", showList); // example using defined function

    function showList() {
        cards.classList.add("list");
        cards.classList.remove("grid");
    }
}


if (day == 0 || day == 4 || day == 5 || day == 6) {
    document.querySelector(".banner").setAttribute('id', 'hide');
}

if (document.querySelector(".bannerClose")) {
    document.querySelector(".bannerClose").addEventListener("click", function () {
        this.closest(".banner").setAttribute('id', 'hide');
    })
}

async function apiFetch() {
    try {
        const response = await fetch(forecastUrl);
        if (response.ok) {
            const data = await response.json();
            displayResults(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

apiFetch();


function displayResults(data) {
    currentTemp.innerHTML = `${data.current.temp}&deg;F`;
    const iconsrc = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
    let desc = data.current.weather[0].description;
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', desc);
    captionDesc.textContent = `${desc}`;
    forecast1.innerHTML = `${data.daily[1].temp.day}&deg;F`;
    forecast2.innerHTML = `${data.daily[2].temp.day}&deg;F`;
    forecast3.innerHTML = `${data.daily[3].temp.day}&deg;F`;
}




