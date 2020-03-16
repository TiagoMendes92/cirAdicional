<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

// include_once  $_SERVER['DOCUMENT_ROOT'] .'/40_adicional/api/dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id_episodio = intval($_POST['id']);
    $user = $_POST['user'];
    $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [cir_segura]=0 WHERE [id]=:id');
    $stmt->bindParam(':id', $id_episodio);
    if($stmt->execute()){   
      $historic = new Historico();  
      $type = 'marcadaCirurgiaInsegura';
      $obj;
      $obj['episodio'] = $id_episodio;
      $obj['user'] = $user;
      $historic->addHistorico($type, $obj);    
      echo json_encode('success');
  }else{
      echo json_encode('error');
  }