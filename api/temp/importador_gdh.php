<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();

    $file = fopen('Anexo-III-Final.csv', 'r');
    $gdhs = [];
    while (($line = fgetcsv($file)) !== FALSE) {
      $line = array_map("utf8_encode", $line);
      if($line[2] == 1){
        $gdh = [
          'desc' => $line[1],
          'gdh' => $line[0],
          'perc' => 45.00,
          'v_uni' => $line[5],
          'cod_gdh' => $line[0]."I",
          'cod_portaria' => '12345'
        ];
        $gdhs[] = $gdh;
        if($line[15]!= '-'){
          $gdh = [
            'desc' => $line[1],
            'gdh' => $line[0],
            'perc' => 45.00,
            'v_uni' => $line[15],
            'cod_gdh' => $line[0]."A",
            'cod_portaria' => '12345'
          ];
          $gdhs[] = $gdh;
        }
      }
    }
    fclose($file);

    // foreach ($gdhs as $gdh) {
    //   $stmt = $connection->prepare('INSERT INTO [dbo].[data_adicional_gdh] ([desc], [gdh], [perc], [v_uni], [cod_gdh], [cod_portaria])
    //                                                                 VALUES ( :descr, :gdh, :perc, :v_uni, :cod_gdh, :cod_portaria)');
    //   $stmt->bindParam(':descr', $gdh['desc']);
    //   $stmt->bindParam(':gdh', $gdh['gdh']);
    //   $stmt->bindParam(':perc', $gdh['perc']);
    //   $stmt->bindParam(':v_uni', $gdh['v_uni']);
    //   $stmt->bindParam(':cod_gdh', $gdh['cod_gdh']);
    //   $stmt->bindParam(':cod_portaria', $gdh['cod_portaria']);
      
    //   if($stmt->execute()){
    //     echo "meti";
    //   } else {
    //     echo json_encode($stmt->errorInfo()) . "<br><br>";
    //   }
      
    // }