<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id = intval($_POST['id']);
    $funcao = json_decode($_POST['funcao']);
    $user = $_POST['user'];

    $stmt = $connection->prepare("DELETE FROM [data_adicional_funcao] WHERE [id] = :id");
    $stmt->bindParam(':id', intval($funcao->id));
    if($stmt->execute()){
      echo json_encode("success");  
    }else{
      echo json_encode("error");  
    }