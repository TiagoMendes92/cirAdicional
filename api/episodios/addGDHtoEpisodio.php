<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id_episodio = intval($_POST['id_episodio']);
    $gdh2 = intval($_POST['gdh2']);
    $user = $_POST['user'];
    $stmt;
    $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [gdh2]=:gdh2 WHERE [id]= :id_episodio');
    $stmt->bindParam(':gdh2', $gdh2,  PDO::PARAM_INT);
    $stmt->bindParam(':id_episodio', $id_episodio,  PDO::PARAM_INT);
    if($stmt->execute()){
      $historic = new Historico();  
      $obj;
      $obj['gdh2'] = $gdh2;
      $obj['user'] = $user;
      $obj['episodio'] = $id_episodio;
      $type = 'addGDH';
      $historic->addHistorico($type, $obj);
      echo json_encode('success');
    } else {
      echo json_encode($stmt->errorInfo());
    }
    