<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
   
    // $file = fopen('assistentes.txt', 'r');
    // $medicos = [];
    // while (($line = fgetcsv($file)) !== FALSE) {
    //     $lineArray = explode("-",$line[0]);
    //     $medico = array( 
    //         'n_mec' => $lineArray[0],
    //         'nome' => $lineArray[1],
    //         'categoria' => 'assistente'
    //     );
    //     $medicos[]= $medico;
    // }
    // fclose($file);
    // foreach ($medicos as $medico) {
    //     $stmt = $connection->prepare('INSERT INTO data_adicional_prof (n_mec, nome, categoria) VALUES (:n_mec, :nome, :categoria)');
    //     $stmt->bindParam(':n_mec', $medico['n_mec'],  PDO::PARAM_STR, 55);
    //     $stmt->bindParam(':nome', $medico['nome'],  PDO::PARAM_STR, 555);
    //     $stmt->bindParam(':categoria', $medico['categoria'],  PDO::PARAM_STR, 255);
    //     // $stmt->execute();
    // }

    $listaFuncoesPlaceholder = [
        ["sigla" => 'IP', "nome" => 'INSTRUMENTISTA PRINCIPAL', "perc"=> 45, "equipa" =>'EC'],
        ["sigla" => 'IA', "nome" => 'INSTRUMENTISTA AJUDANTE', "perc"=> 10, "equipa" =>'EC'],
        ["sigla" => 'AP', "nome" => 'ANESTESISTA PRINCIPAL', "perc"=> 25, "equipa" =>'EC'],
        ["sigla" => 'AA', "nome" => 'ANESTESISTA AJUDANTE', "perc"=> 7.5, "equipa" =>'EC'],
        ["sigla" => 'CP', "nome" => 'CIRCULANTE PRINCIPAL', "perc"=> 5, "equipa" =>'EC'],
        ["sigla" => 'CA', "nome" => 'CIRCULANTE AJUDANTE', "perc"=> 2.5, "equipa" =>'EC'],
    ];

    $stmt = $connection->prepare('SELECT id, servico FROM [data_adicional_servico]');
    $stmt->execute();
    $servicos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($servicos as $servico) {
        foreach ($listaFuncoesPlaceholder as $funcao) {
            $stmt = $connection->prepare('INSERT INTO [data_adicional_funcao] (sigla, funcao, perc, equipa, id_servico) VALUES (:sigla, :funcao, :perc, :equipa, :id_servico)');
            $stmt->bindParam(':sigla', $funcao['sigla']);
            $stmt->bindParam(':funcao', $funcao['nome']);
            $stmt->bindParam(':perc', $funcao['perc']);
            $stmt->bindParam(':equipa', $funcao['equipa']);
            $stmt->bindParam(':id_servico', $servico['id']);
            // if($stmt->execute()){
            //     echo "success <br>";
            // } else {
            //     echo  var_dump($stmt->errorInfo()) . "<br>";
            // }
            
        }
    }