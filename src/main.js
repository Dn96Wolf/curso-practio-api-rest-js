const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});


const BASE_URL = `https://api.themoviedb.org/3`;

//utils
const createMovies = (movies, section) => {
    section.innerHTML = "";
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });
        const movieImg = document.createElement('img');

        //estaria bueno poner algo para cuando la api no trae las imagenes.
        if (movie.poster_path === null) {

        } else {
            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title);
            movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        };

        movieContainer.appendChild(movieImg);
        section.appendChild(movieContainer);
    });

}

const createCategories = (categories, container) => {
    container.innerHTML = "";
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add(`category-container`);

        const categoryTitle = document.createElement('h3'),
            genreTitlteText = document.createTextNode(category.name);
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        });

        categoryTitle.appendChild(genreTitlteText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
};

const getTrendingMoviesPreview = async () => {
    try {
        const { data } = await api(`trending/movie/day`);
        //   const data = await res.json();
        const movies = data.results;
        createMovies(movies, trendingMoviesPreviewList);

        //  trendingMoviesPreviewList.innerHTML = '';
        //  movies.forEach(movie => {
        //       const trendingMoviesPreviewList = document.querySelector('#trendingPreview .trendingPreview-movieList');
        //      const movieContainer = document.createElement('div');
        //      movieContainer.classList.add('movie-container');

        //      const movieImg = document.createElement('img');
        //      movieImg.classList.add('movie-img');
        //      movieImg.setAttribute('alt', movie.title);
        //      movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);

        //      movieContainer.appendChild(movieImg);
        //      trendingMoviesPreviewList.appendChild(movieContainer);
        //  });

    } catch (error) {

        console.log(`no se obtuvieron respuestas`)
    }
};

const getCategoriesPreview = async () => {
    try {
        const { data } = await api(`genre/movie/list`);
        // data = await res.json();
        const categories = data.genres;
        // categories.forEach(category => {
        //     // const categoriesPreviewList = document.querySelector(`#categoriesPreview .categoriesPreview-list`);
        //     const categoryContainer = document.createElement('div');
        //     categoryContainer.classList.add(`category-container`);

        //     const categoryTitle = document.createElement('h3'),
        //         genreTitlteText = document.createTextNode(category.name);
        //     categoryTitle.classList.add('category-title');
        //     categoryTitle.setAttribute('id', 'id' + category.id);
        //     categoryTitle.addEventListener('click', () => {
        //         location.hash = `#category=${category.id}-${category.name}`
        //     });

        //     categoryTitle.appendChild(genreTitlteText);
        //     categoryContainer.appendChild(categoryTitle);
        //     categoriesPreviewList.appendChild(categoryContainer);
        // });
        createCategories(categories, categoriesPreviewList);

    } catch (error) {
        console.log('algo salio mal...');
    }
};

const getMoviesByCategory = async (id) => {
    try {
        const { data } = await api(`discover/movie`, {
            params: {
                with_genres: id,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection);
    } catch (error) {

        console.log(`no se obtuvieron respuestas`)
    };
};

// const getMovies = async (url, node, otherParams = {}) => {
//     try {
//         const { data } = await api(url, otherParams),
//             movies = data.results;
//         node.innerHTML = "";

//         movies.forEach(movie => {
//             const movieContainer = document.createElement('div');
//             movieContainer.classList.add('movie-container');

//             const movieImg = document.createElement('img');
//             movieImg.classList.add('movie-img');
//             movieImg.setAttribute('alt', movie.title);
//             movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);

//             movieContainer.appendChild(movieImg);
//             node.appendChild(movieContainer);
//         });
//     } catch (error) {
//         console.log(`no se obtuvieron respuestas`)
//     };
// };

const getMoviesBySearch = async (query) => {
    try {
        const { data } = await api('search/movie', {
            params: {
                query,
            }
        });
        const movies = data.results;

        createMovies(movies, genericSection);
    } catch (error) {

    }
};

const getTrendingMovies = async () => {
    try {
        const { data } = await api(`trending/movie/day`);
        const movies = data.results;
        createMovies(movies, genericSection);

    } catch (error) {
        console.log(`no se obtuvieron respuestas`);
    }
};

const getMovieById = async (movieId) => {
    try {
        const { data: movie } = await api(`movie/${movieId}`);
        console.log(movie);

        const movieImgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        // headerSection.style.background = `url(${movieImgUrl})`;
        headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%,
            rgba(0, 0, 0, 0) 29.17%),
            url(${movieImgUrl})`;

        movieDetailTitle.textContent = movie.title;
        movieDetailDescription.textContent = movie.overview;
        movieDetailScore.textContent = movie.vote_average;

        createCategories(movie.genres, movieDetailCategoriesList);
        getRelatedMoviesId(movieId);


    } catch (error) {

        console.log(`no se obtuvieron respuestas`);
    }
};

const getRelatedMoviesId = async (movieId) => {
    try {
        const { data } = await api(`movie/${movieId}/similar`),
        similarMovies = data.results;
        createMovies(similarMovies,relatedMoviesContainer);    
    } catch (error) {

        console.log(`no se obtuvieron respuestas`);
    }
};