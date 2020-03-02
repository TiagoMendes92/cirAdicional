$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/historic/historic.css">');

var ALLUsers;
var ALLFuncoes;
var ALLProfissionais;
var ALLEpisodios;
var ALLGDHs;
var Historico;
var tiposAccoes = [
    {
        label: 'Adição a Equipa',
        value: 'addEquipa'
    },
    {
        label: 'Remoção de Equipa',
        value: 'removeEquipa'
    },
    {
        label: 'Validação de Pendente Secretariado',
        value: 'valitadePendenteSecretariado'
    },
    {
        label: 'Adição aos Elegíveis',
        value: 'addElegivel'
    },
    {
        label: 'Remoção dos Elegíveis',
        value: 'removeElegivel'
    },
    {
        label: 'Atualização de GDH',
        value: 'updateGDH'
    },
    {
        label: 'GDH(s) Definidos',
        value: 'addGDH'
    },
    {
        label: 'Validação de Pendente GDH',
        value: 'valitadePendenteGDH'
    },
    {
        label: 'Validação Pendente Pagamento',
        value: 'valitadePendentePagamento'
    },
    {
        label: 'Invalidação Pendente Secretariado',
        value: 'desvalitadePendenteSecretariado'
    },
    {
        label: 'Serviço validável pelo secretariado',
        value: 'duplaValidacaoSecretariado'
    },
    {
        label: 'Serviço validável pelo secretariado clínico',
        value: 'singleValidacaoSecretariado'
    },
    {
        label: 'Marcada Cirurgia Segura',
        value: 'marcadaCirurgiaSegura'
    },
    {
        label: 'Marcada Cirurgia Insegura',
        value: 'marcadaCirurgiaInsegura'
    },
    {
        label: 'Invalidação Pendente GDH',
        value: 'desvalitadePendenteGDH'
    },
    {
        label: 'Pagamento de Serviço Aprovado',
        value: 'approveService'
    },
    {
        label: 'Pagamento de Serviço Recusado',
        value: 'reffuseService'
    },
    {
        label: 'Episódio Recusado Enviado para o Secretariado',
        value: 'sendRefusedToSecretariado'
    },
    {
        label: 'Episódio Recusado Enviado para o pendente de GDH',
        value: 'sendRefusedToGDH'
    },
    {
        label: 'Alteração horário de funcionamento de Serviço',
        value:'changeSchedule'
    },
    {
        label: 'Lista de GDHs autorizados por serviço atualizada',
        value:'authorizedGDHtoService'
    },
    {
        label: 'Lista de Funções por serviço atualizada',
        value: 'addFuncaoToService'
    },
    {
        label:'Geração de Ficheiro',
        value: 'generatedFile'
    }    
];

// get historico
function getHistoric(){
    addLoading();
    $.ajax({
        type: "GET",
        url: "./api/users/getAllUsers.php",
        processData: false,
        contentType: false,
        success:function(data){
            ALLUsers = JSON.parse(data);
            $.ajax({
                type: "GET",
                url: "./api/funcoes/getAllFuncoes.php",
                processData: false,
                contentType: false,
                success:function(data){
                    ALLFuncoes = JSON.parse(data);
                    $.ajax({
                        type: "GET",
                        url: "./api/intervenientes/getAllProfissionais.php",
                        processData: false,
                        contentType: false,
                        success:function(data){
                            ALLProfissionais = JSON.parse(data);
                            $.ajax({
                                type: "GET",
                                url: "./api/episodios/getAllEpisodios.php",
                                processData: false,
                                contentType: false,
                                success:function(data){
                                    ALLEpisodios = JSON.parse(data);
                                    $.ajax({
                                        type: "GET",
                                        url: "./api/gdh/getAllGDHs.php",
                                        processData: false,
                                        contentType: false,
                                        success:function(data){
                                            ALLGDHs = JSON.parse(data);
                                            var today = new Date().toISOString().slice(0, 19).replace('T', ' ').split(' ')[0];
                                            var todayBegin = today + ' 00:00:00';
                                            var todayEnd = today + ' 23:59:00';
                                            var fd = new FormData();
                                            fd.append('min-data', todayBegin);
                                            fd.append('max-data', todayEnd);
                                            $.ajax({
                                                type: "POST",
                                                url: "./api/historico/getHistoric.php",
                                                data: fd,
                                                processData: false,
                                                contentType: false,
                                                success:function(data){
                                                    Historico = JSON.parse(data);
                                                    removeLoading();
                                                }
                                            });
                                        }
                                    });
                                }
                            }); 
                        }
                    }); 
                }
            });  
        }
    });  
}

// show Historico
function showHistorico(){
    $("#episodios_header, #episodios_body, #validarPendenteSecretariado").css('display', 'none');
    $("#showEpisodios-topMenu").addClass('inactive_menu');
    $("#showHistorico").removeClass('inactive_menu');
    var historic =  "<div id='hist'>"+
                        "<div id='hist_filters' >"+
                            "<div><b>Filtros</b> <span onclick='toogleFiltrosHist()' style='float:right'><i id='toogleIcon' class='fas fa-minus-circle'></i></span></div></br>"+
                            "<div id='hist_filters_container' class='col_container'>"+
                                "<div class='col col_14 hist_filter'>"+
                                    "<label>Tipo</label></br>"+
                                    "<select id='hist_tipo'>"+
                                        "<option value=''>Todos</option>";
                                        tiposAccoes.forEach(function(tipo) {
                            historic += "<option value='"+tipo.value+"'>"+tipo.label+"</option>";   
                                        });
                        historic += "<select>"+
                                "</div>"+
                                "<div class='col col_14 hist_filter'>"+
                                    "<label>Data Mínima</label></br>"+
                                    "<input type='date' id='hist_minData'/>"+
                                "</div>"+
                                "<div class='col col_14 hist_filter'>"+
                                    "<label>Data Máxima</label></br>"+
                                    "<input type='date' id='hist_maxData'/>"+
                                "</div>"+
                                "<div class='col col_14 hist_filter'>"+
                                    "<label>Episódio</label></br>"+
                                    "<input id='hist_episodio_nr' min='1' type='number' placeholder='Nº do Processo'/>"+
                                    "<input id='hist_episodio_utente' type='text' placeholder='Utente'/>"+
                                "</div>"+
                                "<div class='col col_14 hist_filter'>"+
                                    "<label>Interveniente</label>"+
                                    "<input id='hist_interveniente_nome' placeholder='Nome' type='text'/></br>"+
                                    "<input id='hist_interveniente_mec' placeholder='Nº Mecanográfico' type='text'/>"+
                                "</div>"+
                                "<div class='col col_14 hist_filter'>"+
                                    "<label>Utilizador</label></br>"+
                                    "<input id='hist_user' type='text'/>"+
                                "</div>"+
                                "<div class='col col_10 hist_filter'>"+
                                    "<i onclick='getHistoricFiltered()' class='fas fa-search searchIcon'></i>"+
                                    "<i onclick='resetHistoricFilters()' class='fas fa-sync-alt searchIcon'></i>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                        "<div id='hist_results_label'>"+
                            "<b>Acções tomadas no dia de hoje</b>"+
                        "</div>"+
                        "<div id='hist_results'>"+
                        "</div>"+
                    "</div>";
    $("#hist").remove();    
    $("main").append(historic);
    $('#hist_minData, #hist_maxData').val(formatValueForInput(new Date()));
    drawHistorico();
}

// toogle filtros historico
function toogleFiltrosHist(){
    $("#hist_filters_container").slideToggle();
    setTimeout(() => {
        if($('#hist_filters_container').css('display') == 'none'){
            $("#toogleIcon").removeClass("fa-minus-circle").addClass("fa-plus-circle");
        } else {
            $("#toogleIcon").removeClass("fa-plus-circle").addClass("fa-minus-circle");
        }
    }, 410);
}

// desenha historico
function drawHistorico() {
    $("#hist_results").empty();
    if(Historico.length > 0){
        Historico.forEach(function (historic, it ) {
            var info;
            var historicInfo = JSON.parse(historic.info);
            var row =   "<div id='hist_result-"+it+"' class='hist_result_row borderBottom'>"+
                        "</div>";
            $("#hist_results").append(row);
            if(historic.tipo == 'addEquipa'){           
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-plus addEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> adicionou intervenientes ao episodio '"+getEpisodioDescHist(historicInfo.episodio)+"'"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Intervenientes Adicionados:</b></br>";
                                historicInfo.funcoes.forEach( function (element) {
                        info += "<div>"+
                                    getProfissionalNameHist(element.prof) + " -> " + getFuncaoNameHist(element.func) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'removeEquipa'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-minus removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> removeu um interviente do episodio '"+getEpisodioDescHist(historicInfo.id_episodio)+"'"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Intervenientes Removido:</b></br>"+
                                "<div>"+
                                    historicInfo.n_mec + " - '"+historicInfo.nome+"' ("+historicInfo.categoria.toUpperCase()+ ") "+
                                "</div>"+
                            "</div>"+
                        "</div>";
    
    
            }
            else if(historic.tipo == 'valitadePendenteSecretariado'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-check valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> validou episódios que estavam <b>Pendentes de Secretariado</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódios Validados:</b></br>";
                    historicInfo.episodios.forEach( function (episodio) {
                        info += "<div>"+
                                    getEpisodioDescHist(episodio) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'addElegivel'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-indent addEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> tornou profissionais elegíveis a fazer cirugias adicionais"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Profissionais Elegíveis:</b></br>";
                                 historicInfo.profissionais.forEach( function (element) {
                        info += "<div>"+
                                    getProfissionalNameHist(element) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'removeElegivel'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-outdent removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> removeu a elegibilidade para fazer cirugias adicionais a um profissional"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Profissionais que deixaram de estar Elegíveis:</b></br>"+
                                "<div>"+
                                    getProfissionalNameHist(historicInfo.profissional) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'updateGDH'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-edit valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> editou um GDH"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>GDH editado:</b></br>"+
                                "<div>"+
                                    "<b>"+getGDHFromIdALL(historicInfo.id_gdh)['name']+ "</b> -> Serviço: " + getServiceName(historicInfo.servico) + "; Percetagem: " + historicInfo.perc + "%; Valor Unitário: " + historicInfo.v_uni + "€"+
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'addGDH'){
                var GDH1 = null;
                var GDH2 = null;
                for (let index = 0; index < ALLGDHs.length; index++) {
                    const gdhCan = ALLGDHs[index];
                    if(gdhCan.id == historicInfo.gdh1){
                        GDH1 = gdhCan;
                    }
                }
                if(historicInfo.gdh2 != null){
                    for (let index = 0; index < ALLGDHs.length; index++) {
                        const gdhCan = ALLGDHs[index];
                        if(gdhCan.id == historicInfo.gdh2){
                            GDH2 = gdhCan;
                        }
                    }
                }
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-tags valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> defeniu o(s) GDH(s) do Episódio '"+getEpisodioDescHist(historicInfo.episodio)+"'"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</sp+an>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>GDH(s) definido(s):</b></br>"+
                                "<div>"+
                                    "<b>"+(GDH2 != null ? (GDH2.id)['name']+ "</b> -> Serviço: " + getServiceName(GDH2.servico) + "; Percetagem: " + GDH2.perc + "%; Valor Unitário: " + GDH2.v_uni + "€": (GDH1.id)['name']+ "</b> -> Serviço: " + getServiceName(GDH1.servico) + "; Percetagem: " + GDH1.perc + "%; Valor Unitário: " + GDH1.v_uni + "€" )+"</b>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'valitadePendenteGDH'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-check valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> validou episódios que estavam <b>Pendentes de GDH</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódios Validados:</b></br>";
                    historicInfo.episodios.forEach( function (episodio) {
                        info += "<div>"+
                                    getEpisodioDescHist(episodio) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'valitadePendentePagamento'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-file-invoice-dollar valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> validou episódios que estavam <b>Pendentes de Pagamento</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódios Validados:</b></br>";
                    historicInfo.episodios.forEach( function (episodio) {
                        info += "<div>"+
                                    getEpisodioDescHist(episodio) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'desvalitadePendenteSecretariado'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-times removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"' anulou</b> a validação do <b>Secretariado</b> de um episódio"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódio Invalidado:</b></br>"+
                                "<div>"+
                                    getEpisodioDescHist(historicInfo.episodio) +
                                "</div>"+
                            "</div>"+
                        "</div>";

            }
            else if(historic.tipo == 'duplaValidacaoSecretariado'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-check-double addEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> marcou um serviço como validável pelo secretariado."+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Serviço marcado como validável pelo secretariado:</b></br>"+
                                "<div>"+
                                    getService(historicInfo.servico) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'singleValidacaoSecretariado'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-check addEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> marcou um serviço como validável pelo secretariado clínico."+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Serviço marcado como validável pelo secretariado clínico:</b></br>"+
                                "<div>"+
                                    getService(historicInfo.servico) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'marcadaCirurgiaSegura'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-shield addEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> marcou um episódio como <b>cirurgia segura</b>."+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódio marcado como cirurgia segura:</b></br>"+
                                "<div>"+
                                    getEpisodioDescHist(historicInfo.episodio) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'marcadaCirurgiaInsegura'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-shield removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> marcou um episódio como <b>cirurgia não segura</b>."+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer; margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódio marcado como cirurgia não segura:</b></br>"+
                                "<div>"+
                                    getEpisodioDescHist(historicInfo.episodio) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'desvalitadePendenteGDH'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-user-times removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"' anulou</b> a validação de <b>GDH</b> de um episódio"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódio Invalidado:</b></br>"+
                                "<div>"+
                                    getEpisodioDescHist(historicInfo.episodio) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'approveService'){
                info =  "<div>"+
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-euro-sign addEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> aprovou o pagamento do Serviço <b>"+getServiceNameFromEpisodio(historicInfo)+"</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódios Aprovados:</b></br>";
                    historicInfo.episodios.forEach( function (episodio) {
                        info += "<div>"+
                                    getEpisodioDescHist(episodio) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'reffuseService'){
                 info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fab fa-creative-commons-nc-eu removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> reprovou o pagamento do Serviço <b>"+getServiceNameFromEpisodio(historicInfo)+"</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódios Recusados:</b></br>";
                    historicInfo.episodios.forEach( function (episodio) {
                        info += "<div>"+
                                    getEpisodioDescHist(episodio) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'sendRefusedToSecretariado'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-fast-backward removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> marcou episódio rejeitado pelo Conselho de Administração como <b>Pendente de verificação de secretariado</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódio que passou para Pendente de verificação de secretariado:</b></br>"+
                                "<div>"+
                                    getEpisodioDescHist(historicInfo.episodio) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'sendRefusedToGDH'){
                info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-step-backward removeEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> marcou episódio rejeitado pelo Conselho de Administração como <b>Pendente de GDH</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódio que passou para Pendente de GDH:</b></br>"+
                                "<div>"+
                                    getEpisodioDescHist(historicInfo.episodio) +
                                "</div>"+
                            "</div>"+
                        "</div>";
            } 
            else if(historic.tipo == 'changeSchedule'){
                info =  "<div>"+
                            "<div class='table-cell col_4'>"+
                                "<i class='far fa-clock valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> alterou o horário do Serviço <b>"+getServiceName(historicInfo.servico)+"</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Novo Horário:</b></br>"+
                                "<span>"+servicos[historicInfo.servico].horario_ini.substring(0,5)+" - "+servicos[historicInfo.servico].horario_fim.substring(0,5)+"</span>"+
                            "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'authorizedGDHtoService'){
                info =  "<div>"+
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-wrench valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utilizador <b>'"+historicInfo.user+"'</b> atualizou a lista de <b>GDHs autorizados</b> para o serviço <b>"+getServiceName(historicInfo.servico)+"</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Lista de GDHs Autorizados:</b></br>";
                            var gdhs_auth = JSON.parse(historicInfo['gdhs']);
                            if(gdhs_auth.length == 0){
                        info +="<span>Nenhum GDH autorizado</span>";
                            } else {
                                gdhs_auth.forEach(function (gdh_id) {
                        info +="<span>GDH: <b>" +getGDHFromIdALL(gdh_id)['gdh'] + "</b>; Valor Unitário: "+getGDHFromIdALL(gdh_id)['v_uni']+"; Percentagem: "+getGDHFromIdALL(gdh_id)['perc']+".</span><br>";
                                });
                            }
                    info += "</div>"+
                        "</div>";
            }
            else if(historic.tipo == 'addFuncaoToService'){
 
                info =  "<div>"+
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-users valitadeHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utilizador <b>'"+historicInfo.user+"'</b> atualizou a lista de <b>Funções</b> para o serviço <b>"+getServiceName(historicInfo.servico)+"</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Lista de Funções Possíveis:</b></br>";
                        
                        var funcoes = (historicInfo.funcao != null && historicInfo.funcao != "" ? [JSON.parse(historicInfo.funcao)] : []); 
                        console.log(funcoes);
                                if(funcoes.length == 0){
                        info += "<span><b>Equipa Cirúrgica:</b></span><br>"+
                                "<span>Nenhum Função Disponível</span><br><br>"+
                                "<span><b>Equipa de Apoio:</b></span><br>"+
                                "<span>Nenhum Função Disponível</span><br><br>";
                                } else {
                                    var funcoesEC = [];
                                    var funcoesEA = [];
                                    funcoes.forEach(function(funcao) {
                                        if(funcao.equipa == 'EC'){
                                            funcoesEC.push(funcao);
                                        } else if(funcao.equipa == 'EA'){
                                            funcoesEA.push(funcao);
                                        }
                                    });
                                    if(funcoesEC.length > 0){
                                        info += "<span><b>Equipa Cirurgica:</b></span><br>";
                                        funcoesEC.forEach( function (funcao, it) {
                                            info+="<span>Função: "+funcao['funcao']+"; Sigla: "+funcao['sigla']+"; Percentagem: "+funcao['percentage']+"%</span><br>";
                                        });
                                    } else {
                            info += "<span><b>Equipa Cirúrgica:</b></span><br>"+
                                    "<span>Nenhum Função Disponível<br><br></span>";     
                                    }
                                    if(funcoesEA.length > 0){
                                        info += "<br><span><b>Equipa de Apoio:</b></span><br>";
                                        funcoesEA.forEach( function (funcao, it) {
                                            info+="<span>Função: "+funcao['funcao']+"; Sigla: "+funcao['sigla']+"; Percentagem: "+funcao['percentage']+"%</span><br>";
                                        });
                                    } else {
                            info += "<br><span><b>Equipa de Apoio:</b></span><br>"+
                                    "<span>Nenhum Função Disponível<br><br></span>";     
                                    }
                                }
                    info += "</div>"+
                        "</div>";
            } 
            else if(historic.tipo == 'generatedFile'){
                  info =  "<div>"+    
                            "<div class='table-cell col_4'>"+
                                "<i class='fas fa-file-invoice-dollar addEquipaHist'></i>"+
                            "</div>"+
                            "<div class='table-cell' style='width:63vw'>"+
                                "<span>"+
                                    "O utlizador <b>'"+ historicInfo.user +"'</b> gerou um ficheiro para pagamento de <b>Cirurgia Adicional</b>"+
                                "</span>"+
                                "<span style='float:right'>"+
                                    moment(historic.date, "YYYYMMDDHHmmss").fromNow()+
                                    "<i onclick='toogleCollapsable("+it+")' id='collapse_Icon"+it+"'class='fas fa-plus-circle' style='cursor:pointer;  margin-left: 35px;'></i>"+
                                "</span>"+
                            "</div>"+
                        "</div>"+
                        "<div id='collapsable_Div"+it+"' style='background: white; margin-top: .5vw; display:none'>"+
                            "<div style='padding: .75vw; font-size: 0.7vw; background: #f3f8ff; border-radius: 0.1vw; line-height: 200%;'>"+
                                "<b>Episódios Incluídos no Ficheiro:</b></br>";
                    historicInfo.episodios.forEach( function (episodio) {
                        info += "<div>"+
                                    getEpisodioDescHist(episodio) +
                                "</div>";
                                });
                    info += "</div>"+
                        "</div>";
            }
            $("#hist_result-"+it).append(info);
        });
    } else {
        var div = "<div style='text-align: center;'> Nenhum Actividade para Registar </div>";
        $("#hist_results").append(div);
    }
}


function getGDHFromIdALL(id) {
    var gdh;
    for (let it = 0; it < ALLGDHs.length; it++) {
        const gdhCandidate = ALLGDHs[it];
        if(id == gdhCandidate['id']){
            gdh =  gdhCandidate;
            break;
        }else{
        }
    }
    return gdh;
}
//get service name from episodio id
function getServiceNameFromEpisodio(historicInfo){
    var id_episodio = historicInfo['episodios'][0];
    var targetEpisodio;
    for (let it = 0; it < ALLEpisodios.length; it++) {
        const episodio = ALLEpisodios[it];
        if(parseInt(episodio.id) == parseInt(id_episodio)){
            targetEpisodio = episodio;
            break;
        }
    }
    var serviceName = getServiceName(targetEpisodio.servico);
    return serviceName;
}

// toggle historic item
function toogleCollapsable(it){
    $("#collapsable_Div"+it).slideToggle();
    setTimeout(() => {
        if($('#collapsable_Div'+it).css('display') == 'none'){
            $("#collapse_Icon"+it).removeClass("fa-minus-circle").addClass("fa-plus-circle");
        } else {
            $("#collapse_Icon"+it).removeClass("fa-plus-circle").addClass("fa-minus-circle");
        }
    }, 500);
}

// get descrição do episodio historico
function getEpisodioDescHist(id) {
    var string = "n/a";
    for (let it = 0; it < ALLEpisodios.length; it++) {
        const episodio = ALLEpisodios[it];
        if(parseInt(episodio.id) == id){
            string = "<b>"+episodio.num_processo + "</b> - " + episodio.nome;
            break;
        }
    }
    return string;
}

// get name profissional historico
function getProfissionalNameHist(n_mec){
    var prof = "";
    for (let index = 0; index < ALLProfissionais.length; index++) {
        const profissional = ALLProfissionais[index];
        if(profissional.n_mec == n_mec){
            prof = profissional.n_mec + " - '"+profissional.nome+"' ("+profissional.categoria.toUpperCase()+")";
            break;
        }
    }
    return prof;
}

// get funcao profissional historico
function getFuncaoNameHist(func_id){
    return func_id.funcao;
}

// get gdh from id
function getGDH(id_gdh) {
    var gdh_name = "";
    for (let it = 0; it < ALLGDHs.length; it++) {
        const gdh = ALLGDHs[it];
        if(parseInt(gdh.id) == parseInt(id_gdh)){
            gdh_name = gdh.gdh;
            break;
        }
    }
    return gdh_name; 
}

//get nome do servico pelo id
function getService(id_servico){
    var servicoLBL = "";
    for (let it = 0; it < servicos.length; it++) {
        const servico = servicos[it];
        if(parseInt(servico['id']) == id_servico){
            servicoLBL = servico['servico'];
        }
    }
    return servicoLBL;
}

// format data para inputs
function formatValueForInput(date){
    var local = date;
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0,10);
}

// reset filters historico
function resetHistoricFilters(){
    $("#hist_tipo, #hist_episodio_nr, #hist_episodio_utente, #hist_interveniente_nome, #hist_interveniente_mec, #hist_user").val('');
    $('#hist_maxData').val(formatValueForInput(new Date()));
    $("#hist_minData").val('');
    getHistoricFiltered();
}

// get historico da pesquisa 
function getHistoricFiltered(){
    var minDate = $("#hist_minData").val();
    var maxDate = $("#hist_maxData").val();
    if(minDate != '' && maxDate != ''){
        if(minDate > maxDate){
            toastr("A Data-limite inferior não pode superior à Data-limite superior", "error");
            return;
        }
    }
    if(minDate != ''){
        minDate += ' 00:00:00';
    }
    if(maxDate != ''){
        maxDate += ' 23:59:00';
    }
    var tipo = $("#hist_tipo").val();
    var fd = new FormData();
    if(minDate != ''){
        fd.append('min-data', minDate);
    }
    if(maxDate != ''){
        fd.append('max-data', maxDate);
    }
    if(tipo != ''){
        fd.append('tipo', tipo);
    }
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/historico/getHistoric.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            $("#hist_results_label").html("<b>Resultados da Pesquisa:</b>");
            var tempHistoric = JSON.parse(data);
            var episodioNr = $("#hist_episodio_nr").val();
            if(episodioNr != ''){
                tempHistoric = filterHistoricByEpisodioNr(tempHistoric, episodioNr);
            }
            var episodioUtente = $("#hist_episodio_utente").val();
            if(episodioUtente != ''){
                tempHistoric = filterHistoricByEpisodioUtente(tempHistoric, episodioUtente);
            }
            var intervenienteNome = $("#hist_interveniente_nome").val();
            if(intervenienteNome != ''){
                tempHistoric = filterHistoricByIntervenienteName(tempHistoric, intervenienteNome);
            }
            var intervenienteMec = $("#hist_interveniente_mec").val();
            if(intervenienteMec != ''){
                tempHistoric = filterHistoricByIntervenienteMec(tempHistoric, intervenienteMec);
            }
            var user =  $("#hist_user").val();
            if(user != ''){
                tempHistoric = filterHistoricByUser(tempHistoric, user);
            }
            Historico = tempHistoric;
            drawHistorico();
            removeLoading();
        }
    });
}

// filter historico by episodio nr
function filterHistoricByEpisodioNr(tempHistoric, episodioNr) {
    for (let index = tempHistoric.length-1; index >= 0; index--) {
        const historicItem = tempHistoric[index];
        const historicInfo = JSON.parse(historicItem.info);
        if(historicItem.tipo == 'addEquipa'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'removeEquipa'){
            var nrEpisodio = getEpisodioNr(historicInfo.id_episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'valitadePendenteSecretariado'){
            var arrayEpNrs = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpNrs.push(getEpisodioNr(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpNrs.length; it++) {
                const element = arrayEpNrs[it];
                if(element.toString().includes(episodioNr.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if( historicItem.tipo == 'addElegivel'){
            tempHistoric.splice(index, 1);
        }
        else if( historicItem.tipo == 'removeElegivel'){
            tempHistoric.splice(index, 1);
        }
        else if( historicItem.tipo == 'updateGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'addGDH'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'valitadePendenteGDH'){
            var arrayEpNrs = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpNrs.push(getEpisodioNr(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpNrs.length; it++) {
                const element = arrayEpNrs[it];
                if(element.toString().includes(episodioNr.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'valitadePendentePagamento'){
            var arrayEpNrs = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpNrs.push(getEpisodioNr(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpNrs.length; it++) {
                const element = arrayEpNrs[it];
                if(element.toString().includes(episodioNr.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'desvalitadePendenteSecretariado'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'duplaValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'singleValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'marcadaCirurgiaSegura'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'marcadaCirurgiaInsegura'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'desvalitadePendenteGDH'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'approveService'){
            var arrayEpNrs = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpNrs.push(getEpisodioNr(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpNrs.length; it++) {
                const element = arrayEpNrs[it];
                if(element.toString().includes(episodioNr.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'reffuseService'){
            var arrayEpNrs = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpNrs.push(getEpisodioNr(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpNrs.length; it++) {
                const element = arrayEpNrs[it];
                if(element.toString().includes(episodioNr.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'sendRefusedToSecretariado'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'sendRefusedToGDH'){
            var nrEpisodio = getEpisodioNr(historicInfo.episodio);
            if(!nrEpisodio.toString().includes(episodioNr.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'changeSchedule'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'authorizedGDHtoService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'addFuncaoToService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'generatedFile'){
            var arrayEpNrs = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpNrs.push(getEpisodioNr(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpNrs.length; it++) {
                const element = arrayEpNrs[it];
                if(element.toString().includes(episodioNr.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }

    }
    return tempHistoric;
}

// get episodio nr processo
function getEpisodioNr(id){
    var num_processo;
    for (let it = 0; it < ALLEpisodios.length; it++) {
        const episodio = ALLEpisodios[it];
        if(parseInt(episodio.id) == id){
            num_processo = episodio.num_processo;
            break;
        }
    }
    return num_processo;
}

// filter historico by episodio utente
function filterHistoricByEpisodioUtente(tempHistoric, nome) {
    for (let index = tempHistoric.length-1; index >= 0; index--) {
        const historicItem = tempHistoric[index];
        const historicInfo = JSON.parse(historicItem.info);
        if(historicItem.tipo == 'addEquipa'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'removeEquipa'){
            var utente = getEpisodioUtente(historicInfo.id_episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'valitadePendenteSecretariado'){
            var arrayEpUtentes = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpUtentes.push(getEpisodioUtente(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpUtentes.length; it++) {
                const element = arrayEpUtentes[it];
                if(element.toString().includes(nome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if( historicItem.tipo == 'addElegivel'){
            tempHistoric.splice(index, 1);
        }
        else if( historicItem.tipo == 'removeElegivel'){
            tempHistoric.splice(index, 1);
        }
        else if( historicItem.tipo == 'updateGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'addGDH'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'valitadePendenteGDH'){
            var arrayEpUtentes = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpUtentes.push(getEpisodioUtente(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpUtentes.length; it++) {
                const element = arrayEpUtentes[it];
                if(element.toString().includes(nome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'valitadePendentePagamento'){
            var arrayEpUtentes = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpUtentes.push(getEpisodioUtente(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpUtentes.length; it++) {
                const element = arrayEpUtentes[it];
                if(element.toString().includes(nome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'desvalitadePendenteSecretariado'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'duplaValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'singleValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'marcadaCirurgiaSegura'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'marcadaCirurgiaInsegura'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'desvalitadePendenteGDH'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'approveService'){
            var arrayEpUtentes = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpUtentes.push(getEpisodioUtente(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpUtentes.length; it++) {
                const element = arrayEpUtentes[it];
                if(element.toString().includes(nome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'reffuseService'){
            var arrayEpUtentes = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpUtentes.push(getEpisodioUtente(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpUtentes.length; it++) {
                const element = arrayEpUtentes[it];
                if(element.toString().includes(nome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if(historicItem.tipo == 'sendRefusedToSecretariado'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'sendRefusedToGDH'){
            var utente = getEpisodioUtente(historicInfo.episodio);
            if(!utente.toString().includes(nome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'changeSchedule'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'authorizedGDHtoService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'addFuncaoToService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'generatedFile'){
            var arrayEpUtentes = [];
            historicInfo.episodios.forEach(epis => {
                arrayEpUtentes.push(getEpisodioUtente(epis));
            });
            var exists = false;
            for (let it = 0; it < arrayEpUtentes.length; it++) {
                const element = arrayEpUtentes[it];
                if(element.toString().includes(nome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
    }
    return tempHistoric;
}

// get episodio utente
function getEpisodioUtente(id) {
    var nome_utente;
    for (let it = 0; it < ALLEpisodios.length; it++) {
        const episodio = ALLEpisodios[it];
        if(parseInt(episodio.id) == id){
            nome_utente = episodio.nome;
            break;
        }
    }
    return nome_utente;
}

// filter historico by interveniente Nome
function filterHistoricByIntervenienteName(tempHistoric, intervenienteNome) {
    for (let index = tempHistoric.length-1; index >= 0; index--) {
        const historicItem = tempHistoric[index];
        const historicInfo = JSON.parse(historicItem.info);
        if(historicItem.tipo == 'addEquipa'){
            var intervenientesEpisodio = historicInfo.funcoes;
            var intervenientesEpisodioNames = [];
            intervenientesEpisodio.forEach(interveniente => {
                var nameInterveniente = getIntervenienteName(interveniente.prof);
                intervenientesEpisodioNames.push(nameInterveniente);
            });
            var exists = false;
            for (let it = 0; it < intervenientesEpisodioNames.length; it++) {
                const name = intervenientesEpisodioNames[it];
                if(name.toString().includes(intervenienteNome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }   
        else if(historicItem.tipo == 'removeEquipa'){
            var nameInterveniente = getIntervenienteName(historicInfo.id_prof);
            if(!nameInterveniente.toString().includes(intervenienteNome.toString())){
                tempHistoric.splice(index, 1);
            }
        }
        else if(historicItem.tipo == 'valitadePendenteSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if( historicItem.tipo == 'addElegivel'){
            var intervenientesEpisodio = historicInfo.profissionais;
            var intervenientesEpisodioNames = [];
            intervenientesEpisodio.forEach(interveniente => {
                var nameInterveniente = getIntervenienteName(interveniente);
                intervenientesEpisodioNames.push(nameInterveniente);
            });
            var exists = false;
            for (let it = 0; it < intervenientesEpisodioNames.length; it++) {
                const name = intervenientesEpisodioNames[it];
                if(name.toString().includes(intervenienteNome.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if( historicItem.tipo == 'removeElegivel'){
           var nameInterveniente = getIntervenienteName(historicInfo.profissional);
           if(!nameInterveniente.toString().includes(intervenienteNome.toString())){
                tempHistoric.splice(index, 1);  
           }
        }
        else if( historicItem.tipo == 'updateGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'addGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'valitadePendenteGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'valitadePendentePagamento'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'desvalitadePendenteSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'duplaValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'singleValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'marcadaCirurgiaSegura'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'marcadaCirurgiaInsegura'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'desvalitadePendenteGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'approveService'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'reffuseService'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'sendRefusedToSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'sendRefusedToGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'changeSchedule'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'authorizedGDHtoService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'addFuncaoToService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'generatedFile'){
            tempHistoric.splice(index, 1);
        }
    }
    return tempHistoric;
}

// get only name profissional historico
function getIntervenienteName(prof_id){
    var prof = "";
    for (let index = 0; index < ALLProfissionais.length; index++) {
        const profissional = ALLProfissionais[index];
        if(profissional.n_mec == prof_id){
            prof = profissional.nome;
            break;
        }
    }
    return prof;
}

// filter historico by interveniente mecanografico 
function filterHistoricByIntervenienteMec(tempHistoric, intervenienteMec){
    for (let index = tempHistoric.length-1; index >= 0; index--) {
        const historicItem = tempHistoric[index];
        const historicInfo = JSON.parse(historicItem.info);
        if(historicItem.tipo == 'addEquipa'){
            var intervenientesEpisodio = historicInfo.funcoes;
            var intervenientesEpisodioMecs = [];
            intervenientesEpisodio.forEach(interveniente => {
                var mecInterveniente = getIntervenienteMec(interveniente.prof);
                intervenientesEpisodioMecs.push(mecInterveniente);
            });
            var exists = false;
            for (let it = 0; it < intervenientesEpisodioMecs.length; it++) {
                const mec = intervenientesEpisodioMecs[it];
                if(mec.toString().includes(intervenienteMec.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }

        }
        else if(historicItem.tipo == 'removeEquipa'){
            var mec = getIntervenienteMec(historicInfo.id_prof);
            if(!mec.toString().includes(intervenienteMec.toString())){
                tempHistoric.splice(index, 1);
            } 
        }
        else if(historicItem.tipo == 'valitadePendenteSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if( historicItem.tipo == 'addElegivel'){
            var intervenientesEpisodio = historicInfo.profissionais;
            var intervenientesEpisodioMecs = [];
            intervenientesEpisodio.forEach(interveniente => {
                var mecInterveniente = getIntervenienteMec(interveniente);
                intervenientesEpisodioMecs.push(mecInterveniente);
            });
            var exists = false;
            for (let it = 0; it < intervenientesEpisodioMecs.length; it++) {
                const mec = intervenientesEpisodioMecs[it];
                if(mec.toString().includes(intervenienteMec.toString())){
                    exists = true;
                    break;
                }
            }
            if(!exists){
                tempHistoric.splice(index, 1);  
            }
        }
        else if( historicItem.tipo == 'removeElegivel'){
            var mecInterveniente = getIntervenienteMec(historicInfo.profissional);
            if(!mecInterveniente.toString().includes(intervenienteMec.toString())){
                tempHistoric.splice(index, 1);  
            }
        }
        else if( historicItem.tipo == 'updateGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'addGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'valitadePendenteGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'valitadePendentePagamento'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'desvalitadePendenteSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'duplaValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'singleValidacaoSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'marcadaCirurgiaSegura'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'marcadaCirurgiaInsegura'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'desvalitadePendenteGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'approveService'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'reffuseService'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'sendRefusedToSecretariado'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'sendRefusedToGDH'){
            tempHistoric.splice(index, 1);
        }
        else if(historicItem.tipo == 'changeSchedule'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'authorizedGDHtoService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'addFuncaoToService'){
            tempHistoric.splice(index, 1); 
        }
        else if(historicItem.tipo == 'generatedFile'){
            tempHistoric.splice(index, 1);
        }
    }
    return tempHistoric;
}

// get only mec from profissional
function getIntervenienteMec(prof_id) {
    var prof = "";
    for (let index = 0; index < ALLProfissionais.length; index++) {
        const profissional = ALLProfissionais[index];
        if(profissional.n_mec == prof_id){
            prof = profissional.n_mec;
            break;
        }
    }
    return prof;
}

// filter historico by user
function filterHistoricByUser(tempHistoric, user) {
    for (let index = tempHistoric.length-1; index >= 0; index--) {
        const historicItem = tempHistoric[index];
        const historicInfo = JSON.parse(historicItem.info);
        var episodioUser = historicInfo.user;
        if(!episodioUser.toString().includes(user.toString())){
            tempHistoric.splice(index, 1);
        }
    }
    return tempHistoric;
}
