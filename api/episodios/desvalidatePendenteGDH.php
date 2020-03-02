<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id = json_decode($_POST['id']);
    $user = $_POST['user'];
    $date = date('Y-m-d H:i:s');
    $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [estado]=1, [data_estado]=:dataa WHERE [id]=:id');
    $stmt->bindParam(':dataa', $date);
    $stmt->bindParam(':id', $id);
    if($stmt->execute()){   
        $historic = new Historico();  
        $type = 'desvalitadePendenteGDH';
        $obj;
        $obj['episodio'] = $id;
        $obj['user'] = $user;
        $historic->addHistorico($type, $obj);    
        echo json_encode('success');
    }else{
        echo json_encode('error');
    }