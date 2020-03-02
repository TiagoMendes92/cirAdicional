// [{"sigla":"CIR","funcao":"Cirurgião","percentage":"25","equipa":"EC"},{"sigla":"ANE","funcao":"Anestesista","percentage":"25","equipa":"EC"},{"sigla":"AUXB","funcao":"Auxiliar Bloco Operatório","percentage":"5","equipa":"EC"},{"sigla":"SEC","funcao":"Secretario","percentage":"2.5","equipa":"EA"}]


// check login
function checkAuth(){
    var user = JSON.parse(sessionStorage.getItem('user'));
    if(user != null){
        if(user.role_id == '-1'){
            alert("Ainda não tem previlégios definidos para a esta aplicação. Por favor, solicite a um administrador que defina o seu papel na aplicação.");
            sessionStorage.removeItem('user');
            location.reload();
            return;
        }
        if(user['role_id'] == '3'){
            $('#pendente_secretariado').attr('checked', false);
        }
        if(user['role_id'] == '4'){
            $('#pendente_secretariado, #pendente_pagamento, #enviado_pagamento').attr('checked', false);
        }            
        if(user['role_id'] == '5'){
            $('#pendente_gdh, #pendente_pagamento, #enviado_pagamento, #pagamento_processado').attr('checked', false);
        }
        checkPrivilegies(user);
    } else {
        showLoginForm();
    }
}

// close all modals
function closeAllModals() {
    $(".overlay").remove();
}

// get valor do episodio
function getValorOfEpisodio(gdh1, gdh2){
    if(gdh1 != null && gdh2 == null){
        var gdh_target1;
        for (let it = 0; it < gdhList.length; it++) {
            const gdh_candidate = gdhList[it];
            if(gdh_candidate.id == gdh1){
                gdh_target1 = gdh_candidate;
                break;
            }   
        }
        var valorGDH1 = parseFloat(gdh_target1['v_uni']);
        var percentageGDH1 = parseFloat(gdh_target1['perc']);
        var gdh_finalVal1 = valorGDH1 * percentageGDH1 / 100;
        return gdh_finalVal1.toFixed(2) + ' €';
    } else if(gdh1 == null && gdh2 == null) {
        return 'indefinido';
    }  else {
        var gdh_target2;
        for (let it = 0; it < gdhList.length; it++) {
            const gdh_candidate = gdhList[it];
            if(gdh_candidate.id == gdh2){
                gdh_target2 = gdh_candidate;
                break;
            }   
        }
        var valorGDH2 = parseFloat(gdh_target2['v_uni']);
        var percentageGDH2 = parseFloat(gdh_target2['perc']);
        var gdh_finalVal2 = valorGDH2 * percentageGDH2 / 100;
        return gdh_finalVal2.toFixed(2) + ' €';
    }
}

var episodios;
var servicos;
var blocos;
// get episodios
function getEpisodios(estados, servico) {
    var fd = new FormData();
    var dataCirurgiaInicio = $("#data_cir_ini_filtro").val();
    var dataCirurgiaFim = $("#data_cir_fim_filtro").val();
    fd.append('estados', JSON.stringify(estados));
    if(servico != null){
        fd.append('servico', servico);
    }
    if(dataCirurgiaInicio != undefined && dataCirurgiaInicio.trim() != ''){
        fd.append('dataCirurgiaInicio', dataCirurgiaInicio);
    }
    if(dataCirurgiaFim != undefined && dataCirurgiaFim.trim() != ''){
        fd.append('dataCirurgiaFim', dataCirurgiaFim);
    }
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/searchEpisodios.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            getServicos();
            episodios = JSON.parse(data);
        }
    }); 
}

// show hide certain state of episodio 
function toggleEpisodiosState(id, estado) {
    var user = JSON.parse(sessionStorage.getItem('user'));
    if(user.role_id == "3"){
        if($("#"+id).is(':checked')){
            $('.mainList-filter').prop('checked', false);
            $("#"+id).prop('checked', true);
            pesquisaEpisodios();
            if(id == "pendente_secretariado"){
                $("#mainList-validationButtons").empty();
            }
        } else {
            var tempEpisodios = [];
            episodios.forEach(episodio => {
                if(episodio.estado !== estado){
                    tempEpisodios.push(episodio);
                }
            });
            drawEpisodios(tempEpisodios);
        }
    }
    else if(user.role_id == "4"){
        if($("#"+id).is(':checked')){
            $('.mainList-filter').prop('checked', false);
            $("#"+id).prop('checked', true);
            pesquisaEpisodios();
            if(id == "pendente_secretariado"){
                $("#mainList-validationButtons").empty();
            } if(id == "pendente_gdh"){
                $("#mainList-validationButtons").empty();
                $("#mainList-validationButtons").append('<button id="validarPendenteGDH" class="confirm-btn" style="margin-top:2vw; margin-right:2vw;" onclick="validarGDHsEpisodios()">Validar</button>');
            } if(id == "pendente_pagamento"){
                $("#mainList-validationButtons").empty();
                $("#data_env_filtro").remove();
                $("#mainList-validationButtons").append("<button id='validarPendentePagamento' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='validarPendentePagamentoEpisodios()'>Confirmar</button>");
            } if(id == "enviado_pagamento" ){
                $("#mainList-validationButtons").empty();
                $("#mainList-validationButtons").append("<button id='verResumo_enviadoPagamento' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='verResumoEnviadoPagamento()'>Ver Resumo</button>");
                $("#mainList-validationButtons").append("<button id='imprimirResumo_enviadoPagamento' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='imprimirResumoEnviadoPagamento()'>Imprimir Resumo</button>");
                $("#data_filtros").append("<div id='data_env_filtro' class='data_filtro'><div class='data_filtro_nome'>Data Envio Pag.</div><input id='data_env_ini_filtro' type='date'><input id='data_env_fim_filtro' type='date'></div>");
            }
        } else {
            var tempEpisodios = [];
            episodios.forEach(episodio => {
                if(episodio.estado !== estado){
                    tempEpisodios.push(episodio);
                }
            });
            drawEpisodios(tempEpisodios);
        }
    }
    else if(user.role_id == "5"){
        if($("#"+id).is(':checked')){
            $('.mainList-filter').prop('checked', false);
            $("#"+id).prop('checked', true);
            getEpisodios([parseInt(estado)], null);
            $("#mainList-validationButtons").empty();
            if(id == "pendente_secretariado"){
                $("#mainList-validationButtons").empty();
                $("#mainList-validationButtons").append('<button id="validarPendenteSecretariado" class="confirm-btn" style="margin-top:2vw; margin-right:2vw;" onclick="validarEquipasEpisodios()">Validar</button>');
                $("#data_env_filtro").remove();
            } if(id == "pendente_gdh"){
                $("#mainList-validationButtons").empty();
                $("#mainList-validationButtons").append('<button id="validarPendenteGDH" class="confirm-btn" style="margin-top:2vw; margin-right:2vw;" onclick="validarGDHsEpisodios()">Validar</button>');
                $("#data_env_filtro").remove();
            } if(id == "pendente_pagamento"){
                $("#mainList-validationButtons").empty();
                $("#mainList-validationButtons").append("<button id='validarPendentePagamento' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='validarPendentePagamentoEpisodios()'>Confirmar</button>");
                $("#data_env_filtro").remove();
            }if(id == "enviado_pagamento" ){
                $("#mainList-validationButtons").empty();
                $("#mainList-validationButtons").append("<button id='verResumo_enviadoPagamento' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='verResumoEnviadoPagamento()'>Ver Resumo</button>");
                $("#mainList-validationButtons").append("<button id='imprimirResumo_enviadoPagamento' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='imprimirResumoEnviadoPagamento()'>Imprimir Resumo</button>");
                if(document.getElementById('data_env_filtro') == null){
                    $("#data_filtros").append("<div id='data_env_filtro' class='data_filtro'><div class='data_filtro_nome'>Data Envio Pag.</div><input id='data_env_ini_filtro' type='date'><input id='data_env_fim_filtro' type='date'></div>");
                }
            } if(id == "pagamento_processado"){
                if(document.getElementById('data_env_filtro') == null){
                    $("#data_filtros").append("<div id='data_env_filtro' class='data_filtro'><div class='data_filtro_nome'>Data Envio Pag.</div><input id='data_env_ini_filtro' type='date'><input id='data_env_fim_filtro' type='date'></div>");
                }
            }
        } else {
            var tempEpisodios = [];
            episodios.forEach(episodio => {
                if(episodio.estado !== estado){
                    tempEpisodios.push(episodio);
                }
            });
            drawEpisodios(tempEpisodios);
        }
    }
    else{
        if($("#"+id).is(':checked')){
            drawEpisodios(episodios);
        } else {
            var tempEpisodios = [];
            episodios.forEach(episodio => {
                if(episodio.estado !== estado){
                    tempEpisodios.push(episodio);
                }
            });
            drawEpisodios(tempEpisodios);
        }
    }
}

//ver resumo por serviço
function verResumoEnviadoPagamento(){
    var start = $("#data_cir_ini_filtro").val();
    var end = $("#data_cir_fim_filtro").val();
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
            groupEpisodiosByServico();
        }
    }); 
}
//imprimir resumo por serviço
function imprimirResumoEnviadoPagamento(){
    var dataInicio = $("#data_cir_ini_filtro").val();
    var dataFim = $("#data_cir_fim_filtro").val();
    var blocoNome = $("#bloco_filtro").val() == '' ? 'Todos' : getBlocoName($("#bloco_filtro").val());
    var servico = $("#servico_filtro").val() == '' ? 'Todos' : getServiceName($("#servico_filtro").val());
    var doente = $("#doente_2_filtro").val() == '' ? 'Todos' : 'Pesquisa por "'+$("#doente_2_filtro").val()+'"';
    var intervenienteN_MEC = $("#interveniente_mec_filtro").val() == '' ? 'Todos' : 'Pesquisa por "'+$("#interveniente_mec_filtro").val()+'"';
    var intervenienteNOME = $("#interveniente_nome_filtro").val() == '' ? 'Todos' : 'Pesquisa por "'+$("#interveniente_nome_filtro").val()+'"';
    var gdh = $("#gdh_filtro").val() == '' ? 'Todos' : getGDHfromID($("#gdh_filtro").val());

    for (let index = 0; index < episodios.length; index++) {
        const episodio = episodios[index];
        episodio['serviceName'] = getServiceName(episodio['servico']); 
        episodio['blocoName'] = getBlocoName(episodio['bloco']);
        var targetGDH;
        if(episodio['gdh2'] == null){
            if(episodio['gdh1'] == null){
                targetGDH = null;
            } else {
                for (let it = 0; it < gdhList.length; it++) {
                    const gdh_candidate = gdhList[it];
                    if(gdh_candidate.id == episodio['gdh1']){
                        targetGDH = gdh_candidate;
                        break;
                    }
                }
            }
        }else{
            for (let it = 0; it < gdhList.length; it++) {
                const gdh_candidate = gdhList[it];
                if(gdh_candidate.id == episodio['gdh2']){
                    targetGDH = gdh_candidate;
                    break;
                }
            }
        }
        episodio['gdhToPay'] = targetGDH; 
    }
    
    var fd = new FormData();
    fd.append('episodios', JSON.stringify(episodios));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', JSON.stringify(user));
    
    fd.append('dataInicio', dataInicio);
    fd.append('dataFim', dataFim);
    fd.append('blocoNome', blocoNome);
    fd.append('servico', servico);
    fd.append('doente', doente);
    fd.append('intervenienteN_MEC', intervenienteN_MEC);
    fd.append('intervenienteNOME', intervenienteNOME);
    fd.append('gdh', gdh);

    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/pdfs/resumo.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            var link=document.createElement("a");
            link.id = 'someLink'; //give it an ID!
            link.href=JSON.parse(data);
            link.target="_blank";
            link.click();
        }
    });
}

function getGDHfromID(id_gdh) {
    var gdh;
    for (let it = 0; it < gdhList.length; it++) {
        const gdh_candidate = gdhList[it];
        if(gdh_candidate['id'] == id_gdh){
            gdh = gdh_candidate['gdh'];
            break;
        }
    }
    return gdh;
}

//agroupar episodios por servico
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

function selectAllEpisodios() {
    if($("#mainListSellALL input").is(":checked")){
        $(".episodio_select").prop('checked', true);
    } else {
        $(".episodio_select").prop('checked', false);
    }
}

function checkIfAllSelected(estado,it){
    var id ="";
    if(estado == '0'){
        id = "pendente_secretariado_"+it;
    }
    if(estado == '1'){
        id = "pendente_gdh_"+it;
    }
    if(estado == '2'){
        id = "pendente_pagamento_"+it;
    }
    if(estado == '3'){
        id = "enviado_pagamento_"+it;
    }
    if($("#mainListSellALL input").is(':checked')){
      if(!$("#"+id).is(':checked')){
          $("#mainListSellALL input").prop('checked', false);
      }
    }
  }

//calcular valores a pagar por serviço
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
            for (let id = 0; id < gdhList.length; id++) {
            const gdh = gdhList[id];
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
            for (let id = 0; id < gdhList.length; id++) {
            const gdh = gdhList[id];
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
    drawEpisodiosServicoModal();
}

function drawEpisodiosServicoModal(){
    var modalResumo =   "<div class='overlay'>"+
                            "<div id='resumoModal' class='modal bigModal'>"+
                                "<h4 class='modal_title font-black'>Monitorização de Cirurgia Adicional, de "+$("#data_cir_ini_filtro").val()+" a "+$("#data_cir_fim_filtro").val()+" <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                "<div style='width:100%; height:1px; margin-top:15px; margin-bottom:15px; background: lightgrey;'></div>"+
                                "<div id='verResumo_tableHeader' class='col_container'>"+
                                    "<div class='col col_65'>Serviço</div>"+
                                    "<div class='col col_20 numericValue' style='padding-right:15px'>Valor</div>"+
                                    "<div class='col col_15'>Estado</div>"+
                                "</div>"+
                                "<div id='verResumo_tableBody' style='margin-top: 1vw;' class='col_container'>"+
                                "</div>"+
                                "<div>"+
                                    "<button onclick='closeModal();' class='confirm-btn'>Fechar</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
    $("body").append(modalResumo);
    if(servicos.length > 0){
        servicos.forEach(function(servico, it) {
          var div = "<div id='servico_"+it+"' style='display: table; width:100%; table-layout:fixed; margin-bottom: 15px;'>"+
                      "<div style='width:65%; background:white; display: table-cell; vertical-align: middle'>"+
                        "<div>"+
                          servico.servico+
                        "</div>"+
                      "</div>"+
                      "<div class='service_unit' style='width:20%;'>"+
                        "<div style='display:block; width: calc(100% - 30px); margin-left: 15px;' class='service_unit_interior'>";
                        if(servico['valorPorValidar'] != 0){
                    div += "<p style='padding: 5px; margin-left: 5px; margin: 0; text-align:right;'>"+servico['valorPorValidar'].toFixed(2)+" €</p>";
                        } 
                        if(servico['valorValidado'] != 0){
                    div += "<p style='color:green; padding: 5px; margin-left: 5px; margin: 0; text-align:right;'>"+servico['valorValidado'].toFixed(2)+" €</p>";
                        } 
                        if(servico['valorRejeitado'] != 0){
                    div += "<p style='color:red; padding: 5px; margin-left: 5px; margin: 0; text-align:right;'>"+servico['valorRejeitado'].toFixed(2)+" €</p>";
                        } 
                div += "</div>"+
                      "</div>"+
                      "<div style='display:inline-flex;' class='col_15'>"+
                        "<div style='display:block'>";
                        if(servico['valorPorValidar'] != 0){
                        div += "<div style='margin-bottom:7px;'>"+
                                    "<i class='fas fa-ellipsis-h toValidate tooltip_container' style='margin-left:5px;' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'>"+
                                        "<div class='tooltip right_tooltip'> Pendente de Aprovação pelo Conselho de Administração</div>"+
                                    "</i>"+
                                    "<i class='fas fa-search tooltip_container' onclick='resumo_ServiceDetail("+it+",0)' style='margin-left:10px; transform: translateY(2px); color: blue; cursor:pointer;' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'>"+
                                        "<div class='tooltip right_tooltip'> Ver Episódios do Serviço</div>"+
                                    "</i>"+
                                "</div>";
                        }
                        if(servico['valorValidado'] != 0){
                    div +=  "<div style='margin-bottom:7px;'>"+
                                "<i class='fas fa-check-circle otherIcon tooltip_container' style='margin-left:5px; color:green' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'>"+
                                    "<div class='tooltip right_tooltip'> Valor aprovado pelo Conselho de Administração</div>"+
                                "</i>"+
                            "</div>";
                        } 
                        if(servico['valorRejeitado'] != 0){
                    div += "<div style='margin-bottom:7px;'>"+
                                "<i class='fas fa-times-circle otherIcon tooltip_container' style='margin-left:5px; color:red' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'>"+
                                    "<div class='tooltip right_tooltip'> Valor reprovado pelo Conselho de Administração</div>"+
                                "</i>"+
                            "</div>";
                        } 
              div +=    "</div>"+
                      "</div>"+
                    "</div>";
          
          $("#verResumo_tableBody").append(div);
        });
      } else {
        $("#verResumo_tableBody").append("<div class='service_unit_interior' style='width:100%;'>Nenhum serviço com espisódios neste mês</div>");
      }
}

function closesubModaisResumo(nivel){
    if(nivel == 1){
        $("#resumo_servico_modal").remove();
    }
    else if(nivel == 2){
        $("#resumo_gdh_modal").remove();
    }
}

function resumo_ServiceDetail(it, estado){
    if(estado == 0){
        var servico = servicos[it];
        var validateServicoModal =  "<div class='overlay' id='resumo_servico_modal'>"+
                                        "<div id='valida_servico' style='width:60vw; line-height: 175%;' class='modal bigModal'>"+
                                        "<div><i onclick='closesubModaisResumo(1)' style='color:rgba(3, 106, 255, .95); float:right' class='fas fa-times'></i></div>"+
                                        "<div class='col_container' style='border-bottom: 1px solid lightgray; padding-bottom:25px'>"+
                                            "<div class='col col_50'>"+
                                            "<b>Serviço:</b> "+servico.servico+
                                            "<br><b>Período:</b> "+($("#data_cir_ini_filtro").val()+" a "+$("#data_cir_fim_filtro").val())+
                                            "</div>"+
                                        "</div>"+
                                        "<div>"+
                                            "<table style='margin-top:20px; width: 100%; table-layout: fixed'>"+
                                            "<thead>"+
                                                "<tr>"+
                                                "<th style='width: 25%; text-align:left'>"+
                                                    "GDH"+
                                                "</th>"+
                                                "<th style='width: 25%; padding-right: 5px;' class='numericValue'>"+
                                                    "Valor Unitário"+
                                                "</th>"+
                                                "<th style='width: 25%; padding-right: 5px;' class='numericValue'>"+
                                                    "Nº Total de Episódios"+ 
                                                "</th>"+
                                                "<th style='width: 25%; text-align: left'>"+
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
                                                "<b style='padding-right: 17px;'>N.º Total de Episódios</b><br>"+
                                                "<div style='width: calc(100% - 15px); background: #EBF6F5; border-radius: 5px;'>"+
                                                "<span id='all_Episodios_nr'></span>"+
                                                "</div>"+
                                            "</div>"+
                                            "<div class='col numericValue'>"+
                                                "<b style='padding-right: 17px;'>Valor a Pagar</b><br>"+
                                                "<div style='width: calc(100% - 15px); background: #EBF6F5; border-radius: 5px;'>"+
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
        gdhList.forEach(function(gdh, it_gdh) {
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
                            "<i class='fas fa-search tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()' onclick='resumo_GDHDetail("+it+","+it_gdh+")' style='color:rgba(3, 106, 255, .95); margin-left: 15px; cursor: pointer;'>"+
                                "<div class='tooltip right_tooltip'>Ver episódios do GDH '"+gdh['gdh']+"'</div>"+
                            "</i>"+
                        "</td>"+
                        "<td style='width:5%'>"+
                        "</td>"+
                        "</tr>";
            $("#body_servico").append(div);
            }
        
        });
        $("#all_Episodios_nr").text(episodiosPorValidar.length);
        $("#all_Episodios_value").text(valorApagarTotal.toFixed(2) + " €");
    }
}


function resumo_GDHDetail(it_servico, it_gdh){
    var servico = servicos[it_servico];
    var episodiosDoGDHTarget = [];
    servico.episodios.forEach(function (episodio) {
        if( (episodio['gdh1'] == gdhList[it_gdh].id && episodio['gdh2'] == null) || (episodio['gdh2'] == gdhList[it_gdh].id)){
            episodiosDoGDHTarget.push(episodio);
        }
    });
    var resumo_GDHDetail_Modal = "<div class='overlay' id='resumo_gdh_modal'>"+
                                    "<div id='resumo_GDHDetail_Modal' style='width:60vw; line-height: 175%;' class='modal bigModal'>"+
                                        "<div><i onclick='closesubModaisResumo(2);' style='color:rgba(3, 106, 255, .95); float:right;' class='fas fa-times-circle close_modal'></i></div>"+
                                        "<div class='col_container' style='border-bottom: 1px solid lightgray; padding-bottom:15px'>"+
                                            "<div class='col col_50'>"+
                                            "<b>GDH:</b> "+gdhList[it_gdh]['gdh']+
                                            "<br><b>Serviço:</b> "+servico.servico+
                                            "<br><b>Período:</b> "+($("#data_cir_ini_filtro").val()+" a "+$("#data_cir_fim_filtro").val())+
                                            "</div>"+
                                        "</div>"+
                                        "<div id='resumo_GDHDetail_Modal_body' style='max-height: 600px; margin-top:15px; overflow: auto'>"+
                                        "</div>"+
                                        "<div>"+
                                            "<button onclick='closesubModaisResumo(2);' style='margin-top:15px;' class='confirm-btn'>Fechar</button>"+
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


function calcGDHValuePerInterveniente(episodio, interveniente){
    if(episodio['gdh2'] == null){
        var valor = 0;
        var valorGDH1;
        var gdh1 = episodio['gdh1'];
        var tagetGDH1;
        for (let id = 0; id < gdhList.length; id++) {
            const gdh = gdhList[id];
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
        for (let id = 0; id < gdhList.length; id++) {
            const gdh = gdhList[id];
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

// draw Episodios
function drawEpisodios(episodios){
    $("#episodios_body").empty(); 
    if(episodios.length !== 0){
        var user = JSON.parse(sessionStorage.getItem("user"));
        episodios.forEach(function(episodio, it) {
            var div =   "<div class='episodio' id='episodio"+it+"'>"+
                            "<section style='width:46%;'>"+
                                "<div style='width:calc(10% - 20px)' class='borderBottom'>"+
                                    "HUC" +
                                "</div>"+
                                "<div style='width:calc(24% - 20px)' class='marginLeft20 borderBottom'>"+
                                    episodio['num_processo']+
                                "</div>"+
                                "<div style='width:calc(66% - 20px); font-weight:600' class='marginLeft20 borderBottom'>"+
                                    episodio['nome'].toUpperCase()+
                                "</div>"+
                            "</section>"+
                            "<section style='width:10%;'>"+
                                "<div style='width:calc(100% - 20px)' class='borderBottom'>"+
                                    episodio['dta_cirurgia']+
                                "</div>"+
                            "</section>"+
                            "<section style='width:7.76%;'>"+
                                "<div style='width:calc(100% - 20px)' class='borderBottom numericValue'>"+
                                    (episodio['gdh1'] != null ? getGDHRef(episodio['gdh1']) : 'indefinido')+
                                "</div>"+
                            "</section>"+
                            "<section style='width:7.76%;'>"+
                                "<div style='width:calc(100% - 20px)' class='borderBottom numericValue'>"+
                                    (episodio['gdh2'] != null ? getGDHRef(episodio['gdh2']) : 'indefinido')+
                                "</div>"+
                            "</section>"+
                            "<section style='width:7.76%;'>"+
                                "<div style='width:calc(100% - 20px)' class='borderBottom numericValue'>"+
                                    getValorOfEpisodio(episodio['gdh1'], episodio['gdh2'])+
                                "</div>"+
                            "</section>"+
                            "<section style='width:calc(13% - 20px);'>"+
                                "<div style='width:calc(100% - 20px)' class='borderBottom'>"+
                                    getNomeEstado(episodio['estado']).substring(0, 2) + " " +(episodio['data_estado'] != null ? episodio['data_estado'] : 'n/a')+
                                "</div>"+
                            "</section>"+
                            "<section class='check'>"+
                                "<label class='container costumHeight' id='container_"+getHTMLidEpisodio(episodio['estado'], it)+"'>"+
                                    "<input onclick='checkIfAllSelected("+episodio['estado']+","+it+")'type='checkbox' id='"+getHTMLidEpisodio(episodio['estado'], it)+"' class='pendente_secretariado episodio_select'>"+
                                    "<span class='checkmark costumCheck_inner'></span>"+
                                "</label>"+
                                "<i onclick='toggleEpisodio("+it+", event)' id='toggle"+it+"' class='toggle fas fa-plus-circle tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Mostrar/Esconder detalhe do episódio.</div></i>"+
                                "<i onclick='editEpisodio("+it+", event)' id='edit"+it+"' class='edit fas fa-pencil-alt tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Editar episódio.</div></i>"+
                                "<i onclick='printEpisodio("+it+", event)' id='print"+it+"' class='print fas fa-print'></i>"+
                            "</section>"+
                            "<section id='collapsable"+it+"' class='collapsable' onclick='stopPropagation(event)'>"+
                                "<div class='col_45_float'>"+
                                    "<h5 style='font-size:.7vw'>DETALHES DO EPISÓDIO</h5>"+
                                    "<div class='divider'></div>"+
                                    "<div id='equipaTableHeader' class='tableHeader'>"+
                                        "<div style='width: 65%'>"+
                                            "Equipa Cirúrgica"+
                                        "</div>"+
                                        "<div style='width: 15%; transform: translateX(-15px); text-align:right'>"+
                                            "%"+
                                        "</div>"+
                                        "<div style='width: 20%; text-align:right'>"+
                                            "Valor"+
                                        "</div>"+
                                    "</div>"+
                                    "<div id='equipaTableBody"+it+"' class='tableBody'>"+
                                    "</div>"+
                                    "<div id='equipaATableHeader' class='tableHeader'>"+
                                        "<div style='width: 65%'>"+
                                            "Equipa de Apoio"+
                                        "</div>"+
                                        "<div style='width: 15%; transform: translateX(-15px); text-align:right'>"+
                                            "%"+
                                        "</div>"+
                                        "<div style='width: 20%; text-align:right'>"+
                                            "Valor"+
                                        "</div>"+
                                    "</div>"+
                                    "<div id='equipaATableBody"+it+"' class='tableBody'>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='col_50'>"+
                                    "<div id='intervencaoTableHeader' class='tableHeader'>"+
                                        "<div style='width: 100%'>"+
                                            "Intervenções"+
                                        "</div>"+
                                    "</div>"+
                                    "<div id='intervencaoTableBody' class='tableBody'>";
                                    episodio['intervencoes'].forEach(function(intervencao, it) {
                                div+=   "<div style='width: 10%; float: left'>"+intervencao['sigla']+"</div>"+
                                        "<div style='width: calc(90% - 15px); margin-left:15px; float: left'>"+intervencao['nome'].toUpperCase()+"</div>";
                                    });    
                            div +=  "</div>"+
                                    "<div id='diagnosticoTableHeader' class='tableHeader'>"+
                                        "<div style='width: 100%'>"+
                                            "Diagnósticos"+
                                        "</div>"+
                                    "</div>"+
                                    "<div id='diagnosticoTableBody' class='tableBody'>";
                                    episodio['diagnosticos'].forEach(function(diagnostico, it) {
                                div+=   "<div style='width: 10%; float: left'>"+diagnostico['sigla']+"</div>"+
                                        "<div style='width: calc(90% - 15px); margin-left:15px; float: left'>"+diagnostico['nome'].toUpperCase()+"</div>";
                                    });    
                            div +=  "</div>"+
                                    "<div id='cirugiaSegura'>"+
                                        "<span class='cirurgia_segura_label_collapsable' style='float: left'>Cirúrgia Segura:</span>"+
                                        "<label class='container costumHeight container_cirurgia_segura_check'>"+
                                            "Sim"+
                                            "<input type='checkbox' id='cirSegura_sim_"+it+"' onclick='marcarCirurgiaSegura("+it+", event)' "+(parseInt(episodio['cir_segura']) == 1 ? 'checked' : '')+">"+
                                            "<span class='checkmark costumCheck_inner'></span>"+
                                        "</label>"+
                                        "<label class='container costumHeight container_cirurgia_segura_check'>"+
                                            "Não"+
                                            "<input type='checkbox' id='cirSegura_nao_"+it+"' onclick='marcarCirurgiaInsegura("+it+", event)' "+(parseInt(episodio['cir_segura']) == 0 ? 'checked' : '')+">"+
                                            "<span class='checkmark costumCheck_inner'></span>"+
                                        "</label>"+
                                    "</div>"+
                                "</div>"+
                            "</section>"+
                        "</div>";
            $("#episodios_body").append(div); 
            checkErrosEpisodio(episodio, it);
            if(user['role_id'] == "1"){
                checkIfEpisodioIsValidOrNotLVL1(episodio, it);
            } else if(user['role_id'] == "2"){
                checkIfEpisodioIsValidOrNotLVL2(episodio, it);
            } else if(user['role_id'] == "3"){
                $(".container_cirurgia_segura_check").remove();
                $(".cirurgia_segura_label_collapsable").text('Cirúrgia Segura: ' + (episodio['cir_segura'] == 1 ? 'Sim' : 'Não'));
                checkIfEpisodioIsValidOrNotLVL3(episodio, it);
            } else if(user['role_id'] == "4"){
                $(".container_cirurgia_segura_check").remove();
                $(".cirurgia_segura_label_collapsable").text('Cirúrgia Segura: ' + (episodio['cir_segura'] == 1 ? 'Sim' : 'Não'));
                checkIfEpisodioIsValidOrNotLVL4(episodio, it);
            }
            else if(user['role_id'] == "5"){
                $(".container_cirurgia_segura_check").remove();
                $(".cirurgia_segura_label_collapsable").text('Cirúrgia Segura: ' + (episodio['cir_segura'] == 1 ? 'Sim' : 'Não'));
                checkIfEpisodioIsValidOrNotLVL4(episodio, it);
            }
            if(episodio.estado == "4"){
                $(".edit").remove();
            }
            drawEquipaCirurgicaeApoioMainList(episodio, it);
        });
    } else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum Episódio para mostrar"+
                            "</div>";
        $("#episodios_body").append(elementoDiv); 
    }
}

//marcar como cirurgia segura
function marcarCirurgiaSegura(it, event){
    var episodio = episodios[it];
    if(episodio.cir_segura != '1'){
        addLoading();
        var fd = new FormData();
        fd.append('id', episodio['id']);
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        $.ajax({
            type: "POST",
            url: "./api/episodios/marcarCirurgiaSegura.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                var response = JSON.parse(data); 
                removeLoading();
                if(response == 'error'){
                    toastr("Erro ao marcar episódio como seguro", "error");
                    return;
                } else {
                    $("#cirSegura_sim_"+it).prop('checked', true);
                    $("#cirSegura_nao_"+it).prop('checked', false);   
                    episodio.cir_segura = "1";
                }
            }
        });
    } else {
        event.preventDefault();
    }
}

//marcar como cirurgia insegura
function marcarCirurgiaInsegura(it, event){
    var episodio = episodios[it];
    if(episodio.cir_segura != '0'){
        addLoading();
        var fd = new FormData();
        fd.append('id', episodio['id']);
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        $.ajax({
            type: "POST",
            url: "./api/episodios/marcarCirurgiaInsegura.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                var response = JSON.parse(data); 
                removeLoading();
                if(response == 'error'){
                    toastr("Erro ao marcar episódio como inseguro", "error");
                    return;
                } else {
                    $("#cirSegura_sim_"+it).prop('checked', false);
                    $("#cirSegura_nao_"+it).prop('checked', true);   
                    episodio.cir_segura = "0";
                }
            }
        });
    } else {
        event.preventDefault();
    }
}

// check if Episodio is valid - lvl 1
function checkIfEpisodioIsValidOrNotLVL1(episodio, it){
    if(meuServico['dupla_validacao_equipa'] == '1'){
        if(episodio['estado'] == "0"){
            // $("#container_pendente_secretariado_"+it).html("<div class='simulatedCheckbox_unchecked'></div>");
            $("#container_pendente_secretariado_"+it).html("");
        } else if(episodio['estado'] == "1"){
            $("#container_pendente_gdh_"+it).html("<div class='episodioValidado_check'><i class='fas fa-check-circle tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Episódio Validado.</div></i></div>");
            $("#episodio"+it).addClass('episodioValidado');
            $("#edit"+it).remove();
        }
    } else {
        if(episodio['estado'] == "1"){
            $("#container_pendente_gdh_"+it).html("<div class='episodioValidado_check'><i class='fas fa-check-circle tooltip_container'  onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Episódio Validado.</div></i></div>");
            $("#episodio"+it).addClass('episodioValidado');
            $("<i onclick='removeValidationPendenteSecretariado("+it+")' class='tooltip_container removeValidation fas fa-times-circle' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Desvalidar o episódio.</div></i>").insertAfter("#toggle"+it);
            $("#edit"+it).remove();
        } 
    }
}

//remover validação de pendente de secretariado
function removeValidationPendenteSecretariado(it) {
    var episodio = episodios[it];
    var fd = new FormData();
    fd.append('id', episodio['id']);
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/desvalidatePendenteSecretariado.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            var response = JSON.parse(data); 
            if(response == 'error'){
                toastr("Erro ao desvalidar episódio(s)", "error");
                return;
            } else {
                pesquisaEpisodios();
            }
        }
    });
}

// check if Episodio is valid - lvl 2
function checkIfEpisodioIsValidOrNotLVL2(episodio, it){
    if(episodio['estado'] == "0"){
    } else if(episodio['estado'] == "1"){
        $("#container_pendente_gdh_"+it).html("<div class='episodioValidado_check'><i class='fas fa-check-circle tooltip_container'  onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Episódio Validado.</div></i></div>");
        $("#episodio"+it).addClass('episodioValidado');
        $("<i onclick='removeValidationPendenteSecretariado("+it+")' class='tooltip_container removeValidation fas fa-times-circle' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Desvalidar o episódio.</div></i>").insertAfter("#toggle"+it);
        $("#edit"+it).remove();
    }
}

// check if Episodio is valid - lvl 3
function checkIfEpisodioIsValidOrNotLVL3(episodio, it) {
    if(episodio['estado'] == "0"){
        $("#container_pendente_secretariado_"+it).html("<div class='simulatedCheckbox_unchecked'></div>");
        $("#edit"+it).remove();
    }
    else if(episodio['estado'] == "2"){
        $("#container_pendente_pagamento_"+it).html("<div class='episodioValidado_check'><i class='fas fa-check-circle tooltip_container'  onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Episódio Validado.</div></i></div>");
        $("#episodio"+it).addClass('episodioValidado');
        $("<i onclick='removeValidationPendenteGDH("+it+")' class='tooltip_container removeValidation fas fa-times-circle' onmouseover='showTooltip(this)' onmouseout='hideTooltips()'><div class='tooltip right_tooltip'>Desvalidar o episódio.</div></i>").insertAfter("#toggle"+it);
        $("#edit"+it).remove();
    }
}

//remover validação de pendente de gdh
function removeValidationPendenteGDH(it){
    var episodio = episodios[it];
    var fd = new FormData();
    fd.append('id', episodio['id']);
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/desvalidatePendenteGDH.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            var response = JSON.parse(data); 
            if(response == 'error'){
                toastr("Erro ao desvalidar episódio(s)", "error");
                return;
            } else {
                pesquisaEpisodios();
            }
        }
    });
}

// check if Episodio is valid - lvl 4
function checkIfEpisodioIsValidOrNotLVL4(episodio, it){
    if(episodio['estado'] == "0"){
        var user = JSON.parse(sessionStorage.getItem('user'));
        // $("#container_pendente_secretariado_"+it).html("<div class='simulatedCheckbox_unchecked'></div>");
        if(user.role_id == "4"){
            $("#container_pendente_secretariado_"+it).html("");
        }
        $("#edit"+it).remove();
    }
    else if(episodio['estado'] == "2"){
        $("#edit"+it).remove();
        if(episodio['pago'] == '-1'){
            var div =   "<i onclick='checkRefusedEpisodeOptions("+it+", 0)' class='fas fa-exclamation-triangle otherIcon tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()' style='position: absolute; top: 1px; left: 2.85vw; color: red; font-size: 1.1vw;'>"+
                            "<div class='tooltip right_tooltip'>Episódio Recusado pelo Conselho de Administração<br><b>Click para ver opções</b></div>"+
                        "</i>";
            $("#episodio"+it).addClass('refused_episodio');
            $(div).insertAfter("#toggle"+it);
        } else {
            var div =   "<i onclick='checkRefusedEpisodeOptions("+it+", 1)' class='fas fa-undo otherIcon tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()' style='position: absolute; top: 1px; left: 2.85vw; color: #036aff; font-size: 1.1vw;'>"+
                            "<div class='tooltip right_tooltip'>Enviar episódio para estado anterior<br><b>Click para ver opções</b></div>"+
                        "</i>";
            $(div).insertAfter("#toggle"+it);
        }
    }
    else if(episodio['estado'] == "3"){
        var div;
        if(episodio['pago'] == '1'){
            div = "<i class='fas fa-check-circle otherIcon tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()' style='position:absolute; top:1px; left:-.1vw; color:green; font-size:1.2vw;'>"+
                    "<div class='tooltip right_tooltip'>Aprovado pelo Coselho de Administração</div>"+
                  "</i>";  
        } else if(episodio['pago'] == '0'){
            div = "<i class='fas fa-ellipsis-h otherIcon tooltip_container' onmouseover='showTooltip(this)' onmouseout='hideTooltips()' style='position:absolute; top:1px; left:-.1vw; background: blue; color: white; border-radius: 50%; padding: 3px; font-size: .85vw;'>"+
                    "<div class='tooltip right_tooltip'>Pendente de Aprovação pelo Coselho de Administração</div>"+
                  "</i>";
        }
        $("#container_enviado_pagamento_"+it).remove();
        $(div).insertBefore("#toggle"+it);
        $("#edit"+it).remove();
    }
}

function checkRefusedEpisodeOptions(it , from){
    var episodio = episodios[it];
    var div = "<div class='overlay'>"+
                "<div id='refusedEpisodeOptions' class='modal bigModal'>";
                if(from == 0){
        div += "<h4 class='modal_title font-black'>O Episódio '<b>"+episodio['num_processo']+"</b> - "+episodio['nome']+"' foi reprovado pelo Conselho de administração <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>";
                } else {
        div += "<h4 class='modal_title font-black'>Enviar o Episódio '<b>"+episodio['num_processo']+"</b> - "+episodio['nome']+"' para um estado anterior <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>";
                }
            div += "<div style='font-size:12px; margin-top: 5px; background: #d0f3f3; padding: 10px 20px; border-radius: 5px; line-height:175%; max-height: 500px; overflow: auto;'>"+
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
                        div +=  "<span>"+intervencao.sigla+" - "+intervencao.nome+"</span>";
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
                    "<div>"+
                        "<button class='button' onclick='sendReffusedToSecretariado("+it+")'>Passar episódio para pendente de verificação de Secretariado</button>"+    
                        "<button class='button' onclick='sendReffusedToGDH("+it+")'>Passar episódio para pendente de GDH</button>"+     
                    "</div>"+
                "</div>"+
              "</div>";
    $("body").append(div);
}

//manda episodio recusado para secretariado
function sendReffusedToSecretariado(it){
    var episodio = episodios[it];
    addLoading();
    var fd = new FormData();
    fd.append('id', episodio['id']);
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    $.ajax({
        type: "POST",
        url: "./api/episodios/sendRefusedToSecretariado.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            var response = JSON.parse(data); 
            removeLoading();
            if(response == 'error'){
                toastr("Erro ao enviar episódio para o secretariado", "error");
            }
            closeModal();
            pesquisaEpisodios();
        }
    });
}

//manda episodio recusado para secretariado
function sendReffusedToGDH(it){
    var episodio = episodios[it];
    addLoading();
    var fd = new FormData();
    fd.append('id', episodio['id']);
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    $.ajax({
        type: "POST",
        url: "./api/episodios/sendRefusedToGDH.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            var response = JSON.parse(data); 
            removeLoading();
            if(response == 'error'){
                toastr("Erro ao enviar episódio para pendente de GDH", "error");
            }
            closeModal();
            pesquisaEpisodios();
        }
    });
}

// get HTML id episodio
function getHTMLidEpisodio(estado, it){
    if(estado == '0'){
        return "pendente_secretariado_"+it;
    }
    if(estado == '1'){
        return "pendente_gdh_"+it;
    }
    if(estado == '2'){
        return "pendente_pagamento_"+it;
    }
    if(estado == '3'){
        return "enviado_pagamento_"+it;
    }
}

// get GDH ref
function getGDHRef(id) {
    var gdh;
    for (let it = 0; it < gdhList.length; it++) {
        const gdh_candidate = gdhList[it];
        if(gdh_candidate.id == id){
            gdh = gdh_candidate.gdh;
            break;
        }   
    }
    return gdh;
}

// desenha equipa cirurgica e de apoio
function drawEquipaCirurgicaeApoioMainList(episodio, it) {
    var equipaCirugica = [];
    var equipaApoio = [];
    episodio['intervenientes'].forEach(function(interveniente) {
        var funcao = interveniente.funcao;
        if(funcao.equipa != "EA"){
            equipaCirugica.push(interveniente);
        } else{
            equipaApoio.push(interveniente);
        }
    });
    episodio['equipaCirugica'] = equipaCirugica;
    episodio['equipaApoio'] = equipaApoio;
    if(equipaCirugica.length >0){
        equipaCirugica.forEach(function(interveniente) {
        var funcao = interveniente.funcao;
        var div=   "<div style='width: calc(65% - 30px)'>"+
                        interveniente['n_mec'] + " <span style='margin-left: 15px'>" + interveniente['nome'].substring(0,30) + (interveniente['nome'].length>30 ? '...' : '') + "</span>" +
                    "</div>"+
                    "<div style='width: 15%; margin-left:15px;' class='numericValue'>"+
                        funcao['perc']+"%"+
                    "</div>"+
                    "<div style='width: 20%; margin-left:15px; text-align:right'>"+
                        (episodio['gdh1'] == null && episodio['gdh2'] == null ? 'n/d' : getValueOfPercentage(episodio['gdh1'], episodio['gdh2'],  interveniente)) +
                    "</div>";
            $("#equipaTableBody"+it).append(div);
        });
    } else {
        var div =  "<div style='width: 100%; text-align: center'>"+
                        "Nenhum Interveniente"+
                    "</div>";
        $("#equipaTableBody"+it).append(div);
    }

    if(equipaApoio.length >0){
        equipaApoio.forEach(function(interveniente) {
            var funcao = interveniente.funcao;
            var div=   "<div style='width: calc(65% - 30px)'>"+
                            interveniente['n_mec'] + " <span style='margin-left: 15px'>" + interveniente['nome'].substring(0,30) + (interveniente['nome'].length>30 ? '...' : '') + "</span>" +
                        "</div>"+
                        "<div style='width: 15%; margin-left:15px;' class='numericValue'>"+
                            funcao['perc']+"%"+
                        "</div>"+
                        "<div style='width: 20%; margin-left:15px; text-align:right'>"+
                            (episodio['gdh1'] == null && episodio['gdh2'] == null ? 'n/d' : getValueOfPercentage(episodio['gdh1'], episodio['gdh2'], interveniente)) +
                        "</div>";
            $("#equipaATableBody"+it).append(div);
        }); 
    } else {
        var div=    "<div style='width: 100%; text-align: center'>"+
                        "Nenhum Interveniente"+
                    "</div>";
        $("#equipaATableBody"+it).append(div);
    }
  
}

var meuServico = null;
// get servicos
function getServicos(){
    $.ajax({
        type: "GET",
        url: "./api/servicos/getServicos.php",
        processData: false,
        contentType: false,
        success:function(data){
            servicos = JSON.parse(data);
            var user = JSON.parse(sessionStorage.getItem("user"));
            $('#servico_filtro, #agrupamento_filtro').empty()
            $("#servico-filter").append(new Option("Qualquer", ""));
            if(user['role_id'] != 1){
                $("#servico_filtro").append(new Option("Qualquer", ""));
                var servicosAgrupamentos = [];
                servicos.forEach(function (servico) {
                    if(!servicosAgrupamentos.includes(servico.agrupamento)){
                        servicosAgrupamentos.push(servico.agrupamento)
                    }
                });
                $("#agrupamento_filtro").append(new Option("Qualquer", ""));
                servicosAgrupamentos.forEach( function (agrupamento) {
                    $("#agrupamento_filtro").append(new Option(agrupamento, agrupamento));
                });
            } else {
                var targetServico;
                for (let it = 0; it < servicos.length; it++) {
                    const serv = servicos[it];
                    if(serv.id == user['servico_id']){
                        targetServico = serv;
                        break;
                    }
                }
                meuServico = targetServico;
                $("#servico_filtro").append(new Option(targetServico.servico, targetServico.id));
                $("#agrupamento_filtro").append(new Option(targetServico.agrupamento, targetServico.agrupamento));
                if(targetServico.dupla_validacao_equipa == "1"){
                    $("#validarPendenteSecretariado").remove();
                    $("#episodios_body").css('height', 'calc(100vh - 8vw)');
                }
                if(meuServico.dupla_validacao_equipa == "1"){
                    $("#mainListSellALL").remove();
                }
            }
            servicos.forEach(function(servico, it) {
                $("#servico-filter").append(new Option(servico.servico, servico.id));
                if(user['role_id'] != 1){
                    $("#servico_filtro").append(new Option(servico.servico, servico.id));
                }
            });  
            getBlocos();
        }
    });
}

// get blocos
function getBlocos(){
    $.ajax({
        type: "GET",
        url: "./api/blocos/getBlocos.php",
        processData: false,
        contentType: false,
        success:function(data){
            blocos = JSON.parse(data);
            var user = JSON.parse(sessionStorage.getItem('user'));
            $("#bloco_filtro").empty();
            $("#gdh_filtro").empty();
            if(user['role_id'] == 1){
                var blocosVisivies = [];
                blocos.forEach( function (bloco) {
                    var exists = false;
                    for (let it = 0; it < episodios.length; it++) {
                        const episodio = episodios[it];
                        if(episodio.bloco == bloco.id){
                            exists = true;
                            blocosVisivies.push(bloco);
                            break;
                        }
                    }
                });
                if(blocosVisivies.length > 1){
                    $("#bloco_filtro").append(new Option("Qualquer", ""));
                }
                blocosVisivies.forEach(function (bloco) {
                    $("#bloco_filtro").append(new Option(bloco.nome, bloco.id));
                });
            } else {
                $("#bloco_filtro").append(new Option("Qualquer", ""));
                blocos.forEach( function (bloco) {
                    $("#bloco_filtro").append(new Option(bloco.nome, bloco.id));
                });
            }
            drawOpcoesBlocos();
            $("#gdh_filtro").append(new Option("Qualquer", ""));
            gdhList.forEach(function (gdh) {
                $("#gdh_filtro").append(new Option(gdh.gdh + " ("+gdh.cod_gdh+")", gdh.id));
            });
            drawEpisodios(episodios);
            removeLoading();
        }
    });
}

function drawOpcoesBlocos() {
    var user = JSON.parse(sessionStorage.getItem('user'));
    $("#bloco_filtro").empty();
    if(user['role_id'] == 1){
        var blocosVisivies = [];
        blocos.forEach( function (bloco) {
            var exists = false;
            for (let it = 0; it < episodios.length; it++) {
                const episodio = episodios[it];
                if(episodio.bloco == bloco.id){
                    exists = true;
                    blocosVisivies.push(bloco);
                    break;
                }
            }
        });
        if(blocosVisivies.length > 1){
            $("#bloco_filtro").append(new Option("Qualquer", ""));
        }
        blocosVisivies.forEach(function (bloco) {
            $("#bloco_filtro").append(new Option(bloco.nome, bloco.id));
        });
    } else {
        $("#bloco_filtro").append(new Option("Qualquer", ""));
        blocos.forEach( function (bloco) {
            $("#bloco_filtro").append(new Option(bloco.nome, bloco.id));
        });
    }
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

// get value to recievr by an intervinient
function getValueOfPercentage(gdh1, gdh2, interveniente) {
    if(gdh1 != null && gdh2 == null){
        var GDH1;
        
        for (let index = 0; index < gdhList.length; index++) {
            const gdhCan = gdhList[index];
            if(gdhCan.id == gdh1){
                GDH1 = gdhCan;
            }
        }
        var valorGDH = parseFloat(GDH1['v_uni']);
        var percentageGDH = parseFloat(GDH1['perc']);
        var gdh_finalVal = valorGDH * percentageGDH / 100;
        var funcao = interveniente.funcao;
        var valor = gdh_finalVal * parseFloat(funcao['perc']) / 100;
        return valor.toFixed(2) + " €"; 
    } else if(gdh1 == null && gdh2 == null){
        return "n/d";
    } else {
        var GDH2; 
        for (let index = 0; index < gdhList.length; index++) {
            const gdhCan = gdhList[index];
            if(gdhCan.id == gdh2){
                GDH2 = gdhCan;
            }
        }
        var valorGDH2 = parseFloat(GDH2['v_uni']);
        var percentageGDH2 = parseFloat(GDH2['perc']);
        var gdh_finalVal2 = valorGDH2 * percentageGDH2 / 100;
        var funcao = interveniente.funcao;
        var valor =  (gdh_finalVal2 * parseFloat(funcao['perc']) / 100);
        return valor.toFixed(2) + " €";
    }
}

// toggle episodios
function toggleEpisodio(it, evt) {
    evt.stopPropagation();
    $("#collapsable"+it).toggleClass("expanded"); 
    $("#episodio"+it).toggleClass("open"); 
    if($("#collapsable"+it).hasClass("expanded")){
        $("#toggle"+it).removeClass("fa-plus-circle").addClass("fa-minus-circle");
        $("#edit"+it + ", #print"+it).css("display","block");
    } else {
        $("#toggle"+it).removeClass("fa-minus-circle").addClass("fa-plus-circle");
        $("#edit"+it + ", #print"+it).css("display","none");
    }
}

// editar episodio
function editEpisodio(it, evt) {
    evt.stopPropagation();  
    showEditModal(episodios[it]);
}

// imprimir episodio
function printEpisodio(it, evt) {
    evt.stopPropagation();
    var episodio = episodios[it];   
    episodio['serviceName'] = getServiceName(episodio['servico']); 
    episodio['blocoName'] = getBlocoName(episodio['bloco']);
    var targetGDH;
    if(episodio['gdh2'] == null){
        if(episodio['gdh1'] == null){
            targetGDH = null;
        } else {
            for (let it = 0; it < gdhList.length; it++) {
                const gdh_candidate = gdhList[it];
                if(gdh_candidate.id == episodio['gdh1']){
                    targetGDH = gdh_candidate;
                    break;
                }
            }
        }
    }else{
        for (let it = 0; it < gdhList.length; it++) {
            const gdh_candidate = gdhList[it];
            if(gdh_candidate.id == episodio['gdh2']){
                targetGDH = gdh_candidate;
                break;
            }
        }
    }
    episodio['gdhToPay'] = targetGDH; 

    var fd = new FormData();
    fd.append('episodio', JSON.stringify(episodio));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', JSON.stringify(user));
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/pdfs/episodioPDF.php",
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

// fechar modal primaria
function closeModal() {
    $(".overlay").remove();
}

// fechar modal secundaria
function closeSubModal(){
    $(".submodal").remove();
}

// stoppropagation
function stopPropagation(evt){
    evt.stopPropagation();
}

// validar pendentes de secretariado
function validarEquipasEpisodios() {
    var listaToAdd = [];
    var erros = [];
   
    episodios.forEach(function(episodio, it) {
        if($("#pendente_secretariado_"+it).is(':checked')){
            if(parseInt(episodio['cir_segura']) == 0){
                var erro = {
                    episodio: episodio,
                    tipo: 'warning',
                    erro: 'não está marcado como cirurgia segura'
                };
                erros.push(erro);
            }          
            var hasElementEC = false;
            var hasElementEA = false;
            var somaDasPercentagens = 0;
            episodio.intervenientes.forEach(function(interveniente) {
                var funcao = interveniente.funcao;
                if(funcao.equipa == 'EC'){
                    hasElementEC = true;
                }
                if(funcao.equipa == 'EA'){
                    hasElementEA = true;
                }
                somaDasPercentagens += Number(funcao.perc);
            });
            if(!hasElementEC){
                var erro = {
                    episodio: episodio,
                    tipo: 'error',
                    erro: 'não tem elementos na equipa cirurgica'
                };
                erros.push(erro);
            }
            if(!hasElementEA){
                var erro = {
                    episodio: episodio,
                    tipo: 'error',
                    erro: 'não tem elementos na equipa de apoio'
                };
                erros.push(erro);
            }
            if(somaDasPercentagens != 100){
                var erro = {
                    episodio: episodio,
                    tipo: 'error',
                    erro: 'a soma das percentagens dos intervenientes dá '+somaDasPercentagens+'%' 
                };
                erros.push(erro);
            }
            var servico;
            for (let i = 0; i < servicos.length; i++) {
                const servicoI = servicos[i];
                if(episodio.servico == servicoI.id){
                    servico = servicoI;
                    break;
                }
            }   
            var horaInicioServico = moment(servico.horario_ini, 'HH:mm:ss');
            var horaEntradaBloco = moment(episodio.horas_oper_ini, 'HH:mm:ss');
            var isHoraEntradaBlocoEarlier = horaInicioServico.isBefore(horaEntradaBloco) 
            if(!isHoraEntradaBlocoEarlier){
                var erro = {
                    episodio: episodio,
                    tipo: 'warning',
                    erro: 'a hora registada como entrada no bloco operatório ('+horaEntradaBloco.format('HH:mm:ss')+') é anterior ao horário de funcionamento do serviço "'+servico['servico']+'" ('+horaInicioServico.format('HH:mm:ss')+')', 
                };
                erros.push(erro);
            }
            listaToAdd.push(episodio);
        }
    });

    if(listaToAdd.length == 0 && erros.length == 0){
        toastr("Selecione pelo menos um episódio para validar", "error");
        return;
    }
    var errosValidacaoSecretariadoModal="<div class='overlay'>"+
                                            "<div id='erros_validacao_pendente_secretariado' class='modal bigModal'>"+
                                                "<h4 class='modal_title font-black'>Erro(s) ao validar episódio(s) <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                                "<p id='episodios_com_erros_pendente_secretariado_label'>Os seguintes episódios <span style='color:red'>não serão válidados</span> devido à existência de erros:</p>"+
                                                "<div id='episodios_com_erros_pendente_secretariado' class='errors_modal_container'>"+
                                                "</div>"+
                                                "<p id='episodios_com_inconformidades_pendente_secretariado_label' style='border-top: 1px solid lightgray; padding-top: 15px; margin-top: 15px;'>Os seguintes episódios <span style='color:orange'>poderão ser válidados</span> mas apresentam inconformidades:</p>"+
                                                "<div id='episodios_com_inconformidades_pendente_secretariado' class='errors_modal_container'>"+
                                                    "<label class='container costumHeight' style='width:1.75vw; float: left; margin-right: 1vw;'>"+
                                                        "<input type='checkbox' id='episodio_desconforme_all' onclick='selecAlltDesconformes()'>"+
                                                        "<span class='checkmark costumCheck_inner'></span>"+
                                                    "</label>"+ 
                                                    "<b>Selecionar todos os desconformes</b>"+
                                                "</div>"+
                                                "<p id='episodios_sem_erros_pendente_secretariado_label' style='border-top: 1px solid lightgray; padding-top: 15px; margin-top: 15px;'>Assim sendo, apenas os seguintes episódios serão validados:</p>"+
                                                "<div id='episodios_sem_erros_pendente_secretariado' class='errors_modal_container'>"+
                                                "</div>"+
                                                "<div style='margin-top:1vw'>"+
                                                    "<button id='validarEpisodiosComErros_pendente_secretariado' class='confirm-btn'>Validar Conformes e Desconformes Selecionados (<span id='nrOfSelected'>0</span>)</button>"+
                                                    "<button id='validarEpisodiosSemErros_pendente_secretariado' class='confirm-btn'>Validar Apenas Conformes</button>"+
                                                    "<button onclick='closeModal();' class='confirm-btn'>Cancelar</button>"+
                                                "</div>"+
                                            "</div>"+        
                                        "</div>";
    if(erros.length > 0){
        var contaImpeditivos = 0;
        var contaInconformes = 0;
        var contaConformes = 0;
        $("body").append(errosValidacaoSecretariadoModal);
        for (let index = 0; index < listaToAdd.length; index++) {
            const episodio = listaToAdd[index];
            var errosEpisodio = [];
            erros.forEach(function (error) {
                if(error.episodio == episodio){
                    errosEpisodio.push(error);
                }
            });
            if(errosEpisodio.length == 0){
                contaConformes++;
                listaToAdd[index]['errosImpeditivos'] = [];
                listaToAdd[index]['errosNaoImpeditivos'] = [];
                $("#episodios_sem_erros_pendente_secretariado").append("<p><b>"+episodio['num_processo']+"</b> - "+episodio['nome']+" <i style='color:green; margin-left:5px;' class='fas fa-check-circle'></i></p>");
            } else {
                var errosImpeditivos = [];
                var errosNaoImpeditivos = [];
                errosEpisodio.forEach(function (error) {
                    if(error.tipo == 'error'){
                        errosImpeditivos.push(error);
                    }else {
                        errosNaoImpeditivos.push(error);
                    }
                });
                listaToAdd[index]['errosImpeditivos'] = errosImpeditivos;
                listaToAdd[index]['errosNaoImpeditivos'] = errosNaoImpeditivos;
                if(errosImpeditivos.length > 0){
                    var string = "<p>O episódio <b>"+episodio['num_processo']+"</b> - "+episodio['nome'];
                    errosImpeditivos.forEach( function (erro) {
                        contaImpeditivos++;
                        string += " " + erro.erro + ",";
                    });
                    string = string.substring(0, string.length-1);
                    string+=" <i style='color:red; margin-left:5px;' class='fas fa-times-circle'></i></p>";
                    $("#episodios_com_erros_pendente_secretariado").append(string);
                } else {
                    if(errosNaoImpeditivos.length > 0){
                        var string = "";
                        string += "<p>"+
                                    "<label class='container costumHeight' style='width:1.75vw; float: left; margin-right: 1vw;'>"+
                                        "<input type='checkbox' id='episodio_desconforme_"+episodio['id']+"' class='episodio_desconforme'>"+
                                        "<span class='checkmark costumCheck_inner' onclick='selectDesconforme("+episodio['id']+")'></span>"+
                                    "</label>"+ 
                                    "O episódio <b>"+episodio['num_processo']+"</b> - "+episodio['nome'];
                        errosNaoImpeditivos.forEach( function (erro) {
                            contaInconformes++;
                            string += " " + erro.erro + ",";
                        });
                        string = string.substring(0, string.length-1);
                        string+=" <i style='color:orange; margin-left:5px;' class='fas fa-exclamation-triangle'></i></p>";
                        $("#episodios_com_inconformidades_pendente_secretariado").append(string);
                    }
                }
            }
        }
        if(contaConformes == 0){
            $("#episodios_sem_erros_pendente_secretariado_label").remove();
            $("#episodios_sem_erros_pendente_secretariado").remove();
        }
        if(contaImpeditivos == 0){
            $("#episodios_com_erros_pendente_secretariado_label").remove();
            $("#episodios_com_erros_pendente_secretariado").remove();
        }
        if(contaInconformes == 0){
            $("#episodios_com_inconformidades_pendente_secretariado_label").remove();
            $("#episodios_com_inconformidades_pendente_secretariado").remove();
            $("#validarEpisodiosComErros_pendente_secretariado").remove();
        }
        document.getElementById('validarEpisodiosSemErros_pendente_secretariado').addEventListener('click', function(){
            var listaToAddIds = [];
            listaToAdd.forEach(function(episodioValidado) {
                if(episodioValidado.errosImpeditivos.length == 0 && episodioValidado.errosNaoImpeditivos.length == 0){
                    listaToAddIds.push(episodioValidado['id']);
                }
            });
            if(listaToAddIds == 0){ 
                toastr("Nenhum episódio está completamente válido", "error");
            } else{
                realValidarPendenteSecretariado(listaToAddIds);    
                closeModal();
            }
            return;
        });
        if(document.getElementById('validarEpisodiosComErros_pendente_secretariado') != null){
            document.getElementById('validarEpisodiosComErros_pendente_secretariado').addEventListener('click', function () {
                var listaToAddIds = [];
                listaToAdd.forEach(function(episodioValidado) {
                    if(episodioValidado.errosImpeditivos.length == 0 && episodioValidado.errosNaoImpeditivos.length != 0){
                        if($("#episodio_desconforme_"+episodioValidado['id']).is(':checked')){
                            listaToAddIds.push(episodioValidado['id']);
                        }
                    } else if(episodioValidado.errosImpeditivos.length == 0 && episodioValidado.errosNaoImpeditivos.length == 0){
                        listaToAddIds.push(episodioValidado['id']);
                    }
                });
                if(listaToAddIds == 0){ 
                    toastr("Nenhum episódio está completamente válido", "error");
                } else{
                    realValidarPendenteSecretariado(listaToAddIds);    
                    closeModal();
                }
                return;
            });
        }
        return;
    }
    var listaToAddIds = [];
    listaToAdd.forEach(function(episodioValidado) {
        listaToAddIds.push(episodioValidado['id']);
    });
    realValidarPendenteSecretariado(listaToAddIds);    
}

function selecAlltDesconformes(){
    if($("#episodio_desconforme_all").is(":checked")){
        $(".episodio_desconforme").prop('checked', true);
    } else {
        $(".episodio_desconforme").prop('checked', false);
    }
    var selectedNr = 0;
    $(".episodio_desconforme").each(function() {
        if($(this).is(':checked')){
            selectedNr++;
        }
    });    
    $("#nrOfSelected").text(selectedNr);
}

function selectDesconforme(id_episodio){
    setTimeout(() => {
        var selectedNr = 0;
        if($("#episodio_desconforme_all").is(':checked')){
            if(!$("#episodio_desconforme_"+id_episodio).is(':checked')){
                $("#episodio_desconforme_all").prop('checked', false);
            }
        }
        $(".episodio_desconforme").each(function() {
            if($(this).is(':checked')){
                selectedNr++;
            }
        });    
        $("#nrOfSelected").text(selectedNr);
    }, 10);
}

//processo de validar, após verificação de restrições
function realValidarPendenteSecretariado(listaToAdd){
    if(listaToAdd.length > 0){
        var fd = new FormData();
        fd.append('list', JSON.stringify(listaToAdd));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/episodios/validatePendenteSecretariado.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                var response = JSON.parse(data); 
                if(response == 'error'){
                    toastr("Erro ao validar episódio(s)", "error");
                    return;
                } else {
                    pesquisaEpisodios();
                }
            }
        });
    }
}

// validar pendentes de GDH
function validarGDHsEpisodios (){
    var listaToAdd = [];
    var erros = [];
    episodios.forEach(function(episodio, it) {
        if($("#pendente_gdh_"+it).is(':checked')){
            if(episodio['gdh1'] == null && episodio['gdh2'] == null){
                var erro = {
                    episodio: episodio,
                    erro: ' não tem nenhum GDH atribuído' 
                };
                erros.push(erro);
            }
            
            if(episodio['gdh1'] != null &&  episodio['gdh2'] == null){
                var targetServico;
                for (let it3 = 0; it3 < servicos.length; it3++) {
                    const service = servicos[it3];
                    if(service['id'] == episodio['servico']){
                        targetServico = service;
                        break;
                    }
                }
                var authGDHs = targetServico['listaGHDs'];
                var targetGDH;
                for (let it4 = 0; it4 < gdhList.length; it4++) {
                    const gdh = gdhList[it4];
                    if(gdh.id == episodio['gdh1']){
                        targetGDH = gdh;
                        break;
                    }
                }
                if(authGDHs.indexOf(targetGDH['id']) == -1){
                    var erro = {
                        episodio: episodio,
                        erro: ' o gdh definido '+targetGDH.gdh+' não está autorizado para o servico "'+targetServico['servico']+'"' 
                    };
                    erros.push(erro);
                }               
            }
            listaToAdd.push(episodio);
        }
    });
    

    
    if(listaToAdd.length == 0 && erros.length == 0){
        toastr("Selecione pelo menos um episódio para validar", "error");
        return;
    }

    var errosValidacaoGDHModal="<div class='overlay'>"+
                                            "<div id='erros_validacao_pendente_gdh' class='modal bigModal'>"+
                                                "<h4 class='modal_title font-black'>Erro(s) ao validar episódio(s) <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                                "<span>Os seguintes episódios <span style='color:red'>não serão válidados</span> devido à existência de erros:</span>"+
                                                "<div id='episodios_com_erros_pendente_gdh' class='errors_modal_container'>"+
                                                "</div>"+
                                                "<div style='width:100%; height:1px; margin-top:15px; margin-bottom:15px; background: lightgrey;'></div>"+
                                                "<span>Assim sendo, apenas os seguintes episódios serão validados:</span>"+
                                                "<div id='episodios_sem_erros_pendente_gdh' class='errors_modal_container'>"+
                                                "</div>"+
                                                "<div style='margin-top:1vw'>"+
                                                    "<button onclick='closeModal();' id='validarEpisodiosSemErros_pendente_gdh' class='confirm-btn'>Concluir</button>"+
                                                "</div>"+
                                            "</div>"+        
                                        "</div>";
    if(erros.length > 0){
        $("body").append(errosValidacaoGDHModal);
        var contaInconformes = 0;
        var contaConformes = 0;
        for (let it = 0; it < listaToAdd.length; it++) {
            const episodio = listaToAdd[it];
            var errosEpisodio = [];
            erros.forEach(function (error) {
                if(error.episodio == episodio){
                    errosEpisodio.push(error);
                }
            });
            episodio['erros'] = errosEpisodio;
            
            if(episodio['erros'].length > 0){
                contaInconformes++;
                var errorString = "<p>O episódio <b>"+episodio['num_processo']+"</b> - "+episodio['nome'];
                episodio['erros'].forEach(function(error) {
                    errorString += " " + error.erro + ",";
                });
                errorString = errorString.substring(0, errorString.length-1);
                errorString += "<i style='color:red; margin-left:15px;' class='fas fa-times-circle'></i></p>";
                $("#episodios_com_erros_pendente_gdh").append(errorString);
            } else {
                contaConformes++;
                $("#episodios_sem_erros_pendente_gdh").append("<p><b>"+episodio['num_processo']+"</b> - "+episodio['nome']+" <i style='color:green; margin-left:15px;' class='fas fa-check-circle'></i></p>");
            }
        }

        if(contaInconformes == 0){
            $("#episodios_com_erros_pendente_gdh").append("<p><b>Nenhum episódio com erros</b></p>");
        }
        if(contaConformes == 0){
            $("#episodios_sem_erros_pendente_gdh").append("<p><b>Nenhum episódio será validado</b></p>");
        }
        
        document.getElementById('validarEpisodiosSemErros_pendente_gdh').addEventListener('click', function(){
            var listaToAddIds = [];
            listaToAdd.forEach(function(episodioValidado) {
                if(episodioValidado.erros.length == 0 ){
                    listaToAddIds.push(episodioValidado['id']);
                }
            });
            realValidarPendenteGDH(listaToAddIds);    
        });

        return;
    }
    var listaToAddIds = [];
    listaToAdd.forEach(function(episodioValidado) {
        listaToAddIds.push(episodioValidado['id']);
    });
    realValidarPendenteGDH(listaToAddIds);
}

function realValidarPendenteGDH(listaToAdd){
    if(listaToAdd.length > 0){
        var fd = new FormData();
        fd.append('list', JSON.stringify(listaToAdd));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/episodios/validatePendenteGDH.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                var response = JSON.parse(data); 
                if(response == 'error'){
                    toastr("Erro ao validar episódio(s)", "error");
                    return;
                } else {
                    pesquisaEpisodios();
                }
            }
        });
    }
}

// validar pendentes de pagamento
function validarPendentePagamentoEpisodios(){
    var listaToAdd = [];
    episodios.forEach(function(episodio, it) {
        if($("#pendente_pagamento_"+it).is(':checked')){
            listaToAdd.push(episodio.id);
        }
    });
    if(listaToAdd.length == 0){
        toastr("Selecione pelo menos um episódio para validar", "error");
        return;
    }
    var fd = new FormData();
    fd.append('list', JSON.stringify(listaToAdd));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);

    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/validatePagamento.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            var response = JSON.parse(data); 
            if(response == 'error'){
                toastr("Erro ao validar episódio(s)", "error");
                return;
            } else {
                pesquisaEpisodios();
            }
        }
    });
    
}

// check for errors
function checkErrosEpisodio(episodio, it) {
    //erro sem registo de admissao    
    if( episodio['n_episode_cir'] == null || episodio['n_episode_cir'].trim() == '' || 
        episodio['dta_episodio'] == null || episodio['dta_episodio'].trim() == '' || 
        episodio['dta_admissao'] == null || episodio['dta_admissao'].trim() == '' ||
        episodio['dta_alta'] == null || episodio['dta_alta'].trim() == '') 
    {
        $("#episodio"+it).addClass('error');
        $("#error_semRegistoAdmissao").css('display','block');
    }
}

// reset pesquisa de episodios
function restaurarPesquisaEpisodios(){
    var user = JSON.parse(sessionStorage.getItem("user"));
    $("#doente_2_filtro, #interveniente_mec_filtro, #interveniente_nome_filtro, #data_cir_ini_filtro, #data_cir_fim_filtro").val('');
    $("#bloco_filtro").val($("#bloco_filtro option:first").val());
    $("#servico_filtro").val($("#servico_filtro option:first").val());
    $("#agrupamento_filtro").val($("#agrupamento_filtro option:first").val());
    $("#gdh_filtro").val($("#gdh_filtro option:first").val());
    var currMonthName  = moment().format('MMMM');
    var currYearName  = moment().format('YYYY');
    $("#mainListResults").text(" (" + currMonthName + " " + currYearName + ")");
    var firstDayOfMonth = moment().startOf('month').format("YYYY-MM-DD");
    var lastDayOfMonth = moment().endOf('month').format("YYYY-MM-DD");
    $("#data_cir_ini_filtro").val(firstDayOfMonth);
    $("#data_cir_fim_filtro").val(lastDayOfMonth);

    if(user.role_id !== 1){
        $("#data_env_ini_filtro, #data_env_fim_filtro").val('');
    }
    if(user.role_id == 1){
        getEpisodios([0,1], user['servico_id']);
        return;
    }
    if(user.role_id == 2){
        getEpisodios([0,1], null);
        return;
    }
    if(user.role_id == 3){
        $('.mainList-filter').prop('checked', false);
        $('#pendente_gdh').prop('checked', true);
        getEpisodios([1,2], null);
        return;
    }
    if(user.role_id == 4){
        $('.mainList-filter').prop('checked', false);
        $('#pendente_gdh').prop('checked', true);
        $("#mainList-validationButtons").empty();
        $("#mainList-validationButtons").append('<button id="validarPendenteGDH" class="confirm-btn" style="margin-top:2vw; margin-right:2vw;" onclick="validarGDHsEpisodios()">Validar</button>');
        getEpisodios([2], null);
        $("#pendente_pagamento").prop('checked', true);
        return;
    }
    $('.mainList-filter').prop('checked', false);
    $('#pendente_secretariado').prop('checked', true);
    getEpisodios([0], null);
}

// search episodios
function pesquisaEpisodios() {
    var doente = $("#doente_2_filtro").val();
    var bloco = $("#bloco_filtro").val();
    var servico = $("#servico_filtro").val();
    var agrupamento = $("#agrupamento_filtro").val();
    var intervinienteMEC = $("#interveniente_mec_filtro").val();
    var intervinienteNOME = $("#interveniente_nome_filtro").val();
    var gdh = $("#gdh_filtro").val();
    var dataCirurgiaInicio = $("#data_cir_ini_filtro").val();
    var dataCirurgiaFim = $("#data_cir_fim_filtro").val();
    var dataEnvioInicio = $("#data_env_ini_filtro").val();
    var dataEnvioFim = $("#data_env_fim_filtro").val();

    $("#mainListResults").text(" (Resultados da Pesquisa)");
   
    var fd = new FormData();
    if(doente != undefined && doente.trim() != ''){
        fd.append('doente', doente);
    }
    if(bloco != undefined && bloco.trim() != ''){
        fd.append('bloco', bloco);
    }
    if(servico != undefined && servico.trim() != ''){
        fd.append('servico', servico);
    }
    if(agrupamento != undefined && agrupamento.trim() != ''){
        fd.append('agrupamento', agrupamento);
    }
    if(intervinienteMEC != undefined && intervinienteMEC.trim() != ''){
        fd.append('intervinienteMEC', intervinienteMEC);
    }
    if(intervinienteNOME != undefined && intervinienteNOME.trim() != ''){
        fd.append('intervinienteNOME', intervinienteNOME);
    }
    if(gdh != undefined && gdh.trim() != ''){
        fd.append('gdh', gdh);
    }
    if(dataCirurgiaInicio != undefined && dataCirurgiaInicio.trim() != ''){
        fd.append('dataCirurgiaInicio', dataCirurgiaInicio);
    }
    if(dataCirurgiaFim != undefined && dataCirurgiaFim.trim() != ''){
        fd.append('dataCirurgiaFim', dataCirurgiaFim);
    }
    if(dataEnvioInicio != undefined && dataEnvioInicio.trim() != ''){
        fd.append('dataEnvioInicio', dataEnvioInicio);
    }
    if(dataEnvioFim != undefined && dataEnvioFim.trim() != ''){
        fd.append('dataEnvioFim', dataEnvioFim);
    }

    var estados;
    var user = JSON.parse(sessionStorage.getItem('user'));
    var role = parseInt(user['role_id']);
    if(role == 1 || role == 2){
        estados = [0,1];
    }
    else if(role == 3){
        if($("#pendente_secretariado").is(':checked')){
            estados = [0];
        } else if($("#pendente_gdh").is(':checked')){
            estados = [1,2];
        } else {
            estados = [];
        }
    } else if(role == 4){
        if($("#pendente_secretariado").is(':checked')){
            estados = [0];
        } else if($("#pendente_gdh").is(':checked')){
            estados = [1];
        } else if($("#pendente_pagamento").is(':checked')){
            estados = [2];
        } else if($("#enviado_pagamento").is(':checked')){
            estados = [3];
        } else {
            estados = [];
        }
    } else if(role == 5){
        if($("#pendente_secretariado").is(':checked')){
            estados = [0];
        } else if($("#pendente_gdh").is(':checked')){
            estados = [1];
        } else if($("#pendente_pagamento").is(':checked')){
            estados = [2];
        } else if($("#enviado_pagamento").is(':checked')){
            estados = [3];
        } else {
            estados = [4];
        }
    }

    fd.append('estados', JSON.stringify(estados));
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/searchEpisodios.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            episodios = JSON.parse(data);
            drawEpisodios(episodios);
            removeLoading();
        }
    }); 

}

//show tooltip
function showTooltip(elemento){
    var tooltip;
    for (var i = 0; i < elemento.childNodes.length; i++) {
        if (elemento.childNodes[i].className.includes("tooltip")) {
            tooltip = elemento.childNodes[i];
          break;
        }        
    }
    tooltip.style.display = "block";
    tooltip.style.zIndex = "9999999";
}

//hide tooltip
function hideTooltips() {
    $(".tooltip").css("z-index", "99");
    $(".tooltip").css("display", "none");
}


function manageUsers(){
    addUsersModal();
}

var app_users;
function getUsers() {
    addLoading();
    var fd = new FormData();
    var nrApp = $("#nrApp-filter").val();
    var papelApp = $("#papelApp-filter").val();
    if(nrApp.trim() != ""){
        fd.append('username', nrApp);
    }
    if(papelApp.trim() != ""){
        fd.append('role', papelApp);
    }
    $.ajax({
        type: "POST",
        url: "./api/users/getAllUsers.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
           app_users = JSON.parse(data);
           removeLoading();
           drawAppUsers(app_users);
        }
    }); 
}

function restorSearchAppUsers(){
    $("#nrApp-filter").val('');
    $("#papelApp-filter").val('');
    getUsers();
}

function addUsersModal() {
    var validateServicoModal =  "<div class='overlay' id='user_modal'>"+
                                    "<div id='valida_servico' style='width:54vw; line-height: 175%;' class='modal bigModal'>"+
                                        "<div><i onclick='closeModal()' style='color:rgba(3, 106, 255, .95); float:right' class='fas fa-times'></i></div>"+
                                        "<div class='col_container' style='border-bottom: 1px solid lightgray; padding-bottom:25px'>"+
                                            "<b>Gestão de Utilizadores:</b> "+
                                        "</div>"+
                                        "<div>"+
                                        "<div class='container-filtros'>"+
                                            "<span class='font-light'>"+
                                                "Filtros"+
                                            "</span><br><br>"+
                                            "<span class='font-bold'>Número Mecanografico:</span>"+
                                            "<input id='nrApp-filter' class='input-adicional' type='text'>"+
                                            "<span class='font-bold margin-filtros'>Papel:</span>"+
                                            "<select id='papelApp-filter' class='input-adicional'>"+
                                                "<option value=''>Todos</option>"+
                                                "<option value='1'>Secretariado Clínico</option>"+
                                                "<option value='2'>Secretariado</option>"+
                                                "<option value='3'>Codificador de GDH</option>"+
                                                "<option value='4'>Envia para pagamento</option>"+
                                                "<option value='5'>Administrador</option>"+
                                            "</select>"+
                                            "<span>"+
                                                "<i onclick='getUsers()' class='fas fa-search search-icon search-icon-left' aria-hidden='true'></i>"+
                                            "</span>"+
                                            "<span>"+
                                                "<i onclick='restorSearchAppUsers()' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw' aria-hidden='true'></i>"+
                                            "</span>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div style='border-top: 1px solid lightgrey; margin-top: 25px; padding-top: 20px;'>"+
                                        "<div id='usersApp-body' style='max-height: 50vh; background: white; border-radius: 5px; padding: 10px; box-sizing: border-box; overflow: auto;'>"+
                                        "</div>"+
                                    "</div>"+
                                    "</div>"+
                                "</div>";

    $("body").append(validateServicoModal);
    getUsers();
}

function drawAppUsers(app_users) {
    $("#usersApp-body").empty();
    if(app_users.length >0){
        app_users.forEach(function (element, it) {
            var div =   "<div class='col_container user_app'>"+
                            "<div class='col' style='width:13%;'>"+
                                "<b>N.º Mec:</b> " + element['user']+
                            "</div>"+
                            "<div class='col' style='width: 45%'>"+
                                "<b>Nome</b>: " + element['nome']+
                            "</div>"+
                            "<div class='col' style='width: 30%'>"+
                                "<b>Papel</b>: " +(element['role_id'] == 1 ? 'Secretariado Clínico' : element['role_id'] == 2 ? 'Secretariado' : element['role_id'] == 3 ? 'Codificador de GDH' : element['role_id'] == 4 ? 'Envia para pagamento' : 'Administrador')+
                                (element['role_id'] == 1 ? " - " +getServiceName(element['servico_id']) : '')+
                            "</div>"+
                            "<div class='col' style='width: 13%; text-align:right'>"+
                                "<i onclick='editAppUser("+it+");' style='margin-left:10px; cursor:pointer; color:blue;'class='fas fa-pencil-alt'></i>"+
                                "<i onclick=' onclick='deleteAppUser("+it+");'("+it+");' style='margin-left:10px; cursor:pointer; color:red;' class='fas fa-minus-circle'></i>"+
                            "</div>"+
                        "</div>";
            $("#usersApp-body").append(div);
        });
    } else {
        var div =   "<div style='text-align: center' class='user_app'>"+
                        "Nenhum Resultado" +
                    "</div>";
        $("#usersApp-body").append(div);
    }
}

function editAppUser(it) {
    var user = app_users[it];
    var editUserApp = "<div class='overlay submodal minimodal' id='gdhMiniModal'>"+
                            "<div class='modal'>"+
                                "<h4 class='modal_title font-black'>"+user['nome']+"<i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                "<form>"+
                                    "<label>Papel</label><br>"+
                                    "<select onchange='checkSecretariado()' style='margin-left:0; margin-top:10px' id='newPapelApp-filter' class='input-adicional'>"+
                                        "<option value='1'>Secretariado Clínico</option>"+
                                        "<option value='2'>Secretariado</option>"+
                                        "<option value='3'>Codificador de GDH</option>"+
                                        "<option value='4'>Envia para pagamento</option>"+
                                        "<option value='5'>Administrador</option>"+
                                    "</select>"+
                                "</form>"+
                                "<div style='margin-top:2vw;' id='editUser-App'>"+
                                    "<button class='confirm-btn'>Confirmar</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
    $("body").append(editUserApp);
    $("#newPapelApp-filter").val(user['role_id']);

    if(user['role_id'] == 1){
        var select =    "<br class='things_remove'><br class='things_remove'><label class='things_remove'>Serviço</label><br class='things_remove'><select id='servico_editNewUser'>";
        servicos.forEach(function (servico) {
            select +=   "<option value='"+servico['id']+"'>"+servico['servico']+"</option>";
        });       
        select+="</select>";
        $("#gdhMiniModal form").append(select);
        $("#servico_editNewUser").val(user['servico_id']);
    }
    $("#editUser-App").click(function () {
        var newPapel = $("#newPapelApp-filter").val();
        var fd = new FormData();
        fd.append('role_id', newPapel);
        if(newPapel == 1){
            var newServico = $("#servico_editNewUser").val();
            fd.append('servico_id', newServico);
        }
        fd.append('id', user['id']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/users/editUser.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                if(data == '"success"'){
                    removeLoading();
                    closeSubModal();
                    getUsers();
                } else {
                    toastr("Erro ao editar utilizador", "error");
                }
            }
        }); 
    });

}

function checkSecretariado(){
    $("#servico_editNewUser").remove();
    $(".things_remove").remove();
    if($("#newPapelApp-filter").val() == 1){
        var select =    "<br class='things_remove'><br class='things_remove'><label class='things_remove'>Serviço</label><br class='things_remove'><select id='servico_editNewUser'>";
        servicos.forEach(function (servico) {
            select +=   "<option value='"+servico['id']+"'>"+servico['servico']+"</option>";
        });       
        select+="</select>";
        $("#gdhMiniModal form").append(select);
    }
}

function deleteAppUser(it) {
    var user = app_users[it];
    var confirmModal = "<div class='overlay submodal'>"+
                            "<div class='modal bigModal'>"+
                                "<h4 class='modal_title font-black'>Apagar Utilizador '"+user['nome']+"' <i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                "<div>"+
                                    "Tem a certeza que quer apagar o utilizador '"+user['user']+" - "+user['nome']+"' ?" +
                                "</div>"+
                                "<div style='margin-top:1vw'>"+
                                    "<button onclick='closeSubModal();' class='confirm-btn'>Cancelar</button>"+
                                    "<button id='confirm-remove-auth' class='confirm-btn'>Confirmar</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
    $("body").append(confirmModal);
    $("#confirm-remove-auth").click(function () {
        addLoading();
        var fd = new FormData();
        fd.append('id', app_users[it]['id']);
        $.ajax({
            type: "POST",
            url: "./api/users/deleteUser.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                if(data == '"success"'){
                    removeLoading();
                    closeSubModal();
                    getUsers();
                } else {
                    toastr("Erro ao apagar utilizador", "error");
                }
            }
        }); 
    });
}
