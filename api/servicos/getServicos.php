<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $stmt = $connection->prepare("SELECT * FROM [data_adicional_servico]");
    if($stmt->execute()){
        $tempServicos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $servicos = [];
        foreach ($tempServicos as $tempServico) {
            $servico = $tempServico;
            $stmt = $connection->prepare("SELECT * FROM [data_adicional_funcao] WHERE [id_servico] = :id");
            $idServico = intval($servico['id']);
            $stmt->bindParam(':id', $idServico,  PDO::PARAM_INT);
            $stmt->execute();
            $lista_funcoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $servico['lista_funcoes'] = $lista_funcoes;
            $servicos[] = $servico;
        }
        echo json_encode($servicos);
    } else {
        echo json_encode($stmt->errorInfo());
    }
    