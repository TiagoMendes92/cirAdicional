$('head').append('<link rel="stylesheet" type="text/css" href="./assets/toastr/toastr.css">');

animationOnCourse = false;
function toastr(message, type){
  if(!animationOnCourse){
    var div = "<div class='col_container toaster"+(type == 'error' ? ' error' : ' success')+"'>"+
              "<div class='col toastr_icon' style='vertical-align: middle'>"+
                "<i style='color:white;' class='fa fa-times-circle'></i>"+
              "</div>"+
              "<div class='col' style='width:calc(100% - 50px); color:white; vertical-align: middle;'>"+
                "<span>"+message+"</span>"+
              "</div>"+
            "</div>";
   $("body").append(div);
    animationOnCourse = true;
    $(".toaster").animate({bottom:'5px'}, 500);
    setTimeout(function() {
      $(".toaster").animate({bottom:'-95px'}, 500, function(){
        $(".toaster").remove();
        animationOnCourse = false;
      });
    }, 3000);
  }
}
