$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/loginModal/Login.css">');
$('head').append('<link rel="stylesheet" type="text/css" href="./assets/modals/modals.css">');

var loginModal ="<div class='overlay'>"+
                    "<div id='login_modal' class='modal'>"+
                        "<h4 class='modal_title'>Autenticação</h4>"+
                        "<div class='modal_form'>"+
                            "<label>número mecanográfico</label></br>"+
                            "<input id='username' autocomplete='off' type='text'></br>"+
                            "<label>palavra-chave</label></br>"+
                            "<input id='password' autocomplete='off' type='password'></br></br>"+
                        "</div>"+
                        "<div class='modal_buttons'>"+
                            "<button onclick='tryLogin()'>Entrar</button>"+
                        "</div>"+
                    "</div>"+
                "</div>";

// show modal login
function showLoginForm (){
    $("body").append(loginModal);
}

// try login
function tryLogin(){
    if($("#username").val().trim() == ""){
        toastr("Preencha o seu Número Mecanográfico", "error");
        return;
    }
    if($("#password").val().trim() == ""){
        toastr("Preencha a sua Palavra-Chave", "error");
        return;
    }
    var user = {
        username: $("#username").val(),
        password:  $("#password").val()
    };
    addLoading();
    var fd = new FormData();
    fd.append('user', JSON.stringify(user));
    $.ajax({
        type: "POST",
        url: "./api/auth/login.php",
        data: fd,
        processData: false,
        contentType: false,
        success:function(data){
            removeLoading();
            var response = JSON.parse(data); 
            if(response == 'error'){
                toastr("Erro no processo de autenticação", "error");
                return;
            }
            if(response == 'no_user'){
                toastr("Não existe nenhum utilizador com esse Número Mecanográfico", "error");
                return;
            }
            if(response == 'error_pass'){
                toastr("A Palavra-Chave inserida não está correcta", "error");
                return;
            }
            closeAllModals()
            sessionStorage.setItem('user', data);
            var user = JSON.parse(sessionStorage.getItem('user'));
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
        }
    }); 
}

// check privilegies
function checkPrivilegies(user) {
    var role = parseInt(user['role_id']);
    getGDHList();
    var currMonthName  = moment().format('MMMM');
    var currYearName  = moment().format('YYYY');
    $("#mainListResults").text(" (" + currMonthName + " " + currYearName + ")");
    var firstDayOfMonth = moment().startOf('month').format("YYYY-MM-DD");
    var lastDayOfMonth = moment().endOf('month').format("YYYY-MM-DD");
    $("#data_cir_ini_filtro").val(firstDayOfMonth);
    $("#data_cir_fim_filtro").val(lastDayOfMonth);
    if(role == 1){
        $("#filtro_pendente_secretariado .nome_filtro").text("Pendente de verificação secretariado clínico");
        $("#filtro_pendente_gdh").remove();
        $("#filtro_pendente_pagamento").remove();
        $("#filtro_enviado_pagamento").remove();
        $("#filtro_pagamento_processado").remove();
        $("#botoes_autorizacoes").remove();
        $("#data_env_filtro").remove();
        getEpisodios([0, 1], user['servico_id']);
        // $("#mainListSellALL").remove();
        return;
    }
    if(role == 2){
        $("#filtro_pendente_gdh").remove();
        $("#filtro_pendente_pagamento").remove();
        $("#filtro_enviado_pagamento").remove();
        $("#filtro_pagamento_processado").remove();
        $("#botoes_autorizacoes").remove();
        $("#data_env_filtro").remove();
        getEpisodios([0, 1], null);
        return;
    }
    if(role == 3){
        $("#filtro_pendente_secretariado").remove();
        $("#filtro_pendente_pagamento").remove();
        $("#filtro_enviado_pagamento").remove();
        $("#filtro_pagamento_processado").remove();
        $("#botoes_autorizacoes").remove();
        $("#validarPendenteSecretariado").remove();
        $("#data_env_filtro").remove();
        getEpisodios([1,2], null);
        if($("#validarPendenteGDH").length == 0){
            $("#mainList-validationButtons").append("<button id='validarPendenteGDH' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='validarGDHsEpisodios()'>Validar</button>");
        }
        return;
    }
    if(role == 4){
        //user 4 só vê pendente de pagamento e enviado por pagamento
        $("#filtro_pendente_secretariado").remove();
        $("#filtro_pendente_gdh").remove();
        //removido botão de validar pendentes de gdh
        // $("#mainList-validationButtons").append("<button id='validarPendenteGDH' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='validarGDHsEpisodios()'>Validar</button>");
        $("#data_env_filtro").remove();

        $("#botoes_autorizacoes").remove();
        $("#filtro_pagamento_processado").remove();
        $("#validarPendenteSecretariado").remove();
        $("#validarPendenteGDH").remove();
        getEpisodios([2], null);
        $("#data_env_filtro").show();
        $("#pendente_pagamento").prop('checked', true);
        $("#mainList-validationButtons").append("<button id='validarPendentePagamento' class='confirm-btn' style='margin-top:2vw; margin-right:2vw;' onclick='validarPendentePagamentoEpisodios()'>Confirmar</button>");
        return;
    }
    $("#opcoes_gestao").css("display", "block");
    getEpisodios([0], null);
    getHistoric();
    $("#data_env_filtro").remove();

    $("#top-menu").append("<span id='showHistorico' style='float:right; margin-right:5vw;' class='inactive_menu'>HISTÓRICO</span>");

    // $("#botoes_filtros").prepend("<a target='_blank' href='https://www.fortydegrees.pt/cirurgia_adicional/sentForPayment.php'>Página a integrar no GestRH</a>");
    document.getElementById("showHistorico").addEventListener("click", function(event){
        event.stopPropagation();
        showHistorico();
    });
    document.getElementById('showEpisodios-topMenu').addEventListener("click", function(event){
        event.stopPropagation();
        $("#hist").remove();
        $("#episodios_header, #episodios_body, #validarPendenteSecretariado").css('display', 'block');
        $("#showEpisodios-topMenu").removeClass('inactive_menu');
        $("#showHistorico").addClass('inactive_menu');
    });
}

//logout
function logOut() {
    sessionStorage.removeItem('user');
    location.reload();
}