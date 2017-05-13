var deadline = 'July 9 2017 12:00:00 GMT+0200';
var fileName;
var picturePaths;
var coverWidth;
var pageCounter = 0;
var currentBook;
var currentBookLength;
var currentPicture = 0;
var currentAlbum;
var peopleList = [];
var currentPerson;
var currentPersonInfo = {
  name: '',
  spouse: '',
  life: '',
  married: ''
}

//Get all albums and books
$.get('/album', function(data) {
  picturePaths = data;
  bookCount = 1;
  albumCount = 1;
  for (var album in picturePaths.Albums) {
    $('.album-cover-wrapper').append('<div class="album-link"><span>' + album + '</span></div>');
    $('.album-link:nth-of-type(' + albumCount + ')').css('background-image', 'url("/Assets/Albums/' + album + '/' + picturePaths.Albums[album][0] + '")');
    albumCount++;
    picturePaths.Albums[album].forEach(function(picture, index) {
      if(picture.indexOf('back') > -1) {
        picturePaths.Albums[album].splice(index, 1);
      }
    });
    $('.albums .sidebar ul').append('<li>' + album + '      ' + picturePaths.Albums[album].length + ' photos <span>' + album + '</span></li>')
  }
  for (var book in picturePaths.Books) {
    $('.book-cover-wrapper').append('<div class="book-link-wrapper"><div class="book-link"><span>'+ book + '</span></div><span>' + book + '</span></div>');
    $('.book-link-wrapper:nth-of-type(' + bookCount + ') .book-link').css('background-image', 'url("/Assets/Books/' + book + '/cover.jpg")');
    $('.book-link-wrapper:nth-of-type(' + bookCount + ') .book-link').css('border', '1px solid black');
    bookCount++;
  }
  coverWidth = $(window).width();
  $('.book-link-wrapper').css('height', coverWidth * .15 * 1.5 + 'px');
  bookCount = 1;
  console.log(picturePaths);
});

//Gather all people from familyTree.json into an array for easier searching
function people(person) {
  peopleList.push({
    name: person.name,
    spouse: person.spouse,
    dob: person.dob,
    dod: person.dod,
    picture: person.picture,
    description: person.description
  });
  if (person.children) {
    person.children.forEach(function(child, index) {
      people(child);
    });
  }
}
$.getJSON('/Data/familyTree.json', function (data) {
  people(data);
  console.log(peopleList)
});

$('.tree-directions:not(.directions-open)').hover(
  function(){
    $(".directions-symbol-black").addClass("directions-symbol-active");  //Add the active class to the area is hovered
    $(".directions-symbol-white").removeClass("directions-symbol-active");
  }, function () {
    $(".directions-symbol-white").addClass("directions-symbol-active");
    $(".directions-symbol-black").removeClass("directions-symbol-active");
  }
);
$('.tree-directions').on('click', function() {
  $(this).toggleClass('directions-open');
  $('.tree-directions img').toggleClass('direction-symbol-hidden');
  $('.tree-directions li').toggleClass('directions-li-open');

});

// code for modal window containing specific people
$('#tree-container').on('click', '.node text', function() {
  var nodeText = $(this).text();
  peopleList.forEach(function(current, index) {
    if (current.name == nodeText) {
      currentPerson = current;
    }
  });
  $('.person-wrapper').prepend('<img class="person-picture" src="' + currentPerson.picture + '">');
  $('.text-wrapper').append('<p class="person-name">' + currentPerson.name +'</p>');
  $('.text-wrapper').append('<p class="person-dob"> D.O.B.: </p><p>' + currentPerson.dob + '</p>');
  if (currentPerson.dod) {
  $('.text-wrapper').append('<p class="person-dod"> D.O.D.: </p><p>' + currentPerson.dod + '</p>');
  }
  if (currentPerson.spouse) {
    $('.text-wrapper').append('<p class="person-spouse"> Married to: </p><p>' + currentPerson.spouse.name + 'on ' + currentPerson.spouse.married + '</p>');
  }
  $('.text-wrapper').append('<p class="person-description">' + currentPerson.description + '</p>');
  $('.person-displayer').show();
  $('#tree-container').hide();
});
$('.person-displayer').on('click', function () {
  $('.person-displayer').hide();
  $('.person-picture').remove();
  $('.text-wrapper').empty();
  $('#tree-container').show();
});

$('.person-displayer-exit').on('click', function() {
  $('.person-displayer').hide();
  $('.person-picture').remove();
  $('.text-wrapper').empty();
  $('#tree-container').show();
});

//code for album events

$('.album-cover-wrapper').on('click', '.album-link',function() {
  $('.album-cover-wrapper').empty();
  currentAlbum = $(this).children('span').text();
  for(var i = 1; i < 21; i++) {
    currentPicture = i;
    if (picturePaths.Albums[$(this).children('span').text()][currentPicture]) {
      $('.album-cover-wrapper').append('<div class="album-picture"></div>');
      $('.album-picture:nth-of-type(' + currentPicture + ')').css('background-image', 'url("/Assets/Albums/' + $(this).children('span').text() + '/' + picturePaths.Albums[$(this).children('span').text()][currentPicture - 1] + '")');
    }
  }
});
$('.albums .sidebar').on('click', 'li',function() {
  $('.album-cover-wrapper').empty();
  currentAlbum = $(this).children('span').text();
  // console.log(picturePaths.Albums[$(this).children('span').text()].length)
  for(var i = 0; i < 20; i++) {
    currentPicture = i;
    if (picturePaths.Albums[$(this).children('span').text()][currentPicture]) {
      $('.album-cover-wrapper').append('<div class="album-picture"></div>');
      $('.album-picture:nth-of-type(' + currentPicture + ')').css('background-image', 'url("/Assets/Albums/' + $(this).children('span').text() + '/' + picturePaths.Albums[$(this).children('span').text()][currentPicture] + '")');
    }
  }
});

$(window).on('scroll', function() {
  if ($('.album-picture').length) {
    if ($(document).height() - ($(window).scrollTop() + $(window).height()) < 20 ) {
      if (picturePaths.Albums[currentAlbum][currentPicture]) {
        for (var i = currentPicture; i < currentPicture + 20; i++) {
          console.log(i)
          console.log(picturePaths.Albums[currentAlbum][i])
          if(picturePaths.Albums[currentAlbum][i]) {
            console.log('yes')
            $('.album-cover-wrapper').append('<div class="album-picture"></div>');
            $('.album-picture:nth-of-type(' + i + ')').css('background-image', 'url("/Assets/Albums/' + currentAlbum + '/' + picturePaths.Albums[currentAlbum][i] + '")');
          }
        }
        currentPicture += 20;
      }
    }
  }
  });

$('.album-cover-wrapper').on('click', '.album-picture', function() {
  $('.picture-wrapper').empty();
  var clickedImageNext = $(this).css('background-image').slice(5, $(this).css('background-image').length - 6) + 'back.jpg';
  $('.picture-wrapper').append('<img class="front-of-image displayed-image" src="' + $(this).css('background-image').slice(5, $(this).css('background-image').length - 2) + '">');
  $('.displayed-image').on('load', function() {
    $('.displayed-image').css('top', 'calc(50% - ' + $('.displayed-image').height() / 2 +'px)');
    $('.displayed-image').css('left', 'calc(50% - ' + $('.displayed-image').width() / 2 +'px)');
  });
  $('.album-cover-wrapper').hide();
  $('.picture-displayer').show();
  $('.picture-displayer').css('opacity', '1');

  $('.picture-wrapper').on('click', '.front-of-image', function () {
    $('.picture-wrapper').empty();
    $('.picture-wrapper').append('<img class="back-of-image displayed-image" src="' + clickedImageNext + '">');
    $('.displayed-image').on('load', function() {
      $('.displayed-image').css('top', 'calc(50% - ' + $('.displayed-image').height() / 2 +'px)');
      $('.displayed-image').css('left', 'calc(50% - ' + $('.displayed-image').width() / 2 +'px)');
    });
  });
  $('.picture-wrapper').on('click', '.back-of-image', function () {
    console.log(clickedImageNext.slice(0, clickedImageNext.length - 8));
    $('.picture-wrapper').empty();
    $('.picture-wrapper').append('<img class="front-of-image displayed-image" src="' + clickedImageNext.slice(0, clickedImageNext.length - 8) + '.jpg">');
    $('.displayed-image').on('load', function() {
      $('.displayed-image').css('top', 'calc(50% - ' + $('.displayed-image').height() / 2 +'px)');
      $('.displayed-image').css('left', 'calc(50% - ' + $('.displayed-image').width() / 2 +'px)');
    });
  });
});

$('.picture-displayer').on('click', ':not(.picture-wrapper)', function () {
  $('.picture-displayer').css('opacity', '0');
  setTimeout(function() {
    $('.picture-displayer').hide();
  }, 1000);
  $('.album-cover-wrapper').show();
});

$('.picture-displayer-exit').on('click', function() {
  $('.picture-displayer').css('opacity', '0');
  setTimeout(function() {
    $('.picture-displayer').hide();
  }, 1000);
  $('.album-cover-wrapper').show();
});

//Events regarding Books

$(window).on('resize', function() {
  coverWidth = $(window).width();
  $('.book-link-wrapper').css('height', coverWidth / 6 + 'px');
  $('.book-link-wrapper').css('height', coverWidth * .15 * 1.5 + 'px');
});
$('.book-cover-wrapper').on('click', '.book-link',function() {
  currentBook = $(this).find('span').text();
  currentBookLength = picturePaths.Books[$(this).find('span').text()].length
  console.log(currentBook);
  console.log(currentBookLength);
  $('section').hide();
  $('.book-displayer .sidebar ul').empty();
  for (var chapter in Books[currentBook]) {
    $('.book-displayer .sidebar ul').append('<li>' + chapter + '</li>');
  }
  $('.book-displayer .sidebar ul').css('margin-top', 'calc(' + $('.book-displayer .sidebar').height() / 2 + 'px - ' + $('.book-displayer .sidebar ul').height() / 2 +'px)');
  $('.book-displayer').show();
  $('.book-displayer').css('opacity', '1');
  $('.left-page').css('visibility', 'hidden');
  $('.right-page').css('visibility', 'hidden');
  $('.left-page').append('<img class="book-page" src="/Assets/Books/' + $(this).find('span').text() + '/cover.jpg">');
  $('.right-page').append('<img class="book-page" src="/Assets/Books/' + $(this).find('span').text() + '/page1.jpg">');
  $('.left-page .book-page').on('load', function() {
    $('.left-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.left-page .book-page').height() / 2 +'px)');
    $('.left-page .book-page').css('visibility', 'visible');
  });
  $('.right-page .book-page').on('load', function() {
    $('.right-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.right-page .book-page').height() / 2 +'px)');
    $('.right-page .book-page').css('visibility', 'visible');
  });
});

$('.book-displayer .sidebar').on('click', 'li', function() {
  var clickedChapter = $(this).text();
  $('.left-page').empty();
  $('.right-page').empty();
  pageCounter = Books[currentBook][clickedChapter];
  console.log(pageCounter);
  $('.left-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][Books[currentBook][clickedChapter]] + '">');
  $('.right-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][pageCounter + 1] + '">');
  $('.left-page .book-page').on('load', function() {
    $('.left-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.left-page .book-page').height() / 2 +'px)');
    $('.left-page .book-page').css('visibility', 'visible');
  });
  $('.right-page .book-page').on('load', function() {
    $('.right-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.right-page .book-page').height() / 2 +'px)');
    $('.right-page .book-page').css('visibility', 'visible');
  });
});

$('.right-changer').on('click', function() {
  $('.left-page').empty();
  $('.right-page').empty();
  if (pageCounter < currentBookLength - 1){
    pageCounter++;
  } else {
    pageCounter = 0;
  }
  $('.left-page').css('visibility', 'hidden');
  $('.right-page').css('visibility', 'hidden');
  $('.left-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][pageCounter] + '">');
  if (pageCounter === currentBookLength - 1) {
    $('.right-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][0] + '">');
  } else {
    $('.right-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][pageCounter + 1] + '">');
  }
  $('.left-page .book-page').on('load', function() {
    $('.left-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.left-page .book-page').height() / 2 +'px)');
    $('.left-page .book-page').css('visibility', 'visible');
  });
  $('.right-page .book-page').on('load', function() {
    $('.right-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.right-page .book-page').height() / 2 +'px)');
    $('.right-page .book-page').css('visibility', 'visible');
  });
});
$('.left-changer').on('click', function() {
  $('.left-page').empty();
  $('.right-page').empty();
  if (pageCounter > 0){
    pageCounter--;
  } else {
    pageCounter = currentBookLength - 1;
  }
  $('.left-page').css('visibility', 'hidden');
  $('.right-page').css('visibility', 'hidden');
  $('.left-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][pageCounter] + '">');
  if (pageCounter === currentBookLength - 1) {
    $('.right-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][0] + '">');
  } else {
    $('.right-page').append('<img class="book-page" src="/Assets/Books/' + currentBook + '/' + picturePaths.Books[currentBook][pageCounter + 1] + '">');
  }
  $('.left-page .book-page').on('load', function() {
    $('.left-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.left-page .book-page').height() / 2 +'px)');
    $('.left-page .book-page').css('visibility', 'visible');
  });
  $('.right-page .book-page').on('load', function() {
    $('.right-page .book-page').css('margin-top', 'calc(' + $('.left-page').height() / 2 + 'px - ' + $('.right-page .book-page').height() / 2 +'px)');
    $('.right-page .book-page').css('visibility', 'visible');
  });
});

$('.book-displayer-exit').on('click', function() {
  $('.book-displayer').css('opacity', 0);
  setTimeout(function() {
    $('.book-displayer').hide();
  }, 500);
  $('.left-page').empty();
  $('.right-page').empty();
  $('.books').show();
  pageCounter = 0;
});
$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) {
      if($('.book-displayer').css('display') === 'block') {
        $('.book-displayer').css('opacity', 0);
        setTimeout(function() {
          $('.book-displayer').hide();
        }, 500);
        $('.left-page').empty();
        $('.right-page').empty();
        $('.books').show();
        pageCounter = 0;
      } else if ($('.picture-displayer').css('display') === 'block'){
        $('.picture-displayer').css('opacity', '0');
        setTimeout(function() {
          $('.picture-displayer').hide();
        }, 1000);
        $('.album-cover-wrapper').show();
      } else {
        $('.person-displayer').hide();
        $('.person-picture').remove();
        $('.text-wrapper').empty();
        $('#tree-container').show();
      }
    }
});
// function getTimeRemaining(endtime){
//   var t = Date.parse(endtime) - Date.parse(new Date());
//   var seconds = Math.floor( (t/1000) % 60 );
//   var minutes = Math.floor( (t/1000/60) % 60 );
//   var hours = Math.floor( (t/(1000*60*60)) % 24 );
//   var days = Math.floor( t/(1000*60*60*24) );
//   return {
//     'total': t,
//     'days': days,
//     'hours': hours,
//     'minutes': minutes,
//     'seconds': seconds
//   };
// }
// function initializeClock(id, endtime){
//   var timeinterval = setInterval(function(){
//     var t = getTimeRemaining(endtime);
//     $('.countdown span').text('The Krueger Family Picnic is in ' + t.days + ' days, ' + t.hours + ' hours, ' + t.minutes + ' minutes, and ' + t.seconds + ' seconds.')
//     if(t.total<=0){
//       clearInterval(timeinterval);
//     }
//   },1000);
// }
// initializeClock("clock", deadline);

$('.email-attachment-cover').on('click', function(e) {
  e.preventDefault();
  $('.email-attachment').click();
});
$('.person-email-attachment-cover').on('click', function(e) {
  e.preventDefault();
  $('.person-email-attachment').click();
});
$('.email-attachment').on('change', function(e) {
  fileName = e.target.files[0].name;
});
$('.share-story').on('click', function() {
  if ($('.contact-me').hasClass('contact-active')) {
    $('.contact-me').css('height', '0px');
    $('.contact-me').css('padding-top', '0px');
    $('.contact-me').css('padding-bottom', '0px');
  } else {
    $('.contact-me').css('height', '520px');
    $('.contact-me').css('padding-top', '50px');
    $('.contact-me').css('padding-bottom', '50px');
  }
  $('.contact-me').toggleClass('contact-active');
});
$('.share-person').on('click', function() {
  if ($('.submit-person').hasClass('submit-person-active')) {
    $('.submit-person').css('height', '0px');
    $('.submit-person').css('padding-top', '0px');
    $('.submit-person').css('padding-bottom', '0px');
  } else {
    $('.submit-person').css('height', '1200px');
    $('.submit-person').css('padding-top', '50px');
    $('.submit-person').css('padding-bottom', '50px');
  }
  $('.submit-person').toggleClass('submit-person-active');
});
$('.slideshow').slick({
  autoplay: true,
  arrows: false
});
