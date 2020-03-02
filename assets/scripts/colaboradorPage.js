var num_mec;
var episodios = [];
function checkUser(){
  var url = new URL(window.location.href);
  var nmec = url.searchParams.get("n_mec");
  if(nmec == null){
    $("#user").css("display","none");
    $("#nenhum_user").css("display","block");
  } else {
    num_mec = nmec;
    $('#monthPicker').datepicker({
      changeMonth: true,
      changeYear: true,
      showButtonPanel: true,
      dateFormat: 'MM yy',
    }).focus(function() {
      var thisCalendar = $(this);
      $('.ui-datepicker-calendar').detach();
      $('.ui-datepicker-close').text("Escolher");
      $('.ui-datepicker-close').click(function() {
        var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
        var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
        thisCalendar.datepicker('setDate', new Date(year, month, 1));
        var realMonth = parseInt(month);
        month = parseInt(month) + 1;
        month = month.toString();
        if(month.length == 1){
          month = '0'+ month;
        }
        var date = year + "-" + month;
        var beginDate = date + '-01';
        var startDate = moment([year, realMonth]);
        var endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
        searchEpisodios(beginDate, endDate);
      });
    }); 
    var startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    var endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');
    var default_date = new Date();
    $("#monthPicker").datepicker("setDate", default_date);
    searchEpisodios(startOfMonth, endOfMonth);  
  }
}

function searchEpisodios(start, end) {
  addLoading();
  var fd = new FormData();
  fd.append('startDate', start);
  fd.append('endDate', end);
  fd.append('n_mec', num_mec);
  $.ajax({
      type: "POST",
      url: "./api/episodios/searchEpisodiosColaborador.php",
      data: fd,
      processData: false,
      contentType: false,
      success:function(data){
        removeLoading();
        episodios = JSON.parse(data);
        drawEpisodios();
      }
  }); 
}

function drawEpisodios() {
  $("#episodio_table_body").empty();
  if(episodios.length > 0){
    episodios.forEach(episodio => {
      var div = "<div class='episodio'>"+
                  "<div style='width:60%'><div class='innerCell'>"+episodio['num_processo']+"</div></div>"+
                  "<div style='width:20%'><div class='innerCell'>"+episodio['dta_cirurgia']+"</div></div>"+
                  "<div style='width:20%'><div class='innerCell'>"+getValor(episodio)+"</div></div>"+
                "</div>";     
      $("#episodio_table_body").append(div);
    });
    calcTotal();
    $("#total").css("display", "table");
  } else {
    var div ="<div class='zeroResults'>Nenhum Resultado</div>";
    $("#episodio_table_body").append(div);
    $("#total").css("display", "none");
  }
}

function getValor(episodio) {
  var percInterveniente = episodio['perc'];
  var percGDH = episodio['gdhOBJ']['perc'];
  var valor = episodio['gdhOBJ']['v_uni'];
  var valorGDH = (Number(valor) * Number(percGDH) / 100);
  var valorInterveniente = (Number(valorGDH) * Number(percInterveniente) / 100);
  return valorInterveniente.toFixed(2) + " €";
}

function calcTotal(){
  var total = 0;
  episodios.forEach(episodio => {
    var percInterveniente = episodio['perc'];
    var percGDH = episodio['gdhOBJ']['perc'];
    var valor = episodio['gdhOBJ']['v_uni'];
    var valorGDH = (Number(valor) * Number(percGDH) / 100);
    var valorInterveniente = (Number(valorGDH) * Number(percInterveniente) / 100);
    total += valorInterveniente;
  });
  total = total.toFixed(2);
  $("#totalLbl").text(total + " €");
}
