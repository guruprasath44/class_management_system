const mysql = require('mysql2');
const connect= mysql.createConnection({ 
host:'localhost',
user:'root',
password: 'guru',
database:'cms',
port:'3306'
});


module.exports=connect;