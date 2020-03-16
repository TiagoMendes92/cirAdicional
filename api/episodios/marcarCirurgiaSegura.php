<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id_episodio = intval($_POST['id']);
    $user = $_POST['user'];
    $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [cir_segura]=1 WHERE [id]=:id');
    $stmt->bindParam(':id', $id_episodio);
    if($stmt->execute()){   
      $historic = new Historico();  
      $type = 'marcadaCirurgiaSegura';
      $obj;
      $obj['episodio'] = $id_episodio;
      $obj['user'] = $user;
      $historic->addHistorico($type, $obj);    
      echo json_encode('success');
  }else{
      echo json_encode('error');
  }
