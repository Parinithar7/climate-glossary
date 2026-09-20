const API_URL = "https://script.google.com/macros/s/AKfycbzxn8GtpVtPkJ3ekFU-hX8ZiJYyzlFCdodnJiMIxRUcnKCveiY6nnSR6SE4SAsOswGLwg/exec";
let terms = [];

let currentCategory = "all";


// =====================================================
// LOAD TERMS
// =====================================================

async function loadTerms() {

    console.log("Loading terms...");

    try {

        const response = await fetch(API_URL);

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error("Google Sheets connection failed");
        }

        const data = await response.json();

        console.log("Data received:", data);

        terms = data;

        displayTerms(terms);

    } catch (error) {

        console.error("ERROR:", error);

        const container =
            document.getElementById("termsContainer");

        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load climate terms.</p>
                <small>Check your Google Sheets connection.</small>
            </div>
        `;
    }
}


// =====================================================
// DISPLAY TERMS
// =====================================================

function displayTerms(data) {

    const container =
        document.getElementById("termsContainer");

    if (!container) {

        console.error("termsContainer NOT FOUND");

        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="no-results">
                No climate terms found.
            </div>
        `;

        return;
    }


    data.forEach(function(term) {

        const card =
            document.createElement("div");

        card.className = "term-card";


        const termName =
            term.Term || "";

        const definition =
            term.Definition || "";

        const category =
            term.Category || "";

        const example =
            term.Example || "";


        card.dataset.term =
            termName.toLowerCase();

        card.dataset.category =
            category.toLowerCase();


        card.innerHTML = `

            <h2>
                ${termName}
            </h2>

            <p>
                ${definition}
            </p>

            <p>
                <strong>Category:</strong>
                ${category}
            </p>

            <p>
                <strong>Example:</strong>
                ${example}
            </p>

        `;


        container.appendChild(card);

    });


    applyFilters();

    console.log(
        "Cards created:",
        container.querySelectorAll(".term-card").length
    );
}


// =====================================================
// SEARCH
// =====================================================

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");


    if (!searchInput) {

        console.error("Search input not found");

        return;
    }


    searchInput.addEventListener(
        "input",
        function() {

            applyFilters();

        }
    );
}


// =====================================================
// APPLY SEARCH + CATEGORY FILTER
// =====================================================

function applyFilters() {

    const searchInput =
        document.getElementById("searchInput");


    const searchValue =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const cards =
        document.querySelectorAll(".term-card");


    cards.forEach(function(card) {

        const cardText =
            card.innerText.toLowerCase();


        const cardCategory =
            card.dataset.category || "";


        const matchesSearch =
            cardText.includes(searchValue);


        const matchesCategory =
            currentCategory === "all" ||
            cardCategory ===
            currentCategory.toLowerCase();


        if (
            matchesSearch &&
            matchesCategory
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });
}


// =====================================================
// CATEGORY FILTER
// =====================================================

function filterTerms(category) {

    currentCategory =
        category || "all";


    const searchInput =
        document.getElementById("searchInput");


    if (searchInput) {

        searchInput.value = "";

    }


    applyFilters();
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log("Climate Quest loaded");

        setupSearch();

        loadTerms();

    }
);
