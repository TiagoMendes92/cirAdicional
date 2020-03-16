<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

// include_once  $_SERVER['DOCUMENT_ROOT'] .'/40_adicional/api/dbclass.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();

    $startDate = $_POST['startDate']; 
    $endDate = $_POST['endDate']; 
    $n_mec = $_POST['n_mec']; 
    $query = "SELECT * FROM [data_adicional_intervenientes] i
              LEFT JOIN [data_adicional_episodio] e 
              ON i.id_episodio = e.id 
              LEFT JOIN [data_adicional_funcao] f
              ON i.id_funcao = f.id 
              WHERE i.id_prof=:nmec
              AND e.estado=4 
              AND e.pago=1 
              AND e.included_in_file=1 
              AND e.dta_cirurgia >= '".$startDate."'  
              AND e.dta_cirurgia <= '".$endDate."'";
    
    $stmt = $connection->prepare($query);
    $stmt->bindParam(':nmec', $n_mec);
    if($stmt->execute()){
      $episodiosParticipados = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $finalEpisodios = [];
      foreach ($episodiosParticipados as $episodio) {
        $finalEpisodio = $episodio;
        $gdh = $episodio['gdh2'] != NULL ? $episodio['gdh2'] : $episodio['gdh1'];
        $stmt = $connection->prepare("SELECT * FROM [data_adicional_gdh] WHERE [id] = ".intval($gdh));
        $stmt->execute();
        $finalGDH = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $finalEpisodio['gdhOBJ'] = $finalGDH[0];
        $finalEpisodios[]=$finalEpisodio;
      }
      echo json_encode($finalEpisodios);
    } else {
      echo json_encode($stmt->errorInfo());
    }