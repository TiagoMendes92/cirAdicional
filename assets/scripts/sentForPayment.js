var episodios;
var n_mec;
function loadEpisodios() {
  addLoading();

  var url = new URL(location.href);
  n_mec = url.searchParams.get("nmec");
  if(n_mec == null || (n_mec != 'CA' && n_mec != 'RH')){
    alert("Zona de acesso restrito");
    location.replace("http://localhost/CirurgiaAdicional-repo");
    return;
  }
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

function searchEpisodios(start, end) {
  var fd = new FormData();
  fd.append('estados', JSON.stringify([3,4]));
  fd.append('dataCirurgiaInicio', start);
  fd.append('dataCirurgiaFim', end);
  $.ajax({
      type: "POST",
      url: "./api/episodios/searchEpisodiosEnviadosPaga.php",
      data: fd,
      processData: false,
      contentType: false,
      success:function(data){
          episodios = JSON.parse(data);
          getServicos();
      }
  }); 
}

var servicos;
var allServices;
var gdhs;
var blocos;
function getServicos(){
  $.ajax({
      type: "GET",
      url: "./api/servicos/getServicos.php",
      processData: false,
      contentType: false,
      success:function(data){
        allServices = JSON.parse(data);
        servicos = JSON.parse(data);
        $.ajax({
          type: "GET",
          url: "./api/blocos/getBlocos.php",
          processData: false,
          contentType: false,
          success:function(data2){
            blocos = JSON.parse(data2);
            $.ajax({
              type: "GET",
              url: "./api/gdh/getAllGDHs.php",
              processData: false,
              contentType: false,
              success:function(data3){
                gdhs = JSON.parse(data3);
                groupEpisodiosByServico();
                removeLoading();
              }
            });
          }
        });
      }
  });
}

var groupedByService = [];
function groupEpisodiosByServico() {
  servicos.forEach(function (servico) {
    servico['episodios'] = [];  
  });
  episodios.forEach(function (episodio) {
    var servicoEpisodio = episodio['servico'];
    for (let it = 0; it < servicos.length; it++) {
      const servico = servicos[it];
      if(servico['id'] == servicoEpisodio){
        servico['episodios'].push(episodio);
        break;
      }
    }
  });
  calcServicesValues();
}

//desenha servicos CA
function drawEpisodiosServicoCA(){
  $("#pageBody_tableBody").empty();
  if(servicos.length > 0){
    servicos.forEach(function(servico, it) {
      var div = "<div id='servico_"+it+"' style='display: table; width:100%; table-layout:fixed; margin-bottom: 15px;'>"+
                  "<div style='display:table-cell; width: 5%; vertical-align: middle'>";
                  if(servico['valorPorValidar'] != 0){   
              div+= "<label class='container costumHeight' style='transform: translateY(-.5vw)'>"+
                      "<input onclick='checkIfSelectAll_services("+it+")' id='sel_service"+it+"' class='sel_service' type='checkbox'>"+
                      "<span class='checkmark costumCheck'></span>"+
                    "</label>";
                  }
          div += "</div>"+
                  "<div style='width:60%; background:white; display: table-cell; vertical-align: middle'>"+
                    "<div>"+
                      servico.servico+
                    "</div>"+
                  "</div>"+
                  "<div class='service_unit' style='width:20%;'>"+
                    "<div style='display:block; width: calc(100% - 30px); margin-left: 15px;' class='service_unit_interior'>";
                    if(servico['valorPorValidar'] != 0){
                div += "<p style='padding: 5px; margin-left: 5px; margin: 0;' class='numericValue'>"+servico['valorPorValidar'].toFixed(2)+" €</p>";
                    } 
                    if(servico['valorValidado'] != 0){
                div += "<p style='color:green; padding: 5px; margin-left: 5px; margin: 0;' class='numericValue'>"+servico['valorValidado'].toFixed(2)+" €</p>";
                    } 
                    if(servico['valorRejeitado'] != 0){
                div += "<p style='color:red; padding: 5px; margin-left: 5px; margin: 0;' class='numericValue'>"+servico['valorRejeitado'].toFixed(2)+" €</p>";
                    } 
            div += "</div>"+
                  "</div>"+
                  "<div style='display:inline-flex' class='col_15'>"+
                    "<div style='display:block'>";
                    if(servico['valorPorValidar'] != 0){
                div += "<p style='padding: 5px; margin-left: 5px; cursor:pointer; margin: 0;' onclick='openValidationModal("+it+")'><i class='fas fa-ellipsis-h toValidate'></i> <i style='color:blue' class='fas fa-pencil-alt'></i></p>";
                    }
                    if(servico['valorValidado'] != 0){
                div += "<p style='color:green; padding: 5px; margin-left: 5px; cursor:pointer; margin: 0;'><i class='fas fa-check-circle otherIcon'></i></p>";
                    } 
                    if(servico['valorRejeitado'] != 0){
                div += "<p style='color:red; padding: 5px; margin-left: 5px; cursor:pointer; margin: 0;' onclick='openValidationModal("+it+")'><i class='fas fa-times-circle otherIcon'></i></p>";
                    } 
          div +=    "</div>"+
                  "</div>"+
                "</div>";
      
      $("#pageBody_tableBody").append(div);
    });
  } else {
    $("#pageBody_tableBody").append("<div class='service_unit_interior' style='width:100%;'>Nenhum serviço com espisódios neste mês</div>");
  }
}

//check if sell All is selected onclick on specific service
function checkIfSelectAll_services(it){
  if($("#sellAllServices").is(':checked')){
    if(!$("#sel_service"+it).is(':checked')){
        $("#sellAllServices").prop('checked', false);
    }
  }
}

// select all services
function selectAllServicesToApprove(){
  if($("#sellAllServices").is(":checked")){
      $(".sel_service").prop('checked', true);
  } else {
      $(".sel_service").prop('checked', false);
  }
}

// calc values to pay  per service
function calcServicesValues() {
  servicos.forEach(function(servico) {
    var valorPorValidar = 0;  
    var valorValidado = 0;
    var valorRejeitado = 0;  
    servico['episodios'].forEach(function (episodio) {
      var gdh2 = episodio['gdh2'];
      if(gdh2 == null){
          var gdh1 = episodio['gdh1'];
          var targetGDH1;
          for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
            if(gdh1 == gdh['id']){
                targetGDH1 = gdh;
                break;
            }
          }
          if(episodio['pago'] == '0'){
              valorPorValidar += (Number(targetGDH1['v_uni']) * Number(targetGDH1['perc']) / 100);
          } else if(episodio['pago'] == '1'){
              valorValidado += (Number(targetGDH1['v_uni']) * Number(targetGDH1['perc']) / 100);
          } else {
              valorRejeitado += (Number(targetGDH1['v_uni']) * Number(targetGDH1['perc']) / 100);
          }
      } else {
          var targetGDH2;
          for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
          if(gdh2 == gdh['id']){
              targetGDH2 = gdh;
              break;
          }
          }
          if(episodio['pago'] == '0'){
              valorPorValidar += (Number(targetGDH2['v_uni']) * Number(targetGDH2['perc']) / 100);
          } else if(episodio['pago'] == '1'){
              valorValidado += (Number(targetGDH2['v_uni']) * Number(targetGDH2['perc']) / 100);
          } else {
              valorRejeitado += (Number(targetGDH2['v_uni']) * Number(targetGDH2['perc']) / 100);
          }

      }
    });
    servico['valorPorValidar'] = valorPorValidar;
    servico['valorValidado'] = valorValidado;
    servico['valorRejeitado'] = valorRejeitado;
  });
  
  for (let it = servicos.length-1; it >= 0; it--) {
    const servico = servicos[it];
    if(servico['valorPorValidar'] == 0 && servico['valorValidado'] == 0 && servico['valorRejeitado'] == 0){
      servicos.splice(it, 1);
    }
  }
  if(n_mec == 'CA'){
    drawEpisodiosServicoCA();
  } else {
    drawEpisodiosServicoRH();
  }
}

//close modal de episodios per gdh
function closesubModaisResumo(nivel){
  if(nivel == 1){
      $("#resumo_gdh_modal").remove();
  }
}

//ver modal  de episodios per gdh
function verDetail(it_service, it_gdh) {
  var servico = servicos[it_service];
  var gdh = gdhs[it_gdh];
  var episodiosDoGDHTarget = [];
    servico.episodios.forEach(function (episodio) {
        if((episodio['gdh1'] == gdh.id && episodio['gdh2'] == null) || (episodio['gdh2'] == gdh.id)){
            episodiosDoGDHTarget.push(episodio);
        }
    });
    var resumo_GDHDetail_Modal = "<div class='overlay' id='resumo_gdh_modal'>"+
                                    "<div id='resumo_GDHDetail_Modal' style='width:60vw; line-height: 175%;' class='modal bigModal'>"+
                                        "<div><i onclick='closesubModaisResumo(1);' style='color:rgba(3, 106, 255, .95); float:right;' class='fas fa-times-circle close_modal'></i></div>"+
                                        "<div class='col_container' style='border-bottom: 1px solid lightgray; padding-bottom:15px'>"+
                                            "<div class='col col_50'>"+
                                            "<b>GDH:</b> "+gdh['gdh']+
                                            "<br><b>Serviço:</b> "+servico.servico+
                                            "<br><b>Período:</b> "+($('#monthPicker').val())+
                                            "</div>"+
                                        "</div>"+
                                        "<div id='resumo_GDHDetail_Modal_body' style='max-height: 600px; margin-top:15px; overflow: auto'>"+
                                        "</div>"+
                                        "<div>"+
                                            "<button onclick='closesubModaisResumo(1);' style='margin-top:15px;' class='confirm-btn'>Fechar</button>"+
                                        "</div>"+
                                    "</div>"
                                 "</div>"; 
    $("body").append(resumo_GDHDetail_Modal);
    episodiosDoGDHTarget.forEach(function(episodio, it) {
        var div = "<div style='padding:5px; background: white; margin-bottom: 5px;'>"+
                    "<div>"+    
                        "<b>" + episodio['num_processo'] + "</b> - " + episodio['nome'] + 
                        "<i onclick='toggleResumoEpisodios("+it+")' id='resumo_episodio_icon_"+it+"' style='float:right; margin-top: 6px; margin-right:5px; cursor:pointer; color:#1072ff;' class='fas fa-plus-circle'></i>"+
                    "</div>"+
                    "<div style='display:none' id='resumo_episodio_info_"+it+"'>"+
                        "<div style='font-size:12px; margin-top: 5px; background: #d0f3f3; padding: 10px 20px; border-radius: 5px;'>"+
                            "<div class='col_container'>"+
                                "<div class='col col_33'>"+
                                    "<span class='ep_resumo_titulo'><b>Identificação do doente:</b></span><br>"+
                                    "<span>HUC "+episodio['num_processo']+" - "+episodio['nome']+"</span><br><br>"+
                                    "<span class='ep_resumo_titulo'><b>Registos Operatórios:</b></span><br>"+
                                    "<span><b>Reg. Oper:</b> "+episodio['n_episode_cir']+"</span><br>"+
                                    "<span><b>Data Episódio:</b> "+episodio['dta_episodio']+"</span><br>"+
                                    "<span><b>Agrupamento/Serviço:</b> "+getServicoAgrupamento(episodio['servico']) + " " +  getServiceName(episodio['servico'])+"</span><br>"+
                                    "<span><b>Data de Admissão:</b> "+episodio['dta_admissao']+"</span><br>"+
                                    "<span><b>Data de Alta:</b> "+episodio['dta_alta']+"</span><br>"+
                                    "<span><b>Internamentos:</b> "+episodio['n_episode_int']+"</span>"+
                                "</div>"+
                                "<div class='col col_33'>"+
                                    "<span class='ep_resumo_titulo'><b>Detalhes do Registo Operatório:</b></span><br>"+
                                    "<span>Técn. Cir.</span><br>"+
                                    "<span><b>Anestesia:</b> "+episodio['tipo_anestesia']+"</span><br>"+
                                    "<span><b>Bloco:</b> "+getBlocoName(episodio['bloco'])+"</span><br>"+
                                    "<span><b>Sala:</b> "+episodio['sala']+"</span><br>"+
                                    "<span><b>Tipo Cir.:</b> "+episodio['tipo_cirurgia']+"</span><br>"+
                                    "<span><b>Bloco Oper.:</b> "+episodio['horas_oper_ini'] + " - " + episodio['horas_oper_fim'] +"</span><br>"+
                                    "<span><b>Anestesia:</b> "+episodio['hora_anest']+"</span><br>"+
                                    "<span><b>Cirurgia:</b> "+episodio['hora_cir']+"</span><br>"+
                                    "<span><b>Cirurgia Segura: </b> "+(parseInt(episodio['cir_segura']) == 1 ? 'Sim' : 'Não')+"</span><br>"+
                                "</div>"+
                                "<div class='col col_33'>"+
                                    "<span><b>Recobro:</b> "+episodio['dta_recobro']+"</span><br>"+
                                    "<span><b>Lateralidade:</b> ?</span><br>"+
                                    "<span><b>Destino Cir.:</b> "+episodio['destino']+"</span><br>"+
                                    "<span><b>Acto Cir.:</b> "+episodio['ato_cir']+"</span><br>"+
                                    "<span><b>Detalhes Interv.</b> ?</span><br>"+
                                    "<span><b>Obs.</b> ?</span><br>"+
                                    "<span><b>Nº de Inter.</b> ?</span><br>"+
                                    "<span><b>Estado de Integração:</b> "+getNomeEstado(episodio.estado)+"</span><br>"+
                                "</div>"+
                            "</div><br>"+
                            "<div class='col_container'>"+
                                "<div class='col col_50'>"+
                                    "<span class='ep_resumo_titulo'><b>Intervenções:</b></span><br>";
                                episodio['intervencoes'].forEach(function(intervencao) {
                             div += "<span>"+intervencao.sigla+" - "+intervencao.nome+"</span>";
                                });
                         div += "</div>"+
                                "<div class='col col_50'>"+
                                    "<span class='ep_resumo_titulo'><b>Diagnósticos:</b></span><br>";
                                episodio['diagnosticos'].forEach(function(diagnostico) {
                             div += "<span>"+diagnostico.sigla+" - "+diagnostico.nome+"</span>";
                                });
                        div += "</div>"+
                            "</div><br>"+
                            "<span class='ep_resumo_titulo'><b>Equipa Cirurgica:</b></span><br>"+
                            "<div>"+
                                "<table style='width:100%; table-layout: fixed;'>"+
                                    "<thead>"+
                                        "<tr>"+
                                            "<th style='width:40%; text-align:left;'><span>Identificação do Interveniente</span></th>"+
                                            "<th style='width:30%; text-align:left;'><span>Função</span></th>"+
                                            "<th class='numericValue' style='width:15%;'><span>%</span></th>"+
                                            "<th class='numericValue' style='width:15%;'><span>Valor</span></th>"+
                                        "</tr>"+
                                    "</thead>"+
                                    "<tbody style='background: white;'>";
                                    episodio['intervenientes'].forEach(function (interveniente) {
                                      var funcao = interveniente.funcao;
                                        if(funcao.equipa == 'EC'){
                                 div += "<tr>"+
                                            "<td style='width:40%; '>"+
                                                "<span>"+interveniente['n_mec']+
                                                    "<span style='margin-left:10px'> "+interveniente['nome']+"</span>"+
                                                "</span>"+
                                            "</td>"+
                                            "<td style='width:30%'>"+
                                                "<span>"+funcao['sigla']+
                                                    "<span style='margin-left:10px'> "+funcao['funcao']+"</span>"+
                                                "</span>"+
                                            "</td>"+
                                            "<td style='width:15%' class='numericValue'>"+
                                                "<span>"+funcao['perc']+" % </span>"+
                                            "</td>"+
                                            "<td style='width:15%' class='numericValue'>"+
                                                "<span>"+
                                                    calcGDHValuePerInterveniente(episodio, interveniente)+ " € " +
                                                "</span>"+
                                            "</td>"+
                                        "</tr>";
                                        }
                                    });
                            div +=  "</tbody>"+
                                "</table>"+
                            "</div><br>"+
                            "<span class='ep_resumo_titulo'><b>Equipa de Apoio:</b></span><br>"+
                            "<div>"+
                                "<table style='width:100%; table-layout: fixed;'>"+
                                    "<thead>"+
                                        "<tr>"+
                                            "<th style='width:40%; text-align:left;'><span>Identificação do Interveniente</span></th>"+
                                            "<th style='width:30%; text-align:left;'><span>Função</span></th>"+
                                            "<th class='numericValue' style='width:15%;'><span>%</span></th>"+
                                            "<th class='numericValue' style='width:15%;'><span>Valor</span></th>"+
                                        "</tr>"+
                                    "</thead>"+
                                    "<tbody style='background: white;'>";
                                    episodio['intervenientes'].forEach(function (interveniente) {
                                      var funcao = interveniente.funcao;
                                        if(funcao.equipa == 'EA'){
                                 div += "<tr>"+
                                            "<td style='width:40%; '>"+
                                                "<span>"+interveniente['n_mec']+
                                                    "<span style='margin-left:10px'> "+interveniente['nome']+"</span>"+
                                                "</span>"+
                                            "</td>"+
                                            "<td style='width:30%'>"+
                                                "<span>"+funcao['sigla']+
                                                    "<span style='margin-left:10px'> "+funcao['funcao']+"</span>"+
                                                "</span>"+
                                            "</td>"+
                                            "<td style='width:15%' class='numericValue'>"+
                                                "<span>"+funcao['perc']+" % </span>"+
                                            "</td>"+
                                            "<td style='width:15%' class='numericValue'>"+
                                                "<span>"+
                                                    calcGDHValuePerInterveniente(episodio, interveniente)+ " € " +
                                                "</span>"+
                                            "</td>"+
                                        "</tr>";
                                        }
                                    });
                            div +=  "</tbody>"+
                                "</table>"+
                            "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                  "</div>";
        $("#resumo_GDHDetail_Modal_body").append(div);        
    });
}

// toggle info do episodio 
function toggleResumoEpisodios(it) {
  $("#resumo_episodio_info_"+it).slideToggle('600');
  setTimeout(() => {
      if($("#resumo_episodio_info_"+it).css('display') !== 'none'){
          $("#resumo_episodio_icon_"+it).removeClass("fa-plus-circle").addClass("fa-minus-circle");
      } else {
          $("#resumo_episodio_icon_"+it).removeClass("fa-minus-circle").addClass("fa-plus-circle");
      }    
  }, 600);
}

//ver detalhe do servico (gdhs per service)
function openValidationModal(it) {
  var servico = servicos[it];
  var validateServicoModal =  "<div class='overlay'>"+
                                "<div id='valida_servico' style='width:60vw; line-height: 175%;' class='modal bigModal'>"+
                                  "<div><i onclick='closeModal()' style='color:rgba(3, 106, 255, .95); float:right' class='fas fa-times'></i></div>"+
                                  "<div class='col_container' style='border-bottom: 1px solid lightgray; padding-bottom:25px'>"+
                                    "<div class='col col_50'>"+
                                      "<b>Serviço:</b> "+servico.servico+
                                      "<br><b>Período:</b> "+($('#monthPicker').val())+
                                    "</div>"+
                                    "<div class='col col_50'>"+
                                      "<button id='approveServico' class='btn' style='background: green'>Aprovar <i class='fas fa-check'></i></button>"+
                                      "<button id='reffuseServico' class='btn' style='background: red'>Recusar <i class='fas fa-times'></i></button>"+
                                    "</div>"+
                                  "</div>"+
                                  "<div>"+
                                    "<table style='margin-top:20px; width: 100%; table-layout: fixed'>"+
                                      "<thead>"+
                                        "<tr>"+
                                          "<th style='width: 25%; text-align:left'>"+
                                            "GDH"+
                                          "</th>"+
                                          "<th style='width: 25%; padding-right: 15px;' class='numericValue'>"+
                                            "Valor Unitário"+
                                          "</th>"+
                                          "<th style='width: 25%; padding-right: 15px;' class='numericValue'>"+
                                            "Nº Total de Episódios"+ 
                                          "</th>"+
                                          "<th style='width: 25%; text-align:left'>"+
                                            "Valor Correspondente"+
                                          "</th>"+
                                        "</tr>"+
                                      "</thead>"+
                                      "<tbody id='body_servico'>"+
                                      "</tbody>"+
                                    "</table>"+
                                  "</div>"+
                                  "<div style='border-top: 1px solid lightgrey; margin-top: 25px; padding-top: 20px;'>"+
                                    "Valor Global GDH"+
                                    "<div class='col_container' style='width: 50%; margin-top: 15px;'>"+
                                      "<div class='col numericValue'>"+
                                        "<b style='padding-right:15px;'>N.º Total de Episódios</b><br>"+
                                        "<div style='width: calc(100% - 15px); background: #EBF6F5; border-radius: 5px;' class='numericValue'>"+
                                          "<span id='all_Episodios_nr'></span>"+
                                        "</div>"+
                                      "</div>"+
                                      "<div class='col numericValue'>"+
                                        "<b style='padding-right:15px;'>Valor a Pagar</b><br>"+
                                        "<div style='width: calc(100% - 15px); background: #EBF6F5; border-radius: 5px;' class='numericValue'>"+
                                          "<span id='all_Episodios_value'></span>"+
                                        "</div>"+
                                      "</div>"+
                                    "</div>"+
                                  "</div>"+
                                "</div>"+
                              "</div>";
  $("body").append(validateServicoModal);
  
  var episodiosPorValidar = [];
  var valorApagarTotal = 0; 
  servico['episodios'].forEach(function (episodio, it) {
    if(episodio.pago == '0'){
      episodiosPorValidar.push(episodio);
    }
  });
  gdhs.forEach(function(gdh, it_gdh) {
    var exists = false;
    var episodiosPerGDH = [];
    for (let it2 = 0; it2 < episodiosPorValidar.length; it2++) {
      const episodio = episodiosPorValidar[it2];
      if(episodio['pago'] == "0"){
        if((episodio['gdh1'] == gdh['id'] && episodio['gdh2'] == null) || (episodio['gdh2'] == gdh['id'])){
          exists = true;
          episodiosPerGDH.push(episodio);
          valorApagarTotal += (Number(gdh['v_uni']) * Number(gdh['perc']) / 100);
        }
      }
    }
    if(exists && episodiosPerGDH.length > 0){
      var div = "<tr>"+
                  "<td style='width:25vw'>"+
                    "<div class='unit_coloured_table'>"+
                      gdh['gdh']+
                    "</div>"+ 
                  "</td>"+
                  "<td style='width:25%'>"+
                    "<div class='unit_coloured_table numericValue'>"+
                      gdh['v_uni']+" €"+
                    "</div>"+
                  "</td>"+
                  "<td style='width:25%'>"+
                    "<div class='unit_coloured_table numericValue'>"+
                      episodiosPerGDH.length +
                    "</div>"+
                  "</td>"+
                  "<td style='width:20%'>"+
                    "<div class='unit_coloured_table numericValue' style='width: 50%; float:left;'>"+
                      (Number(gdh['v_uni']) * Number(gdh['perc']) / 100 * episodiosPerGDH.length).toFixed(2) + " €" +
                    "</div>"+
                    "<i class='fas fa-search' onclick='verDetail("+it+","+it_gdh+")' style='color:rgba(3, 106, 255, .95); margin-left: 15px'></i>"+
                  "</td>"+
                  "<td style='width:5%'>"+
                  "</td>"+
                "</tr>";
      $("#body_servico").append(div);
    }
  });
  $("#all_Episodios_nr").text(episodiosPorValidar.length);
  $("#all_Episodios_value").text(valorApagarTotal.toFixed(2) + " €");

  document.getElementById('approveServico').addEventListener( 'click', function () {
    var ids = [];
    episodiosPorValidar.forEach(function (episodio){
      ids.push(episodio['id']);
    });
    addLoading();
    var fd = new FormData();
    fd.append('ids', ids);
    $.ajax({
        type: "POST",
        url: "./api/episodios/validateFromGestRH.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            var fdata = JSON.parse(data);
            removeLoading();
            if(fdata == 'success'){
              closeModal();
              var dates = getDatesFromPicker();
              searchEpisodios(dates[0], dates[1]);
            } else {
              alert("Erro ao enviar episódios para pagamento");
            } 
        }
    });
  });

  document.getElementById('reffuseServico').addEventListener( 'click', function () {
    var ids = [];
    episodiosPorValidar.forEach(function (episodio){
      ids.push(episodio['id']);
    });
    addLoading();
    var fd = new FormData();
    fd.append('ids', ids);
    $.ajax({
        type: "POST",
        url: "./api/episodios/refuseFromGestRH.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            var fdata = JSON.parse(data);
            removeLoading();
            if(fdata == 'success'){
              closeModal();
              var dates = getDatesFromPicker();
              searchEpisodios(dates[0], dates[1]);
            } else {
              alert("Erro ao enviar episódios para pagamento");
            }
            
        }
    });
  });
}


function getDatesFromPicker() {
  var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
  var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
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
  return [beginDate, endDate];
}
//aprovar múltiplos serviços
function aprovarMultipleServices(){
  var servicesToApprove = [];
  servicos.forEach(function(servico, it) {
    if($("#sel_service"+it).length > 0 ){
      if($("#sel_service"+it).is(':checked')){
        servicesToApprove.push(servico);
      }
    }
  });
  if(servicesToApprove.length > 0){
    var ids = [];
    servicesToApprove.forEach(function (servico, it){
      servico['episodios'].forEach(function(episodio) {
        if(episodio.pago == '0'){
          ids.push(episodio.id);
        }
      });
    });
    addLoading();
    var fd = new FormData();
    fd.append('ids', ids);
    $.ajax({
        type: "POST",
        url: "./api/episodios/validateFromGestRH.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
          var fdata = JSON.parse(data);
          removeLoading();
          if(fdata !== 'success'){
            alert("Erro ao enviar episódios para pagamento");
          } 
          var dates = getDatesFromPicker();
          searchEpisodios(dates[0], dates[1]);
        }
    });
  } else {
    alert("Selecione, pelo menos, um serviço para validar.");
  }
}

// fechar modal primaria
function closeModal() {
  $(".overlay").remove();
}

// get service name
function getServiceName(servicoIN) {
  var servicoName ="";
  servicos.forEach(function (servico) {
      if(servicoIN == servico.id){
          servicoName = servico.servico;
          return;
      }
  });
  return servicoName;  
}

// get service agrupamento
function getServicoAgrupamento(servicoIN){
  var servicoAgrupamento ="";
  servicos.forEach(function (servico) {
      if(servicoIN == servico.id){
          servicoAgrupamento = servico.agrupamento;
          return;
      }
  });
  return servicoAgrupamento.toUpperCase();  
}

// get bloco name
function getBlocoName(blocoIN){
  var blocoName ="";
  blocos.forEach(function (bloco) {
      if(blocoIN == bloco.id){
          blocoName = bloco.nome;
          return;
      }
  });
  return blocoName;  
}

// get estado nome
function getNomeEstado(estado){
  if(estado == 0){
      return "PV | Pendende de verif. Secr.";
  } else if (estado == 1){
      return "PG | Pendende de GDH";
  } else if (estado == 2){
      return "PP | Pendende de Pagamento";
  } else if (estado == 3){
      return "EP | Enviado para Pagamento";
  } else if(estado == 4){
      return "PP | Pagamento Processado";
  }
}

//calcula valor a receber por interveniente
function calcGDHValuePerInterveniente(episodio, interveniente){
  if(episodio['gdh2'] == null){
      var valor = 0;
      var valorGDH1;
      var gdh1 = episodio['gdh1'];
      var tagetGDH1;
      for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
          if(parseInt(gdh.id) == parseInt(gdh1)){
              tagetGDH1 = gdh;
              break;
          }
      }
      var funcao = interveniente.funcao
      valorGDH1 = parseFloat(tagetGDH1['v_uni']);
      var percentageGDH1 = parseFloat(tagetGDH1['perc']);
      var gdh_finalVal1 = valorGDH1 * percentageGDH1 / 100;
      valorGDH1 = gdh_finalVal1 * parseFloat(funcao['perc']) / 100;
      valor = valorGDH1;
      return valor.toFixed(2);
  } else {
      var valor = 0;
      var valorGDH2;
      var gdh2 = episodio['gdh2'];
      var tagetGDH2;
      for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
          if(parseInt(gdh.id) == parseInt(gdh2)){
              tagetGDH2 = gdh;
              break;
          }
      }
      var funcao = interveniente.funcao
      valorGDH2 = parseFloat(tagetGDH2['v_uni']);
      var percentageGDH2 = parseFloat(tagetGDH2['perc']);
      var gdh_finalVal2 = valorGDH2 * percentageGDH2 / 100;
      valorGDH2 = gdh_finalVal2 * parseFloat(funcao['perc']) / 100;
      valor = valorGDH2;
      return valor.toFixed(2);
  }
}

//imprime Relatorios
function printRelatorio() {
  addLoading();
  var fd = new FormData();
  fd.append('servicos', JSON.stringify(servicos));
  fd.append('user', 'Recursos Humanos');
  fd.append('data', $("#monthPicker").val());
  fd.append('allServices', JSON.stringify(allServices));
  
  var month = moment().format('M');
  var year  = moment().format('YYYY');
  var monthLabel;
  switch (month) {
    case "1":
      monthLabel = "Janeiro ";
      break;
    case "2":
      monthLabel = "Fevereiro ";
      break;
    case "3":
      monthLabel = "Março ";
      break;
    case "4":
      monthLabel = "Abril ";
      break;
    case "5":
      monthLabel = "Maio ";
      break;
    case "6":
      monthLabel = "Junho ";
      break;
    case "7":
      monthLabel = "Julho ";
      break;
    case "8":
      monthLabel = "Agosto ";
      break;
    case "9":
      monthLabel = "Setembro ";
      break;
    case "10":
      monthLabel = "Outubro ";
      break;
    case "11":
      monthLabel = "Novembro ";
      break;
    case "12":
      monthLabel = "Dezembro ";
      break;
  }
  fd.append('actual-data', monthLabel + " " + year);
  $.ajax({
      type: "POST",
      url: "./api/pdfs/printRelatorioCA.php",
      data: fd,
      processData: false,
      contentType: false,
      success:function(data){
        removeLoading();
        var link=document.createElement("a");
        link.id = 'someLink'; 
        link.href=JSON.parse(data);
        link.target="_blank";
        link.click();
      }
  });
}



//PARTE DOS RH
function drawEpisodiosServicoRH(){
  $("#approveBtn").remove();
  $("#buttonArea").html('<button id="approveBtn" onclick="gerarFicheiro()" class="button">Gerar Ficheiro</button>')
  $("#pageBody_tableBody").empty();
  if(servicos.length > 0){
    servicos.forEach(function (servico, it) {
      if(servico.valorValidado != 0){
        var everythingAlreadyInFile = true;
        for (let index = 0; index < servico['episodios'].length; index++) {
          const episodio = servico['episodios'][index];
          if(parseInt(episodio.pago) == 1 && parseInt(episodio.included_in_file) == 0){
            everythingAlreadyInFile = false;
            break;
          }
        }
        var valueIncludedInFile = getValueIncludedInFileByService(servico);
        var valueNotIncludedInFile = getValueNotIncludedInFileByService(servico);
        servico['valueIncludedInFile'] = valueIncludedInFile;
        servico['valueNotIncludedInFile'] = valueNotIncludedInFile;

        var div = "<div id='servico_"+it+"' style='display: table; width:100%; table-layout:fixed; margin-bottom: 15px;'>"+
                    "<div style='display:table-cell; width: 5%; vertical-align: middle'>";
              div +=  "<label class='container costumHeight' style='transform: translateY(-.5vw)'>"+
                        "<input onclick='checkIfSelectAll_services("+it+")' id='sel_service"+it+"' class='sel_service' type='checkbox'>"+
                        "<span class='checkmark costumCheck'></span>"+
                      "</label>"+ 
                      "</div>"+
                      "<div style='width:60%; background:white; display: table-cell; vertical-align: middle'>"+
                        "<div>"+
                          servico.servico+
                        "</div>"+
                      "</div>"+
                      "<div class='service_unit' style='width:20%;'>"+
                        "<div style='display:block; width: calc(100% - 30px); margin-left: 15px;' class='service_unit_interior'>";
                        if(valueNotIncludedInFile != 0){
                    div += "<p style='padding: 5px; margin-left: 5px; margin: 0;' class='numericValue'>"+valueNotIncludedInFile+" €</p>";
                        } 
                        if(valueIncludedInFile != 0){
                    div += "<p style='padding: 5px; margin-left: 5px; margin: 0; color:green;' class='numericValue'>"+valueIncludedInFile+" €</p>";
                        } 
              div +=  "</div>"+
                    "</div>"+
                    "<div style='display:inline-flex' class='col_15'>"+
                      "<div style='display:block'>";
                      if(valueNotIncludedInFile != 0){
                div +=  "<p style='padding: 5px; margin-left: 5px; cursor:pointer; margin: 0; color:blue'><i class='fas fa-file-import'></i></p>";
                      }
                      if(valueIncludedInFile != 0){
                div +=  "<p style='color:green; padding: 5px; margin-left: 5px; cursor:pointer; margin: 0;'><i class='fas fa-file-export otherIcon'></i></p>";
                      }
            div +=  "</div>"+
                  "</div>"+
                "</div>";
        $("#pageBody_tableBody").append(div);
      }
    });
  } else {
    $("#pageBody_tableBody").append("<div class='service_unit_interior' style='width:100%;'>Nenhum serviço com espisódios neste mês</div>");
  }
}

//calc valores do serviço que já foram incluido noutro ficheiro
function getValueIncludedInFileByService(servico){
  var valorIncluido = 0;
  servico['episodios'].forEach(function (episodio) {
    if(parseInt(episodio['pago']) == 1){
      var gdh2 = episodio['gdh2'];
      if(gdh2 != null){
        var targetGDH2;
        for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
          if(gdh2 == gdh['id']){
            targetGDH2 = gdh;
            break;
          }
        }
        if(parseInt(episodio['included_in_file']) == 1){
          valorIncluido += Number(targetGDH2['v_uni']) * Number(targetGDH2['perc']) / 100;
        } 
      } else {
        var targetGDH1;
        for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
          if(episodio['gdh1'] == gdh['id']){
            targetGDH1 = gdh;
            break;
          }
        }
        if(parseInt(episodio['included_in_file']) == 1){
          valorIncluido += Number(targetGDH1['v_uni']) * Number(targetGDH1['perc']) / 100;
        } 
      }
    }
  });
  return valorIncluido.toFixed(2);
}

//calc valores do serviço que ainda NÃO foram incluido noutro ficheiro
function getValueNotIncludedInFileByService(servico) {
  var valorNaoIncluido = 0;
  servico['episodios'].forEach(function (episodio) {
    if(parseInt(episodio['pago']) == 1){
      var gdh2 = episodio['gdh2'];
      if(gdh2 != null){
        var targetGDH2;
        for (let id = 0; id < gdhs.length; id++) {
            const gdh = gdhs[id];
            if(gdh2 == gdh['id']){
              targetGDH2 = gdh;
              break;
            }
        }
        if(parseInt(episodio['included_in_file']) == 0){
            valorNaoIncluido += Number(targetGDH2['v_uni']) * Number(targetGDH2['perc']) / 100;
        } 
      } else {
        var targetGDH1;
        for (let id = 0; id < gdhs.length; id++) {
            const gdh = gdhs[id];
            if(episodio['gdh1'] == gdh['id']){
              targetGDH1 = gdh;
              break;
            }
        }
        if(parseInt(episodio['included_in_file']) == 0){
            valorNaoIncluido += Number(targetGDH1['v_uni']) * Number(targetGDH1['perc']) / 100;
        } 
      }
    }
  });
  return valorNaoIncluido.toFixed(2);
}

//aprovar múltiplos serviços
function gerarFicheiro(){
  var servicesToApprove = [];
  servicos.forEach(function(servico, it) {
    if($("#sel_service"+it).length > 0 ){
      if($("#sel_service"+it).is(':checked')){
        servicesToApprove.push(servico);
      }
    }
  });
  if(servicesToApprove.length > 0){
    var episodios = [];
    servicesToApprove.forEach(function (servico, it){
      servico['episodios'].forEach(function(episodio) {
        if(parseInt(episodio.pago) == 1){
          episodios.push(episodio);
        }
      });
    });
    
    episodios.forEach(function(episodio) {
      var service = episodio.servico;
      var serviceName = getServiceName(service);
      episodio['serviceName'] = serviceName.trim();
      var gdh_id = episodio['gdh2'];
      var gdh_target;

      if(gdh_id != null){
        for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
          if(parseInt(gdh.id) == parseInt(gdh_id)){
              gdh_target = gdh;
              break;
          }
        }  
      } else {
        for (let id = 0; id < gdhs.length; id++) {
          const gdh = gdhs[id];
          if(parseInt(gdh.id) == parseInt(episodio['gdh1'])){
              gdh_target = gdh;
              break;
          }
        }
      }
      

      var valorGDH = parseFloat(gdh_target['v_uni']);
      var percentageGDH = parseFloat(gdh_target['perc']);
      var gdh_finalVal = valorGDH * percentageGDH / 100;
      episodio['intervenientes'].forEach(function(interveniente, it) {
          var funcao = interveniente.funcao;
          var valor = gdh_finalVal * parseFloat(funcao['perc']) / 100;
          interveniente['valueToReceive'] = valor.toFixed(2);
      });
    });
    
    addLoading();
    var fd = new FormData();
    fd.append('episodios', JSON.stringify(episodios));
    fd.append('user', 'Recursos Humanos');
    fd.append('data', $("#monthPicker").val());
    $.ajax({
        type: "POST",
        url: "./api/episodios/createFile.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
          removeLoading();
          var fdata = JSON.parse(data);
          if(fdata == 'error'){
            alert("Erro ao gerar ficheiro");
          } else {
            const url = fdata;
            var a = document.createElement("a");
            a.setAttribute("type", "hidden");
            a.href = "./api/files/"+url;
            a.download = url;
            document.body.appendChild(a);
            a.click();
            a.remove();
            // loadEpisodios();
            closeModal();
            var dates = getDatesFromPicker();
            searchEpisodios(dates[0], dates[1]);
          }
        }
    });
  } else {
    alert("Selecione, pelo menos, um serviço para gerar ficheiro.");
  }
}
