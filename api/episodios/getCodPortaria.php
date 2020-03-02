<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $data = $_POST['data'];
    $stmt = $connection->prepare("SELECT [cod_portaria]
                                  FROM [data_portaria]
                                  WHERE [data_inicio]<=:data1
                                  AND ([data_fim] > :data2 OR [data_fim] IS NULL)");
    $stmt->bindParam(':data1', $data);
    $stmt->bindParam(':data2', $data);
    $stmt->execute();
    echo json_encode($stmt->fetchAll()[0]);