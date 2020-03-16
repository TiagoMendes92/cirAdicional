<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

// include_once  $_SERVER['DOCUMENT_ROOT'] .'/40_adicional/api/dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $query = 'SELECT * FROM [data_adicional_historic] WHERE 1=1';
    
    if(isset($_POST['tipo'])){
        $query .= " AND [tipo]='".$_POST['tipo']."'";
    }
    if(isset($_POST['min-data'])){
        $query .= " AND [date] >= '".$_POST['min-data']."'";
    }

    if(isset($_POST['max-data'])){
        $query .= " AND [date] <= '".$_POST['max-data']."'";
    }
    $query.=" ORDER BY [date] DESC";
    $stmt = $connection->prepare($query);
    if($stmt->execute()){
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } else {
        echo json_encode($stmt->errorInfo());
    }