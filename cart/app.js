var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , bodyParser = require("body-parser")
    , app = express();

app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

var cart = [];

app.post("/add", function (req, res, next) {
    var obj = req.body;
    console.log("add ");
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));

    var max = 0;
    var ind = 0;
    var qt1 = 0;
    var qt2 = 0;

    if (cart["" + obj.custId] === undefined)
        cart["" + obj.custId] = [];
    var c = cart["" + obj.custId];
    for (ind = 0; ind < c.length; ind++)
        if (max < c[ind].cartid)
            max = c[ind].cartid;
    var cartid = max + 1;
    var data = {
        "cartid": cartid,
        "productID": obj.productID,
        "name": obj.name,
        "price": obj.price,
        "image": obj.image,
        "quantity": obj.quantity
    };
    console.log(JSON.stringify(data));
   if (c.length>0){
       for(i = 0; i < c.length; i++){
           if(c[i].productID === obj.productID){
               qt1 = parseInt(c[i].quantity, 10);
               qt2 = parseInt(obj.quantity, 10);
               c[i].quantity = qt1 + qt2;
               data = {};
           }
       }
   }
   if (data.productID !== null && data.productID !== undefined) {
       c.push(data);
   }
    res.status(201);
    res.send("");
});

/* toDO */
app.delete("/cart/:custId/items/:id", function (req, res, next) {
    var body = '';
    var customerId = req.params.custId.toString();
    var ShoppingCart = cart[customerId];
    var cartItemId = req.params.id.toString();

    if(ShoppingCart.length > 1){
        ShoppingCart.splice(cartItemId-1, 1);
    } else {
        ShoppingCart.splice(0, 1);
    }

    console.log("Delete item from cart: for custId " + req.url + ' ' +
        req.params.id.toString());

    res.send('');
});


app.get("/cart/:custId/items", function (req, res, next) {


    var custId = req.params.custId;
    console.log("getCart" + custId);


    console.log('custID ' + custId);


    console.log(JSON.stringify(cart["" + custId], null, 2));

    res.send(JSON.stringify(cart["" + custId]));
    console.log("cart sent");

});


var server = app.listen(process.env.PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
