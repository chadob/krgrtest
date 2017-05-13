var requestProxy = require('express-request-proxy'),
  express = require('express'),
  nodemailer = require('nodemailer'),
  multer = require('multer'),
  fs = require('fs'),
  upload = multer(),
  port = process.env.PORT || 3000,
  app = express(),
  path = require('path');


//function to get all directories in a directory
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

//code to create a object that contains all album and book paths
var albumList = getDirectories('./Assets/Albums');
var bookList = getDirectories('./Assets/Books');
var imgSourceList = {Albums: {}, Books: {}};
albumList.forEach(function (album) {
  imgSourceList.Albums[album] = {};
});
bookList.forEach(function (book) {
  imgSourceList.Books[book] = {};
});
for (var property in imgSourceList) {
  if (imgSourceList.hasOwnProperty(property)) {
    for (var directory in imgSourceList[property]) {
      if (imgSourceList[property].hasOwnProperty(directory)) {
        imgSourceList[property][directory] = fs.readdirSync('./Assets/' + property + '/' + directory);
      }
    }
  }
}

app.use(express.static('./'));
app.get('/album', function(request, response) {
  response.send(imgSourceList);
});
//initializes the home page
app.get('/*', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});
app.get('/Assets', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('Assets', { root: '.' });
});
//gives a route for emails to go down
app.post('/contact', upload.single('file'), function (req, res) {
  console.log(req.body);
  var mailOpts, smtpTrans, attachment;
  if (req.file) {
    attachmentName = req.file.originalname;
    attachmentContent = req.file.buffer;
  } else {
    attachmentName = '';
    attachmentContent = '';
  }
  //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
  // smtpTrans = nodemailer.createTransport('smtps://krgrfamily@gmail.com:bobandjeans@smtp.gmail.com');
  //Mail options
  mailOptions = {
      from: req.body.name + ' <' + 'krgrfamily@gmail.com' + '>', //grab form data from the request body object
      to: 'krgrfamily@gmail.com',
      subject: 'Website contact form',
      text: req.body.email + ' ' + req.body.message,
      attachments: [
        {
          filename: '' + attachmentName,
          content: attachmentContent
        }
      ]
  };
  smtpTrans.sendMail(mailOptions, function (error, response) {
      //Email not sent
      if (error) {
        console.log(error);
          res.sendRedirect
          // res.end('There was a problem with your message. Please try again. If this problem persists, email me at krgrfamily@gmail.com');
      }
      //Yay!! Email sent
      else {
        console.log('worked');
          // res.end('Your message was sent. Thank You!');
      }
      res.redirect('/');
  });
});
app.post('/submit', upload.single('file'), function (req, res) {
  console.log(req.body);
  var mailOpts, smtpTrans, attachment;
  if (req.file) {
    attachmentName = req.file.originalname;
    attachmentContent = req.file.buffer;
  } else {
    attachmentName = '';
    attachmentContent = '';
  }
  //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
  // smtpTrans = nodemailer.createTransport('smtps://krgrfamily@gmail.com:bobandjeans@smtp.gmail.com');
  //Mail options
  mailOptions = {
      from: req.body.email + ' <' + 'krgrfamily@gmail.com' + '>', //grab form data from the request body object
      to: 'krgrfamily@gmail.com',
      subject: 'Website person form',
      text:  'NAME: ' + req.body.personName + ', D.O.B: ' + req.body.personBirth + ', D.O.D: ' + req.body.personDeath + ', CHILDREN: ' + req.body.personChildren + ', DESCRIPTION: ' + req.body.personDescription + ', SPOUSE: ' + req.body.personSpouse + ', MARRIED ON: ' + req.body.personMarried + ', ' + req.body.message,
      attachments: [
        {
          filename: '' + attachmentName,
          content: attachmentContent
        }
      ]
  };
  smtpTrans.sendMail(mailOptions, function (error, response) {
      //Email not sent
      if (error) {
        console.log(error);
          res.sendRedirect
          // res.end('There was a problem with your message. Please try again. If this problem persists, email me at krgrfamily@gmail.com');
      }
      //Yay!! Email sent
      else {
        console.log('worked');
          // res.end('Your message was sent. Thank You!');
      }
      res.redirect('/');
  });
});


app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});
