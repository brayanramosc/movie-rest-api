import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'brynrms32752290',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
    static getAll = async ({ genre }) => {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase()

            const [genres] = await connection.execute(
                'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
                [lowerCaseGenre]
            )

            if (genres.length === 0) return []

            const genre_id = genres[0].id

            const [movies] = await connection.execute(
                `SELECT 
                    BIN_TO_UUID(tm.id) AS id, 
                    tm.title, 
                    tm.year,
                    tm.director, 
                    tm.poster, 
                    tm.rate 
                FROM movie_genres tmg 
                INNER JOIN movie tm ON tmg.movie_id = tm.id 
                WHERE tmg.genre_id = ?;`,
                [genre_id]
            )

            return movies
        }

        const [movies] = await connection.query(
            'SELECT BIN_TO_UUID(id) AS id, title, year, director, poster, rate FROM movie;'
        )

        return movies
    }

    static getById = async ({ id }) => {
        const [movies] = await connection.execute(
            `SELECT 
                BIN_TO_UUID(tm.id) AS id, 
                tm.title, 
                tm.year,
                tm.director, 
                tm.poster, 
                tm.rate 
            FROM movie tm
            WHERE tm.id = UUID_TO_BIN(?);`,
            [id]
        )

        if (movies.length === 0) return null

        return movies[0]
    }

    static create = async ({ input }) => {
        const {
            genre: undefined,
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        try {
            await connection.execute(`
                INSERT INTO 
                    movie (id, title, year, director, duration, poster, rate ) 
                VALUES 
                    (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);
            `,
                [title, year, director, duration, poster, rate]
            )
        } catch (error) {
            throw new Error('Error creating movie')
        }

        const [movies] = await connection.execute(
            `SELECT 
                BIN_TO_UUID(id) AS id, 
                title, 
                year,
                director, 
                poster, 
                rate 
            FROM movie WHERE id = UUID_TO_BIN(?)`,
            [uuid]
        )

        return movies[0]
    }

    static delete = async ({ id }) => {
    }

    static update = async ({ id, input }) => {
    }
}
