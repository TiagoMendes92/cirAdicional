<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

// include_once  $_SERVER['DOCUMENT_ROOT'] .'/40_adicional/api/dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $lista = json_decode($_POST['listToAdd']);
    $user = $_POST['user'];
    $sql = "INSERT INTO [data_adicional_prof] ([n_mec]) VALUES";
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
        echo json_encode('error');
    }
    