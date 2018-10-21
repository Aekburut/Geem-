var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://ocljownkhqazkm:41dbf85afa3bf5181cd11d7ea62de618220f6c50017dbb01c167d4017cf6b38f@ec2-54-156-0-178.compute-1.amazonaws.com:5432/d3qep9jb346m2h?ssl=true');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/about', function (req, res) {
    var name = 'Aekburut Rawangngan';
    var hobbies = ['Sport', 'part time', 'Work'];
    var bdate = '07/03/1998';
    res.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });
});

// Display all product
app.get('/products', function (req, res) {
    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/products', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from products where id=" + pid;
    db.any(sql)
        .then(function (data) {
            res.render('pages/product_edit', { products: data[0],time: time })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

app.get('/user/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'select * from users';
    if (id) {
        sql += ' where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});

app.get('/user', function (req, res) {
    db.any('select * from users', )
        .then(function (data) {
            console.log('DATA' + data);
            res.render('pages/users', { users: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});
// Update data
app.post('/products/update',function (req, res) {
    var id =req.body.id;
    var title =req.body.title;
    var price =req.body.price;
    var sql=`update products set title='${title}',price='${price}' where id='${id}'`;
    // res.send(sql)
    //db.none
    db.any(sql)
            .then(function (data) {
                console.log('DATA:' + data);
                res.redirect('/products')
            })
    
            .catch(function (error) {
                console.log('ERROR:' + error);
            })
    })

app.post('/products/insert', function (req, res){
    var id = req.body.id;
    var title = req.body.title;
    var time = req.body.time;
    var price = req.body.price;

    var sql = `INSERT INTO products (id,title,price,created_at) VALUES ('${id}','${title}','${price}','${time}')`;
    console.log('UPDATE:' + sql);
    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            
            res.redirect('/products')

        })
        .catch(function (data) {
            console.log('ERROR:' + error);

        })
});

app.get('/insert', function (req, res) {
    var time = moment().format();
    res.render('pages/insert', { time:time});
});

app.get('/product_delete/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = 'DELETE FROM products';
    if (id){
            sql += ' where id ='+ id;
    }
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.redirect('/products');
    
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
                
    })
 });

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});