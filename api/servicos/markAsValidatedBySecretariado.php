<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id = intval($_POST['id']);
    $stmt = $connection->prepare("UPDATE [data_adicional_servico] SET [dupla_validacao_equipa]=1 WHERE [id]=:id");
    $stmt->bindParam(':id', $id,  PDO::PARAM_INT);
    if($stmt->execute()){
        $historic = new Historico();  
        $obj;
        $obj['servico'] = $id;
        $obj['user'] = $_POST['user'];  
        $type = 'duplaValidacaoSecretariado';
        $historic->addHistorico($type, $obj); 
        echo json_encode("success");
    } else {
        echo json_encode("error");
    }
