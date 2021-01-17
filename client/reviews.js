window.addEventListener("load", function() {   
    //Creating the table
    const table = document.querySelector("table");
    const thead = table.createTHead();
    const header = thead.insertRow();
    
    const titleHead = document.createElement("th");
    titleHead.classList.add("title-col");
    const titleHeadText = document.createTextNode("Movie Title");
    titleHead.appendChild(titleHeadText);
    header.appendChild(titleHead);

    //titleHead.addEventListener("click", sortTable); //Sorting by title

    const castHead = document.createElement("th");
    castHead.classList.add("cast-col");
    const castHeadText = document.createTextNode("Notable Cast");
    castHead.appendChild(castHeadText);
    header.appendChild(castHead);

    const ratingHead = document.createElement("th");
    ratingHead.classList.add("rating-col");
    ratingHead.classList.add("sortable");
    const ratingHeadText = document.createTextNode("Rating");
    ratingHead.appendChild(ratingHeadText);
    header.appendChild(ratingHead);

    ratingHead.addEventListener("click", sortTableRating);

    const notesHead = document.createElement("th");
    notesHead.classList.add("notes-col");
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

function sortTableRating() {
    let tableRows = document.getElementById("reviewsTable").rows;
    let tLength = tableRows.length, allRows = [];
    for(let i = tLength - 1; i > 0; i--) {
        let rowItem = [tableRows[i].cells[0].innerHTML, tableRows[i].cells[1].innerHTML, tableRows[i].cells[2].innerHTML, tableRows[i].cells[3].innerHTML];
        allRows.unshift(rowItem);
        tableRows[i].remove();
    }

    let sorted = [...allRows];
    sorted.sort(function(a, b) {
        return b[2] - a[2];
    });
    if(JSON.stringify(sorted) === JSON.stringify(allRows)) { //Sort in descending order if the list is already sorted
        sorted.sort(function(a, b) {
            return a[2] - b[2];
        });
    }
    
    //Here TODO: Check if array is already sorted, and if it is, put it in descending order

    const table = document.getElementById("reviewsTable");
    for(let i = 0; i < allRows.length; i++) {
        const row = table.insertRow();

        const title = row.insertCell();
        const titleText = document.createTextNode(sorted[i][0]);
        title.appendChild(titleText);

        const cast = row.insertCell();
        const castText = document.createTextNode(sorted[i][1]);
        cast.appendChild(castText);

        const rating = row.insertCell();
        const ratingText = document.createTextNode(sorted[i][2]);
        rating.appendChild(ratingText);

        const notes = row.insertCell();
        const notesText = document.createTextNode(sorted[i][3]);
        notes.appendChild(notesText);
    }
}