<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $episodios = json_decode($_POST['episodios']);
    $user = $_POST['user'];
    $ids_episodios = [];
    $file_string = "";
    $serviceName = "";
    $data = $_POST['data'];
    foreach ($episodios as $episodio) {
      $ids_episodios[]= intval($episodio->id);
      foreach ($episodio->intervenientes as $interveniente) {
        $file_string.= $interveniente->n_mec."|".$interveniente->valueToReceive."|508|HUC|".$episodio->num_processo."|".$episodio->dta_cirurgia."\n";
      }
      $serviceName = $episodio->serviceName;
    }
    $serviceName = preg_replace('/\s+/', '', $serviceName);
    $data = preg_replace('/\s+/', '', $data);
    $file = fopen('../files/Adicional_'.$serviceName.'_'.$data.'.txt', "w");
    fwrite($file, $file_string);
    fclose($file);
    $episodio_ids = implode(",",$ids_episodios);
    $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [included_in_file]=1, [estado]=4 WHERE [id] IN ('.$episodio_ids.')');
    if($stmt->execute()){
      $historic = new Historico();
      $type = 'generatedFile';
      $obj;
      $obj['episodios'] = $ids_episodios;
      $obj['user'] = 'Recursos Humanos';
      $historic->addHistorico($type, $obj);
      $path = 'Adicional_'.$serviceName.'_'.$data.'.txt';
      echo json_encode($path);
   } else {
    echo json_encode('error');
   }