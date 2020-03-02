<?php

include_once $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';

class DBClass {

    // private $host = "localhost";
    // private $username = "root";
    // private $password = "";
    // private $database = "cirugia_adicional";
    

    private $server = "LAPTOP-CDDKN3E8";
    private $username = "sa";
    private $password = "1234";
    private $database = "cirurgia_adicional";
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
}

include_once $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/historico/addHistorico.php';
?>