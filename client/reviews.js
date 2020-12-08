window.addEventListener("load", function() {   
    //Creating the table
    const table = document.querySelector("table");
    const thead = table.createTHead();
    const header = thead.insertRow();
    
    const titleHead = document.createElement("th");
    const titleHeadText = document.createTextNode("Movie Title");
    titleHead.appendChild(titleHeadText);
    header.appendChild(titleHead);

    const yearHead = document.createElement("th");
    const yearHeadText = document.createTextNode("Year");
    yearHead.appendChild(yearHeadText);
    header.appendChild(yearHead);

    const castHead = document.createElement("th");
    const castHeadText = document.createTextNode("Notable Cast");
    castHead.appendChild(castHeadText);
    header.appendChild(castHead);

    const ratingHead = document.createElement("th");
    const ratingHeadText = document.createTextNode("Rating");
    ratingHead.appendChild(ratingHeadText);
    header.appendChild(ratingHead);

    const notesHead = document.createElement("th");
    const notesHeadText = document.createTextNode("Notes");
    notesHead.appendChild(notesHeadText);
    header.appendChild(notesHead);

    fetch('/viewReviews')
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < data.length; i++) {
                const row = table.insertRow();

                const title = row.insertCell();
                const titleText = document.createTextNode(data[i].title);
                title.appendChild(titleText);

                const year = row.insertCell();
                const yearText = document.createTextNode(data[i].year);
                year.appendChild(yearText);

                const cast = row.insertCell();
                const castText = document.createTextNode(data[i].cast);
                cast.appendChild(castText);

                const rating = row.insertCell();
                const ratingText = document.createTextNode(data[i].rating);
                rating.appendChild(ratingText);

                const notes = row.insertCell();
                const notesText = document.createTextNode(data[i].notes);
                notes.appendChild(notesText);
            }
        });
});

document.getElementById("addReviewButton").addEventListener('click', async function() {
    const movie = {"title": document.getElementById("title").value,
                      "year": document.getElementById("year").value,
                      "cast": document.getElementById("cast").value,
                      "rating": document.getElementById("rating").value,
                      "notes": document.getElementById("notes").value,
                    };

    fetch('./addReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(movie),
    });
});