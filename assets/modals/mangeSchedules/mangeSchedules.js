$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/mangeSchedules/mangeSchedules.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/modals.css">');

var manageSchedulesModal =  "<div class='overlay'>"+
                              "<div id='manageSchedulesModal' class='modal bigModal'>"+
                                "<h4 class='modal_title font-black'>Definir Horários dos Serviços <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                "<div id='modal_servicos_container'>"+
                                "</div>"+
                                "<div style='margin-top:1vw;'>"+
                                  "<button onclick='submitServiceSchedules();' class='confirm-btn'>Concluir</button>"+
                                "</div>"+
                              "</div>"+
                            "</div>";

function showManageSchedules (){
  $("body").append(manageSchedulesModal);
  drawServicosModal();
}

function drawServicosModal() {
  $("#modal_servicos_container").empty();
  var header =  "<div class='col_container' id='header'>"+
                    "<div class='col col_25'>"+
                      "Serviço"+
                    "</div>"+
                    "<div class='col col_25'>"+
                      "Agrupamento"+
                    "</div>"+
                    "<div class='col col_25'>"+
                      "Horário Início"+
                    "</div>"+
                    "<div class='col col_25'>"+
                      "Horário Fim"+
                    "</div>"+
                  "</div>";
  $("#modal_servicos_container").append(header);
  $("#modal_servicos_container").append("<div id='modal_servicos_list'></div>");
  servicos.forEach(function(servico, it) {    
    var div = "<div class='col_container line'>"+
                "<div class='col col_25'>"+
                  servico['servico'] +
                "</div>"+
                "<div class='col col_25'>"+ 
                  servico['agrupamento'] +
                "</div>"+
                "<div class='col col_25'>"+
                  "<input onchange='updateHoraIni("+it+")' id='ini"+it+"' type='time' value='"+servico['horario_ini'].substring(0, 5)+"'/>"+
                "</div>"+
                "<div class='col col_25'>"+
                  "<input onchange='updateHoraIni("+it+")' id='fim"+it+"' type='time' value='"+servico['horario_fim'].substring(0, 5)+"'/>"+
                "</div>"+
              "</div>";
    $("#modal_servicos_list").append(div);
  });
}

function updateHoraIni(it) {
  var servico_id = servicos[it]['id'];
  var servico_ini = $("#ini"+it).val();
  var servico_fim = $("#fim"+it).val();
  if(servico_ini.trim == ""){
    toastr("Defina o Horário de Início do Serviço");
    return;
  }
  if(servico_fim.trim == ""){
    toastr("Defina o Horário de Fim do Serviço");
    return;
  }
  addLoading();
  var fd = new FormData();
  fd.append('id', servico_id);
  fd.append('ini', servico_ini);
  fd.append('fim', servico_fim);
  var user = JSON.parse(sessionStorage.getItem('user'));
  fd.append('user', user['user']);
  $.ajax({
      type: "POST",
      url: "./api/servicos/updateSchedules.php",
      data: fd,
      processData: false,
      contentType: false,
      success:function(data){
        removeLoading();
      }
  });
}

function submitServiceSchedules() {
  getServicos();
  closeModal();
}

