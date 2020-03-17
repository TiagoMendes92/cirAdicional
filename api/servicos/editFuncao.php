<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $id = intval($_POST['id']);
    $funcao = json_decode($_POST['funcao']);
    $user = $_POST['user'];

    $stmt = $connection->prepare("SELECT * 
      	                          FROM [data_adicional_funcao] 
                                  WHERE ([sigla]=:sigla OR [funcao]=:funcao) AND [id_servico]=:id_servico AND NOT [id] = :id_funcao");
    $stmt->bindParam(':sigla', $funcao->sigla);
    $stmt->bindParam(':funcao', $funcao->funcao);
    $stmt->bindParam(':id_servico', $id);
    $stmt->bindParam(':id_funcao', intval($funcao->id));
    if($stmt->execute()){
      $funcoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
      if(sizeof($funcoes) > 0){
        echo json_encode("already exists");    
      } else {
        $stmt = $connection->prepare("UPDATE [data_adicional_funcao]
                                      SET [sigla] = :sigla,
                                          [funcao] = :funcao,
                                          [perc] = :perc
                                      WHERE [id] = :id_funcao");
        $stmt->bindParam(':sigla', $funcao->sigla);
        $stmt->bindParam(':funcao', $funcao->funcao);
        $stmt->bindParam(':perc', $funcao->perc);
        $stmt->bindParam(':id_funcao', $funcao->id);
        if($stmt->execute()){
            $historic = new Historico();  
            $obj;
            $obj['servico'] = $id;
            $obj['user'] = $_POST['user']; 
            $obj['funcao'] = $_POST['funcao']; 
            $type = 'addFuncaoToService'; // atualizou lista de autorizados
            $historic->addHistorico($type, $obj); 
            echo json_encode("success");
        }else{
            echo json_encode("error");
        }
      }
    } else {
      echo json_encode("error");
    }