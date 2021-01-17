window.addEventListener("load", function() {   
    //Creating the table
    const table = document.querySelector("table");
    const thead = table.createTHead();
    const header = thead.insertRow();
    
    const titleHead = document.createElement("th");
    titleHead.classList.add("title-col");
    titleHead.classList.add("sortable");
    const titleHeadText = document.createTextNode("Movie Title");
    titleHead.appendChild(titleHeadText);
    header.appendChild(titleHead);

    titleHead.addEventListener("click", function() {sortTable(0);}); //Sorting by title

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

    ratingHead.addEventListener("click", function() {sortTable(2);});

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

//@param {number} field: the field to be sorted. 0 = title, 2 = rating
function sortTable(field) {
    const tableRows = document.getElementById("reviewsTable").rows;
    const tLength = tableRows.length, allRows = [];
    for(let i = tLength - 1; i > 0; i--) {
        const rowItem = [tableRows[i].cells[0].innerHTML, tableRows[i].cells[1].innerHTML, tableRows[i].cells[2].innerHTML, tableRows[i].cells[3].innerHTML];
        allRows.unshift(rowItem);
        tableRows[i].remove();
    }

    const sorted = [...allRows];
    if(field === 0) { //Sorting strings
        sorted.sort();
    }
    else if(field === 2) { //Sorting numbers
        sorted.sort(function(a, b) {
            return b[field] - a[field];
        });
    }

    if(JSON.stringify(sorted) === JSON.stringify(allRows)) { //Sort in descending order if the list is already sorted
        sorted.reverse();
    }
    

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