<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

// include_once  $_SERVER['DOCUMENT_ROOT'] .'/40_adicional/api/dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $list = json_decode($_POST['list']);
    $user = $_POST['user'];
    $date = date('Y-m-d H:i:s');
    $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [estado]=3, [data_estado]=:dataa, [pago]=0 WHERE [id] IN ('.implode(",",$list).')');
    $stmt->bindParam(':dataa', $date);
    if($stmt->execute()){   
        $historic = new Historico();
        $type = 'valitadePendentePagamento';
        $obj;
        $obj['episodios'] = $list;
        $obj['user'] = $user;
        $historic->addHistorico($type, $obj);
        echo json_encode('success');
    }else{
        echo json_encode('error');
    }