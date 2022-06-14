
let page = 1;
let maxPage;
let infinitScroll;

//dado que infinite scroll no esta definida como tal, sucede que cada que se carga la pagina no 
//no le asigan un valor, es por esto que en la funcion navigator, se borra el evento scroll asignado a nada,
//y despues se vuelve a re asignar para que cuando cargue el location con el hash de la pagina se active la funcion
//del scroll infinito.
window.addEventListener('scroll', infinitScroll, false);
// trendingMoviesPreviewList.addEventListener('scroll', infinitScroll, false);

//en las funciones de search, categories, etc... se tiene que crear una funcion que consuma la api 
//de forma paginada.

const navigator = () => {
    console.log({ location });

    if(infinitScroll){
        window.removeEventListener('scroll', infinitScroll, {passive: false});
        infinitScroll = undefined;
    };

    if (location.hash.startsWith('#trends')) {
        trendsPage();
        page;
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
        page;
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
        page;
    } else {
        homePage();
    }
    window.scrollTo(top);

    if(infinitScroll){
        window.addEventListener('scroll', infinitScroll, {passive: false});
    };
};

const homePage = () => {
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    MovieDetailSection.classList.add('inactive');

    // getMovies(`trending/movie/day`, trendingMoviesPreviewList);
    getTrendingMoviesPreview();
    getCategoriesPreview();
}

const categoriesPage = () => {
    console.log('Categories!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('header-arrow--white');
    arrowBtn.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    MovieDetailSection.classList.add('inactive');

    //de la url conserguimos el id para la categoria de la pelicula.

    const [first, categoyData] = location.hash.split('='),
        [categoryId, categoryName] = categoyData.split('-'),
        categoryNameDecode = decodeURI(categoryName);


    headerCategoryTitle.innerHTML = categoryNameDecode;

    // getMovies(`discover/movie`, genericSection, {
    //     params: {
    //         with_genres: categoryId,
    //     }
    // });

    getMoviesByCategory(categoryId);

    infinitScroll = getPaginatedMoviesByCategory;
}

const movieDetailPage = () => {
    console.log('MovieDetails!!');

    headerSection.classList.add('skeleton-bg');
    headerSection.classList.add('skeleton-bg-movie');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    MovieDetailSection.classList.remove('inactive');


    const [_, movieId] = location.hash.split('=');

    if (getMovieById(movieId)) {
        //agregando lo perteneciente al path
        headerSection.classList.add('header-container--long');
        headerSection.classList.remove('skeleton-bg');
        headerSection.classList.remove('skeleton-bg-movie');
        //quitando el skeleto
        movieDetailTitle.classList.remove('skeleton-bg');
        movieDetailTitle.classList.remove('skeleton-textbox');

        movieDetailScore.classList.remove('skeleton-bg');
        movieDetailScore.classList.remove('skeleton-textbox-mini');

        movieDetailDescription.classList.remove('skeleton-bg');
        movieDetailDescription.classList.remove('skeleton-textbox-detail');
    } else {
        console.log('no es lo mismo, namas te, que ya mamas te')
    }
}

const searchPage = () => {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('header-arrow--white');
    arrowBtn.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    MovieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);

    infinitScroll = getPaginatedSearchMovies;
}

const trendsPage = () => {
    console.log('Trends!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('header-arrow--white');
    arrowBtn.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    MovieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrendingMovies();

    infinitScroll = getPaginatedTrendingMovies;
}

window.addEventListener('DOMContentLoaded',
    navigator,
    false);

window.addEventListener('DOMContentLoaded', () => {
    navigator;
    window.history.pushState({ loadUrl: window.location.href }, null, '');
},
    false);
window.addEventListener('hashchange', navigator, false);

searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`;
});


trendingBtn.addEventListener('click', () => {
    location.hash = '#trends='
});

arrowBtn.addEventListener('click', () => {
    const stateLoad = window.history.state ? window.history.state.loadUrl : '';
    if (stateLoad.includes('#')) {
        window.location.hash = '#home';
    } else {
        window.history.back();
    }
});
