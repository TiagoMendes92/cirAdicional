<?php
class DBClass {

    // private $host = "localhost";
    // private $username = "root";
    // private $password = "";
    // private $database = "cirugia_adicional";
    

    private $server = "172.23.2.86,2473";
    // private $server = "LAPTOP-CDDKN3E8";
    private $username = "sa";
    private $password = "innuxhuc";
    // private $password = "1234";

    private $database = "40_ADICIONAL";
    public $connection;

    private $database_GestRH_dados = "GestRH_dados";
    public $connection_GestRH_dados;

    // get the database connection
    
    public function getConnection(){
        $this->connection = null;
        try{
            // $this->connection = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->database, $this->username, $this->password);
            $this->connection = new PDO("sqlsrv:Server=".$this->server.";Database=".$this->database, $this->username, $this->password);
        }catch(PDOException $exception){
            echo "Error: " . $exception->getMessage();
        }
        return $this->connection;
    }


    public function getConnectionGestRH_dados(){
        $this->connection_GestRH_dados = null;
        try{
            $this->connection_GestRH_dados = new PDO("sqlsrv:Server=".$this->server.";Database=".$this->database_GestRH_dados, $this->username, $this->password);
        }catch(PDOException $exception){
            echo "Error: " . $exception->getMessage();
        }
        return $this->connection_GestRH_dados;
    }

    public function getimagesLink(){
        $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR;
        // return $_SERVER['DOCUMENT_ROOT'].'/40_Adicional/api/images/';
    }

    public function getoutputPDF(){
        $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'generatedPDFS' .DIRECTORY_SEPARATOR;
        // return $_SERVER['DOCUMENT_ROOT'].'/40_Adicional/api/generatedPDFS/';
    }
}
include_once  $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'api' . DIRECTORY_SEPARATOR . 'historico' . DIRECTORY_SEPARATOR . 'addHistorico.php';
// include_once $_SERVER['DOCUMENT_ROOT'].'/40_adicional/api/historico/addHistorico.php';
?>