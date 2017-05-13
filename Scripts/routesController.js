var controller = {};
controller.home = function () {
  $('section').hide();
  $('header').css('margin-top', '-125px');
  $('.home').show();
};
controller.section = function(ctx, next) {
  var clickedSection = ctx.params.section;
  $('section').hide();
  $('header').css('margin-top', '-75px');
  $('.' + clickedSection).show();
}
