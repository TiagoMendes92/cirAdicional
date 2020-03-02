<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $gdh = $_POST['gdh'];
    $servico = $_POST['servico'];
    $query = "SELECT * FROM [data_adicional_gdh] WHERE 1 = 1";
    if($gdh !== ''){
        $query.= " AND [gdh] LIKE '%".$gdh."%'";
    }
    if($servico !== ''){
        $query.= " AND [servico] LIKE '%".$servico."%'";
    }
    $stmt = $connection->prepare($query);
    if($stmt->execute()){
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo json_encode($stmt->errorInfo());
    }
    