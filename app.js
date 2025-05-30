const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');        
const mypageRoutes = require('./routes/mypage');
const xssRoutes = require('./routes/xss');
const sqliRoutes = require('./routes/sqli');
const fileRoutes = require('./routes/vulnfile');
const adminRoutes = require('./routes/admin');
const metadataRoutes = require('./routes/metadata');
const previewRoutes = require('./routes/preview');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: 'secure-lab-secret', resave: false, saveUninitialized: true }));


app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/api', apiRoutes);          
app.use('/mypage', mypageRoutes);    
app.use('/xss', xssRoutes);
app.use('/sqli', sqliRoutes);
app.use('/files', fileRoutes);
app.use('/admin', adminRoutes);
app.use('/metadata', metadataRoutes);
app.use('/preview', previewRoutes);

app.listen(3000, () => console.log('Server running on 3000'));