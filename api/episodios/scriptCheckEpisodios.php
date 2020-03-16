<?php
 //   include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR .'ciradicional_repo'. DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $stmt = $connection->prepare('SELECT id, servico 
                                  FROM [data_adicional_episodio] 
                                  WHERE [estado] = 0 
                                  AND [data_estado] IS NULL');
    $stmt->execute();
    $episodios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($episodios as $episodio) {
      $stmt = $connection->prepare('SELECT * 
                                    FROM [data_adicional_equipas] e  
                                    LEFT JOIN [data_adicional_sonho_funcoes] sf
                                    ON e.id_funcao_sonho = sf.id
                                    WHERE e.id_episodio = :id');
      $stmt->bindParam(':id', $episodio['id']);
      $stmt->execute();
      $funcoes_sonho = $stmt->fetchAll(PDO::FETCH_ASSOC);
      $stmt = $connection->prepare('SELECT *
                                    FROM [data_adicional_intervenientes] i 
                                    LEFT JOIN [data_adicional_funcao] f
                                    ON i.id_funcao = f.id
                                    WHERE id_episodio = :id');
      $stmt->bindParam(':id', $episodio['id']);
      $stmt->execute();
      $funcoes_cirA = $stmt->fetchAll(PDO::FETCH_ASSOC);
      foreach ($funcoes_sonho as $funcao_sonho) {
        $alreadyExists = false;
        for ($i=0; $i < sizeof($funcoes_cirA); $i++) { 
          $funcao_cirA = $funcoes_cirA[$i];
          if($funcao_sonho['nmec'] == $funcao_cirA['id_prof']){
            $alreadyExists = true;
            break;
          }
        }
        if(!$alreadyExists){
          $stmt = $connection->prepare('SELECT *
                                        FROM [data_adicional_funcao]
                                        WHERE [id_servico] = :id');
          $stmt->bindParam(':id', $episodio['servico']);
          $stmt->execute();
          $funcoes_Servico = $stmt->fetchAll(PDO::FETCH_ASSOC);
          $funcaoExistsOnService = false;
          $funcao_target_cirA = null;
          for ($i=0; $i < sizeof($funcoes_Servico); $i++) { 
            $funcao_Servico = $funcoes_Servico[$i];
            if($funcao_sonho['descricao'] == $funcao_Servico['funcao']){
              $funcaoExistsOnService = true;
              $funcao_target_cirA = $funcao_Servico;
              break;
            }
          }

          if($funcaoExistsOnService){
            $obj = [
              "id_episodio"=>$funcao_sonho['id_episodio'],
              "id_prof"=>$funcao_sonho['nmec'],
              "id_funcao"=>$funcao_target_cirA['id']
            ];
            $stmt = $connection->prepare('INSERT INTO [dbo].[data_adicional_intervenientes]
                                                ([id_episodio]
                                                ,[id_prof]
                                                ,[id_funcao])
                                          VALUES
                                                (:id_episodio
                                                ,:id_prof
                                                ,:id_funcao)');
            $stmt->bindParam(':id_episodio', $obj['id_episodio']);
            $stmt->bindParam(':id_prof', $obj['id_prof']);
            $stmt->bindParam(':id_funcao', $obj['id_funcao']);
            $stmt->execute();
          } else {
            $funcao = [
              "sigla"=> $funcao_sonho['codigo'],
              "funcao"=> $funcao_sonho['descricao'],
              "perc"=> 100,
              "equipa"=> 'EC',
              "id_servico"=> $episodio['servico'],
            ];
            $stmt = $connection->prepare('INSERT INTO [dbo].[data_adicional_funcao]
                                                ([sigla]
                                                ,[funcao]
                                                ,[perc]
                                                ,[equipa]
                                                ,[id_servico])
                                          VALUES
                                                (:sigla
                                                ,:funcao
                                                ,:perc
                                                ,:equipa
                                                ,:id_servico)');

            $stmt->bindParam(':sigla', $funcao['sigla']);
            $stmt->bindParam(':funcao', $funcao['funcao']);
            $stmt->bindParam(':perc', $funcao['perc']);
            $stmt->bindParam(':equipa', $funcao['equipa']);
            $stmt->bindParam(':id_servico', $funcao['id_servico']);
            $stmt->execute();
            $retirevefuncao = intval($connection->lastInsertId());
            $obj = [
              "id_episodio"=>$funcao_sonho['id_episodio'],
              "id_prof"=>$funcao_sonho['nmec'],
              "id_funcao"=>$retirevefuncao
            ];
            $stmt = $connection->prepare('INSERT INTO [dbo].[data_adicional_intervenientes]
                                                ([id_episodio]
                                                ,[id_prof]
                                                ,[id_funcao])
                                          VALUES
                                                (:id_episodio
                                                ,:id_prof
                                                ,:id_funcao)');
            $stmt->bindParam(':id_episodio', $obj['id_episodio']);
            $stmt->bindParam(':id_prof', $obj['id_prof']);
            $stmt->bindParam(':id_funcao', $obj['id_funcao']);
            $stmt->execute();
          }
        }
      }
    }