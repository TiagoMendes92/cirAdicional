<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $stmt = $connection->prepare("SELECT * FROM [data_adicional_bloco]");
    if($stmt->execute()){
        echo json_encode( $stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo json_encode($stmt->errorInfo());
    }
    