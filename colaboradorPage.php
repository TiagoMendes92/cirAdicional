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
        <script src="assets/scripts/colaboradorPage.js"></script>
        <link rel="stylesheet" href="assets/scripts/jquery-ui.structure.min.css">
        <link rel="stylesheet" href="assets/scripts/jquery-ui.theme.min.css">
        <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
        <link rel="stylesheet" href="assets/styles/utilitaries.css">
        <link rel="stylesheet" href="assets/styles/colaboradorPage.css">
        <link rel="stylesheet" href="assets/modals/modals.css">
        <link href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:100,300,400,700&display=swap" rel="stylesheet">
        <script src="https://kit.fontawesome.com/5144695880.js"></script>
    </head>
    <body onload="checkUser()">
      <div id="user" style="max-width: 1000px;">
        <div id="pageHeader">
          Monitorização de Cirurgia Adicional 
          <input id='monthPicker' type="text">
        </div>
        <div id="pageBody">
          <div id="episodio_table">
            <div id="episodio_table_header">
              <div style="width:60%">
                N.º Episódio
              </div>
              <div style="width:20%">
                Data da Cirurgia
              </div>
              <div style="width:20%">
                Valor
              </div>
            </div>
            <div id="episodio_table_body">

            </div>
          </div>
          <div id="total">
            <div style="width:60%"></div>
            <div style="width:20%"></div>
            <div style="width:20%">
              Total <br>
              <section id="totalLbl">

              </section>
            </div>
          </div>
        </div>    
      </div>
      <div id="nenhum_user" style="max-width: 1000px;">
        Nenhum User
      </div>
    </body>
</html>