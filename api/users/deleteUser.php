<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $id = intval($_POST['id']);
    $connection = $dbclass->getConnection();
    $stmt = $connection->prepare('DELETE FROM [login] WHERE [id]= :id');
    $stmt->bindParam(':id', $id,  PDO::PARAM_INT);
    if($stmt->execute()){
      echo json_encode('success');
    } else {
      echo json_encode('error');
    }
