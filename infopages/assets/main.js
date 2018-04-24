$(function(){

  $(window).scroll(function(){
     var scrolled = $(window).scrollTop();
      if (scrolled > 200) $('.back-to-top').fadeIn('slow');
      if (scrolled < 200) $('.back-to-top').fadeOut('slow');
  });
    
  $('.back-to-top').click(function () {
      $("html, body").animate({ scrollTop: "0" },  500);
  });
  
});