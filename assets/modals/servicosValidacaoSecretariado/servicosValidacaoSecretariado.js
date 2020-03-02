$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/servicosValidacaoSecretariado/servicosValidacaoSecretariado.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/modals.css">');

var servicosValidacaoSecretariadoModal =  "<div class='overlay'>"+
                                            "<div id='servicosValidacaoSecretariado' class='modal bigModal'>"+
                                              "<h4 class='modal_title font-black'>Gestão de Serviços que precisam de dupla verificação <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                              "<div class='col_container'>"+
                                                "<div class='col col_50 servicos_list_col' style='border-right: 1px solid black'>"+
                                                  "<section>"+
                                                    "<span><b>Serviços validados pelo secretariado clínico</b></span>"+
                                                  "</section>"+
                                                  "<div id='servicos_uma_validacao'>"+
                                                  "</div>"+
                                                "</div>"+
                                                "<div class='col col_50 servicos_list_col'>"+
                                                  "<section>"+
                                                    "<span><b>Serviços validados pelo secretariado</b></span>"+
                                                  "</section>"+
                                                  "<div id='servicos_duas_validacao'>"+
                                                  "</div>"+
                                                "</div>"+
                                              "</div>"+
                                              "<div style='margin-top:1vw;'>"+
                                                "<button onclick='closeModal();' class='confirm-btn'>Concluir</button>"+
                                              "</div>"+
                                            "</div>"+
                                          "</div>";

function showServicosValidacaoSecretariado(){
  $("body").append(servicosValidacaoSecretariadoModal);
  drawServicosNoTipoDeValidacao(servicos);
}

function drawServicosNoTipoDeValidacao(servicos){
  $("#servicos_duas_validacao").empty();
  $("#servicos_uma_validacao").empty();
  servicos.forEach(function(servico, it) {
    if(servico['dupla_validacao_equipa'] == '1'){
      $("#servicos_duas_validacao").append("<div class='service_unit'><i class='tooltip_container fas fa-arrow-circle-left' onmouseover='showTooltip(this)' onmouseout='hideTooltips()' onclick='markAsValidatedBySecretariadoClinico("+it+")'><div class='tooltip left_tooltip'>Adicionar aos serviços validados pelo secretariado clínico.</div></i> "+servico.servico+"</div>");
    } else {
      $("#servicos_uma_validacao").append("<div class='service_unit'>"+servico.servico+" <i class='tooltip_container fas fa-arrow-circle-right' onmouseover='showTooltip(this)' onmouseout='hideTooltips()' onclick='markAsValidatedBySecretariado("+it+")'><div class='tooltip right_tooltip'>Adicionar aos serviços validados pelo secretariado.</div></i></div>");
    }
  });
}

function markAsValidatedBySecretariadoClinico(it) {
  var servico = servicos[it];
  var id = servico['id'];
  addLoading();
  var fd = new FormData();
  fd.append('id', id);
  var user = JSON.parse(sessionStorage.getItem('user'));
  fd.append('user', user['user']);
  $.ajax({
      type: "POST",
      url: "./api/servicos/markAsValidatedBySecretariadoClinico.php",
      data: fd,
      processData: false,
      contentType: false,
      success:function(data){
        var answer = JSON.parse(data);
        if(answer == 'success'){
          reGetServicos();
        } else {
          toastr("Erro ao passar serviço para validação pelo secretariado clínico", "error");
        }
      }
  });
}


function markAsValidatedBySecretariado (it) {
  var servico = servicos[it];
  var id = servico['id'];
  addLoading();
  var fd = new FormData();
  fd.append('id', id);
  var user = JSON.parse(sessionStorage.getItem('user'));
  fd.append('user', user['user']);
  $.ajax({
      type: "POST",
      url: "./api/servicos/markAsValidatedBySecretariado.php",
      data: fd,
      processData: false,
      contentType: false,
      success:function(data){
        var answer = JSON.parse(data);
        if(answer == 'success'){
          reGetServicos();
        } else {
          toastr("Erro ao passar serviço para validação pelo secretariado", "error");
        }
      }
  });
}

function reGetServicos() {
  $.ajax({
    type: "GET",
    url: "./api/servicos/getServicos.php",
    processData: false,
    contentType: false,
    success:function(data){
      servicos = JSON.parse(data);
      drawServicosNoTipoDeValidacao(servicos);
      removeLoading(); 
    }
});
}