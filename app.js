import express, { json } from 'express'

import { createMovieRouter } from './routes/movies.js'
//import { corsMiddlewire } from './middleware/cors.js'

export const createApp = ({ movieModel }) => {
    const app = express()
    app.use(json())
    //app.use(corsMiddlewire)
    app.disable('x-powered-by')

    app.use('/movies', createMovieRouter({ movieModel }))

    const PORT = process.env.PORT ?? 1234
    app.listen(PORT, () => {
        console.log(`Server listening on port http://localhost:${PORT}`)
    })
}
