const bodyParser = require('body-parser');
const cluster = require('cluster');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const MongoStore = require('connect-mongo');

const numCPUs = process.env.WEB_CONCURRENCY || require('os').cpus().length;

// const updateScript = require('./utils/updateScript');
const getCurrentSeason = require('./utils/getCurrentSeason');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);

  dotenv.config({ path: path.join(__dirname, '.env') });

  const PORT = process.env.PORT || 3000;
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tusf';
  const MAX_SERVER_UPLOAD_LIMIT = 52428800;
  const MAX_SERVER_PARAMETER_LIMIT = 50000;
  const QUERY_LIMIT = 10;

  const activityRouteController = require('./routes/activityRoute');
  const adminRouteController = require('./routes/adminRoute');
  const authRouteController = require('./routes/authRoute');
  const branchRouteController = require('./routes/branchRoute');
  const contestRouteController = require('./routes/contestRoute');
  const imageRouteController = require('./routes/imageRoute');
  const indexRouteController = require('./routes/indexRoute');
  const statisticsRouteController = require('./routes/statisticsRoute');
  const universityRouteController = require('./routes/universityRoute');
  const userRouteController = require('./routes/userRoute');
  const yearRouteController = require('./routes/yearRoute');

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(bodyParser.json({ limit: MAX_SERVER_UPLOAD_LIMIT }));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: MAX_SERVER_UPLOAD_LIMIT,
    parameter: MAX_SERVER_PARAMETER_LIMIT
  }));

  const sessionOptions = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI
    })
  });

  app.use(cookieParser());
  app.use(sessionOptions);

  app.use((req, res, next) => {
    if (!req.query || typeof req.query != 'object')
      req.query = {};
    if (!req.body || typeof req.body != 'object')
      req.body = {};

    res.locals.QUERY_LIMIT = QUERY_LIMIT;
    res.locals.CURRENT_SEASON = getCurrentSeason();
    req.query.limit = QUERY_LIMIT;

    next();
  });

  app.use('/activity', activityRouteController);
  app.use('/admin', adminRouteController);
  app.use('/auth', authRouteController);
  app.use('/branch', branchRouteController);
  app.use('/contest', contestRouteController);
  app.use('/image', imageRouteController);
  app.use('/statistics', statisticsRouteController);
  app.use('/university', universityRouteController);
  app.use('/user', userRouteController);
  app.use('/year', yearRouteController);
  app.use('/', indexRouteController);

  server.listen(PORT, () => {
    console.log(`Server is on port ${PORT} as Worker ${cluster.worker.id} running @ process ${cluster.worker.process.pid}`);
  });
}
