// import
import express, {json} from 'express';
import morgan from 'morgan';
import { listQuestions } from './dao.mjs';
import cors from 'cors';


// setup server - init
const app = express();
const port  = 3001;
    
// Middleware
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(json());
app.use(morgan('dev'));

// Route

// GET /api/questions
app.get('/api/questions', (request, response) => {  //l'API deve

    listQuestions()
    .then(questions => response.json(questions))
    .catch(() => response.status(500).end());   // .end invia lo status impostato
});

// far partire il server
app.listen(port, () => 'API Server started!');

