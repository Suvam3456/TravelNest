////////////////////////////    PTS      /////////////////////////////////////////

Open folder in Vscode -> Open cmd and run mongosh -> On vs code terminal run nodemon app.js -> localhost:8080/listings

let chat1 = new Chat({
from:"Akash",
to: "Aman",
msg: "send me your exam sheet",
created_at: new Date(),
});

chat1.save().then((res) => {
  console.log(res);
})

npm init -y creates a package.json file.
npm i express mongoose ejs

.Data is stored in Bson which is binary json. Parsing of data is difficult in json compared to bson as json is text-based.Many Datatypes can be stored in bson but not in json .Bson is space efficient compared to json. We will give data in json format only and mongodb automatically convert it into BSON before storing. 

Schema is blue print of database. As we define a schema for a table in sql ,similarly we define a schema for a collection. It defines how a document is created & stored in a collection. We can add schema type options like min/max length or unique or required etc.

ex: const userSchema = mongoose.Schema({
  name: String,
  email: String,
  age :{
  type : Number,
  //Jab multiple constraints define krna ho
}
})     

3) A model is a class or can be called as a collection from which we form objects ie instance of model is object or document.

const User = mongoose.model("User", userSchema);
Mongoose Database test me ek new collection create karra of name Users.
First argument is collection name which we want and second argument is userSchema which we created and User is Model we get. Collection name and model name is taken same
Name of collection changes from User -> users in mongodb ie singular to plural.

 const user1 = new User({
   name: "Adam",
   email: "adam@gmail.com",
   age: 48,
 });

To test if document is created in memory or not , write command :
Node
.load index.js
user1
so isse ek document show hora with a id automatically generated by mongoose for document.
user1.save() , Isse ab insert hogya user1 collection me document. We can check by command 
db.users.find() in test database. Here save() is also an asynchronous fn which return a promise so we can apply .then and .catch on it.

4. Find in mongoose

User.find({})         // to fetch all documents {}
.then((res) => {
  console.log(res[0].name);
})
.catch((err) => {
  console.log(err);
})

Although find fn returns a query object and not a promise, still we can apply .then and .catch ie it returns a thennable object.

findOne() returns a single document data. 
findById() is most used fn.



5) Update in mongoose -->
Returns a query object
updateOne ->
updateMany ->

ex:Bruce name wale ka age 49 krna. Here we don't have to use set operator like mongoshell

User.updateOne({name:"Bruce"},{age:49})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
 })

ex: Jha Jha age ki value greater then 48 hai wha wha age ka value 55 krdo update -->

User.updateOne({ age: {$gt:48}}, {age:55})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
 }) 

 Similarly We have findOneAndUpdate and findByIdAndUpdate.Isme pehle find krta document ko then console me print krta then uske baad update krta database me.We can pass options as well in its argument. ex: {new:true} jisse console me updated hi print ho.

6) Delete in mongoose:-

We create a seperate folder for all schemas but we don't need to connect to database in each schema file since at the end they are called in the main index.js file.
Note: Model in mongoose == Collection in database

> /Models/Chat.js:-
koi random field jo schema me nhi thi but mere document/chat jo ham create kare hai schema se ,usse store nhi karega but ignore krdega collection also error message bhi nhi dega.

Initialise Database:

index.js -:

app.get("/chats", async (req,res) => {
let chats = await Chat.find(); 
// To get all the chats from the database and stored in form of an array in chats variable. Here await because find is an async fn which return promise, so we made callback async as well.
res.render("index.ejs", {chats});
})

/////////////////////////////////////////////////

>Middlewares: It is an intermediary

Middlewares in express are functions (normal Javascript functions or arrow fns) that come into play after the server receives the request and before the response is sent to the client. So express me jab ham middleware bolte ham ek function ki baat karre jo ek kaam perform krra response bhejne se pehle
 
Request ----> Middlewares ----> Response

Common middlewares functions:
. method-override -: to send put and delete requests to Backend through html forms
. bodyparser 
. express.urlencoded
. express.static 

We use app.use so that koi bhi request aaye (get,post,put etc..) iss middleware ko run kro.
But we can define middleware for specific requests , specific routes/conditions also.

In middlewares req, res object can be used anytime to access, like req.params , req.body.
Chaining or nesting of functions/ Middlewares is possible and can stop this anytime.

Middlewares chahe tho pehle hi response bhej de tho niche  api/requested route tak code jayega hi nhi wahi kaam ho jayega.

Our 1st Middleware

app.use ke andar middlewares likhte aur 2 arguments hote hai, if 2nd argument which is path is not specified then vo middleware works for all paths.

Middleware 2 kaam kar skta response bhejna ya next middleware call ie next operation ko perform krwana. Generally response ke liye nhi balki next next middleware call ie next operation ko perform krwana hi iska kaam. In dono me se kuch nhi krra tho page reload hote rahega with no response on frontend.

The next middleware fn is commonly denoted by a variable named next.
app.use((req,res,next) => {
 console.log("Hi");
 next();
 console.log()
}) 

if the current middleware fn does not end the request-response cycle by sending response, it must call next() to pass control to the next middleware ie ab  niche/aage likha hua code execute hoga. Aur ab ek baar response send ho jati aage koi matlab nhi chain breaks.

There are different types of middlewares such as Built-in middlewares which are already available in express which includes express.static, express.urlencoded etc . There are many third-party middlewares jinhe hame npm package ke form me install krna hota ex: 'Cookie-parser' to parse cookies , 'morgan' which is used to create loggers , 'CORS' which Allow or Restrict requested resources on web server .These are very well known middlewares.
 
Infact ham koi galat path pe bhi request bheje apne browser se tab bhi middleware run honge as usse bas request se matlab path ya type of request vo dekh hi nhi rha.

 
* Validations :-

Client side Validation / Form Validation:- When we enter data in the form, the browser and/or the web server will check to see that the data is in the correct format and within the constraints (exx: max-length if we set for title and price can't be negative) set by the application. This default of 'required'  implementation is browser dependent. So to make it common in all browsers we use bootstrap styling to make our website standardised and not using browser default validation. 
  
So go to Bootstrap -> Forms -> Validation 

Client side valodation me bas form me validation laga but agar koi postman/hoppscotch pe jake request bheje with empty request body then vo bhi add hone lagega so we need server side validation on our rest-apis.

Server side Validation:- Ensures db schema is followed to database and error handling to errors if arises on performing crud operations on database. So we add nonvalidate naam ka boolean attribute of Bootstrap in our form.

Success and Failure Text - valid-feedback and invalid-feedback are two classes in bootstrap to be added in our form .

We'll get an asynchronous error from database when someone sends request from postman  with invalid data format and as it will directly stored in the database so our database will return a Validation error and server stops. So we will create a middleware as:

app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
});

This middleware handles error.

* Wrap/Async:
It is a better alternative of try catch block to handle errors. Isme Validation error aane pe server stop nhi hota. Jab error acche se handle nhi ho pata tho crash hota server. So sabhi Rest apis routes me WrapAsync  krre taki error handle ho jaye aur server stop na ho.

Suppose Postman se kuch data bhejenge apne /listing wale post route pe 

* Schema Validations:

Har ek individual field ke liye nhi check krre apne routes me , kewal listing empty hone pr hi error message show hora user ko and in rest of the case listing will be stored in the database even if we missed to send capital or description in our listing when request is sent through postman with listing in its body.

To tackle this we have 2 options ,

app.post("/listings", wrapAsync (async(req, res, next) => {
if(!req.body.listing){
throw new ExpressError(400, "Send Valid-data for listing");
}
const newListing = new Listing(req.body.listing);
if (!newListing.title) {
  throw new ExpressError(400, "Title is missing!");
}

if (!newListing.description) {
  throw new ExpressError(400, "Description is missing!");
}

if (!newListing.location) {
  throw new ExpressError(400, "Location is missing!");
}
 await newListing.save();
    res.redirect("/listings");
  }) 
);

OR, Use a tool joi to validate our schema as by using above method if we have a lot of models ya  if we add more feilds ,it may become messy. Joi is an npm package so we need to install and require it. So joi ko use krke bhi schema define hoga aur ye hamare mongoose ke liye schema nhi hoga balki server side validation ke liye schema hoga. So we create a file schema.js.

* Create Reviews:-
After form is submitted we have 2 options either we can send '/reviews' as post request with our listing id in the req body or we can create a route  '/listings/:id/reviews'

Now Validations for reviews similarly to what we did for listings and also display reviews.

* Cookies: 

Uses: 
. Session Management :- When we add electronics items to our cart in Amazon website then it is not stored in database until we purchase it ,so if we go to any other page in that website let's suppose clothing page then website will not forget those items of electronics which i selected. This is possible due to cookies.

.Tracking : Target ads dikhana on the basis of our browsing to capture our interest.

Go to any Website -> Inspect -> Application -> We'll see different cookies jo vo website mere browser pe save krra.

.Cookies ko server send krta. In our 'res' object ek cookie naam ka method hota jisse ham data in the form of name-value pairs bhej skte server ko. Ek baar "/setcookies" route pe request bhejdia aur aapke browser me cookie aa gyi then ab kisi bhi route pe jao wo cookie rahegi.

ex:-
app.get("/setcookies", (req, res) => {
  res.cookie("greet", "namaste");
  res.cookie("origin", "India");
  res.send("We sent you a cookie!");
});

A session is an interaction between client and server.

Stateful Protocol: It require server to save the status and session information.
eg - ftp

Stateless Protocol: It does not require the server to retain the server information or
eg - http

* Express Sessions :- An npm package

A session id is created for any user who is using website and adding some items to the cart. It stores whatever user is doing in the website. This id is created by Express Sessions.  Express Session kewal session id ko bhejta client side ke browser me in the form of cookies and naki entire data bcoz only tiny bits of data can be stored in the form of a cookie. Iss data ko server side pe store karare bcoz https is a stateless protocol so  after adding some items to cart if we move to other page and not using Express Sessions then our website will forget history. We cant store the data for session id in database bcoz in database data is always stored permanently and hence we cant store any items unitl payment is done by user. So it is stored in a temporary storage.

Jab bhi ham session create krenge , current session ke liye tho current session ke liye hamare pass kuch na kuch secret hona chaiye. This is acheived using 'secret' option of Express sesssions.

Yeh session id ek signed cookie hoti hai which has a secret in the form of a long string or anything else.It should not be easily guessable.

Authentication : Verifying user using Signup and login
Authorization : Login krne ke baad usko kya kya karne ka access/permission dena , authorize krna. Ex: Bina login hue kisi bhi user ko listing create krna allow nhi hoga aur ham kisi aur ke listing ko delete nhi kr skte kewal apna hi edit/delete kr skte logib hone ke baad hi.

Password salting:
Password salting is a technique to protect passwords stored in databases by adding a
string of 32 or more characters and then hashing them.

* Passport : A library which helps in authentication for Node.js ,compatible in express.
 . Normal authentication with username and password using passport-local.
 . By using Sign up and login with google ,facebook etc jaise features website me apply krne me use krte
 .Can explore passportjs.org website to know more and npm official website for docs.
 .npm i passport
 .npm i passport-local
 .npm i passport-local-mongoose

 * Owner - Authorization of edit/delete of listing and reviews:
 . Add owner property in schema of listing and review

 router.get("/new", isLoggedIn, listingController.renderNewForm);
// isLoggedIn is used to authorize user ie if user is logged in or not. If user is found logged in then only new.ejs form renders to create a new listing.

// Merge Params is used so that listing id iss file tak pahuche aur app.js tak hi na reh jaye as without this hamara review add nhi hoga as req ki body me jo id aayi hai vo yha tak pahuch hi nhi rhi. so isse parent ka parameter child me merge hogya sab.
