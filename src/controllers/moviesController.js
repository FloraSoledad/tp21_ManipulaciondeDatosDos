const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        // TODO   
        db.Genre.findAll({
            order : [ 'name']
        })
            .then(genres => res.render('moviesAdd', {genres}))
        .catch(error => console.log (error)) 
    },
    create: function (req, res) {
        // TODO
        const {title, release_date, awards, length,rating, genre}= req.body
        db.Movie.create({
            title: title.trim(),
            rating,
            length,
            awards,
            release_date,
            genre_id : genre
        }).then(movie => {
            console.log(movie)
            return res.redirect('/movies')
      }).catch(error => console.log(error)) 

    },
    edit: function (req, res) {
        let Movie = Movies.findByPk(req.params.id, {
            include: [
                {
                    association : 'genres' 
                }
            ]
        })
        let allGenres = Genres.findAll({
            order: ['name']
        });
        Promise.all([Movie, allGenres])
            .then(([Movie,allGenres])=>{
            /*     console.log(Movie)
                console.log(allGenres) */
                return res.send(Movie) 
                return res.render('moviesEdit',{
                    Movie,
                    allGenres,
                    moment
                })
            })
        .catch(error => console.log(error)) 
    },
    update: function (req,res) {
        // TODO
    },
    delete: function (req, res) {
        // TODO
    },
    destroy: function (req, res) {
        // TODO
    }

}

module.exports = moviesController;