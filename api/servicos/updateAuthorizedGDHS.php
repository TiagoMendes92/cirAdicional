<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();

    $id = intval($_POST['id']);
    $lista = json_decode($_POST['lista']);
    $user = $_POST['user'];
    $listaComma = implode(",", $lista);

    $stmt = $connection->prepare("UPDATE [data_adicional_servico] SET [listaGHDs]=:lista WHERE [id]=:id");
    $stmt->bindParam(':lista', $listaComma,  PDO::PARAM_INT);
    $stmt->bindParam(':id', $id,  PDO::PARAM_INT);
    if($stmt->execute()){
        $historic = new Historico();  
        $obj;
        $obj['servico'] = $id;
        $obj['user'] = $_POST['user']; 
        $obj['gdhs'] = $_POST['lista']; 
        $type = 'authorizedGDHtoService'; // atualizou lista de autorizados
        $historic->addHistorico($type, $obj); 
        echo json_encode("success");
    } else {
        echo json_encode("error");
    }
