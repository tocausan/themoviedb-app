angular.module('app', [])

    .controller('mainCtrl', function ($scope) {

        /* CONSTANTES */
        const APIKEY = 'e78675eae2c623337185d33bbd7a1c24';
        const IMGURL = 'http://image.tmdb.org/t/p/original';
        const GENRELISTURL = 'http://api.themoviedb.org/3/genre/movie/list?api_key=' + APIKEY;
        const MOVIEDISCOVERURL = 'http://api.themoviedb.org/3/discover/movie?api_key=' + APIKEY;

        /* VARIABLES */
        // Search options
        $scope.searchOption = {
            year: [],
            sort_by: [
                'popularity.asc',
                'popularity.desc',
                'release_date.asc',
                'realease_date.desc',
                'revenue.asc',
                'revenue.desc',
                'primary_release.asc',
                'primary_release.desc',
                'original_title.asc',
                'original_title.desc',
                'vote_average.asc',
                'vote_average.desc',
                'vote_count.asc',
                'vote_count.desc'
            ],
            include_adult: [
                'false',
                'true'
            ],
            include_video: [
                'false',
                'true'
            ],
            page: []
        };

        // Search result
        $scope.search = {
            options: {
                'year': '',
                'language': '',
                'sort_by': '',
                'certification_country': '',
                'certification': '',
                'certification.lte': null,
                'include_adult': 'false',
                'include_video': 'true',
                'primary_release_year': null,
                'primary_release_date.gte': null,
                'primary_release_date.lte': null,
                'release_date.gte': null,
                'release_date.lte': null,
                'vote_count.gte': null,
                'vote_count.lte': null,
                'vote_average.gte': null,
                'vote_average.lte': null,
                'with_cast': '',
                'with_crew': '',
                'with_companies': '',
                'with_genres': '',
                'with_keywords': '',
                'with_people': '',
                'without_genres': '',
                'with_runtime.gte': null,
                'with_runtime.lte': null
            },
            'page': 1
        };

        // Result model
        $scope.movies = {
            page: 1,
            results: [],
            total_results: [],
            total_pages: 0
        };


        /* FUNCTIONS */
        // Fill options
        (function fillOptions() {
            // Years
            var firstYear = 1880;
            var lastYear = new Date().getFullYear() + 5;
            for (var i = lastYear; i > firstYear; i--) {
                $scope.searchOption.year.push(i);
            }
        })();


        // Search genres
        (function searchGenres() {
            // Promise JSON
            new Promise(function (resolve, reject) {
                // New XMLHttpRequest
                var xhr = new XMLHttpRequest();
                xhr.open('get', GENRELISTURL, true);
                xhr.responseType = 'json';
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        // Success
                        resolve(xhr.response);
                        // Set total pages
                        $scope.$apply(function () {
                            $scope.genres = xhr.response.genres;
                        });
                    } else {
                        // Errot
                        reject(xhr.status);
                    }
                };
                xhr.send();
            });
        })();


        // Search movies
        function searchMovies() {
            // reset page
            $scope.search.page = 1;
            // load data
            loadMovies(setUrl(MOVIEDISCOVERURL));
        };

        function changePage() {
            // limit page nav
            if ($scope.search.page < 1) $scope.search.page = $scope.movies.total_pages;
            if ($scope.search.page > $scope.movies.total_pages) $scope.search.page = 1;
            // load data
            loadMovies(setUrl(MOVIEDISCOVERURL));
        };


        // Insert search options into api url
        function setUrl(url) {
            // options
            var options = [];
            for (var key in $scope.search.options) {
                if ($scope.search.options[key] !== null && $scope.search.options[key] !== '') {
                    // push options
                    options.push([key, $scope.search.options[key]])
                    // add options to url
                    url += '&' + key + '=' + $scope.search.options[key];
                }
                ;
            }
            ;
            // add page to url
            url += '&page=' + $scope.search.page;
            // console options
            console.log(options);
            // return
            return url;
        };


        // load movies
        function loadMovies(url) {
            // Promise JSON
            new Promise(function (resolve, reject) {
                // New XMLHttpRequest
                var xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.responseType = 'json';
                xhr.onload = function () {
                    if (xhr.status == 200) {
                        // Success
                        resolve(xhr.response);
                        // Set total pages
                        $scope.$apply(function () {
                            $scope.movies = xhr.response;
                            cleanData();
                        });
                    } else {
                        // Errot
                        reject(xhr.status);
                    }
                };
                xhr.send();
            });
        };


        // Clean data
        function cleanData() {
            for (var g in $scope.genres) {
                //cleanedGenres.push(['hh', $scope.genres[g].name]);
                console.log(g)
                $scope.genres[g].id
            }


            for (var key in $scope.movies.results) {
                //console.log($scope.movies.results[key].genre_ids)
                for (var i in $scope.movies.results[key].genre_ids) {
                    for (var g in $scope.genres) {
                        if ($scope.movies.results[key].genre_ids[i] == $scope.genres[g].id) {
                            $scope.movies.results[key].genre_ids[i] = $scope.genres[g].name
                        }
                    }
                }
            }
        };


        /* LISTENERS */
        // Watch search
        $scope.$watchCollection('search.options', searchMovies);
        $scope.$watch('search.page', changePage);
    });