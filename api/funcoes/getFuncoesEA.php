<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

// include_once  $_SERVER['DOCUMENT_ROOT'] .'/40_adicional/api/dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $stmt = $connection->prepare("SELECT * FROM [data_adicional_funcao] WHERE [equipa]='EA'");
    if($stmt->execute()){
        $funcoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($funcoes);
    } else {
        echo json_encode($stmt->errorInfo());
    }
