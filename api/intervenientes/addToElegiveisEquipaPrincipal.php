<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $lista = json_decode($_POST['listToAdd']);
    $user = $_POST['user'];
    $sql = "INSERT INTO [data_adicional_prof] VALUES";
    $valuesString = "";

    foreach ($lista as $element) {
        $valuesString .= " (".$element."),";
    }
    $valuesString = substr($valuesString, 0, -1);
    $sql.= $valuesString;
    
    $stmt = $connection->prepare($sql);
    if($stmt->execute()){
        $historic = new Historico();  
        $obj;
        $obj['profissionais'] = $lista;
        $obj['user'] = $_POST['user'];  
        $type = 'addElegivel';
        $historic->addHistorico($type, $obj); 
        echo json_encode('success');
    } else {
        echo json_encode("error");
    }
    