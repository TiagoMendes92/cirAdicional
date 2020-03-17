$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/editModal/editModal.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/modals.css">');

var editModal;
var episodioToEdit = null;
var gdhList;

// show modal edit episodio
function showEditModal(episodio){
    episodioToEdit = episodio;
    editModal = "<div class='overlay'>"+
                    "<div id='edit_episodio' class='modal bigModal'>"+
                        "<div id='episodio_haeder' class='col_container'>"+
                            "<i onclick='closeModal(); updateOpenEpisodio("+episodioToEdit['id']+");' class='fas fa-times-circle close_modal' aria-hidden='true'></i>"+
                            "<div class='col col_40'>"+
                                "<h5>Identificação do doente</h5>"+
                                "<div class='divider'></div>"+
                                "<p>HUC <span>"+episodio['num_processo']+"</span> <span>"+episodio['nome']+"</span></p>"+
                                "<h5 class='mTop'>Registos Operatórios</h5>"+
                                "<div class='divider'></div>"+
                                "<div class='col_container'>"+
                                    "<div class='col col_35'>"+
                                        "<div class='col_container'>"+
                                            "<div class='col' style='width:4vw'>"+
                                                "<span><b>Reg-Oper:</b></span>"+
                                            "</div>"+
                                            "<div class='col'>"+
                                                "<span>"+episodio['n_episode_cir']+"</span></br>"+
                                                "<span>"+episodio['dta_episodio']+"</span></br>"+
                                                "<span>"+ getServicoAgrupamento(episodio['servico']) + " " +  getServiceName(episodio['servico'])+"</span>"+
                                            "</div>"+
                                        "</div>"+
                                        "<span><b>Data de Admissão:</b> "+episodio['dta_admissao']+"</span><br>"+
                                        "<span><b>Data de Alta:</b> "+episodio['dta_alta']+"</span>"+
                                    "</div>"+
                                    "<div class='col col_50'>"+
                                        "<div class='col_container'>"+
                                            "<div class='col' style='width:4vw'>"+
                                                "<span><b>Internamentos:</b></span>"+
                                            "</div>"+
                                            "<div class='col'>"+
                                                "<span>"+episodio['n_episode_int']+"</span>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                            "<div class='col col_60'>"+
                                "<h5>Detalhes do Registo Operatório</h5>"+
                                "<div class='divider'></div>"+
                                "<div class='col_container'>"+
                                    "<div class='col col_50'>"+
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
                                    "<div class='col col_50'>"+
                                        "<span><b>Recobro:</b> "+episodio['dta_recobro']+"</span><br>"+
                                        "<span><b>Lateralidade:</b> ?</span><br>"+
                                        "<span><b>Destino Cir.:</b> "+episodio['destino']+"</span><br>"+
                                        "<span><b>Acto Cir.:</b> "+episodio['ato_cir']+"</span><br>"+
                                        "<span><b>Detalhes Interv.</b> ?</span><br>"+
                                        "<span><b>Obs.</b> ?</span><br>"+
                                        "<span><b>Nº de Inter.</b> ?</span><br>"+
                                        "<span><b>Estado de Integração:</b> "+getNomeEstado(episodio.estado)+"</span><br>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                        "<div id='episodio_body'>"+
                            "<div class='col_container'>"+
                                "<div class='col col_40'>"+
                                    "<div class='table_modal'>"+
                                        "<div class='table_modal_header borderBottom'>"+
                                            "<h5>Intervenções</h5>"+
                                        "</div>"+
                                        "<div class='table_modal_body'>";
                                        episodio['intervencoes'].forEach(function(intervencao, it) {
                                editModal+= "<div class='borderBottom' style='width: 10%; float: left'>"+intervencao['sigla']+"</div>"+
                                            "<div class='borderBottom' style='width: calc(90% - 15px); margin-left:15px; float: left'>"+intervencao['nome'].toUpperCase()+"</div>";
                                        });    
                            editModal+="</div>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='col col_40'>"+
                                    "<div class='table_modal'>"+
                                        "<div class='table_modal_header borderBottom'>"+
                                            "<h5>Diagnósticos</h5>"+
                                        "</div>"+
                                        "<div class='table_modal_body'>";
                            episodio['diagnosticos'].forEach(function(diagnostico, it) {
                                editModal+= "<div class='borderBottom' style='width: 10%; float: left'>"+diagnostico['sigla']+"</div>"+
                                            "<div class='borderBottom' style='width: calc(90% - 15px); margin-left:15px; float: left'>"+diagnostico['nome'].toUpperCase()+"</div>";
                                        });    
                            editModal+="</div>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='col col_20' style='position:relative;'>"+
                                    "<div id='whereToADDgdhINPT' style='background: lightblue; right: 0; padding-left: 30px; padding-top: 30px; height: 56vh; position: absolute; width: 16.5vw; line-height: 145%;'>"+
                                    "</div>"+
                                "</div>"+
                            "</div>"+
                            "<div class='col_container' style='margin-top:1.5vw'>"+
                                "<div class='col col_80' style='width: 57%;'>"+
                                    "<div class='table_modal' style='width: 100%;'>"+
                                        "<div class='table_modal_header borderBottom dispTable'>"+
                                            "<div class='col_40_float'>"+
                                                "<h5>Equipa Cirúrgica</h5>"+
                                            "</div>"+
                                            "<div class='col_40_float'>"+
                                                "<h5>Função</h5>"+
                                            "</div>"+
                                            "<div class='col col_10_float valueColEditModal'>"+
                                                "<h5 class='numericValue' style='"+( episodio.estado == 0 ?  'margin-right: 22px;' : 'margin-right: 50px;')+"'>%</h5>"+
                                            "</div>"+
                                            "<div class='col col_10_float accoesColEditModal'>"+
                                                "<h5>Acções</h5>"+
                                            "</div>"+
                                        "</div>"+
                                        "<div class='table_modal_body' id='body_equipe_cirurgica'>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='col col_20'>"+
                                    "<button onclick='addMemberToCirugicTeam("+episodio.id+")' id='editModal-AddMemberEC' class='btn-outline col_container'>"+
                                        "<div class='col col_96 alignMiddle'>"+ 
                                            "Adicionar Membro <br>Equipa Cirurgica"+
                                        "</div>"+
                                        "<div class='col col_4 alignMiddle'>"+
                                            "<i class='fas fa-plus' aria-hidden='true'></i>"+
                                        "</div>"+
                                    "</button>"+
                                "</div>"+
                            "</div>"+
                            "<div class='col_container' style='margin-top:1.5vw'>"+
                                "<div class='col col_80' style='width: 57%;'>"+
                                    "<div class='table_modal' style='width: 100%;'>"+
                                        "<div class='table_modal_header borderBottom dispTable'>"+
                                            "<div class='col_40_float'>"+
                                                "<h5>Equipa de Apoio</h5>"+
                                            "</div>"+
                                            "<div class='col_40_float'>"+
                                                "<h5>Função</h5>"+
                                            "</div>"+
                                            "<div class='col col_10_float valueColEditModal'>"+
                                                "<h5 class='numericValue' style='"+( episodio.estado == 0 ?  'margin-right: 22px;' : 'margin-right: 50px;')+"'>%</h5>"+
                                            "</div>"+
                                            "<div class='col col_10_float accoesColEditModal'>"+
                                                "<h5>Acções</h5>"+
                                            "</div>"+
                                        "</div>"+
                                        "<div class='table_modal_body' id='body_equipe_apoio'>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='col col_20'>"+
                                    "<button onclick='addMemberToApoioTeam("+episodio.id+")' id='editModal-AddMemberEA' class='btn-outline col_container'>"+
                                        "<div class='col col_96 alignMiddle'>"+ 
                                            "Adicionar Membro <br>Equipa de Apoio"+
                                        "</div>"+
                                        "<div class='col col_4 alignMiddle'>"+
                                            "<i class='fas fa-plus' aria-hidden='true'></i>"+
                                        "</div>"+
                                    "</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>";
    
    $("body").append(editModal);
    drawEquipaCirurgica(episodio);
    drawEquipaApoio(episodio);
    $("#whereToADDgdhINPT").css('display', 'none');
    if(episodio.estado >= 1){
        $(".removeFromTeam-icon").remove();
        $(".accoesColEditModal").remove();
        $(".intervenienteEPvalor_editModal, .intervenienteEAvalor_editModal").css('width','calc(18% - 15px)');
        $(".valueColEditModal").css('width','20%');
        $("#whereToADDgdhINPT").css('display', 'block');
        $("#editModal-AddMemberEC, #editModal-AddMemberEA").remove();
            var canMantainGDH = false;
            var div =   "<div>"+
                            "<h5>Adicionar GDH:</h5>";
                    if(episodio['gdh1'] == null){
                        div += "<span><b>O Episódio vem sem qualquer GDH definido</b></span></br>";
                    } else {
                        div += "<span><b>GDH por defeito: "+getGDHRef(episodio['gdh1'])+"</b></span>";
                        var episodioServiceID = episodio.servico;
                        var episodioService;
                        for (let it = 0; it < servicos.length; it++) {
                            const servico = servicos[it];
                            if(servico['id'] == episodioServiceID){
                                episodioService= servico;
                                break;
                            }
                        }
                        var gdhsAuthorizedServiceIDs = (episodioService.listaGHDs != null ? episodioService.listaGHDs : "");
                        gdhsAuthorizedServiceIDs = gdhsAuthorizedServiceIDs.split(","); 
                        var gdhsAuthorizedService = [];
                        gdhsAuthorizedServiceIDs.forEach( function(authorizedGDHId){
                            for (let it = 0; it < gdhList.length; it++) {
                                const gdhCandidate = gdhList[it];
                                if(authorizedGDHId == gdhCandidate['id']){
                                    gdhsAuthorizedService.push(gdhCandidate);
                                }
                            }
                        });
                        var isGDHAuthorized = false;
                        for (let it = 0; it < gdhsAuthorizedService.length; it++) {
                            const gdhAuth = gdhsAuthorizedService[it];
                            if(gdhAuth['id'] == episodio['gdh1']){
                                isGDHAuthorized = true;
                                break;
                            }
                        }
                        if(!isGDHAuthorized){
                            div += "<span style='color:red'><b> (O serviço "+getServiceName(episodio.servico)+" não está autorizado a realizar o GDH "+getGDHRef(episodio['gdh1'])+")</span>";
                        } else {
                            canMantainGDH = true;
                        }
                    }
                    div +=  "<br><span style='display:none;' id='valor_unitario1-editModal-label'><b>VALOR UNITÁRIO:</b></span></br>"+
                            "<span id='valor_unitario1-editModal'></span></br>"+ 
                            "<span style='display:none;' id='perc1-editModal-label'><b>PERCENTAGEM A PAGAR:</b></span></br>"+
                            "<span id='perc1-editModal'></span></br>"+ 
                            "<span style='display:none;' id='valor_pagar1-editModal-label'><b>VALOR A PAGAR:</b></span></br>"+
                            "<span id='valor_pagar1-editModal'></span></br>"+ 
                            "<span><b>GDH Atribuído:</b>"+
                            "<select onchange='calcGDH2Values("+episodio.id+", 1)' class='insertGDH' id='input-gdh2-editModal'>"+
                                "<option value=''>Selecione um GDH</option>"+
                            "</select><br>"+
                            "<span style='display:none;' id='valor_unitario2-editModal-label'><b>VALOR UNITÁRIO:</b></span></br>"+
                            "<span id='valor_unitario2-editModal'></span></br>"+ 
                            "<span style='display:none;' id='perc2-editModal-label'><b>PERCENTAGEM A PAGAR:</b></span></br>"+
                            "<span id='perc2-editModal'></span></br>"+ 
                            "<span style='display:none;' id='valor_pagar2-editModal-label'><b>VALOR A PAGAR:</b></span></br>"+
                            "<span id='valor_pagar2-editModal'></span>"+
                            "<button onclick='addGDHToEpisodioFromModaledit(null)' id='addGDHtoEpisodio-EditModal' class='btn-outline col_container' style='width: 7vw'>"+
                                "<div class='col col_96 alignMiddle'>"+
                                    "Adicionar GDH"+
                                "</div>"+
                                "<div class='col col_4  alignMiddle'>"+
                                    "<i class='fas fa-plus' aria-hidden='true'></i>"+
                                "</div>"+
                            "</button>"+
                        "</div>"; 
        $("#whereToADDgdhINPT").append(div);

        var episodioServiceID = episodio.servico;
        var episodioService;
        for (let it = 0; it < servicos.length; it++) {
            const servico = servicos[it];
            if(servico['id'] == episodioServiceID){
                episodioService= servico;
                break;
            }
        }
        var gdhsAuthorizedServiceIDs = (episodioService.listaGHDs != null ? episodioService.listaGHDs : ""); 
        gdhsAuthorizedServiceIDs = gdhsAuthorizedServiceIDs.split(","); 
        var gdhsAuthorizedService = [];
        gdhsAuthorizedServiceIDs.forEach( function(authorizedGDHId){
            for (let it = 0; it < gdhList.length; it++) {
                const gdhCandidate = gdhList[it];
                if(authorizedGDHId == gdhCandidate['id']){
                    gdhsAuthorizedService.push(gdhCandidate);
                }
            }
        });
        if(gdhsAuthorizedService.length == 0){
            $("#input-gdh2-editModal").empty();
            $('#input-gdh2-editModal').prop('disabled', 'disabled');
            $("#input-gdh2-editModal").append("<option value=''>Nenhum GDH autorizado</option>");
        } else {
            addLoading();
            var data = episodio['dta_cirurgia'];
            var fd = new FormData();
            fd.append('data', data);
            $.ajax({
                type: "POST",
                url: "./api/episodios/getCodPortaria.php",
                data: fd,
                processData: false,
                contentType: false,
                success:function(data){
                    var codigoPortaria = JSON.parse(data)['cod_portaria'];
                    gdhsAuthorizedService.forEach(function (authGDH) {
                        if(codigoPortaria == authGDH.cod_portaria){
                            $("#input-gdh2-editModal").append("<option value='"+authGDH.id+"'>"+authGDH.gdh + " ("+authGDH.cod_gdh+")</option>");
                        }
                    });
                    removeLoading();


                    if(episodio['gdh1'] != null){
                        $("#input-gdh1-editModal").val(episodio['gdh1']);
                        calcGDHValues(episodio['gdh1']);
                    }
                    if(episodio['gdh2'] != null){
                        $("#input-gdh2-editModal").val(episodio['gdh2']);
                        calcGDH2Values(episodio.id, 0);
                    }

                }
            });
        }
    }
    if(episodio.estado == 2){
        $('.insertGDH').prop("disabled", true);
        $("#addGDHtoEpisodio-EditModal").remove();
    }
} 

//atualizar equipa mainList
function addGDHToEpisodioFromModaledit(pred_value) {
    var gdh_id2 = $("#input-gdh2-editModal").val();
    if(gdh_id2 != ''){
        gdh2 = gdh_id2;
        var fd = new FormData();
        fd.append('id_episodio', episodioToEdit.id);
        fd.append('gdh2', gdh2);
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/episodios/addGDHtoEpisodio.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                var answer = JSON.parse(data);
                if(answer == 'success'){
                    closeModal();
                    // checkPrivilegies(user);
                    getEpisodios([1,2], null);
                    if($("#validarPendenteGDH").length == 0){
                        $("#mainList-validationButtons").append("<button id='validarPendenteGDH' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='validarGDHsEpisodios()'>Validar</button>");
                    }
                }
                removeLoading();
            }
        });

    } else {
        toastr("Selecione um GDH", "error");
    }
}

// cal Values GDH1
function calcGDHValues(gdh_id){
    if(gdh_id != ''){
        $('#input-gdh2-editModal').prop("disabled", false);
        var gdh_target;
        for (let id = 0; id < gdhList.length; id++) {
            const gdh = gdhList[id];
            if(gdh.id == gdh_id){
                gdh_target = gdh;
                break;
            }
        }
        var valorGDH = parseFloat(gdh_target['v_uni']);
        var percentageGDH = parseFloat(gdh_target['perc']);
        var gdh_finalVal = valorGDH * percentageGDH / 100;
        var equipaCirurgica = episodioToEdit['equipaCirugica'];
        $("#valor_unitario1-editModal-label, #perc1-editModal-label, #valor_pagar1-editModal-label").css('display','unset');
        $("#valor_unitario1-editModal").text(valorGDH.toFixed(2) + "€");
        $("#perc1-editModal").text(percentageGDH.toFixed(2) + "%");
        $("#valor_pagar1-editModal").text(gdh_finalVal.toFixed(2) + "€");
        equipaCirurgica.forEach(function(interveniente, it) {
            $("#EC_value_recieve"+it).remove();
            var funcao = interveniente.funcao;
            var valor = gdh_finalVal * parseFloat(funcao['perc']) / 100;
            $("#intervenienteEPvalor_editModal"+it).append("<b id='EC_value_recieve"+it+"'style='color:grey; font-size:.9vw; float:right; width:80px'>"+valor.toFixed(2)+" €</b>");
        });
        var equipaApoio = episodioToEdit['equipaApoio'];
        equipaApoio.forEach(function(interveniente, it) {
            $("#EA_value_recieve"+it).remove();
            var funcao = interveniente.funcao;
            var valor = gdh_finalVal * parseFloat(funcao['perc']) / 100;
            $("#intervenienteEAvalor_editModal"+it).append("<b id='EA_value_recieve"+it+"'style='color:grey; font-size:.9vw; float:right; width:80px'>"+valor.toFixed(2)+" €</b>");
        });
    } else {
        $("#valor_unitario2-editModal-label, #perc2-editModal-label, #valor_pagar2-editModal-label").css('display','none');
        $("#valor_unitario2-editModal, #perc2-editModal, #valor_pagar2-editModal").text("");
        if(episodioToEdit['gdh1'] != null){
            calcGDHValues(episodioToEdit['gdh1']);
        } else {
            var equipaCirurgica = episodioToEdit['equipaCirugica'];
            equipaCirurgica.forEach(function(interveniente, it) {
                $("#EC_value_recieve"+it).remove();
            });
            var equipaApoio = episodioToEdit['equipaApoio'];
            equipaApoio.forEach(function(interveniente, it) {
                $("#EA_value_recieve"+it).remove();
            });
        }
    }
}

// cal Values GDH2
function calcGDH2Values(id_episodio , from){
    var gdh_id2;
    if(from == 0){ //load
        var targetGDH;
        for (let it = 0; it < gdhList.length; it++) {
            const gdhCan = gdhList[it];
            if(episodioToEdit['gdh2'] == gdhCan['id']){
                targetGDH = gdhCan['id'];
            }
        }
        $("#input-gdh2-editModal").val(parseInt(targetGDH));
        calcGDH2Values(id_episodio, 1);
    } else { //select change
        gdh_id2 = $("#input-gdh2-editModal").val();
        if(gdh_id2 != ""){
            var targetGDH;
            for (let it = 0; it < gdhList.length; it++) {
                const gdhCandidate = gdhList[it];
                if(parseInt(gdhCandidate['id']) == parseInt(gdh_id2)){
                    targetGDH = gdhCandidate;
                    break;
                }
            }
            var valorGDH2 = parseFloat(targetGDH['v_uni']);
            var percentageGDH2 = parseFloat(targetGDH['perc']);
            var gdh_finalVal2 = valorGDH2 * percentageGDH2 / 100;

            $("#valor_unitario2-editModal-label, #perc2-editModal-label, #valor_pagar2-editModal-label").css('display','unset');
            $("#valor_unitario2-editModal").html("<b>"+valorGDH2.toFixed(2) + "€</b>");
            $("#perc2-editModal").html("<b>"+percentageGDH2.toFixed(2) + "%</b>");
            $("#valor_pagar2-editModal").html("<b>"+gdh_finalVal2.toFixed(2) + "€</b>");
            var equipaCirurgica = episodioToEdit['equipaCirugica'];

            equipaCirurgica.forEach(function(interveniente, it) {
                $("#EC_value_recieve"+it).remove();
                var funcao = interveniente.funcao;
                var valor =  (gdh_finalVal2 * parseFloat(funcao['perc']) / 100);
                $("#intervenienteEPvalor_editModal"+it).append("<b id='EC_value_recieve"+it+"'style='color:red; font-size:.9vw; float:right; width:80px'>"+valor.toFixed(2)+" €</b>");
            });

            var equipaApoio = episodioToEdit['equipaApoio'];
            equipaApoio.forEach(function(interveniente, it) {
                $("#EA_value_recieve"+it).remove();
                var funcao = interveniente.funcao;
                var valor = (gdh_finalVal2 * parseFloat(funcao['perc']) / 100);
                $("#intervenienteEAvalor_editModal"+it).append("<b id='EA_value_recieve"+it+"'style='color:red; font-size:.9vw; float:right; width:80px'>"+valor.toFixed(2)+" €</b>");
            });
        } else {
            calcGDHValues('');
        }
    }
}

// get gdh list
function getGDHList(){
    addLoading();
    $.ajax({
        type: "GET",
        url: "./api/gdh/getAllGDHs.php",
        processData: false,
        contentType: false,
        success:function(data){
            gdhList = JSON.parse(data);
            removeLoading();
        }
    });
}

// desenha equipa cirurgica
function drawEquipaCirurgica(episodio) {
    if(episodio['equipaCirugica'].length >0){
        episodio['equipaCirugica'].forEach(function(interveniente, it) {
            var funcao = interveniente['funcao'];
            var rowEquipa=  "<div style='display:table; width:100%;'>"+
                                "<div style='width: calc(8% - 20px); margin-right:20px; float:left;' class='borderBottom'>"+
                                    interveniente['n_mec'] +
                                "</div>"+
                                "<div style='width: calc(32.9% - 20px); margin-right:20px; float:left;' class='borderBottom'>"+
                                    interveniente['nome'].toUpperCase() +
                                "</div>"+
                                "<div style='width:calc(40.5% - 20px); margin-right:20px; float:left;' class='borderBottom'>"+
                                    "<span style='margin-right: 20px'>"+funcao['sigla']+"</span>"+ funcao['funcao'].toUpperCase()+
                                "</div>"+
                                "<div id='intervenienteEPvalor_editModal"+it+"' class='intervenienteEPvalor_editModal borderBottom numericValue' style='width:calc(10.5% - 20px); margin-right:10px; float:left;'>"+
                                    (Number(funcao['perc']).toFixed(2))+"%"+
                                "</div>"+
                                "<div style='width:8.1%; float:left;' class='removeFromTeam-icon'>"+
                                    "<i onclick='removeFromEquipaCirurgica("+it+")' class='fas fa-minus-circle' style='color:red; cursor:pointer;'></i>" +
                                "</div>"
                            "</div>";
            $("#body_equipe_cirurgica").append(rowEquipa);
        });
    } else {
        var rowEquipa=  "<div style='width: 100%; text-align: center' class='borderBottom'>"+
                            "Nenhum Interveniente"+
                        "</div>";
        $("#body_equipe_cirurgica").append(rowEquipa);
    }
}

// remover da equipa cirurgica
function removeFromEquipaCirurgica(it) {    
    var interveniente = episodioToEdit['equipaCirugica'][it];
    var fd = new FormData();
    fd.append('body', JSON.stringify(interveniente));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/removeIntervenientesEC.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            var response = JSON.parse(data); 
            if(response == 'error'){
                toastr("Erro ao remover elemento da Equipa Cirurgica", "error");
                return;
            } else {
                getEpisodioInfoById(interveniente['id_episodio']);
            }
        }
    });
}

// desenha equipa de apoio
function drawEquipaApoio(episodio) {
    if(episodio['equipaApoio'].length >0){
        episodio['equipaApoio'].forEach(function(interveniente, it) {
            var funcao = interveniente.funcao;
            var rowEquipa=  "<div style='display:table; width:100%;'>"+
                                "<div style='width: calc(8% - 20px); margin-right:20px; float:left;' class='borderBottom'>"+
                                    interveniente['n_mec'] +
                                "</div>"+
                                "<div style='width: calc(32.9% - 20px); margin-right:20px; float:left;' class='borderBottom'>"+
                                    interveniente['nome'].toUpperCase() +
                                "</div>"+
                                "<div style='width:calc(40.5% - 20px); margin-right:20px; float:left;' class='borderBottom'>"+
                                    "<span style='margin-right: 20px'>"+funcao['sigla']+"</span>"+ funcao['funcao'].toUpperCase()+
                                "</div>"+
                                "<div id='intervenienteEAvalor_editModal"+it+"' class='intervenienteEAvalor_editModal borderBottom numericValue' style='width:calc(10.5% - 20px); margin-right:10px; float:left;'>"+
                                    (Number(funcao['perc']).toFixed(2))+"%"+
                                "</div>"+
                                "<div style='width:8.1%; float:left;' class='removeFromTeam-icon'>"+
                                    "<i onclick='removeFromEquipaApoio("+it+")' class='fas fa-minus-circle' style='color:red; cursor:pointer'></i>" +
                                "</div>"+
                            "</div>";
            $("#body_equipe_apoio").append(rowEquipa);
        });
    } else {
        var rowEquipa=  "<div style='width: 100%; text-align: center' class='borderBottom'>"+
                            "Nenhum Interveniente"+
                        "</div>";
        $("#body_equipe_apoio").append(rowEquipa);
    }
}

// remover da equipa apoio
function removeFromEquipaApoio(it) {
    var interveniente = episodioToEdit['equipaApoio'][it];
    var fd = new FormData();
    fd.append('body', JSON.stringify(interveniente));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/removeIntervenientesEC.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            var response = JSON.parse(data); 
            if(response == 'error'){
                toastr("Erro ao remover elemento da Equipa Cirurgica", "error");
                return;
            } else {
                getEpisodioInfoById(interveniente['id_episodio']);
            }
        }
    });  
}

// adicionar membro à equipa cirurgica
function addMemberToCirugicTeam(id_episodio) {
    var addToEquipaCirurgicaEdit =  "<div class='overlay submodal'>"+
                                        "<div class='modal' id='addMemberToCirugicTeam-modal'>"+
                                            "<h4 class='modal_title font-black'>Adicionar Elemento à Equipa Cirurgia <i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                            "<div class='container-filtros'>"+
                                                "<span class='font-light'>Filtros</span><br><br>"+
                                                "<span class='font-bold'>Nome</span><input id='nome-filter-principalAdd' class='input-adicional-nome' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Nº Mecanográfico</span><input style='width:5vw;' id='n_mec-filter-principalAdd' class='input-adicional' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Categoria</span><input style='width:5vw;' id='categoria-filter-principalAdd' class='input-adicional' type='text'/>"+
                                                "<span><i onclick='getFuncionariosPossiveisEquipaCirurgiaEDITmodal(1)' class='fas fa-search search-icon'></i></span>"+
                                                "<span><i onclick='resetSearchEquipaPrincipalModal(1)' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                            "</div>"+
                                            "<div id='addToEquipaCirurgica'>"+
                                                "<div id='addToEquipaCirurgica-header' class='col_container'>"+
                                                    "<div class='col' style='width: 59%;'>"+
                                                        "Intervenientes Eligíveis para Cirurgia Adicional"+
                                                    "</div>"+
                                                    "<div class='col' style='width:26%'>"+
                                                        "Categoria"+
                                                    "</div>"+
                                                    "<div class='col' style='width:15%'>"+
                                                        "<label class='container costumHeight modalCheck'>"+
                                                            "<input type='checkbox' id='select_all_possibilidades_equipaC' onclick='selectAllPossibilidadesEquipaCirurgica()'>"+
                                                            "<span class='checkmark costumCheck'></span>"+
                                                        "</label>"+
                                                        "<span style='margin-left: 34px'>Selecionar</span>"+
                                                    "</div>"+
                                                "</div>"+
                                                "<div id='addToEquipaCirurgica-body' style='width:calc(93% + 18px) !important;'>"+
                                                "</div>"+ 
                                            "</div>"+
                                            "<div style='margin-top:2vw;' id='addToEquipaCirurgicaEdit-btns'>"+
                                                "<button onclick='EDITaddToEquipaPrincipal("+id_episodio+")' class='confirm-btn'>Confirmar</button>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>";
    $("body").append(addToEquipaCirurgicaEdit);
    getFuncionariosPossiveisEquipaCirurgiaEDITmodal(1);
}

//get funcionarios possiveis de adicionar à equipa cirurgica
function getFuncionariosPossiveisEquipaCirurgiaEDITmodal(from){
    var fd = new FormData();
    fd.append('nome', ($("#nome-filter-principalAdd").val() != undefined ? $("#nome-filter-principalAdd").val().trim() : ''));
    fd.append('n_mec', ($("#n_mec-filter-principalAdd").val() != undefined ? $("#n_mec-filter-principalAdd").val().trim() : ''));
    fd.append('categoria', ($("#categoria-filter-principalAdd").val() != undefined ? $("#categoria-filter-principalAdd").val().trim() : ''));
    if(from == 0){
        fd.append('autorizacao', '0');
    } else {
        fd.append('autorizacao', '1');
    }
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/intervenientes/getIntervenientesEquipaPrincipalPossiveis.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            equipaPrincipalPossibilidades = JSON.parse(data);
            var n_mecs = [];
            equipaPrincipalPossibilidades.forEach(function (element) {
                n_mecs.push(element['n_mec']);
            });
            if(n_mecs.length >0) {
                var data = episodioToEdit['dta_cirurgia'];
                var fd = new FormData();
                fd.append('n_mecs', JSON.stringify(n_mecs));
                fd.append('data', data);
                $.ajax({
                    type: "POST",
                    url: "./api/intervenientes/checkAusencias.php",
                    data: fd,
                    processData: false,
                    contentType: false,
                    success:function(data){
                        removeLoading();
                        var pessoalAusente = JSON.parse(data);
                        for (let it1 = equipaPrincipalPossibilidades.length-1; it1 >= 0; it1--) {
                            const possibilidade = equipaPrincipalPossibilidades[it1];
                            for (let it2 = pessoalAusente.length-1; it2 >= 0; it2--) {
                                const ausente = pessoalAusente[it2];
                                if(possibilidade['n_mec'] == ausente['IDTRAB']){
                                    equipaPrincipalPossibilidades.splice(it1, 1);
                                    break;
                                }
                            }
                        }
                        drawEquipaPrincipalPossibilidades(equipaPrincipalPossibilidades, from);
                    }
                });
            } else {
                removeLoading();
                drawEquipaPrincipalPossibilidades(equipaPrincipalPossibilidades, from);
            }
        }
    });   
}

// adicionar membro à equipa de apoio
function addMemberToApoioTeam(id_episodio){
    var addToEquipaApoioModal = "<div class='overlay submodal'>"+
                                    "<div class='modal' id='addMemberToCirugicTeam-modal'>"+
                                        "<h4 class='modal_title font-black'>Adicionar Elemento à Equipa de Apoio<i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                        "<div class='container-filtros'>"+
                                            "<span class='font-light'>Filtros</span><br><br>"+
                                            "<span class='font-bold'>Nome</span><input id='nome-filter-apoioAdd' class='input-adicional-nome' type='text'/>"+
                                            "<span class='font-bold margin-filtros'>Nº Mecanográfico</span><input style='width:5vw' id='n_mec-filter-apoioAdd' class='input-adicional' type='text'/>"+
                                            "<span class='font-bold margin-filtros'>Categoria</span><input style='width:5vw' id='categoria-filter-apoioAdd' class='input-adicional' type='text'/>"+
                                            "<span><i onclick='getFuncionariosPossiveisEquipaApoioEDITmodal(1)' class='fas fa-search search-icon'></i></span>"+
                                            "<span><i onclick='resetSearchEquipaApoioModal(1)' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                        "</div>"+
                                        "<div id='addToEquipaCirurgica'>"+
                                            "<div id='addToEquipaCirurgica-header' class='col_container'>"+
                                                "<div class='col' style='width: 59%;'>"+
                                                    "Intervenientes Eligíveis para Cirurgia Adicional"+
                                                "</div>"+
                                                "<div class='col' style='width:26%'>"+
                                                    "Categoria"+
                                                "</div>"+
                                                "<div class='col' style='width:15%'>"+
                                                    "<label class='container costumHeight modalCheck'>"+
                                                        "<input type='checkbox' id='select_all_possibilidades_equipaC' onclick='selectAllPossibilidadesEquipaCirurgica()'>"+
                                                        "<span class='checkmark costumCheck'></span>"+
                                                    "</label>"+
                                                    "<span style='margin-left: 34px'>Selecionar</span>"+
                                                "</div>"+
                                            "</div>"+
                                            "<div id='addToEquipaCirurgica-body' style='width:calc(93% + 18px) !important;'>"+
                                            "</div>"+ 
                                        "</div>"+
                                        "<div style='margin-top:2vw;' id='addToEquipaCirurgicaEdit-btns'>"+
                                            "<button onclick='EDITaddToEquipaApoio("+id_episodio+")' class='confirm-btn'>Confirmar</button>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>";
    $("body").append(addToEquipaApoioModal);
    getFuncionariosPossiveisEquipaApoioEDITmodal(1);
}

function getFuncionariosPossiveisEquipaApoioEDITmodal(from) {
    var fd = new FormData();
    fd.append('nome', ($("#nome-filter-apoioAdd").val() != undefined ? $("#nome-filter-apoioAdd").val().trim() : ''));
    fd.append('n_mec', ($("#n_mec-filter-apoioAdd").val() != undefined ? $("#n_mec-filter-apoioAdd").val().trim() : ''));
    fd.append('categoria', ($("#categoria-filter-apoioAdd").val() != undefined ? $("#categoria-filter-apoioAdd").val().trim() : ''));
    if(from == 0){
        fd.append('autorizacao', '0');
    } else {
        fd.append('autorizacao', '1');
    }
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/intervenientes/getIntervenientesEquipaApoioPossiveis.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            equipaApoioPossibilidades = JSON.parse(data);
            var n_mecs = [];
            equipaApoioPossibilidades.forEach(function (element) {
                n_mecs.push(element['n_mec']);
            });
            if(n_mecs.length >0) {


                var data = episodioToEdit['dta_cirurgia'];
                var fd = new FormData();
                fd.append('n_mecs', JSON.stringify(n_mecs));
                fd.append('data', data);
                $.ajax({
                    type: "POST",
                    url: "./api/intervenientes/checkAusencias.php",
                    data: fd,
                    processData: false,
                    contentType: false,
                    success:function(data){
                        removeLoading();
                        var pessoalAusente = JSON.parse(data);
                        for (let it1 = equipaApoioPossibilidades.length-1; it1 >= 0; it1--) {
                            const possibilidade = equipaApoioPossibilidades[it1];
                            for (let it2 = pessoalAusente.length-1; it2 >= 0; it2--) {
                                const ausente = pessoalAusente[it2];
                                if(possibilidade['n_mec'] == ausente['IDTRAB']){
                                    equipaApoioPossibilidades.splice(it1, 1);
                                    break;
                                }
                            }
                        }
                        drawEquipaPrincipalPossibilidades(equipaApoioPossibilidades, from);
                    }
                });
            } else{
                removeLoading();
                drawEquipaApoioPossibilidades(equipaApoioPossibilidades, from);
            }
        }
    });   
}
// add member to cirurgic team
function EDITaddToEquipaPrincipal(id_episodio) {
    var listaToAdd = [];
    equipaPrincipalPossibilidades.forEach(function(elemento, it) {
        if($("#possibilidade"+it).is(':checked')){
            listaToAdd.push(elemento.n_mec);
        }
    });
    if(listaToAdd.length == 0){
        toastr("Selecione pelo menos um elemento para adicionar aos elegíveis para integrar uma Equipa Cirurgica", "error");
        return;
    }
    var episodio; 
    for(var i = episodios.length-1; i>=0; i--){
        if(episodios[i]['id'] == id_episodio){
            episodio = episodios[i];
            break;
        }
    }
    var targetServicoID = episodio.servico;
    var targetServico;
    for (let index = servicos.length-1; index >= 0; index--) {
        const servicoCandidadte = servicos[index];
        if(servicoCandidadte['id'] == targetServicoID){
            targetServico = servicoCandidadte;
            break;
        }
    }
    var tempfuncoes = targetServico.lista_funcoes; 
    var funcoes = [];
    tempfuncoes.forEach(function(funcao) {
        if(funcao['equipa'] == 'EC'){
            funcoes.push(funcao);
        }
    });
    
    $("#addMemberToCirugicTeam-modal .container-filtros").remove();
    $("#addMemberToCirugicTeam-modal #addToEquipaCirurgica").empty();
    $("#addMemberToCirugicTeam-modal .modal_title").html("Definir funções dos elementos escolhidos <i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i>");
    $("#addToEquipaCirurgicaEdit-btns").html("<button id='confirmFuncoesEquipaCirurgica' class='confirm-btn'>Confirmar</button>");
    var header= "<div class='col_container borderBottom tableHeader'>"+
                    "<div class='col col_65'>"+
                        "<h5>Funcionário</h5>"+
                    "</div>"+
                    "<div class='col col_35'>"+
                        "<h5>Função</h5>"+
                    "</div>"+
                "</div>";
    $("#addMemberToCirugicTeam-modal #addToEquipaCirurgica").html(header);
    listaToAdd.forEach(function(pos) {
        var elemento = null;
        for (let index = 0; index < equipaPrincipalPossibilidades.length; index++) {
            const element = equipaPrincipalPossibilidades[index];
            if(element.n_mec == pos){
                elemento = element;
                break;
            }
        }
        var row = "<div class='col_container'>"+
                    "<div class='col col_65'>"+
                        "<div class='col_container'>"+
                            "<div class='col col_65'>"+
                                "<div style='float: left; width:15%;' class='borderBottom marginBottom10'>"+
                                    elemento['n_mec']+
                                "</div>"+ 
                                "<div class='borderBottom marginBottom10' style='margin-left:20px; float:left; width: calc(85% - 30px);'>"+
                                    elemento['nome'].toUpperCase()+
                                "</div>"+
                            "</div>"+
                            "<div class='col col_35'>"+
                                "<div class='borderBottom marginBottom10'>"+
                                    elemento['categoria'].toUpperCase()+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    "<div class='col col_35'>";
                    if(funcoes.length > 0){
                row+=   "<select style='margin-top:5px;' id='funcao"+pos+"'>"+
                            "<option value=''>Nenhuma</option>";
                        funcoes.forEach(function (funcao, it) {
                    row += "<option value='"+it+"'>"+funcao['sigla']+" - "+funcao['funcao']+"</option>";
                            });
                row+=   "<select>";
                    } else {
                        row+=   "<select style='margin-top:5px;' id='funcao"+pos+"'>"+
                        "<option value=''>Nenhuma</option>";
                    funcoes.forEach(function (funcao, it) {
                row += "<option value='"+it+"'>"+funcao['sigla']+" - "+funcao['funcao']+"</option>";
                        });
            row+=   "<select>";
                row += "<span style='color:red; margin: 0; transform: translateY(50%); font-size:10px'> (Este Serviço não tem nenhum função definida)</span>";
                    }
                row+= "</div>"+
                    "</div>";
        $("#addMemberToCirugicTeam-modal #addToEquipaCirurgica").append(row);
    });

    document.getElementById('confirmFuncoesEquipaCirurgica').addEventListener('click', function(){
        var anyWithoutFuncion = false;
        var left = null;
        for (let it = 0; it < listaToAdd.length; it++) {
            if($("#funcao"+listaToAdd[it]).val() == '' || $("#funcao"+listaToAdd[it]).val() == undefined){
                anyWithoutFuncion = true;
                left = listaToAdd[it];
                break;
            }
        }
        if(anyWithoutFuncion){
            var intervenienteLeft;
            for (let id = 0; id < equipaPrincipalPossibilidades.length; id++) {
                const element = equipaPrincipalPossibilidades[id];
                if(element.n_mec == left){
                    intervenienteLeft = element;
                }
            }
            toastr("Defina a função do Colaborador '"+intervenienteLeft['nome']+"'","error");
            return;
        }
        var body = {
            episodio: id_episodio,
            funcoes: []
        };
        listaToAdd.forEach(function (it) {
            var elemento = null;
            for (let index = 0; index < equipaPrincipalPossibilidades.length; index++) {
                const element = equipaPrincipalPossibilidades[index];
                if(element.n_mec == it){
                    elemento = element;
                    break;
                }
            }
            var obj = {
                prof: elemento['n_mec'],
                func: funcoes[parseInt($("#funcao"+it).val())]
            };
            body.funcoes.push(obj);
        }); 
        var fd = new FormData();
        fd.append('body', JSON.stringify(body));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/episodios/addIntervenientesEC.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                var response = JSON.parse(data); 
                if(response == 'error'){
                    toastr("Erro ao adicionar elementos à Equipa Cirurgica", "error");
                    return;
                } else {
                    getEpisodioInfoById(id_episodio);
                }
            }
        }); 
    });
       
}

// add member to apoio team
function EDITaddToEquipaApoio(id_episodio) {
    var listaToAdd = [];
    equipaApoioPossibilidades.forEach(function(elemento, it) {
        if($("#possibilidade"+it).is(':checked')){
            listaToAdd.push(elemento.n_mec);
        }
    });
    if(listaToAdd.length == 0){
        toastr("Selecione pelo menos um elemento para adicionar aos elegíveis para integrar uma Equipa Cirurgica", "error");
        return;
    }
    var episodio; 
    for(var i = episodios.length-1; i>=0; i--){
        if(episodios[i]['id'] == id_episodio){
            episodio = episodios[i];
            break;
        }
    }
    var targetServicoID = episodio.servico;
    var targetServico;
    for (let index = servicos.length-1; index >= 0; index--) {
        const servicoCandidadte = servicos[index];
        if(servicoCandidadte['id'] == targetServicoID){
            targetServico = servicoCandidadte;
            break;
        }
    }
    var tempfuncoes = targetServico.lista_funcoes; 
    var funcoes = [];
    tempfuncoes.forEach(function(funcao) {
        if(funcao['equipa'] == 'EA'){
            funcoes.push(funcao);
        }
    });
    $("#addMemberToCirugicTeam-modal .container-filtros").remove();
    $("#addMemberToCirugicTeam-modal #addToEquipaCirurgica").empty();
    $("#addMemberToCirugicTeam-modal .modal_title").html("Definir funções dos elementos escolhidos <i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i>");
    $("#addToEquipaCirurgicaEdit-btns").html("<button id='confirmFuncoesEquipaCirurgica' class='confirm-btn'>Confirmar</button>");
    var header= "<div class='col_container borderBottom tableHeader'>"+
                    "<div class='col col_65'>"+
                        "<h5>Funcionário</h5>"+
                    "</div>"+
                    "<div class='col col_35'>"+
                        "<h5>Função</h5>"+
                    "</div>"+
                "</div>";
    $("#addMemberToCirugicTeam-modal #addToEquipaCirurgica").html(header);
    listaToAdd.forEach(function(pos) {
        var elemento = null;
        for (let index = 0; index < equipaApoioPossibilidades.length; index++) {
            const element = equipaApoioPossibilidades[index];
            if(element.n_mec == pos){
                elemento = element;
                break;
            }
        }
        var row = "<div class='col_container'>"+
                    "<div class='col col_65'>"+
                        "<div class='col_container'>"+
                            "<div class='col col_65'>"+
                                "<div style='float: left; width:15%;' class='borderBottom marginBottom10'>"+
                                    elemento['n_mec']+
                                "</div>"+ 
                                "<div class='borderBottom marginBottom10' style='margin-left:20px; float:left; width: calc(85% - 30px);'>"+
                                    elemento['nome'].toUpperCase()+
                                "</div>"+
                            "</div>"+
                            "<div class='col col_35'>"+
                                "<div class='borderBottom marginBottom10'>"+
                                    elemento['categoria'].toUpperCase()+"</span>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                    "<div class='col col_35'>";
                if(funcoes.length > 0){
                    row+=   "<select style='margin-top:5px;' id='funcao"+pos+"'>"+
                                "<option value=''>Nenhuma</option>";
                            funcoes.forEach(function (funcao, it) {
                        row += "<option value='"+it+"'>"+funcao['sigla']+" - "+funcao['funcao']+"</option>";
                                });
                    row+=   "<select>";
                        } else {
                            row+=   "<select style='margin-top:5px;' id='funcao"+pos+"'>"+
                            "<option value=''>Nenhuma</option>";
                        funcoes.forEach(function (funcao, it) {
                    row += "<option value='"+it+"'>"+funcao['sigla']+" - "+funcao['funcao']+"</option>";
                            });
                row+=   "<select>";
                    row += "<span style='color:red; margin: 0; transform: translateY(50%); font-size:10px'> (Este Serviço não tem nenhum função definida)</span>";
                        }
             row += "</div>"+
                    "</div>";
        $("#addMemberToCirugicTeam-modal #addToEquipaCirurgica").append(row);
    });

    document.getElementById('confirmFuncoesEquipaCirurgica').addEventListener('click', function(){
        var anyWithoutFuncion = false;
        var left = null;
        for (let it = 0; it < listaToAdd.length; it++) {
            if($("#funcao"+listaToAdd[it]).val() == '' || $("#funcao"+listaToAdd[it]).val() == undefined){
                anyWithoutFuncion = true;
                left = listaToAdd[it];
                break;
            }
        }
        if(anyWithoutFuncion){
            var intervenienteLeft;
            for (let id = 0; id < equipaApoioPossibilidades.length; id++) {
                const element = equipaApoioPossibilidades[id];
                if(element.id == left){
                    intervenienteLeft = element;
                }
            }
            toastr("Defina a função do Colaborador '"+intervenienteLeft['nome']+"'","error");
            return;
        }
        var body = {
            episodio: id_episodio,
            funcoes: []
        };
        listaToAdd.forEach(function (it){
            var elemento = null;
            for (let index = 0; index < equipaApoioPossibilidades.length; index++) {
                const element = equipaApoioPossibilidades[index];
                if(element.n_mec == it){
                    elemento = element;
                    break;
                }
            }
            var obj = {
                prof: elemento['n_mec'],
                func: funcoes[parseInt($("#funcao"+it).val())]
            };
            body.funcoes.push(obj);
        }); 
        var fd = new FormData();
        fd.append('body', JSON.stringify(body));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/episodios/addIntervenientesEC.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                var response = JSON.parse(data); 
                if(response == 'error'){
                    toastr("Erro ao adicionar elementos à Equipa Cirurgica", "error");
                    return;
                } else {
                    getEpisodioInfoById(id_episodio);
                }
            }
        }); 
    });

}

//atualizar equipa modal edit
function getEpisodioInfoById(id) {
    var fd = new FormData();
    fd.append('id', id);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/getEpisodioInfoById.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            var episodio = JSON.parse(data);
            closeAllModals();
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
            showEditModal(episodio);
            removeLoading();
        }
    });
}

//atualizar equipa mainList
function updateOpenEpisodio(id) {
    var fd = new FormData();
    fd.append('id', id);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/episodios/getEpisodioInfoById.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            var episodio = JSON.parse(data);
            var it = null;
            for (let id = 0; id < episodios.length; id++) {
                const episodioArray = episodios[id];
                if(episodioArray['id'] == episodio['id']){
                    episodios[id] = episodio;
                    it = id;
                }
            }
            $("#equipaTableBody"+it).empty();
            $("#equipaATableBody"+it).empty();
            drawEquipaCirurgicaeApoioMainList(episodio, it);
            removeLoading();
        }
    });
}