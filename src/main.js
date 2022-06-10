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

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // console.log(entry.target.setAttribute);
        if (entry.isIntersecting === true) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
            //toma en cuenta el tamaño de los archivos porque puede ser que de primeras
            //porque peude ser que si tienen poca altura quiza se muestre toda la info de primeras.
        };
    });
});

const createMovies = (movies, section, { lazyLoad = false, clean = true } = {}) => {

    if (clean) {
        section.innerHTML = "";
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`;
        });
        const movieImg = document.createElement('img');
        // movieImg.classList.add('movie-img');
        // movieImg.setAttribute('alt', movie.title);

        //estaria bueno poner algo para cuando la api no trae las imagenes.
        if (movie.poster_path === null) {

            movieContainer.classList.add('empty-img');
            const titleText = document.createTextNode(movie.title);
            titleText.style = 'color:white;'
            movieContainer.appendChild(titleText);
            // movieImg.appendChild(movieTitle);
        } if (movie.poster_path != null) {
            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title);
            movieImg.setAttribute(
                lazyLoad ? 'data-img' : 'src',
                `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        };

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        };

        movieContainer.appendChild(movieImg);
        section.appendChild(movieContainer);
    });

};

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


//Requests
const getTrendingMoviesPreview = async () => {
    try {
        const { data } = await api(`trending/movie/day`);
        //   const data = await res.json();
        const movies = data.results;

        console.log(movies);
        createMovies(movies, trendingMoviesPreviewList, { lazyLoad: true, clean: true });

        // createMovies(movies, trendingMoviesPreviewList);

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
        createMovies(movies, genericSection, true);
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

        createMovies(movies, genericSection, { lazyLoad: true, clean: true });
    } catch (error) {

    }
};


let page = 1;

const getPaginatedTrendingMovies = async () => {
    const { scrollTop,
        scrollHeight,
        clientHeight } = document.documentElement;
    const scrllIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 100);

    if (scrllIsBottom) {
        page++;
        const { data } = await api(`trending/movie/day`, {
            params: {
                page: page,
            }
        });
        const movies = data.results;
        createMovies(movies, genericSection, { lazyLoad: true, clean: false });
        console.log('ahh perrooo')
    };

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerHTML = 'cargar mas';
    // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
    // genericSection.appendChild(btnLoadMore);
};

const getTrendingMovies = async () => {
    const { scrollTop,
        scrollHeight,
        clientHeight } = document.documentElement;
    const scrllIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);

    try {
        const { data } = await api(`trending/movie/day`);
        const movies = data.results;
        createMovies(movies, genericSection, { lazyLoad: true, clean: true });

        // const btnLoadMore = document.createElement('button');
        // btnLoadMore.innerHTML = 'cargar mas';
        // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
        // genericSection.appendChild(btnLoadMore);
        if (scrllIsBottom === true) {
            console.log('afirmativo', scrllIsBottom);
            getPaginatedTrendingMovies;
        }

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
        createMovies(similarMovies, relatedMoviesContainer);
    } catch (error) {

        console.log(`no se obtuvieron respuestas`);
    }
};

