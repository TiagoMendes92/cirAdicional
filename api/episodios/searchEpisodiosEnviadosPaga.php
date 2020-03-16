<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $connection_GestRH_dados = $dbclass->getConnectionGestRH_dados();

    $estadosPOST = json_decode($_POST['estados']);
    $query = 'SELECT * FROM [data_adicional_episodio] WHERE [estado] IN ('.implode(',',$estadosPOST).')';
    if(isset($_POST['doente'])){
      $query.= " AND [nome] LIKE '%".$_POST['doente']."%'";
    }
    if(isset($_POST['bloco'])){
      $query.= ' AND [bloco] = '.intval($_POST['bloco']);
    }
    if(isset($_POST['servico'])){
      $query.= ' AND [servico] = '.intval($_POST['servico']);
    }
   if(isset($_POST['gdh'])){
      $query.= ' AND ( [gdh1]=' . intval($_POST['gdh']) . ' OR [gdh2]=' . intval($_POST['gdh']) . ')';
   }
   if(isset($_POST['dataCirurgiaInicio'])){
    $query.= " AND [dta_cirurgia] >= '".$_POST['dataCirurgiaInicio']."'";
   }
   if(isset($_POST['dataCirurgiaFim'])){
    $query.= " AND [dta_cirurgia] <= '".$_POST['dataCirurgiaFim']."'";
   }
   if(isset($_POST['dataEnvioInicio'])){
    $query.= " AND [estado]=2 AND [data_estado] >= '".$_POST['dataEnvioInicio']."'";
   }
   if(isset($_POST['dataEnvioFim'])){
    $query.= " AND [estado]=2 AND [data_estado] <= '".$_POST['dataEnvioFim']."'";
   }
   

    $stmt = $connection->prepare($query);
    if($stmt->execute()){
        $episodios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $finalEpisodios = [];
        foreach ($episodios as $episodio) {
            $diagnosticosQuery =  $connection->prepare('SELECT * FROM [data_adicional_episodio_diagnosticos] e LEFT JOIN [data_adicional_diagnosticos] d on e.[id_diagnostico] = d.[id] WHERE e.[id_episodio]='.$episodio['id']);
            $diagnosticosQuery->execute();
            $diagnosticos = $diagnosticosQuery->fetchAll(PDO::FETCH_ASSOC);
            $intervencoesQuery =  $connection->prepare('SELECT * FROM [data_adicional_episodio_intervencoes] e LEFT JOIN [data_adicional_intervencoes] d on e.[id_intervencoes] = d.[id] WHERE e.[id_episodio]='.$episodio['id']);
            $intervencoesQuery->execute();
            $intervencoes = $intervencoesQuery->fetchAll(PDO::FETCH_ASSOC);
            $intervenientesQuery =  $connection->prepare('SELECT * FROM [data_adicional_intervenientes] i LEFT JOIN [data_adicional_prof] p on i.[id_prof] = p.[n_mec] WHERE i.[id_episodio]='.$episodio['id']);
            $intervenientesQuery->execute();
            $intervenientes = $intervenientesQuery->fetchAll(PDO::FETCH_ASSOC);
            $n_mecs = "";
            for ($i=0; $i <sizeof($intervenientes); $i++) { 
              $intervenientes[$i]['n_mec'] = $intervenientes[$i]['id_prof'];
              $n_mecs .= $intervenientes[$i]['n_mec'].",";
            }
            $n_mecs = substr($n_mecs, 0, -1);
            $sql = "SELECT t1.NumMec AS n_mec, t2.DESCRICAO AS categoria, t3.NOME as nome
                    FROM dad_dat_Efectivos_Cat t1
                    LEFT JOIN dad_Categorias t2 ON t2.TIPOPPL = t1.GrpProf
                                AND t2.CARRPROF = - 1
                    LEFT JOIN dad_DadosPessoais t3 ON t1.NumMec = t3.NMEC
                    WHERE t1.DataFim IS NULL
                        AND t1.GrpProf IN (1, 3, 5, 11, 13, 52, 53)
                        AND t3.NOME IS NOT NULL
                        AND t1.NumMec IN (".$n_mecs.")
                        ORDER BY t2.DESCRICAO DESC";
            $intervenientesInfoQuery = $connection_GestRH_dados->prepare($sql);
            $intervenientesInfoQuery->execute();
            $intervenientesInfo = $intervenientesInfoQuery->fetchAll(PDO::FETCH_ASSOC);
            $finalIntervenientes = [];
            foreach ($intervenientes as $interveniente) {
                $finalInterveniente = $interveniente;
                for ($i=0; $i <sizeof($intervenientesInfo) ; $i++) { 
                  if($intervenientesInfo[$i]['n_mec'] == $finalInterveniente['n_mec']){
                      $finalInterveniente['nome'] = $intervenientesInfo[$i]['nome'];
                      $finalInterveniente['categoria'] = $intervenientesInfo[$i]['categoria'];
                      $id_funcao = intval($interveniente['id_funcao']);
                      $stmt = $connection->prepare('SELECT * FROM [data_adicional_funcao] WHERE [id]=:id_funcao');
                      $stmt->bindParam(':id_funcao', $id_funcao);
                      $stmt->execute();
                      $funcoes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                      $funcao = $funcoes[0];
                      $finalInterveniente['funcao'] = $funcao;
                      break;
                  }
              }
                $finalIntervenientes[]=$finalInterveniente;
            }
            $tempEpisodio = $episodio;
            $tempEpisodio['diagnosticos'] = $diagnosticos;
            $tempEpisodio['intervencoes'] = $intervencoes;
            $tempEpisodio['intervenientes'] = $finalIntervenientes;
            $finalEpisodios[]= $tempEpisodio;
        }
        if(isset($_POST['intervinienteMEC'])){
          $tempEventos = [];
          foreach ($finalEpisodios as $episodio) {
            $exists = false;
            foreach ($episodio['intervenientes'] as $interveniente) {
              if (strpos($interveniente['n_mec'], $_POST['intervinienteMEC']) !== false) {
                $exists = true;
                break;
              }
            }
            if($exists){
              $tempEventos[] = $episodio;
            }
          }
          $finalEpisodios = $tempEventos;
        }
        if(isset($_POST['intervinienteNOME'])){
          $tempEventos = [];
          foreach ($finalEpisodios as $episodio) {
            $exists = false;
            foreach ($episodio['intervenientes'] as $interveniente) {
              if (strpos($interveniente['nome'], $_POST['intervinienteNOME']) !== false) {
                $exists = true;
                break;
              }
            }
            if($exists){
              $tempEventos[] = $episodio;
            }
          }
          $finalEpisodios = $tempEventos;
        }
        if(isset($_POST['agrupamento'])){
          $stmt2 = $connection->prepare("SELECT * FROM [data_adicional_servico]");
          $stmt2->execute();
          $servicos = $stmt2->fetchAll(PDO::FETCH_ASSOC);

          $tempEpisodios = [];
          foreach ($finalEpisodios as $episodio) {
            $servicoEpisodio = $episodio['servico'];
            $agrupamentoEpisodio = "";
            foreach ($servicos as $servico) {
              if(intval($servicoEpisodio) == intval($servico['id'])){
                $agrupamentoEpisodio = $servico['agrupamento'];
              break;
              }
            }
            if($agrupamentoEpisodio == $_POST['agrupamento']){
              $tempEpisodios []= $episodio;
            }
          }

          $finalEpisodios = $tempEpisodios;
        }
        echo json_encode($finalEpisodios);
    } else {
        echo json_encode($stmt->errorInfo());
    }