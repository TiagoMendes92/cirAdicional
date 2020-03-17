<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $body = json_decode($_POST['body']);
    $id_episodio = intval($body->id_episodio);
    $user = $_POST['user'];
    $stmt = $connection->prepare('DELETE FROM [data_adicional_intervenientes] WHERE [id_episodio]= :id_episodio AND [id_prof]=:id_prof');
    $stmt->bindParam(':id_episodio', $id_episodio,  PDO::PARAM_INT);
    $stmt->bindParam(':id_prof', $body->id_prof,  PDO::PARAM_INT);
    if($stmt->execute()){
        $historic = new Historico();  
        $obj = $body;
        $obj->user = $_POST['user'];  
        $type = 'removeEquipa';
        $historic->addHistorico($type, $obj);    
        echo json_encode('success');
    } else {
        echo json_encode('error');
    }