<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();
    $id = intval($_POST['id']);
    $role_id = intval($_POST['role_id']);
    $connection = $dbclass->getConnection();
  
    $sql = "UPDATE [login] SET [role_id]=".$role_id;
    if(isset($_POST['servico_id'])){
      $servico_id = intval($_POST['servico_id']);
      $sql.=", [servico_id]=".$servico_id;
    } else {
      $sql.=", [servico_id]=NULL";
    }
    $sql.=" WHERE [id] = ".$id;
    $stmt = $connection->prepare($sql);
    if($stmt->execute()){
      echo json_encode('success');
    } else {
      echo json_encode('error');
    }
