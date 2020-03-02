$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/autorizacaoIntervenientesModal/autorizacaoIntervenientesModal.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/modals.css">');

var equipaPrincipal, equipadeApoio, equipaPrincipalPossibilidades, equipaApoioPossibilidades;
var autorizacaoIntervenientesModal ="<div class='overlay'>"+
                                        "<div id='autorizacao_intervenientes' class='modal bigModal'>"+
                                            "<h4 class='modal_title font-black'>Equipa Cirúrgica <i onclick='closeModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                            "<div class='container-filtros'>"+
                                                "<span class='font-light'>Filtros</span><br><br>"+
                                                "<span class='font-bold'>Nome</span><input id='nome-filter-principal' class='input-adicional-nome' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Nº Mecanográfico</span><input id='n_mec-filter-principal' class='input-adicional' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Função</span><input id='categoria-filter-principal' class='input-adicional' type='text'/>"+
                                                "<span><i onclick='getIntervenientesEquipaPrincipal()' class='fas fa-search search-icon search-icon-left'></i></span>"+
                                                "<span><i onclick='resetSearchEquipaPrincipal()' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                            "</div>"+
                                            "<div id='intervenientes' class='col_container'>"+
                                                "<div class='col col_80'>"+
                                                    "<div id='intervenientes-header' class='col_container'>"+
                                                        "<div class='col' style='width: 55%;'>"+
                                                            "Intervenientes Eligíveis para Cirurgia Adicional"+
                                                        "</div>"+
                                                        "<div class='col' style='width:30%'>"+
                                                            "Função"+
                                                        "</div>"+
                                                        "<div class='col' style='width:15%'>"+
                                                            "<span style='margin-left: 34px'>Acções</span>"+
                                                        "</div>"+
                                                    "</div>"+
                                                    "<div id='intervenientes-body' style='width:calc(93% + 18px) !important;'>"+
                                                    "</div>"+  
                                                "</div>"+
                                                "<div class='col col_20'>"+
                                                    "<button onclick='addToEquipaPrincipal();' class='btn-outline col_container'>"+
                                                        "<div class='col col_96 alignMiddle'>"+
                                                            "Adicionar Membro <br>Equipa Cirurgica"+
                                                        "</div>"+
                                                        "<div class='col col_4  alignMiddle'>"+
                                                            "<i class='fas fa-plus'></i>"+
                                                        "</div>"+
                                                    "</button>"+
                                                "</div>"+
                                            "</div>"+
                                            "<h4 class='modal_title font-black' style='margin-top: 3vw;'>Equipa de Apoio</h4>"+
                                            "<div class='container-filtros'>"+
                                                "<span class='font-light'>Filtros</span><br><br>"+
                                                "<span class='font-bold'>Nome</span><input id='nome-filter-apoio' class='input-adicional-nome' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Nº Mecanográfico</span><input id='n_mec-filter-apoio' class='input-adicional' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Função</span><input id='categoria-filter-apoio' class='input-adicional' type='text'/>"+
                                                "<span><i onclick='getIntervenientesEquipaApoio()' class='fas fa-search search-icon search-icon-left'></i></span>"+
                                                "<span><i onclick='resetSearchEquipaApoio()' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                            "</div>"+
                                            "<div id='apoio' class='col_container'>"+
                                                "<div class='col col_80'>"+
                                                    "<div id='apoio-header' class='col_container'>"+
                                                        "<div class='col' style='width: 55%;'>"+
                                                            "Intervenientes Eligíveis para Cirurgia Adicional"+
                                                        "</div>"+
                                                        "<div class='col' style='width:30%'>"+
                                                            "Função"+
                                                        "</div>"+
                                                        "<div class='col' style='width:15%'>"+
                                                            "<span style='margin-left: 34px'>Acções</span>"+
                                                        "</div>"+
                                                    "</div>"+
                                                    "<div id='apoio-body' style='width:calc(93% + 18px) !important;'>"+
                                                    "</div>"+  
                                                "</div>"+
                                                "<div class='col col_20'>"+
                                                    "<button onclick='addToEquipaApoio();' class='btn-outline col_container'>"+
                                                        "<div class='col col_96 alignMiddle'>"+
                                                            "Adicionar Membro <br>Equipa de Apoio"+
                                                        "</div>"+
                                                        "<div class='col col_4  alignMiddle'>"+
                                                            "<i class='fas fa-plus'></i>"+
                                                        "</div>"+
                                                    "</button>"+
                                                "</div>"+
                                            "</div>"+
                                            "<div>"+
                                                "<button onclick='closeModal();' class='confirm-btn'>Concluir</button>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>";

// show modal Autorizacao Intervenientes
function showAutorizacaoIntervenientes(){
    getIntervenientesEquipaPrincipal();
    getIntervenientesEquipaApoio();
    $("body").append(autorizacaoIntervenientesModal);
} 

//get intervenientes equipa cirurgica
function getIntervenientesEquipaPrincipal(){
    var fd = new FormData();
    fd.append('nome', ($("#nome-filter-principal").val() != undefined ? $("#nome-filter-principal").val().trim() : ''));
    fd.append('n_mec', ($("#n_mec-filter-principal").val() != undefined ? $("#n_mec-filter-principal").val().trim() : ''));
    fd.append('categoria', ($("#categoria-filter-principal").val() != undefined ? $("#categoria-filter-principal").val().trim() : ''));
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/intervenientes/getIntervenientesEquipaPrincipal.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            equipaPrincipal = JSON.parse(data);
            drawEquipaPrincipal(equipaPrincipal);
        }
    });
}

// reset search equipa principal
function resetSearchEquipaPrincipal(){
    $("#nome-filter-principal").val("");
    $("#n_mec-filter-principal").val("");
    $("#categoria-filter-principal").val("");
    getIntervenientesEquipaPrincipal();
}   

// draw equipa cirurgica
function drawEquipaPrincipal(equipaPrincipal){
    $("#intervenientes-body").empty();
    if(equipaPrincipal.length !== 0){
        equipaPrincipal.forEach(function(elemento, it) {
            var elementoDiv =   "<div class='elemento-row'>"+
                                    "<div class='col_float border-bottom' style='width:7%; margin-right:1%;'>"+
                                        elemento['n_mec']+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width: 45%; margin-right:2%;'>"+
                                        elemento['nome'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width:30%;'>"+
                                        elemento['categoria'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom-white' style='width:15%'>"+
                                        "<span style='margin-left: 34px'><i onclick='removeElementoEquipaPrincipal("+it+", 1)' class='removeElemento fas fa-minus-circle'></i></span>"+
                                    "</div>"+
                                "</div>";
            $("#intervenientes-body").append(elementoDiv);
        });
    } else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum Elemento Eligível"+
                            "</div>";
        $("#intervenientes-body").append(elementoDiv);   
    }
}

// get intervenientes equipa de apoio
function getIntervenientesEquipaApoio(){
    var fd = new FormData();
    fd.append('nome', ($("#nome-filter-apoio").val() != undefined ? $("#nome-filter-apoio").val().trim() : ''));
    fd.append('n_mec', ($("#n_mec-filter-apoio").val() != undefined ? $("#n_mec-filter-apoio").val().trim() : ''));
    fd.append('categoria', ($("#categoria-filter-apoio").val() != undefined ? $("#categoria-filter-apoio").val().trim() : ''));
    addLoading();
    $.ajax({
        type: "POST",
        url: "./api/intervenientes/getIntervenientesEquipaApoio.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            equipadeApoio = JSON.parse(data);
            drawEquipadeApoio(equipadeApoio);
        }
    });  
}

// reset search equipa apoio
function resetSearchEquipaApoio(){
    $("#nome-filter-apoio").val("");
    $("#n_mec-filter-apoio").val("");
    $("#categoria-filter-apoio").val("");
    getIntervenientesEquipaApoio();
}

// draw equipa de apoio
function drawEquipadeApoio(equipadeApoio){
    $("#apoio-body").empty();
    if(equipadeApoio.length !== 0){
        equipadeApoio.forEach(function(elemento, it) {
            var elementoDiv =   "<div class='elemento-row'>"+
                                    "<div class='col_float border-bottom' style='width:7%; margin-right:1%;'>"+
                                        elemento['n_mec']+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width: 45%; margin-right:2%;'>"+
                                        elemento['nome'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width:5%'>"+
                                        elemento['categoria'].substring(0,3).toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width:25%;'>"+
                                        elemento['categoria'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom-white' style='width:15%'>"+
                                        "<span style='margin-left: 34px'><i onclick='removeElementoEquipaPrincipal("+it+", 2 )' class='removeElemento fas fa-minus-circle'></i></span>"+
                                    "</div>"+
                                "</div>";
            $("#apoio-body").append(elementoDiv);
        });
    } else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum Elemento Eligível"+
                            "</div>";
        $("#apoio-body").append(elementoDiv);
    }
}

// add to Equipa principal
function addToEquipaPrincipal(){
    var addToEquipaPrincipalModal = "<div class='overlay submodal'>"+
                                        "<div class='modal'>"+
                                            "<h4 class='modal_title font-black'>Adicionar Elemento aos Elegíveis à Cirurgia Adicional (Equipa Principal)<i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                            "<div class='container-filtros'>"+
                                                "<span class='font-light'>Filtros</span><br><br>"+
                                                "<span class='font-bold'>Nome</span><input id='nome-filter-principalAdd' class='input-adicional-nome' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Nº Mecanográfico</span><input style='width:5vw;' id='n_mec-filter-principalAdd' class='input-adicional' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Categoria</span><input style='width:5vw;' id='categoria-filter-principalAdd' class='input-adicional' type='text'/>"+
                                                "<span><i onclick='getFuncionariosPossiveisEquipaCirurgia(0)' class='fas fa-search search-icon'></i></span>"+
                                                "<span><i onclick='resetSearchEquipaPrincipalModal(0)' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                            "</div>"+
                                            "<div id='addToEquipaCirurgica'>"+
                                                "<div id='addToEquipaCirurgica-header' class='col_container'>"+
                                                    "<div class='col' style='width: 60%;'>"+
                                                        "Intervenientes Eligíveis para Cirurgia Adicional"+
                                                    "</div>"+
                                                    "<div class='col' style='width:25%'>"+
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
                                            "<div style='margin-top:2vw;' onclick='addToElegiveisEquipaPrincipal()'>"+
                                                "<button class='confirm-btn'>Confirmar</button>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>";
    $("body").append(addToEquipaPrincipalModal);
    getFuncionariosPossiveisEquipaCirurgia(0);
}

// remove from Equipa principal
function removeElementoEquipaPrincipal(it, from){
    var n_mec;
    var person;
    if(from == 1){
        n_mec = equipaPrincipal[it].n_mec;
        person = equipaPrincipal[it];
    } else {
        n_mec = equipadeApoio[it].n_mec;
        person = equipadeApoio[it];
    }

    var modalConfirm =   "<div class='overlay subsubmodal'>"+
                            "<div id='add_gdh_servico' class='modal bigModal'>"+
                                "<h4 class='modal_title font-black'>Remover Autorização para fazer Cirurgia Adicional <span id='servico_nome_modal_gdh'></span> <i onclick='closeSubsubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                "<div>"+
                                    "Tem a certeza que quer remover a Elegibilidade do colaborador "+ person['nome'] + " para efectuar Cirurgia Adicional ?" +
                                "</div>"+
                                "<div style='margin-top:1vw'>"+
                                    "<button onclick='closeSubsubModal();' class='confirm-btn'>Cancelar</button>"+
                                    "<button id='confirm-remove-auth' class='confirm-btn'>Confirmar</button>"+
                                "</div>"+
                            "</div>"+
                        "</div>";
    $("body").append(modalConfirm);
    $("#confirm-remove-auth").click(function(){
        closeSubsubModal();
        var fd = new FormData();
        fd.append('n_mec', n_mec);
        var user = JSON.parse(sessionStorage.getItem('user'));
        fd.append('user', user['user']);
        $.ajax({
            type: "POST",
            url: "./api/intervenientes/deleteFromEquipa.php",
            data: fd,
            processData: false,
            contentType: false,
            success:function(data){
                removeLoading();
                answer = JSON.parse(data);
                if(answer == 'success'){
                    if(from == 1){
                        getIntervenientesEquipaPrincipal();
                    } else {
                        getIntervenientesEquipaApoio();
                    }
                }else{
                    toastr("Erro ao remover '"+equipaPrincipal[it].nome+" dos elegíveis para integrar uma Equipa Cirúrgica", "error");
                }
            }
        });
    });   
}

//get funcionarios possiveis de adicionar à equipa cirurgica
function getFuncionariosPossiveisEquipaCirurgia(from){
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
            removeLoading();
            equipaPrincipalPossibilidades = JSON.parse(data);
            drawEquipaPrincipalPossibilidades(equipaPrincipalPossibilidades, from);
        }
    });   
}

// reset search equipa principal submodal
function resetSearchEquipaPrincipalModal(from){
    $("#nome-filter-principalAdd").val("");
    $("#n_mec-filter-principalAdd").val("");
    $("#categoria-filter-principalAdd").val("");
    getFuncionariosPossiveisEquipaCirurgia(from);
}

// draw possibilidades de adicionar a equipa cirurgica
function drawEquipaPrincipalPossibilidades(equipaPrincipalPossibilidades, from){
$("#addToEquipaCirurgica-body").empty();
    if(from == 1){
        for (let it1 = equipaPrincipalPossibilidades.length-1; it1 >= 0; it1--) {
            const elemento = equipaPrincipalPossibilidades[it1];
            for (let it2 = episodioToEdit.intervenientes.length-1; it2 >= 0; it2--) {
                const interveniente = episodioToEdit.intervenientes[it2];
                if(elemento.n_mec == interveniente.id_prof){
                    equipaPrincipalPossibilidades.splice(it1,1);
                }
            }   
        }
    }
    if(equipaPrincipalPossibilidades.length !== 0){
        equipaPrincipalPossibilidades.forEach(function(elemento, it) {
            var elementoDiv =   "<div class='elemento-row'>"+
                                    "<div class='col_float border-bottom' style='width:7%; margin-right:1%;'>"+
                                        elemento['n_mec']+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width: 50%; margin-right:2%;'>"+
                                        elemento['nome'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width:25%;'>"+
                                        elemento['categoria'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom-white' style='width:15%'>"+
                                    "<label class='container costumHeight modalCheck'>"+
                                        "<input type='checkbox' id='possibilidade"+it+"' class='possibilidade' onclick='checkIfSelectAll_equipaC("+it+")'>"+
                                        "<span class='checkmark costumCheck' style='right:-4px; transform: translateY(-50%);'></span>"+
                                    "</label>"+
                                    "</div>"+
                                "</div>";
            $("#addToEquipaCirurgica-body").append(elementoDiv);
        });
        
    } else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum Elemento Eligível"+
                            "</div>";
        $("#addToEquipaCirurgica-body").append(elementoDiv);   
    }
}

// select all possibilidades Equipa Cirurgica
function selectAllPossibilidadesEquipaCirurgica(){
    if($("#select_all_possibilidades_equipaC").is(":checked")){
        $(".possibilidade").prop('checked', true);
    } else {
        $(".possibilidade").prop('checked', false);
    }
}

// desselecionar selectall quando uma das opções é desselecionada
function checkIfSelectAll_equipaC(it){
    if($("#select_all_possibilidades_equipaC").is(':checked')){
        if(!$("#possibilidade"+it).is(':checked')){
            $("#select_all_possibilidades_equipaC").prop('checked', false);
        }
    }
}

//adiciona aos eligiveis para Equipa Cirurgica
function addToElegiveisEquipaPrincipal(){
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
    var fd = new FormData();
    fd.append('listToAdd', JSON.stringify(listaToAdd));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    $.ajax({
        type: "POST",
        url: "./api/intervenientes/addToElegiveisEquipaPrincipal.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            answer = JSON.parse(data);
            if(answer == 'success'){
                closeSubModal();
                getIntervenientesEquipaPrincipal();
            }else{
                toastr("Erro ao adicionar elemento(s) aos elegíveis para integrar uma Equipa Cirúrgica", "error");
            }
        }
    });
}

// add to Equipa principal
function addToEquipaApoio(){
    var addToEquipaApoioModal = "<div class='overlay submodal'>"+
                                        "<div class='modal'>"+
                                            "<h4 class='modal_title font-black'>Adicionar Elemento aos Elegíveis à Cirurgia Adicional (Equipa de Apoio)<i onclick='closeSubModal();' class='fas fa-times-circle close_modal'></i></h4>"+
                                            "<div class='container-filtros'>"+
                                                "<span class='font-light'>Filtros</span><br><br>"+
                                                "<span class='font-bold'>Nome</span><input id='nome-filter-apoioAdd' class='input-adicional-nome' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Nº Mecanográfico</span><input id='n_mec-filter-apoioAdd' class='input-adicional' type='text'/>"+
                                                "<span class='font-bold margin-filtros'>Categoria</span><input id='categoria-filter-apoioAdd' class='input-adicional' type='text'/>"+
                                                "<span><i onclick='getFuncionariosPossiveisEquipaApoio(0)' class='fas fa-search search-icon'></i></span>"+
                                                "<span><i onclick='resetSearchEquipaApoioModal(0)' class='fas fa-sync-alt search-icon search-icon-left' style='margin-left:.5vw'></i></span>"+
                                            "</div>"+
                                            "<div id='addToEquipaCirurgica'>"+
                                                "<div id='addToEquipaCirurgica-header' class='col_container'>"+
                                                    "<div class='col' style='width: 60%;'>"+
                                                        "Intervenientes Eligíveis para Cirurgia Adicional"+
                                                    "</div>"+
                                                    "<div class='col' style='width:25%'>"+
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
                                            "<div style='margin-top:2vw;' onclick='addToElegiveisEquipaApoio()'>"+
                                                "<button class='confirm-btn'>Confirmar</button>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>";
    $("body").append(addToEquipaApoioModal);
    getFuncionariosPossiveisEquipaApoio(0);
}

//get funcionarios possiveis de adicionar à equipa de apoio
function getFuncionariosPossiveisEquipaApoio(from){
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
            removeLoading();
            equipaApoioPossibilidades = JSON.parse(data);
            drawEquipaApoioPossibilidades(equipaApoioPossibilidades, from);
        }
    });   
}

// reset search equipa principal submodal
function resetSearchEquipaApoioModal(from){
    $("#nome-filter-apoioAdd").val("");
    $("#n_mec-filter-apoioAdd").val("");
    $("#categoria-filter-apoioAdd").val("");
    getFuncionariosPossiveisEquipaApoio(from);
}

// draw possibilidades de adicionar a equipa cirurgica
function drawEquipaApoioPossibilidades(equipaApoioPossibilidades, from){
    $("#addToEquipaCirurgica-body").empty();
    if(from == 1){
        for (let it1 = equipaApoioPossibilidades.length-1; it1 >= 0; it1--) {
            const elemento = equipaApoioPossibilidades[it1];
            for (let it2 = episodioToEdit.intervenientes.length-1; it2 >= 0; it2--) {
                const interveniente = episodioToEdit.intervenientes[it2];
                if(elemento.n_mec == interveniente.id_prof){
                    equipaApoioPossibilidades.splice(it1,1);
                }
            }   
        }
    }
    if(equipaApoioPossibilidades.length !== 0){
        equipaApoioPossibilidades.forEach(function(elemento, it) {
            var elementoDiv =   "<div class='elemento-row'>"+
                                    "<div class='col_float border-bottom' style='width:7%; margin-right:1%;'>"+
                                        elemento['n_mec']+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width: 50%; margin-right:2%;'>"+
                                        elemento['nome'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom' style='width:25%;'>"+
                                        elemento['categoria'].toUpperCase()+
                                    "</div>"+
                                    "<div class='col_float border-bottom-white' style='width:15%'>"+
                                    "<label class='container costumHeight modalCheck'>"+
                                        "<input type='checkbox' id='possibilidade"+it+"' class='possibilidade' onclick='checkIfSelectAll_equipaC("+it+")'>"+
                                        "<span class='checkmark costumCheck' style='right:-4px; transform: translateY(-50%);'></span>"+
                                    "</label>"+
                                    "</div>"+
                                "</div>";
            $("#addToEquipaCirurgica-body").append(elementoDiv);
        });
    } else {
        var elementoDiv =   "<div class='empty-row'>"+
                                "Nenhum Elemento Eligível"+
                            "</div>";
        $("#addToEquipaCirurgica-body").append(elementoDiv);   
    }
}

//adiciona aos eligiveis para Equipa Apoio
function addToElegiveisEquipaApoio(){
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
    var fd = new FormData();
    fd.append('listToAdd', JSON.stringify(listaToAdd));
    var user = JSON.parse(sessionStorage.getItem('user'));
    fd.append('user', user['user']);
    $.ajax({
        type: "POST",
        url: "./api/intervenientes/addToElegiveisEquipaPrincipal.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            answer = JSON.parse(data);
            if(answer == 'success'){
                closeSubModal();
                getIntervenientesEquipaApoio();
            }else{
                toastr("Erro ao adicionar elemento(s) aos elegíveis para integrar uma Equipa de Apoio", "error");
            }
        }
    });
}