const API_URL = "https://script.google.com/macros/s/AKfycbzxn8GtpVtPkJ3ekFU-hX8ZiJYyzlFCdodnJiMIxRUcnKCveiY6nnSR6SE4SAsOswGLwg/exec";

let terms = [];


// ===============================
// LOAD TERMS
// ===============================

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
            <p style="color:red;">
                Error loading terms. Check browser console.
            </p>
        `;
    }
}


// ===============================
// DISPLAY TERMS
// ===============================

function displayTerms(data) {

    const container =
        document.getElementById("termsContainer");

    console.log("Container:", container);

    if (!container) {

        console.error("termsContainer NOT FOUND");

        return;
    }

    container.innerHTML = "";

    data.forEach(function(term) {

        const card = document.createElement("div");

        card.className = "term-card";

        card.dataset.term = term.Term || "";
        card.dataset.category = term.Category || "";

        card.innerHTML = `
            <h2>${term.Term || ""}</h2>

            <p>${term.Definition || ""}</p>

            <p>
                <strong>Category:</strong>
                ${term.Category || ""}
            </p>

            <p>
                <strong>Example:</strong>
                ${term.Example || ""}
            </p>
        `;

        container.appendChild(card);

    });

    console.log(
        "Cards created:",
        container.querySelectorAll(".term-card").length
    );
}


// ===============================
// SEARCH
// ===============================

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        console.error("Search input not found");
        return;
    }

    searchInput.addEventListener("input", function() {

        const searchValue =
            this.value.toLowerCase().trim();

        const cards =
            document.querySelectorAll(".term-card");

        cards.forEach(function(card) {

            const text =
                card.innerText.toLowerCase();

            if (text.includes(searchValue)) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });
}


// ===============================
// CATEGORY FILTER
// ===============================

function filterTerms(category) {

    const cards =
        document.querySelectorAll(".term-card");

    cards.forEach(function(card) {

        const cardCategory =
            card.dataset.category;

        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {
        searchInput.value = "";
    }
}


// ===============================
// START
// ===============================

document.addEventListener("DOMContentLoaded", function() {

    console.log("Website loaded");

    setupSearch();

    loadTerms();

});