// setup of express and dotenv
const express = require('express');
require('dotenv').config();
// declare app and session middleware
const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');
// passport
const passport = require('./strategies/user.strategy');

// Route includes
const walkupRouter = require('./routes/walkup.router');
const volunteerAdminRouter = require('./routes/volunteer-admin.router');
const volunteerPortalRouter = require('./routes/volunteer-portal.router');
const userRouter = require('./routes/user.router');
const attendeeRouter = require('./routes/attendee.router');
const conventionRouter = require('./routes/convention.router');
const eventRouter = require('./routes/event.router');
const locationRouter = require('./routes/location.router');
const tagRouter = require('./routes/tag.router');
const sponsorRouter = require('./routes/sponsor.router');
const homeRouter = require('./routes/home.router');

// Body parser middleware

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50MB', extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/attendee', attendeeRouter);
app.use('/api/convention', conventionRouter);
app.use('/api/event', eventRouter);
app.use('/api/location', locationRouter);
app.use('/api/tag', tagRouter);
app.use('/api/sponsor', sponsorRouter);
app.use('/api/home', homeRouter);
app.use('/api/volunteer-admin', volunteerAdminRouter);
app.use('/api/volunteer-portal', volunteerPortalRouter);
app.use('/api/walkup', walkupRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
