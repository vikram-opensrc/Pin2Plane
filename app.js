/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
//var methodOverride = require('method-override');
var app = express();
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var session = require('express-session')
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : '4plE3fm',
              database : 'p2p'
            });
 
connection.connect();
 
global.db = connection;

var MySQLStore = require('express-mysql-session')(session);
var options = {
    // Host name for database connection:
    host: 'localhost',
    // Port number for database connection:
    port: 3306,
    // Database user:
    user: 'root',
    // Password for the above database user:
    password: '4plE3fm',
    // Database name:
    database: 'p2p',
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 900000,
    // The maximum age of a valid session; milliseconds:
    expiration: 86400000,
    // Whether or not to create the sessions database table, if one does not already exist:
    createDatabaseTable: true,
    // Number of connections when creating a connection pool:
    connectionLimit: 1,
    // Whether or not to end the database connection when the store is closed:
    endConnectionOnClose: !connection,
    //charset: 'utf8mb4_bin',
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options);
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my-express-secret',
  saveUninitialized: true,
  resave: true,
  store: sessionStore
}));
 
// all environments
app.set('port', process.env.PORT || 8012);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);//call for main index page
app.get('/login', routes.index);//call for login page
app.get('/signup', user.signup);//call for signup page
app.post('/login', user.login);//call for login post
app.post('/signup', user.signup);//call for signup post
app.get('/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/home/logout', user.logout);//call for dashboard page after login
app.get('/user/:u_id', user.user_details);//call for dashboard page after login
//Middleware
app.listen(8012)