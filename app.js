const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
const myRoutes = require('./controller/routes/route');

app.use(myRoutes);
app.set('views', [`${__dirname}/views`, `${__dirname}/views/admin`, `${__dirname}/views/student`]);
app.set('view engine', 'ejs');
app.listen(3000, () => {
  console.log('server is running at the port 3000');
});
