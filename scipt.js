const form_submit = document.querySelector(".form_submit")
const movie_poster = document.querySelector(".movie_poster")
const movie_info = document.querySelector(".movie_info")
const movie_name = document.querySelector(".search_result")
const movie_container = document.querySelector(".movie_container")
const theme_toggle = document.querySelector(".theme_toggle")
const toggle_icon = document.querySelector(".toggle_icon")
const suggestions = document.getElementById("suggestions");



//showing movie-detais.
const showMovieDetails = (data) => {
    movie_container.innerHTML = ""

    console.log(data);
    const {Title, imdbRating, Genre, Released, Runtime, Actors, Plot, Poster, Type, Language } = data;

    const movieElememnt = document.createElement('div')
    movieElememnt.classList.add("movie_inner_details")
    movieElememnt.innerHTML = `<h2>${Title}</h2>
    <p><strong>Rating: &#11088</strong>${imdbRating}</p> `

    const movieGenreElememnt = document.createElement('div')
    movieGenreElememnt.classList.add("movie_genre")

    Genre.split(",").forEach((e) => {
        const p = document.createElement('div')
        p.innerText = e;
        movieGenreElememnt.appendChild(p)
    });

    movieElememnt.innerHTML += `<p><strong>Released Date: </strong>${Released}</p>
    <p><strong>Runtime: </strong>${Runtime}</p>
    <p><strong>Language: </strong>${Language}</p>
    <p><strong>Cast: </strong>${Actors}</p>
    <p><strong>Type: </strong>${Type}</p>
    <p><strong>Plot: </strong>${Plot}</p>
    `

    
    //creating a div for movie poster.
    const movieposterElement = document.createElement("div");
    movieposterElement.classList.add("movie_poster")
    movieposterElement.innerHTML = `<img src="${Poster}">`




    movie_container.appendChild(movieposterElement)
    movie_container.appendChild(movieElememnt)
    movieElememnt.appendChild(movieGenreElememnt)

    
}



//giving spell error
const showError = () => {
    movie_container.innerHTML = `<h2>Movie Not Found ❌</h2>`
}



//fetch movie details.
const getMovieInfo = async (movie) => {

    const api_key = "1b3a028"
    const api_url = `https://www.omdbapi.com/?apikey=${api_key}&t=${movie}`;

    const response = await fetch(api_url)
    .then((res) => {
        return res.json()
    }).catch((error) => {
        console.log(error);
        
    })

    //for giving spell error
    if (!response || response.Response === "False") {
      showError();
      return;
    }

    showMovieDetails(response)

}



//getting the movie name.
form_submit.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(movie_name.value);
    const movieName = movie_name.value.trim();

    if(movieName!==""){
        getMovieInfo(movieName)
    }

    movie_name.value = ""
    suggestions.innerHTML = "";

    
})



//random-search opening in website.
window.addEventListener("DOMContentLoaded", () => {
    const popularMovie = ["The Avengers", "Rockstar", "John Wick", "K.G.F", "Pirates of the Caribbean", "Game of Thrones", "Fight Club", "Inception", "Interstellar", "Now you see me"]
    const getRandomMovie = popularMovie[Math.floor((Math.random())*10)]
    getMovieInfo(getRandomMovie);
});




//default theme for website
const savedTheme = localStorage.getItem("theme");
// console.log(savedTheme);


if(savedTheme === "light"){
    document.documentElement.classList.add("light");
}




//theme-controller
const themeBtn = document.getElementById('themeBtn');
const label    = themeBtn.querySelector('.toggle-label');

themeBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  const isLight = document.documentElement.classList.contains('light');
  const theme = isLight ? 'light' : 'dark';
  localStorage.setItem("theme", theme)
  
});


//search-suggestions
movie_name.addEventListener("input", async () => {
    const query = movie_name.value;

    if(query.length < 2){
        suggestions.innerHTML = "";
        return;
    }

    const api_key = "1b3a028"
    const api_url = `https://www.omdbapi.com/?apikey=${api_key}&s=${query}`;

    const data = await fetch(api_url)
    .then((res) => {
        return res.json()
    }).catch((error) => {
        console.log(error);
        
    })

    if(data.Response === "True"){
        suggestions.innerHTML = data.Search.map(movie => `<p class = "suggestion_items">${movie.Title}</p>`).join("")
    }else{
        suggestions.innerHTML = `<p>No result</p>`
    }
    const item = document.createElement('div');
    item.classList.add('suggest_item');
    
})

//responsibe suggestion box
suggestions.addEventListener("click", (e) => {
    // console.log(e.target.innerHTML);
    if(e.target.classList.contains("suggestion_items")){
        suggestions.innerHTML = ""
        getMovieInfo(e.target.innerText)
        movie_name.value = ""
    }
    
})
