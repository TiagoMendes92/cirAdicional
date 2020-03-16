<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection_GestRH_dados = $dbclass->getConnectionGestRH_dados();
    $n_mecsString = implode(",", json_decode($_POST['n_mecs']));
    $data = $_POST['data'];
    $sql = "SELECT IDTRAB FROM dad_FeriasFaltasConf a JOIN Dad_descTipoFalta b ON a.IDTIPO=b.COD_TIPO WHERE a.IDTRAB IN (".$n_mecsString.") AND '".$data."' between a.DATAINICIO and a.DATAFIM";
    $stmt = $connection_GestRH_dados->prepare($sql);
    if($stmt->execute()){
      $ausencias = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($ausencias);
    } else {
      echo json_encode([]);
    }
