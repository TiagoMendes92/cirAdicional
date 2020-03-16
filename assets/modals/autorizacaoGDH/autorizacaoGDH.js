$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/autorizacaoGDH/autorizacaoGDH.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/modals.css">');

var gdhs;
var autorizacaoGDHModal =   "<div class='overlay'>"+
                                "<div id='autorizacao_gdh' class='modal bigModal'>"+
                                    "<h4 class='modal_title font-black'>GDHs autorizados do <span id='servico_nome_modal_gdh'></span> <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                    "<div class='container-filtros'>"+
                                        "<span class='font-light'>Filtros</span><br><br>"+
                                        "<span class='font-bold'>GDH</span><input id='gdh-filter' class='input-adicional' type='text'/>"+
                                        "<span class='font-bold margin-filtros'>Serviço</span>"+
                                            "<select onchange='getGDHs()' id='servico-filter' class='input-adicional'>"+
                                            "</select>"+
                                        "<span><i onclick='getGDHs()' style='margin-left:2vw;' class='fas fa-search search-icon search-icon-left'></i></span>"+
                                        "<span><i onclick='resetSearchGDHs()' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                    "</div>"+
                                    "<div id='gdh-table'>"+
                                        "<div id='gdh-table-header'>"+
                                            "<div style='width:5%;' class='border-bottom'>GDH</div>"+
                                            "<div style='width:5%;' class='border-bottom'>Cód</div>"+
                                            "<div style='width:35%;' class='border-bottom'>Descrição</div>"+
                                            "<div style='width:25%;' class='border-bottom'>Serviço</div>"+
                                            "<div style='width:10%;' class='border-bottom numericValue'>%</div>"+
                                            "<div style='width:10%;' class='border-bottom numericValue'>"+
                                                "<div style='width: 100%; transform: translateX(-15px);'>"+
                                                    "Valor Unitário"+
                                                "</div>"+
                                            "</div>"+
                                            "<div style='width:10%;' class='border-bottom'>Acções</div>"+
                                        "</div>"+
                                        "<div id='gdh-table-body'>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div style='margin-top:1vw'>"+
                                        "<button style='float: unset;' onclick='addGDHtoServiceModal()' class='confirm-btn'>Autorizar GDHs</button>"+
                                        "<button style='float: unset;' onclick='defineFunctionsModal()' class='confirm-btn'>Definir Funções</button>"+
                                        "<button onclick='closeModal()' class='confirm-btn'>Concluir</button>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";

// show modal Autorizacao Intervenientes
function showAutorizacaoGDH(){
    getGDHs(); 
    $("body").append( autorizacaoGDHModal );
    servicos.forEach(function (servico) {
        $("#servico-filter").append("<option value='"+servico.id+"'>"+servico.servico+"</option>");
    });
    $("#servico_nome_modal_gdh").text('"'+servicos[0].servico+'"');
} 

function defineFunctionsModal(){
    var servico = getServicoFromSelectValue();
    var definefuncoesModal = "<div class='overlay submodal'>"+
                                "<div id='add_gdh_servico' class='modal bigModal' style='width: 80vw;'>"+
                                    "<h4 class='modal_title font-black'>Funções do serviço '"+servico.servico+"' <i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                    "<div class='col_container'>"+
                                        "<div class='col col_50'>"+
                                            "<span>Equipa Cirurgica</span>"+
                                            "<div id='define-funcoes-EC-table'>"+
                                                "<div id='define-funcoes-EC-table-header'>"+
                                                    "<div style='width:15%;' class='border-bottom'>Sigla</div>"+
                                                    "<div style='width:35%;' class='border-bottom'>Função</div>"+
                                                    "<div style='width:30%;' class='border-bottom numericValue'>%</div>"+
                                                    "<div style='width:20%;' class='border-bottom numericValue'>Acções</div>"+
                                                "</div>"+
                                                "<div id='define-funcoes-EC-table-body'>"+
                                                "</div>"+
                                                "<button style='margin-top: 1vw;' onclick='addFuncaoModal(0)'>Adicionar Função à Equipa Cirurgica</button>"+
                                            "</div>"+
                                        "</div>"+
                                        "<div class='col col_50'>"+
                                        "<span>Equipa de Apoio</span>"+
                                            "<div id='define-funcoes-EA-table'>"+
                                                "<div id='define-funcoes-EA-table-header'>"+
                                                    "<div style='width:15%;' class='border-bottom'>Sigla</div>"+
                                                    "<div style='width:35%;' class='border-bottom'>Função</div>"+
                                                    "<div style='width:30%;' class='border-bottom numericValue'>%</div>"+
                                                    "<div style='width:20%;' class='border-bottom numericValue'>Acções</div>"+
                                                "</div>"+
                                                "<div id='define-funcoes-EA-table-body'>"+
                                                "</div>"+
                                                "<button style='margin-top: 1vw;' onclick='addFuncaoModal(1)'>Adicionar Função à Equipa de Apoio</button>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>"+
                                    "<div style='margin-top:1vw'>"+
                                        "<button onclick='closeSubModal()' class='confirm-btn'>Fechar</button>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";
    $("body").append( definefuncoesModal );
    drawFuncoes(servico);
}

function closeSubsubModal() {
    $(".subsubmodal").remove();
}

function addFuncaoModal(team) {
    var servico = getServicoFromSelectValue();
    var equipa = (team == 0 ? 'EC' : 'EA');
    var addFuncao_modal = "<div class='overlay subsubmodal'>"+
                                "<div id='addfuncao_modal' class='modal bigModal'>"+
                                    "<h4 class='modal_title font-black'>Adicionar Função ao Serviço '"+servico.servico+"' <i onclick='closeSubsubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                    "<div>"+
                                        "<form>"+
                                            "<label>Sigla</label><br>"+
                                            "<input id='funcao-sigla' type='text'><br>"+
                                            "<label>Função</label><br>"+
                                            "<input id='funcao-funcao' type='text'><br>"+
                                            "<label>Percentagem (%)</label><br>"+
                                            "<input id='funcao-percentage' type='number'><br>"+
                                        "</form>"+
                                    "</div>"+
                                    "<div style='margin-top:1vw'>"+
                                        "<button id='addFuncao-btn' class='confirm-btn'>Adicionar Função</button>"+
                                        "<button onclick='closeSubsubModal()' class='confirm-btn'>Cancelar</button>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";
    $("body").append( addFuncao_modal );
    $("#addFuncao-btn").click(function () {
        var sigla = $("#funcao-sigla").val();
        var funcao = $("#funcao-funcao").val();
        var percentage = $("#funcao-percentage").val();
        if(sigla == undefined || sigla == null || sigla.trim() == ""){
            toastr("Preencha o Campo 'Sigla'", "error");
            return;
        }
        if(funcao == undefined || funcao == null || funcao.trim() == ""){
            toastr("Preencha o Campo 'Função'", "error");
            return;
        }
        if(percentage == undefined || percentage == null || percentage.trim() == ""){
            toastr("Preencha o Campo 'Percentagem'", "error");
            return;
        }
        var fd = new FormData();
        
        var funcaoOBJ = {
            'sigla': sigla,
            'funcao': funcao,
            'percentage': percentage,
            'equipa': equipa
        };
        var fd = new FormData();
        fd.append('id', servico.id);
        fd.append('funcao', JSON.stringify(funcaoOBJ));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/servicos/addFuncao.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                if(data == '"already exists"'){
                    toastr("Já existe uma função com esse nome ou sigla, neste serviço", "error");
                } else if(data == '"error"'){
                    toastr("Erro ao adicionar função ao serviço", "error");
                } else {
                    closeSubsubModal();
                    getServicesFunctions();
                }
            }
        });
    });       
}

// get Servicos para a modal
function getServicesFunctions() {
    addLoading();
    $.ajax({
        type: "GET",
        url: "./api/servicos/getServicos.php",
        processData: false,
        contentType: false,
        success:function(data){
            servicos = JSON.parse(data);
            removeLoading();
            var servico = getServicoFromSelectValue();
            drawFuncoes(servico);
        }
    });
}

function drawFuncoes(servico) {
    $("#define-funcoes-EC-table-body").empty();
    $("#define-funcoes-EA-table-body").empty();
    var funcoes = servico.lista_funcoes; 
    if(funcoes.length >0 ){
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
            funcoesEC.forEach( function (funcao, it) {
                var elementoDiv =   "<div class='elemento-row'>"+
                                        "<div class='col_float border-bottom' style='width:15%; margin-right:1%;'>"+funcao['sigla']+"</div>"+
                                        "<div class='col_float border-bottom' style='width:35%; margin-right:1%;'>"+funcao['funcao']+"</div>"+
                                        "<div class='col_float border-bottom numericValue' style='width:30%;'><div style='width:100%; transform:translateX(-15px);'>"+funcao['perc']+"</div></div>"+
                                        "<div class='col_float' style='width:20%;'>"+
                                            "<i style='color:red; cursor:pointer; float:right; transform: translateX(-20px);' onclick='removeFuncao("+it+", 0)' class='fas fa-minus-circle' aria-hidden='true'></i>"+
                                            "<i style='color:blue; margin-right: 15px; cursor:pointer; float:right; transform: translateX(-20px);' onclick='editFuncaoModal("+it+", 0)' class='fas fa-pencil-alt' aria-hidden='true'></i>"+
                                        "</div>"+
                                    "</div>"; 
                $("#define-funcoes-EC-table-body").append(elementoDiv);   
            });
        } else {
            var elementoDiv =   "<div class='empty-row'>"+
                                    "Nenhuma Função"+
                                "</div>";
            $("#define-funcoes-EC-table-body").append(elementoDiv);     
        }
        if(funcoesEA.length > 0){
            funcoesEA.forEach( function (funcao, it) {
                var elementoDiv =   "<div class='elemento-row'>"+
                                        "<div class='col_float border-bottom' style='width:15%; margin-right:1%;'>"+funcao['sigla']+"</div>"+
                                        "<div class='col_float border-bottom' style='width:35%; margin-right:1%;'>"+funcao['funcao']+"</div>"+
                                        "<div class='col_float border-bottom numericValue' style='width:30%;'><div style='width:100%; transform:translateX(-15px);'>"+funcao['perc']+"</div></div>"+
                                        "<div class='col_float' style='width:20%;'>"+
                                            "<i style='color:red; cursor:pointer; float:right; transform: translateX(-20px);' onclick='removeFuncao("+it+", 1)' class='fas fa-minus-circle' aria-hidden='true'></i>"+
                                            "<i style='color:blue; margin-right: 15px; cursor:pointer; float:right; transform: translateX(-20px);' onclick='editFuncaoModal("+it+", 1)' class='fas fa-pencil-alt' aria-hidden='true'></i>"+
                                        "</div>"+
                                    "</div>"; 
                $("#define-funcoes-EA-table-body").append(elementoDiv);   
            });
        } else {
            var elementoDiv =   "<div class='empty-row'>"+
                                    "Nenhuma Função"+
                                "</div>";
            $("#define-funcoes-EA-table-body").append(elementoDiv);     
        }
    } else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhuma Função"+
                            "</div>";
        $("#define-funcoes-EC-table-body").append(elementoDiv);  
        $("#define-funcoes-EA-table-body").append(elementoDiv);  
    }
}

function editFuncaoModal(it, team){
    var servico = getServicoFromSelectValue();
    var equipa = (team == 0 ? 'EC' : 'EA');   
    var funcoes = servico.lista_funcoes;
    var funcoesFiltered = [];
    funcoes.forEach(function(funcao) {
        if(funcao.equipa == equipa){
            funcoesFiltered.push(funcao);
        } 
    });
    var targetFuncao = funcoesFiltered[it];
    var editFuncao_modal = "<div class='overlay subsubmodal'>"+
                                "<div id='addfuncao_modal' class='modal bigModal'>"+
                                    "<h4 class='modal_title font-black'>Editar Função '"+targetFuncao['funcao']+"' do Serviço '"+servico.servico+"' <i onclick='closeSubsubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                    "<div>"+
                                        "<form>"+
                                            "<label>Sigla</label><br>"+
                                            "<input id='funcao-sigla' type='text' value='"+targetFuncao['sigla']+"'><br>"+
                                            "<label>Função</label><br>"+
                                            "<input id='funcao-funcao' type='text' value='"+targetFuncao['funcao']+"'><br>"+
                                            "<label>Percentagem (%)</label><br>"+
                                            "<input id='funcao-percentage' type='number' value='"+targetFuncao['perc']+"'><br>"+
                                        "</form>"+
                                    "</div>"+
                                    "<div style='margin-top:1vw'>"+
                                        "<button id='editFuncao-btn' class='confirm-btn'>Editar Função</button>"+
                                        "<button onclick='closeSubsubModal()' class='confirm-btn'>Cancelar</button>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";
    $("body").append( editFuncao_modal);
    $("#editFuncao-btn").click(function(){
        var sigla = $("#funcao-sigla").val();
        var funcao = $("#funcao-funcao").val();
        var percentage = $("#funcao-percentage").val();
        if(sigla == undefined || sigla == null || sigla.trim() == ""){
            toastr("Preencha o Campo 'Sigla'", "error");
            return;
        }
        if(funcao == undefined || funcao == null || funcao.trim() == ""){
            toastr("Preencha o Campo 'Função'", "error");
            return;
        }
        if(percentage == undefined || percentage == null || percentage.trim() == ""){
            toastr("Preencha o Campo 'Percentagem'", "error");
            return;
        }
        targetFuncao['sigla'] = sigla;
        targetFuncao['funcao'] = funcao;
        targetFuncao['perc'] = percentage;
        var fd = new FormData();
        fd.append('id', servico.id);
        fd.append('funcao', JSON.stringify(targetFuncao));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/servicos/editFuncao.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                if(data == '"already exists"'){
                    toastr("Já existe uma função com esse nome ou sigla, neste serviço", "error");
                } else if(data == '"error"'){
                    toastr("Erro ao editar função ao serviço", "error");
                } else {
                    closeSubsubModal();
                    getServicesFunctions();
                }
            }
        });
    });
}

function removeFuncao(it, team){
    var servico = getServicoFromSelectValue();
    var equipa = (team == 0 ? 'EC' : 'EA');   
    var funcoes = servico.lista_funcoes;
    var funcoesFiltered = [];
    funcoes.forEach(function(funcao) {
        if(funcao.equipa == equipa){
            funcoesFiltered.push(funcao);
        } 
    });
    var targetFuncao = funcoesFiltered[it];

    var confirmModal = "<div class='overlay subsubmodal'>"+
                            "<div id='add_gdh_servico' class='modal bigModal'>"+
                                "<h4 class='modal_title font-black'>Remover Função do Serviço '"+servico['servico']+"' <span id='servico_nome_modal_gdh'></span> <i onclick='closeSubsubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                "<div>"+
                                    "Tem a certeza que quer remover a Função "+ targetFuncao['funcao'] + " do serviço " + servico['servico'] + " ?" +
                                "</div>"+
                                "<div style='margin-top:1vw'>"+
                                    "<button onclick='closeSubsubModal();' class='confirm-btn'>Cancelar</button>"+
                                    "<button id='confirm-remove-auth' class='confirm-btn'>Confirmar</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
    $("body").append( confirmModal );     

    $("#confirm-remove-auth").click(function(){
        var fd = new FormData();
        fd.append('id', servico.id);
        fd.append('funcao', JSON.stringify(targetFuncao));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/servicos/deteleFuncao.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                closeSubsubModal();
                if(data == '"error"'){
                    toastr("Erro ao apagar função", "error");
                } else {
                    getServicesFunctions();
                }
            }
        });
    });
    
    
}

// show GDHs
function getGDHs(){
    addLoading();
    let finalServico = getServicoFromSelectValue();
    $("#servico_nome_modal_gdh").text('"'+finalServico.servico+'"');
    var fd = new FormData();
    if($("#gdh-filter").val() != undefined && $("#gdh-filter").val() != null){
        if($("#gdh-filter").val().trim() != ''){
            fd.append('gdh', $("#gdh-filter").val());
        }
    }
    $.ajax({
        type: "POST",
        url: "./api/gdh/getAllGDHs.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            gdhs = JSON.parse(data);
            drawGDHS(gdhs);
        }
    });
}

// reset search gdhs
function resetSearchGDHs(){
    $("#gdh-filter").val('');
    $("#servico-filter").val(servicos[0].id);
    getGDHs();
}

// draw gdhs
function drawGDHS(gdhs) {
    $("#gdh-table-body").empty();
    let finalServico = getServicoFromSelectValue();
    var gdhs_servico = finalServico.listaGHDs != null ? finalServico.listaGHDs : "";
    if(gdhs_servico !== ""){
        var ghs_array = gdhs_servico.split(",");
        if($("#gdh-filter").val() != undefined && $("#gdh-filter").val() != null && $("#gdh-filter").val().trim() != ""){
            if(ghs_array.length > 0){
                for (let it = ghs_array.length-1; it >= 0; it--) {
                    var gdh = getGDHFromId(ghs_array[it]);
                    if(gdh['gdh'].indexOf($("#gdh-filter").val()) == -1){
                        ghs_array.splice(it, 1);
                    }
                }
            }
        }
        if(ghs_array.length > 0){
            ghs_array.forEach(function (gdhelement) {
                var gdh = getGDHFromId(gdhelement);
                var elementoDiv =   "<div class='elemento-row'>"+
                                        "<div class='col_float border-bottom' style='width:5%; margin-right:1%;'>"+
                                            gdh['gdh']+
                                        "</div>"+
                                        "<div class='col_float border-bottom' style='width:5%; margin-right:1%;'>"+
                                            gdh['cod_gdh']+
                                        "</div>"+
                                        "<div class='col_float border-bottom' style='width:35%; margin-right:1%;'>"+
                                            gdh['desc']+
                                        "</div>"+
                                        "<div class='col_float border-bottom' style='width:25%; margin-right:1%;'>"+
                                            finalServico['servico']+
                                        "</div>"+
                                        "<div class='col_float border-bottom numericValue' style='width:10%;'>"+
                                            gdh['perc']+ " %"+
                                        "</div>"+
                                        "<div class='col_float border-bottom numericValue' style='width:10%; margin-right:2%;'>"+
                                            "<div style='transform: translateX(-20px); width:100%'>"+
                                                gdh['v_uni']+ " €"+
                                            "</div>"+ 
                                        "</div>"+
                                        "<div style='width:10%; position:relative;'>"+
                                            "<i style='color:red; cursor:pointer' onclick='desauthGDHfromService("+gdhelement+")' class='fas fa-minus-circle'></i>"+
                                            "<i onclick='openEditGDHModal("+gdh.id+")' style='position:absolute; left:0px; top:0px; color: #2196f3; font-size: 0.7vw; margin-left: 30px; background: white; border-radius: 50%; border: 2px solid #2196f3; padding: .15vw; ' class='edit fas fa-pencil-alt tooltip_container'><div class='tooltip right_tooltip'>Editar episódio.</div></i>"+
                                        "</div>"+
                                    "</div>";
                 $("#gdh-table-body").append(elementoDiv); 
            });
        } else {
            var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum GDH"+
                            "</div>";
            $("#gdh-table-body").append(elementoDiv);  
        }
    }else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum GDH"+
                            "</div>";
        $("#gdh-table-body").append(elementoDiv);  
    }
}

//desautorizar gdh
function desauthGDHfromService(gdhelement) {
    var gdh = getGDHFromId(gdhelement);
    let finalServico = getServicoFromSelectValue();
    var confirmModal = "<div class='overlay submodal'>"+
                            "<div id='add_gdh_servico' class='modal bigModal'>"+
                                "<h4 class='modal_title font-black'>Remover Autorização de GDH <span id='servico_nome_modal_gdh'></span> <i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                "<div>"+
                                    "Tem a certeza que quer remover a autorização do GDH "+ gdh['gdh'] + " ao serviço " + finalServico['servico'] + " ?" +
                                "</div>"+
                                "<div style='margin-top:1vw'>"+
                                    "<button onclick='closeSubModal();' class='confirm-btn'>Cancelar</button>"+
                                    "<button id='confirm-remove-auth' class='confirm-btn'>Confirmar</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
    $("body").append( confirmModal );     
    $("#confirm-remove-auth").click(function(){
        var arrayFromString = finalServico['listaGHDs'].split(",");
        for (let it = arrayFromString.length-1; it >= 0; it--) {
            const element = arrayFromString[it];
            if(element == gdh['id']){
                arrayFromString.splice(it,1);
                break;
            }
        }
        var fd = new FormData();
        fd.append('id', finalServico.id);
        fd.append('lista', JSON.stringify(arrayFromString));
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        addLoading();
        $.ajax({
            type: "POST",
            url: "./api/servicos/updateAuthorizedGDHS.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                answer = JSON.parse(data);
                if(answer == 'success'){
                    closeSubModal(); 
                    getServicesAuthorization();
                } else {
                    toastr("Erro ao autorizar GDH(s) para o Serviço "+servico.servico, "error");
                }
            }
        });
    });   
}

//get gdh from id
function getGDHFromId(id) {
    var gdh;
    for (let it = 0; it < gdhs.length; it++) {
        const gdhCandidate = gdhs[it];
        if(id == gdhCandidate['id']){
            gdh =  gdhCandidate;
            break;
        }else{
        }
    }
    return gdh;
}

//le select e devolve servico
function getServicoFromSelectValue() {
    var finalServico = "";
    for (let it = 0; it < servicos.length; it++) {
        const servico = servicos[it];
        if(servico.id == $("#servico-filter").val()){
            finalServico = servico;
            break;
        }
    }
    return finalServico;
}

// open edit modal GDH
function openEditGDHModal(id) {
    var gdh;
    for (let it = 0; it < gdhs.length; it++) {
        const gdhC = gdhs[it];
        if(gdhC['id'] == id){
            gdh = gdhC;
            break;
        }
    }
    var addToEquipaApoioModal = "<div class='overlay submodal minimodal' id='gdhMiniModal'>"+
                                    "<div class='modal'>"+
                                        "<h4 class='modal_title font-black'>Editar GDH '"+gdh.gdh+"'<i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                        "<form >"+
                                            "<label>Serviço</label><br>"+
                                            "<label>perc</label><br>"+
                                            "<input id='gdh-perc' type='number' value='"+gdh.perc+"'/><br>"+
                                            "<label>Valor Unitário</label><br>"+
                                            "<input id='gdh-v_uni' type='number' value='"+gdh.v_uni+"'/><br>"+
                                        "</form>"+
                                        "<div style='margin-top:2vw;' onclick='editGDH("+id+")'>"+
                                            "<button class='confirm-btn'>Confirmar</button>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>";
    $("body").append(addToEquipaApoioModal);
}

// edit GDH
function editGDH(id){
    if($("#gdh-perc").val().trim() == ''){
        toastr("Preencha o campo perc", "error");
        return;
    }
    if($("#gdh-v_uni").val().trim() == ''){
        toastr("Preencha o campo v_uni", "error");
        return;
    }

    var gdh;
    for (let it = 0; it < gdhs.length; it++) {
        const gdhC = gdhs[it];
        if(gdhC['id'] == id){
            gdh = gdhC;
            break;
        }
    }

    var fd = new FormData();
    fd.append('id', id);
    fd.append('perc', $("#gdh-perc").val());
    fd.append('v_uni', $("#gdh-v_uni").val());
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/gdh/updateGDH.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            answer = JSON.parse(data);
            if(answer == 'success'){
                closeModal();
                closeSubModal();
                showAutorizacaoGDH();
            } else {
                toastr("Erro ao editar GDH '"+gdh.gdh+"'", "error");
            }
        }
    });   
}

// modal de autorizar gdhs
function addGDHtoServiceModal(){
    var servico = getServicoFromSelectValue();
    var addGDHtoService_Modal = "<div class='overlay submodal'>"+
                                    "<div id='add_gdh_servico' style='width: 80vw;' class='modal bigModal'>"+
                                        "<h4 class='modal_title font-black'>GDHs não autorizados para o serviço '"+servico.servico+"' <span id='servico_nome_modal_gdh'></span> <i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                        "<div class='container-filtros'>"+
                                            "<span class='font-light'>Filtros</span><br><br>"+
                                            "<span class='font-bold'>GDH</span><input id='gdh-filter-autorizacoes' class='input-adicional' type='text'/>"+
                                            "<span><i id='drawGDHStoAuth_modal' class='fas fa-search search-icon search-icon-left'></i></span>"+
                                            "<span><i onclick='resetSearchGDHsAutorizacoes()' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                        "</div>"+
                                        "<div id='gdh-table'>"+
                                            "<div id='gdh-table-header-autorizacoes'>"+
                                                "<div style='width:10%;' class='border-bottom'>GDH</div>"+
                                                "<div style='width:10%;' class='border-bottom'>Cód</div>"+
                                                "<div style='width:50%;' class='border-bottom'>Descrição</div>"+
                                                "<div style='width:10%;' class='border-bottom numericValue'>%</div>"+
                                                "<div style='width:10%;' class='border-bottom numericValue'>"+
                                                    "<div style='width: 100%; transform: translateX(-15px);'>"+
                                                        "Valor Unitário"+
                                                    "</div>"+
                                                "</div>"+
                                                "<div style='width:10%;' class='border-bottom'>"+
                                                    "<label class='container costumHeight modalCheck' style='transform: translate(27px, 1px);'>"+
                                                        "<input type='checkbox' id='selectAllGdhs_auth' onclick='selectAll_gdhAuth()'>"+
                                                        "<span class='checkmark costumCheck' style='right:-4px; transform: translateY(-50%);'></span>"+
                                                    "</label>"+
                                                    "<span>&emsp;</span>"+
                                                "</div>"+
                                            "</div>"+
                                            "<div id='gdh-table-body-autorizacoes'>"+
                                            "</div>"+
                                        "</div>"+
                                        "<div style='margin-top:1vw'>"+
                                            "<button onclick='autorizarGDH()' class='confirm-btn'>Autorizar</button>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>";
    $("body").append( addGDHtoService_Modal );
    $("#drawGDHStoAuth_modal").click(function () {
        drawGDHStoAuthorize(servico);
    });
    drawGDHStoAuthorize(servico);
}

// reset pesquisa gdhs autorizaveis
function resetSearchGDHsAutorizacoes (){
    $("#gdh-filter-autorizacoes").val('');
    var servico = getServicoFromSelectValue();
    drawGDHStoAuthorize(servico);
}

// desenhar opcoes de gdhs autorizaveis
function drawGDHStoAuthorize(servico) {
    $("#gdh-table-body-autorizacoes").empty();
    var gdhsFinalList = getFinalListFromServico(servico);
    if($("#gdh-filter-autorizacoes").val() != undefined && $("#gdh-filter-autorizacoes").val() != null){
        if($("#gdh-filter-autorizacoes").val().trim() != ''){
            if(gdhsFinalList.length > 0){
                for (let it = gdhsFinalList.length-1; it >= 0; it--) {
                    if(gdhsFinalList[it]['gdh'].indexOf($("#gdh-filter-autorizacoes").val()) == -1){
                        gdhsFinalList.splice(it, 1);
                    }
                }
            }
        }
    }
    if(gdhsFinalList.length > 0){
        gdhsFinalList.forEach(function (gdh, it) {
            var elementoDiv =   "<div class='elemento-row'>"+
                                    "<div class='col_float border-bottom' style='width:10%; margin-right:1%;'>"+
                                        gdh['gdh']+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width:10%; margin-right:1%;'>"+
                                        gdh['cod_gdh']+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width:50%; margin-right:1%;'>"+
                                        gdh['desc']+
                                    "</div>"+
                                    "<div class='col_float border-bottom numericValue' style='width:10%;'>"+
                                        gdh['perc']+ " %"+
                                    "</div>"+
                                    "<div class='col_float border-bottom numericValue' style='width:10%; padding-right: 27px;'>"+
                                        gdh['v_uni']+ " €"+
                                    "</div>"+
                                    "<div style='width:10%'>"+
                                        "<label class='container costumHeight modalCheck' style='transform: translate(15px, 10px);'>"+
                                            "<input type='checkbox' id='possibilidadeGDH"+it+"' class='possibilidadeGDH' onclick='checkIfSelectAll_gdhAuth("+it+")'>"+
                                            "<span class='checkmark costumCheck' style='right:-4px; transform: translateY(-50%);'></span>"+
                                        "</label>"+
                                    "</div>"+
                                "</div>";
            $("#gdh-table-body-autorizacoes").append(elementoDiv); 
        });
    } else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum GDH"+
                            "</div>";
        $("#gdh-table-body-autorizacoes").append(elementoDiv);  
    }
}

// autorizar ghs
function autorizarGDH() {
    var listaToAdd = [];
    var servico = getServicoFromSelectValue();
    var possibilidades_GDHs = getFinalListFromServico(servico);
    possibilidades_GDHs.forEach(function(elemento, it) {
        if($("#possibilidadeGDH"+it).is(':checked')){
            listaToAdd.push(elemento.id);
        }
    });
    if(listaToAdd.length == 0){
        toastr("Seleceione pelo menos um GDH para autorizar", "error");
        return;
    }
    var arrayFromString = (servico.listaGHDs != null && servico.listaGHDs != "" ? servico.listaGHDs.split(",") : [] );
    listaToAdd.forEach(function(elemento) {
        arrayFromString.push(elemento);
    });    
    var fd = new FormData();
    fd.append('id', servico.id);
    fd.append('lista', JSON.stringify(arrayFromString));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/servicos/updateAuthorizedGDHS.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            answer = JSON.parse(data);
            if(answer == 'success'){
                closeSubModal(); 
                getServicesAuthorization();
            } else {
                toastr("Erro ao autorizar GDH(s) para o Serviço "+servico.servico, "error");
            }
        }
    });
}

// get Servicos para a modal
function getServicesAuthorization() {
    addLoading();
    $.ajax({
        type: "GET",
        url: "./api/servicos/getServicos.php",
        processData: false,
        contentType: false,
        success:function(data){
            servicos = JSON.parse(data);
            removeLoading();
            getGDHs();
        }
    });
}

// get lista de gdh por servico
function getFinalListFromServico(servico) {
    var gdhsFinalList = [];
    var gdhs_servico = servico.listaGHDs != null ? servico.listaGHDs : "";
    gdhs.forEach(function (gdh) {
        if(gdhs_servico.indexOf(gdh.id) == -1){
            gdhsFinalList.push(gdh);
        }
    });
    return gdhsFinalList;
}

// select all gdhs autorizaveis
function selectAll_gdhAuth(){
    if($("#selectAllGdhs_auth").is(":checked")){
        $(".possibilidadeGDH").prop('checked', true);
    } else {
        $(".possibilidadeGDH").prop('checked', false);
    }
}

function checkIfSelectAll_gdhAuth(it) {
    if($("#selectAllGdhs_auth").is(':checked')){
        if(!$("#possibilidadeGDH"+it).is(':checked')){
            $("#selectAllGdhs_auth").prop('checked', false);
        }
    }
}
