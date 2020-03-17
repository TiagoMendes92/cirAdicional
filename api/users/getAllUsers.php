<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();

    $connection = $dbclass->getConnection();
    $connection_GestRH_dados = $dbclass->getConnectionGestRH_dados();
    $sql = "SELECT [id], [user], [role_id], [servico_id] FROM [login] WHERE 1=1";

    if(isset($_POST['username'])){
        $sql .= " AND [user] LIKE '%".$_POST['username']."%'";
    }
    if(isset($_POST['role'])){
        $sql .= " AND [role_id] = ".$_POST['role'];
    }
    $stmt = $connection->prepare($sql);
    if($stmt->execute()){
        $tempUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $users = [];
        foreach ($tempUsers as $tempUser) {
            $stmt = $connection_GestRH_dados->prepare("SELECT [NOME] FROM [dad_DadosPessoais] WHERE [NMEC] = ".$tempUser['user']);
            $stmt->execute();
            $nomes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $user = $tempUser;
            if(sizeof($nomes)>0){
                $user['nome'] = $nomes[0]['NOME'];
            } else {
                $user['nome'] = "Não Definido";
            }
            $users[]=$user;
        }
        echo json_encode($users);
    } else {
        echo json_encode($stmt->errorInfo());
    }
      
