// require express and other modules
const express = require('express');
const app = express();
// Express Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Set Static File Directory
app.use(express.static(__dirname + '/public'));
/************
 * DATABASE *
 ************/

const db = require('./models');
const BookModel = db.books;

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', (req, res) => {
  // TODO: Document all your api endpoints below as a simple hardcoded JSON object.
  res.json({
    message: 'Welcome to my app api!',
    documentationUrl: '', //leave this also blank for the first exercise
    baseUrl: '', //leave this blank for the first exercise
    endpoints: [
      { method: 'GET', path: '/api', description: 'Describes all available endpoints' },
      { method: 'GET', path: '/api/profile', description: 'Data about me' },
      { method: 'GET', path: '/api/books/', description: 'Get All books information' },
      { method: 'POST', path: '/api/books/', description: 'Creates a book with the given body.' },
      { method: 'PUT', path: '/api/books/:id', description: 'Edits the book with the new value which has the id query parameter id.' },
      { method: 'DELETE', path: '/api/books/:id', description: 'Deletes the book with the id query parameter id.' },
      // TODO: Write other API end-points description here like above
    ]
  })
});
// TODO:  Fill the values
app.get('/api/profile', (req, res) => {
  res.json({
    'name': 'Alexander Supertramp',
    'homeCountry': 'USA',
    'degreeProgram': 'Physics',//informatics or CSE.. etc
    'email': 'chrissupertramp@mail.me',
    'deployedURLLink': '',//leave this blank for the first exercise
    'apiDocumentationURL': '', //leave this also blank for the first exercise
    'currentCity': 'Alaska',
    'hobbies': ["Hiking", "Camping", "Chess"]
  })
});
/*
 * Get All books information
 */
app.get('/api/books/', (req, res) => {
  /*
   * use the books model and query to mongo database to get all objects
   */
  db.books.find({}, function (err, books) {
    if (err) throw err;
    /*
     * return the object as array of json values
     */
    res.json(books);
  });
});
/*
 * Add a book information into database
 */
app.post('/api/books/', (req, res) => {

  /*
   * New Book information in req.body
   */
  console.log(req.body);
  /*
   * TODO: use the books model and create a new object
   * with the information in req.body
   */
  /*
   * return the new book information object as json
   */

  BookModel.create(req.body, (err, instance) => {
    if (err) return null;
    res.json(instance);
  });
});

/*
 * Update a book information based upon the specified ID
 */
app.put('/api/books/:id', (req, res) => {
  /*
   * Get the book ID and new information of book from the request parameters
   */
  const bookId = req.params.id;
  const bookNewData = req.body;
  console.log(`book ID = ${bookId} \n Book Data = ${bookNewData}`);

  /*
   * TODO: use the books model and find using the bookId and update the book information
   */
  /*
   * Send the updated book information as a JSON object
   */
  let updatedBookInfo = {};
  BookModel.findOneAndUpdate({_id: bookId}, bookNewData, { useFindAndModify: false, new: true }).then((ret)=>{
    res.json(ret);
  }).catch(e => {
    handleError(e);
  });
});
/*
 * Delete a book based upon the specified ID
 */
app.delete('/api/books/:id', (req, res) => {
  /*
   * Get the book ID of book from the request parameters
   */
  const bookId = req.params.id;
  /*
   * TODO: use the books model and find using
   * the bookId and delete the book
   */
  /*
   * Send the deleted book information as a JSON object
   */
  BookModel.findByIdAndDelete(bookId, { useFindAndModify: false }, function (err, deletedBook) {
    if (err) {
      handleError(err);
      res.status(403).send();
    } else {
      res.json(deletedBook);
    }
  });
});


/**********
 * HELPERS *
 **********/
var handleError = function (err) {
  console.log(err);
}

/**********
 * SERVER *
 **********/

// listen on the port 3000
app.listen(process.env.PORT || 80, () => {
  console.log('Express server is up and running on http://localhost:80/');
});
