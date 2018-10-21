var express = require('express');
var pgp = require('pg-promise')();
//var db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://otgkmeypkqzstt:35a8d460ec0f944fc76af4b2f5418baa65694cc8d07a732f1180f85355781521@ec2-54-156-0-178.compute-1.amazonaws.com:5432/d62ksn3bjp2srd?ssl=true');
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
        sql += ' where id =' + id + " ORDER BY id ASC";
    }
    db.any(sql + " ORDER BY id ASC")
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

app.get('/users/:id', function (req, res) {
    var id = req.params.id;
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    var sql = "select * from users where id=" + id;
    db.any(sql)
        .then(function (data) {
            res.render('pages/users_edit', { user: data[0],time: time })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })

});

app.get('/users', function (req, res) {
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
    // Update data user
    app.post('/users/update',function (req, res) {
        var id =req.body.id;
        var email =req.body.email;
        var password =req.body.password;
        var sql= `update users set id ='${id}', email='${email}',password='${password}' where id='${id}'`;
        // res.send(sql)
        //db.none
        db.any(sql)
                .then(function (data) {
                    console.log('DATA:' + data);
                    res.redirect('/users')
                })
        
                .catch(function (error) {
                    console.log('ERROR:' + error);
                })
        });

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

 app.get('/product_report/:pid',function (req, res) {
    var id = req.params.pid;
    var sql = `select product_id, title, products.price, purchase_id, quantity
    from products, purchase_items
    where products.id = product_id
    and product_id = ${id}`;
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.render('pages/Report' , { report:data})
    
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
    })

    
 });
 app.get('/user_report',function (req, res) {
    var sql = `select email, price
    from users`;
    db.any(sql)
        .then(function(data){
            console.log('DATA:'+data);
            res.render('pages/user_report' , { ureport:data})
        })
        .catch(function(data){
                console.log('ERROR:'+console.error);
    })
 });

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});