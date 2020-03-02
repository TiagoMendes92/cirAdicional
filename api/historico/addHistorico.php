<?php
    include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'dbclass.php';

    class Historico {
        public function addHistorico( $type, $info ){
            $dbclass = new DBClass();
            $connection = $dbclass->getConnection();
            $date = date('Y-m-d H:i:s');
            $infoF = json_encode($info);
            $stmt = $connection->prepare("INSERT INTO [data_adicional_historic]([date], [tipo], [info]) VALUES (:dataa, :tipo, :info)");
            $stmt->bindParam(':dataa', $date);
            $stmt->bindParam(':tipo', $type);
            $stmt->bindParam(':info', $infoF);
            $stmt->execute();
        }
    }