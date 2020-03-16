<?php
   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

// include_once  $_SERVER['DOCUMENT_ROOT'] .'/40_adicional/api/dbclass.php';

   $dbclass = new DBClass();
   $connection = $dbclass->getConnection();
   $ids = explode(",",$_POST['ids']);
   $idsString = $_POST['ids'];
   
   $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [pago]=1 WHERE [id] IN ('.$idsString.')');
   if($stmt->execute()){
      $historic = new Historico();
      $type = 'approveService';
      $obj;
      $obj['episodios'] = $ids;
      $obj['user'] = 'Conselho de Administração';
      $historic->addHistorico($type, $obj);
      echo json_encode('success');
   } else {
    echo json_encode('error');
   }