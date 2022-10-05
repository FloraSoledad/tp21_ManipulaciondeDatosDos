const path = require('path');
const moment = require('moment');
const db = require('../database/models');
const sequelize = db.sequelize;
const { title } = require('process');
//Otra forma de llamar a los modelos
const Movies = db.Movie;
const Genres = db.Genre;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        //TODO
        db.Genre.findAll({
            order: ['name']
        })
            .then(genres => res.render('moviesAdd', { genres }))
            .catch(error => console.log(error))
    },
    create: function (req, res) {
        // CREATE METHOD
        const { title, release_date, awards, length, rating, genre } = req.body;

        db.Movie.create({
            title: title.trim(),
            rating,
            length,
            awards,
            genre,
            release_date,
            genre_id: genre
        }).then(movie => {
            console.log(movie);
            /*  return res.redirect('/movies'); */
        }).catch(err => console.log(err))
    },
    add: function (req, res) { 
        Genres.findAll({
            order : ['name']
        })
            .then(allGenres => {
                return res.render('moviesAdd',{allGenres})
            })
        .catch(error => console.log(error))
      },
    create: function (req, res) {
        const { title, rating, awards, length, release_date, genre_id} = req.body;
        Movies.create({
            title: title.trim(),
            rating,
            awards,
            length,
            release_date,
            genre_id
        }).then(movie => {
            console.log(movie)
            return res.redirect('/movies')
        }).catch(error => console.log(error))
    },
    edit: function (req, res) {
        let Movie = Movies.findByPk(req.params.id, /* {
            include: [
                {
                    association : 'genre' 
                }
            ]
        } */)
        let allGenres = Genres.findAll({
            order: ['name']
        });
        Promise.all([Movie, allGenres])
            .then(([Movie,allGenres])=>{
            /*     console.log(Movie)
                console.log(allGenres) */
              /*   return res.send(Movie)  */
                return res.render('moviesEdit',{
                    Movie,
                    allGenres,
                    moment
                })
            })
        .catch(error => console.log(error)) 
    },
    
    update: function (req, res) {
        const { title, rating, awards, length, release_date, genre_id} = req.body;
        Movies.update(
            {/* el primer objeto me indica que columna tengo actualizada */
                title: title.trim(),
                rating,
                awards,
                length,
                release_date,
                genre_id
            },
            {
                where: {
                    id : req.params.id
                }
            }
        )
            .then(() => res.redirect('/movies/detail/' + req.params.id))
            .catch(error => console.log (error))
    },
    delete: function (req, res) {
        const Movie = req.query
        res.render('moviesDelete', {Movie})
        
    },
    destroy: function (req, res) {
        const { id } = req.params
        Movies.destroy({
            where: {
                id
            }
        })
            .then(() => {
                return res.redirect('/movies')
         })
         .catch(error => console.log(error)) 
    },
};

module.exports = moviesController