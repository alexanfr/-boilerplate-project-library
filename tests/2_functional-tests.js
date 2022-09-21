/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       if(!res.body[0]) {
  //         done();
  //       }
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let bookId = '';

    suite('POST /api/books with title => create book object/expect book object', function() {
      this.timeout(10000);

      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({
            title: 'The Crown'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            bookId = res.body._id;
            assert.equal(res.body.title, 'The Crown');
            setTimeout(done, 5000);
          });

      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            setTimeout(done, 5000);
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      this.timeout(6000);
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'it is an array');
            setTimeout(done, 5000);
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      this.timeout(6000);
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/632a67502c808d99543c3844')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            setTimeout(done, 5000);
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get('/api/books/' + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'The Crown');
            setTimeout(done, 5000);
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      this.timeout(15000);
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post('/api/books/' + bookId)
          .send({
            comment: 'test comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.comments[0], 'test comment');
            setTimeout(done, 5000);
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post('/api/books' + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 404);
            setTimeout(done, 5000);
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post('/api/books/invalidID')
          .send({
            comment: 'test comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            setTimeout(done, 5000);
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      this.timeout(10000);
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete('/api/books/' + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text,  'delete successful')
            setTimeout(done, 5000);
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .delete('/api/books/invalidID')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            setTimeout(done, 5000);
          });
      });

    });

  });

});
