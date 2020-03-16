<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Cirugia Adicional</title>
		<meta name="description" content="">
		<meta name="keywords" content="">
		<meta name="author" content="" />
		<meta name="google-site-verification" content="" />
		<meta name="distribution" content="Global">
		<meta name="googlebot" content="Index, Follow">
		<meta name="robots" content="index,follow">
        <meta name="msnbot" content="index, follow">
        <meta name="allow-search" content="yes">
        <script src="assets/scripts/moment.js"></script>
        <script src="assets/scripts/pt.js"></script>
        <script src="assets/scripts/jquery.js"></script>
        <script src="assets/loading/loading.js"></script>
        <script src="assets/toastr/toastr.js"></script>
        <script src="assets/modals/loginModal/Login.js"></script>
        <script src="assets/modals/autorizacaoGDH/autorizacaoGDH.js"></script>
        <script src="assets/modals/editModal/editModal.js"></script>
        <script src="assets/modals/autorizacaoIntervenientesModal/autorizacaoIntervenientesModal.js"></script>
        <script src="assets/modals/servicosValidacaoSecretariado/servicosValidacaoSecretariado.js"></script>
        <script src="assets/modals/historic/historic.js"></script>
        <script src="assets/modals/mangeSchedules/mangeSchedules.js"></script>
        <script src="assets/scripts/pdf.js"></script>
        <script src="assets/scripts/main.js"></script>
        <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
        <link rel="stylesheet" href="assets/styles/styles.css">
        <link rel="stylesheet" href="assets/styles/utilitaries.css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400,700&display=swap" rel="stylesheet">
        <script src="https://kit.fontawesome.com/5144695880.js"></script>
    </head>
    <body onload="checkAuth()">
        <!-- FILTROS -->
        <aside class="col">
            <h5>ESTADOS <span onclick='logOut()' id='logout'><i class="fas fa-sign-out-alt"></i> Sair</span></h5>
            <div class="divider"></div>
            <div id="estados_filtros">
                <div id="filtro_pendente_secretariado" class="estado_filtro">
                    <label class="container">
                        <span class="nome_filtro">Pendente de verificação secretariado</span>
                        <div class="divider"></div>
                        <input type="checkbox" id="pendente_secretariado" class="mainList-filter" checked onchange="toggleEpisodiosState('pendente_secretariado', '0')">
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div id="filtro_pendente_gdh" class="estado_filtro">
                    <label class="container">
                        <span class="nome_filtro">Pendente GDH</span>
                        <div class="divider"></div>
                        <input type="checkbox" id="pendente_gdh" class="mainList-filter" checked onchange="toggleEpisodiosState('pendente_gdh', '1')">
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div id="filtro_pendente_pagamento" class="estado_filtro">
                    <label class="container">
                        <span class="nome_filtro">Pendente de pagamento</span>
                        <div class="divider"></div>
                        <input type="checkbox" id="pendente_pagamento" class="mainList-filter" checked onchange="toggleEpisodiosState('pendente_pagamento', '2')"> 
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div id="filtro_enviado_pagamento" class="estado_filtro">
                    <label class="container">
                        <span class="nome_filtro">Enviado para pagamento</span>
                        <div class="divider"></div>
                        <input type="checkbox" id="enviado_pagamento" class="mainList-filter" checked onchange="toggleEpisodiosState('enviado_pagamento', '3')">
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div id="filtro_pagamento_processado" class="estado_filtro">
                    <label class="container">
                        <span class="nome_filtro">Pagamento processado</span>
                        <div class="divider"></div>
                        <input type="checkbox" id="pagamento_processado" class="mainList-filter" checked onchange="toggleEpisodiosState('pagamento_processado', '4')">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>
            <h5 id="label_pesquisa">PESQUISA</h5>
            <div class="divider"></div>
            <div id="pesquisa_filtros">
                <div class="pesquisa_filtro">
                    <div class="pesquisa_filtro_nome">Doente</div>
                    <input id="doente_1_filtro" value="HUC" type='text' readonly/> /
                    <input id="doente_2_filtro" placeholder="Nome doente" type='text'>
                </div>
                <div class="pesquisa_filtro">
                    <div class="pesquisa_filtro_nome">Bloco</div>
                    <select id="bloco_filtro">
                    </select>
                </div>
                <div class="pesquisa_filtro">
                    <div class="pesquisa_filtro_nome">Serviço</div>
                    <select id="servico_filtro">
                    </select>
                </div>
                <div class="pesquisa_filtro">
                    <div class="pesquisa_filtro_nome">Serv. Agrup.</div>
                    <select id="agrupamento_filtro">
                    </select>
                </div>
                <div class="pesquisa_filtro">
                    <div class="pesquisa_filtro_nome">Interveni.</div>
                    <input type='text' id="interveniente_mec_filtro" placeholder='Mecanográfico'/>
                    <input type='text' id="interveniente_nome_filtro" placeholder='Nome'/>
                </div>
                <div class="pesquisa_filtro">
                    <div class="pesquisa_filtro_nome">GDH</div>
                    <select id="gdh_filtro">
                    </select>
                </div>

            </div>
            <div id="data_filtros">
                <div class="divider"></div>
                <div id="data_cir_filtro" class="data_filtro">
                    <div class="data_filtro_nome">
                        Data Cirurgia
                    </div>
                    <input id='data_cir_ini_filtro' type="date">
                    <input id='data_cir_fim_filtro' type="date">
                </div>
                <div id="data_env_filtro" class="data_filtro">
                    <div class="data_filtro_nome">
                        Data Envio Pag.
                    </div>
                    <input id='data_env_ini_filtro' type="date">
                    <input id='data_env_fim_filtro' type="date">
                </div>
                <!-- <div class="data_filtro">
                    <div class="data_filtro_nome">
                        Programas
                    </div>
                    <select id="programas_filtro">
                        <option value=""></option>
                    </select>
                </div> -->
            </div>
            <div id="botoes_filtros">
                <button onclick='pesquisaEpisodios()'>Pesquisar</button>
                <button onclick='restaurarPesquisaEpisodios()'>Restaurar</button>
            </div>

            <div style="margin-top: 2.5vw;">
                <h5 id='opcoes_gestao' style='display:none;'>Opções de Gestão:</h5>
                <div id="botoes_autorizacoes" class='col_container_flex'>
                    <div class="col_flex col_35">
                        <button onclick="showAutorizacaoGDH()" id="autorizacoes_GDH">Autorização de GDH</button>
                    </div>
                    <div class="col_flex col_50">
                        <button onclick="showAutorizacaoIntervenientes()" id="autorizacoes_intervenientes">Autorização de Intervenientes</button>
                    </div>
                    <div class="col_flex col50">
                        <button onclick="showServicosValidacaoSecretariado()" style='margin-top:10px;' >Gerir validação de Serviços</button>
                    </div>
                    <div class="col_flex col_50">
                        <button onclick="showManageSchedules()" style='margin-top:10px; margin-left:10px;'>Definir Horários dos Serviços</button>
                    </div>
                    <div class="col_flex col_50">
                        <button onclick="manageUsers()" style='margin-top:10px;'>Gerir Utilizadores</button>
                    </div>
                </div>
            </div>
            

            <div id="errorContainer">
                <div id="error_semRegistoAdmissao" class='error_episodio'>
                    <div class='error_episodio_icon'>
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div>
                        <b>Registo com erro</b> <br>
                        <span class='error_episodio_desc'>sem registo de admissão (Internamento/Ambulatório) (Não aparecerá nas listagens)</span>
                    </div>
                </div>
            </div>
        </aside>
        <!-- TABELA -->
        <main class="col">
            <h5 id="top-menu" class="menu"><span id='showEpisodios-topMenu'>EPISÓDIOS</span><span id="mainListResults"></span></h5>
            <div class="divider"></div>
            <div id="episodios_header">
                <h5 style="width:46%;">Doente</h5>
                <h5 style="width:10%;">Data Cirugia</h5>
                <h5 style="width:7.76%;">
                    <div style='transform: translateX(-23px)' class='numericValue'>
                        GDH 1
                    </div> 
                </h5>
                <h5 style="width:7.76%;">
                    <div style='transform: translateX(-23px)' class='numericValue'>
                        GDH 2
                    </div>  
                </h5>
                <h5 style="width:7.76%;">
                    <div style='transform: translateX(-23px)' class='numericValue'>
                        Valor
                    </div> 
                </h5>
                <h5 style="width:13%;">Est. Integração</h5>
                <h5 style="width:7.7%;">
                    <label id="mainListSellALL"class="container costumHeight">
                        <input onclick="selectAllEpisodios()" type="checkbox">
                        <span class="checkmark costumCheck"></span>
                    </label>
                </h5>
            </div>
            <div id="episodios_body">
            </div>
            <div id='mainList-validationButtons'>
                <button id="validarPendenteSecretariado" class="confirm-btn" style="margin-top:2vw; margin-right:2vw;" onclick='validarEquipasEpisodios()'>Validar</button>
            </div>
        </main>
    </body>
</html>