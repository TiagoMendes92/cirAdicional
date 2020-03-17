<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id = intval($_POST['id']);
    $stmt = $connection->prepare("UPDATE [data_adicional_servico] SET [dupla_validacao_equipa]=0 WHERE [id]=:id");
    $stmt->bindParam(':id', $id,  PDO::PARAM_INT);
    if($stmt->execute()){
        $historic = new Historico();  
        $obj;
        $obj['servico'] = $id;
        $obj['user'] = $_POST['user'];  
        $type = 'singleValidacaoSecretariado';
        $historic->addHistorico($type, $obj); 
        echo json_encode("success");
    } else {
        echo json_encode("error");
    }
