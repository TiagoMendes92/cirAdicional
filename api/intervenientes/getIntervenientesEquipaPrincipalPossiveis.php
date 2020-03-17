<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $stmt = $connection->prepare("SELECT n_mec FROM data_adicional_prof");
    if($stmt->execute()){
        $authorized = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $authorizedString = "";
        foreach ($authorized as $authorizedElement) {
            $authorizedString.= $authorizedElement['n_mec'].",";
        }
        $authorizedString = substr($authorizedString, 0, -1);
        $connection_GestRH_dados = $dbclass->getConnectionGestRH_dados();
        $nome = $_POST['nome'];
        $n_mec = $_POST['n_mec'];
        $categoria = $_POST['categoria'];
        $autorizacao = $_POST['autorizacao'];
        $sql = "SELECT t1.NumMec AS n_mec, t2.DESCRICAO AS categoria, t3.NOME as nome
                FROM dad_dat_Efectivos_Cat t1
                LEFT JOIN dad_Categorias t2 ON t2.TIPOPPL = t1.GrpProf
                            AND t2.CARRPROF = - 1
                LEFT JOIN dad_DadosPessoais t3 ON t1.NumMec = t3.NMEC
                WHERE t1.DataFim IS NULL
                    AND t1.GrpProf IN (1, 3, 5)";
        if($_POST['autorizacao'] == '0'){
            if($authorizedString != ''){
                $sql.= "AND NOT t1.NumMec IN (".$authorizedString.")";
            } else {
                $sql.= "AND t1.NumMec IS NOT NULL";
            }
        }else{
            if($authorizedString != ''){
                $sql.= "AND t1.NumMec IN (".$authorizedString.")";
            } else{
                $sql.= "AND t1.NumMec IS NULL";
            }
        }
         $sql .=  " AND t3.NOME IS NOT NULL";
        if($nome !== ''){
            $sql.= " AND t3.NOME LIKE '%".$nome."%'";
        }
        if($n_mec !== ''){
            $sql.= " AND t1.NumMec LIKE '%".$n_mec."%'";
        }
        if($categoria !== ''){
            $sql.= " AND t2.DESCRICAO LIKE '%".$categoria."%'";
        }
        $sql.=" ORDER BY t2.DESCRICAO DESC";
        $stmt = $connection_GestRH_dados->prepare($sql);
        if($stmt->execute()){
            $intervenientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($intervenientes);
        } else {
            echo json_encode($stmt->errorInfo());
        }
    } else {
        echo json_encode($stmt->errorInfo());
    }


    