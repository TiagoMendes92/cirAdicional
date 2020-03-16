<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

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
