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
		<meta name="google-site-verification" content=""/>
		<meta name="distribution" content="Global">
		<meta name="googlebot" content="Index, Follow">
		<meta name="robots" content="index,follow">
        <meta name="msnbot" content="index, follow">
        <meta name="allow-search" content="yes">
        <script src="assets/scripts/moment.js"></script>
        <script src="assets/scripts/pt.js"></script>
        <script src="assets/scripts/jquery.js"></script>
        <script src="assets/scripts/jquery-ui.min.js"></script>
        <script src="assets/loading/loading.js"></script>
        <script src="assets/toastr/toastr.js"></script>
        <script src="assets/scripts/sentForPayment.js"></script>
        <link rel="stylesheet" href="assets/scripts/jquery-ui.structure.min.css">
        <link rel="stylesheet" href="assets/scripts/jquery-ui.theme.min.css">
        <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
        <link rel="stylesheet" href="assets/styles/utilitaries.css">
        <link rel="stylesheet" href="assets/styles/sentForPayment.css">
        <link rel="stylesheet" href="assets/modals/modals.css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400,700&display=swap" rel="stylesheet">
        <script src="https://kit.fontawesome.com/5144695880.js"></script>
    </head>
    <body onload="loadEpisodios()">
        <div id='pageWrapper'>
            <div id="pageHeader">
                Monitorização de Cirurgia Adicional 
                <input id='monthPicker' type="text">
            </div>
            <div id="pageBody">
                <div id="pageBody_tableHeader" class='col_container'>
                    <div class="col col_5">
                        <label class="container costumHeight">
                            <input type="checkbox" id="sellAllServices" onclick="selectAllServicesToApprove()">
                            <span class="checkmark costumCheck"></span>
                        </label>
                    </div>
                    <div class="col col_60">Serviço</div>
                    <div class="col col_20 numericValue" style='padding-right:15px'>Valor</div>
                    <div class="col col_15">Estado</div>
                </div>
                <div id="pageBody_tableBody" style="margin-top: 1vw;" class='col_container'>
                </div>
                <div id='buttonArea'>
                    <button id="approveBtn" onclick='aprovarMultipleServices()' class='button'>Aprovar</button>
                    <button id="printBtn" onclick='printRelatorio()' class='button'>Imprimir Relatório</button>
                </div>
            </div>
        </div>
    </body>
</html>