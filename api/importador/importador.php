<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
   
    $file = fopen('assistentes.txt', 'r');
    $medicos = [];
    while (($line = fgetcsv($file)) !== FALSE) {
        $lineArray = explode("-",$line[0]);
        $medico = array( 
            'n_mec' => $lineArray[0],
            'nome' => $lineArray[1],
            'categoria' => 'assistente'
        );
        $medicos[]= $medico;
    }
    fclose($file);
    foreach ($medicos as $medico) {
        $stmt = $connection->prepare('INSERT INTO data_adicional_prof (n_mec, nome, categoria) VALUES (:n_mec, :nome, :categoria)');
        $stmt->bindParam(':n_mec', $medico['n_mec'],  PDO::PARAM_STR, 55);
        $stmt->bindParam(':nome', $medico['nome'],  PDO::PARAM_STR, 555);
        $stmt->bindParam(':categoria', $medico['categoria'],  PDO::PARAM_STR, 255);
        // $stmt->execute();
    }