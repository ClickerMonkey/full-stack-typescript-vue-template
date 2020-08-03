import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as FileStoreFactory from 'session-file-store';

import 'require-sql';

import routes from './routes';
import validate from './routes/validate';

import './database';

const app = express();
const port = 3000;
const router = express.Router();
const prefix = '/api';

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'H0bw34Th3W1n',
  store: new (FileStoreFactory(session))()
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 204,
  credentials: true
}));
app.use(prefix, router);

router.get('/auth', validate.auth.get, routes.auth.get);
router.post('/auth', validate.auth.register, routes.auth.register);
router.put('/auth', validate.auth.login, routes.auth.login);
router.delete('/auth', validate.auth.logout, routes.auth.logout);

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});