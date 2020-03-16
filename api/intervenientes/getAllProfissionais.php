<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
  
    $connection_GestRH_dados = $dbclass->getConnectionGestRH_dados();
    $sql = "SELECT t1.NumMec AS n_mec, t2.DESCRICAO AS categoria, t3.NOME as nome
            FROM dad_dat_Efectivos_Cat t1
            LEFT JOIN dad_Categorias t2 ON t2.TIPOPPL = t1.GrpProf
                        AND t2.CARRPROF = - 1
            LEFT JOIN dad_DadosPessoais t3 ON t1.NumMec = t3.NMEC
            WHERE t1.DataFim IS NULL
                AND t1.GrpProf IN (1, 3, 5, 11, 13, 52, 53)
                AND t3.NOME IS NOT NULL";
    $sql.=" ORDER BY t2.DESCRICAO DESC";
    $stmt = $connection_GestRH_dados->prepare($sql);
    if($stmt->execute()){
        $profissionais = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($profissionais);
    } else {
        echo json_encode($stmt->errorInfo());
    }

