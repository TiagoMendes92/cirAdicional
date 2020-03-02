<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $body = json_decode($_POST['body']);
    $id_episodio = intval($body->episodio);
    $user = $_POST['user'];
    foreach ($body->funcoes as $funcao) {
        $arrayFunc = json_encode($funcao->func);    
        $stmt = $connection->prepare('SELECT * FROM [data_adicional_intervenientes] WHERE [id_episodio]= :id_episodio AND [id_prof]=:id_prof AND [id_funcao]=:id_funcao');
        $stmt->bindParam(':id_episodio', $id_episodio,  PDO::PARAM_INT);
        $stmt->bindParam(':id_prof', $funcao->prof,  PDO::PARAM_INT);
        $stmt->bindParam(':id_funcao', intval($funcao->func->id));
        if($stmt->execute()){
            $exists = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(sizeof($exists) == 0){
                $stmt = $connection->prepare('INSERT INTO data_adicional_intervenientes ([id_episodio], [id_prof], [id_funcao]) VALUES ( :id_episodio, :id_prof, :id_funcao)');
                $stmt->bindParam(':id_episodio', $id_episodio,  PDO::PARAM_INT);
                $stmt->bindParam(':id_prof', $funcao->prof,  PDO::PARAM_INT);
                $stmt->bindParam(':id_funcao', intval($funcao->func->id));
                if(!$stmt->execute()){
                    echo json_encode('error');
                    break;
                }
            }
            if($body->funcoes[sizeof($body->funcoes)-1] == $funcao){          
                $historic = new Historico();  
                $obj = $body;
                $obj->user = $_POST['user'];  
                $type = 'addEquipa';
                $historic->addHistorico($type, $obj);              
                echo json_encode('success');
            }
        }else{
            echo json_encode("error");
            break;
        }
    }
 
    