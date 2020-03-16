<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();

    $id = $_POST['id'];
    $perc = $_POST['perc'];
    $v_uni = $_POST['v_uni'];
    $user = $_POST['user'];

    $stmt = $connection->prepare("UPDATE [data_adicional_gdh] SET [perc]=:perc, [v_uni]=:v_uni WHERE [id]=:id");
    $stmt->bindParam(':perc', $perc);
    $stmt->bindParam(':v_uni', $v_uni);
    $stmt->bindParam(':id', $id,  PDO::PARAM_INT);
    if($stmt->execute()){
        $historic = new Historico();  
        $obj;
        $obj['id_gdh'] = $id;
        $obj['perc'] = $perc;
        $obj['v_uni'] = $v_uni;
        $obj['user'] = $_POST['user'];  
        $type = 'updateGDH';
        $historic->addHistorico($type, $obj);
        
        echo json_encode('success');
    } else {
        echo json_encode($stmt->errorInfo());
    }
  