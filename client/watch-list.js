window.addEventListener("load", function() {   
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
});

document.getElementById("addWatchListButton").addEventListener('click', async function() {
    const movie = {"title": document.getElementById("title").value,
                      "year": document.getElementById("year").value,
                      "cast": document.getElementById("cast").value,
                      "rating": document.getElementById("rating").value,
                      "notes": document.getElementById("notes").value,
                    };

    fetch('./addWatchList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(movie),
    });
    //window.location.href = "dc-todaysfood.html";
});