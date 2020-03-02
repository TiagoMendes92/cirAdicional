<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $n_mec = intval($_POST['n_mec']);
    $user = $_POST['user'];
    
    $stmt = $connection->prepare("DELETE FROM [data_adicional_prof] WHERE [n_mec]=:n_mec");
    $stmt->bindParam(':n_mec', $n_mec,  PDO::PARAM_INT);
    if($stmt->execute()){
        $historic = new Historico();  
        $obj;
        $obj['profissional'] = $n_mec;
        $obj['user'] = $_POST['user'];  
        $type = 'removeElegivel';
        $historic->addHistorico($type, $obj);
        echo json_encode("success");
    } else {
        echo json_encode("error");
    }
