<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';


    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $list = json_decode($_POST['list']);
    $user = $_POST['user'];
    $date = date('Y-m-d H:i:s');
    $sql = 'SELECT * FROM [data_adicional_episodio] WHERE [id] IN ('.implode(",",$list).')';
    $stmt = $connection->prepare($sql);
    if($stmt->execute()){   
        $episodios = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $ids_cirInsegura = [];    
        foreach ($episodios as $episodio) {
            if($episodio['cir_segura'] == "0"){
                $ids_cirInsegura[]= $episodio['id'];
            }
        }   
        if(sizeof($ids_cirInsegura) >0 ){
            $ids_cirInseguraString = implode(",",$ids_cirInsegura);
            $sql = 'UPDATE [data_adicional_episodio] SET [cir_segura]=1 WHERE [id] IN ('.$ids_cirInseguraString.')';
            $stmt = $connection->prepare($sql);
            if($stmt->execute()){  
                foreach ($ids_cirInsegura as $id_episodio) {
                    $historic = new Historico();  
                    $type = 'marcadaCirurgiaSegura';
                    $obj;
                    $obj['episodio'] = $id_episodio;
                    $obj['user'] = $user;
                    $historic->addHistorico($type, $obj); 
                }
            } else {
                echo json_encode("erro");
            }

        }
        
        $stmt = $connection->prepare('UPDATE [data_adicional_episodio] SET [estado]=1, [data_estado]=:dataa WHERE [id] IN ('.implode(",",$list).')');
        $stmt->bindParam(':dataa', $date);
        if($stmt->execute()){   
            $historic = new Historico();  
            $type = 'valitadePendenteSecretariado';
            $obj;
            $obj['episodios'] = $list;
            $obj['user'] = $user;
            $historic->addHistorico($type, $obj);    
            echo json_encode('success');
        }else{
            echo json_encode('error 2');
        }              
       
    }


    