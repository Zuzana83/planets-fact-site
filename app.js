const mobileMenuTriggerBtn = document.getElementById("menuTrigger");
const PLANET_URL = "./data.json";
const pageNav = document.getElementById("pageNav");
const planetNamesList = document.querySelectorAll(".page-nav-link");
const planetImageEl = document.getElementById("planetImg");
const geologyImageEl = document.getElementById("geologyImg");
const planetNameEl = document.getElementById("planetName");
const planetDescEl = document.getElementById("planetDesc");
const planetLinkEl = document.querySelector(".source-link a");
const internalLinksWrapper = document.querySelector(".planet-internal-links-wrapper");
const internalLinksList = document.querySelectorAll(".internal-link-btn");
const planetFactElements = document.querySelectorAll(".fact-value");

if(mobileMenuTriggerBtn) {
    mobileMenuTriggerBtn.addEventListener("click", function() {
        const isExpanded = mobileMenuTriggerBtn.getAttribute("aria-expanded") === "true";
        mobileMenuTriggerBtn.setAttribute("aria-expanded", !isExpanded);
        pageNav.classList.toggle("open");
    });
}

const imageMap = {
    overview: "planet",
    structure: "internal",
    geology: "planet"
}

const colorMap = {
    Mercury: "var(--sky-400)",
    Venus: "var(--amber-400)",
    Earth: "var(--purple-600)",
    Mars: "var(--orange-600)",
    Jupiter: "var(--red-500)",
    Saturn: "var(--bronze-700)",
    Uranus: "var(--teal-400)",
    Neptune: "var(--blue-600)" 
}

let planets = [];
let currentPlanet = null;
let activeTab = "overview";

planetNamesList.forEach(planet => {
    let planetName = planet.dataset.name;
    planet.classList.add(planetName.toLowerCase());
    // Span inside
    if(planet.previousElementSibling) {
        planet.previousElementSibling.classList.add(planetName.toLowerCase());
    }
});

const fetchPlanets = async () => {
    try {
        const resp = await fetch(PLANET_URL);
        const data = await resp.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const displayPlanet = (planet) => {
    if(activeTab === "geology") {
        geologyImageEl.src = planet.images.geology;
        geologyImageEl.hidden = false;
    } else {
        geologyImageEl.hidden = true;
    }

    if(planet.name === "Saturn") {
        planetImageEl.classList.add("saturn-img");
    } else {
        planetImageEl.classList.remove("saturn-img");
    }

    planetImageEl.src = planet.images[imageMap[activeTab]];
    planetNameEl.textContent = planet.name;
    planetDescEl.textContent = planet[activeTab].content;
    planetLinkEl.href = planet[activeTab].source;

    for(const planetFact of planetFactElements) {
        let fact = planetFact.dataset.fact;
        planetFact.textContent = planet[fact];
    }

    if(internalLinksWrapper) {
        // Removing all classes with planet name
        Object.keys(colorMap).forEach(name => {
            internalLinksWrapper.classList.remove(name.toLowerCase());
        });
        // Adding current planet name as class
        internalLinksWrapper.classList.add(planet.name.toLowerCase());
    }
    
}

planetNamesList.forEach(planet => {
    planet.addEventListener("click", function(e) {
        activeTab = "overview";
        internalLinksList.forEach(link => link.classList.remove("active-link-btn"));
        internalLinksList[0].classList.add("active-link-btn");
        let planetName = e.currentTarget.dataset.name;
        
        currentPlanet = planets.find(planet => planet.name === planetName);
        if(currentPlanet === undefined) {
            planetNameEl.textContent = "Sorry, we could not find the planet."
            return;
        }
        displayPlanet(currentPlanet);
        pageNav.classList.remove("open");
    });
});

internalLinksList.forEach(link => {
    link.addEventListener("click", function(e) {
        let button = e.currentTarget;
        let linkName = button.dataset.link;
        activeTab = linkName;
       
        internalLinksList.forEach(link => link.classList.remove("active-link-btn"));
        button.classList.add("active-link-btn");
        displayPlanet(currentPlanet);
    });
});

const init = async () => {
    planets = await fetchPlanets();
    if(!planets?.length) {
        planetNameEl.textContent = "Problem with loading data."
        return;
    }
    currentPlanet = planets.find(planet => planet.name === "Venus");
    displayPlanet(currentPlanet);
}

init();