<?php
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/dbclass.php';
    include_once  $_SERVER['DOCUMENT_ROOT'].'/CirurgiaAdicional-repo/api/appconfig.php';
    $dbclass = new DBClass();
    $connection = $dbclass->getConnection();
    $userPOST =json_decode($_POST['user']);


    $ldap_dn = "uid=".$userPOST->username.",dc=Example,dc=com";
    $ldap_pass = $userPOST->password;
    $ldap_con = ldap_connect("ldap.forumsys.com");
    ldap_set_option($ldap_con, LDAP_OPT_PROTOCOL_VERSION, 3);

    if(@ldap_bind($ldap_con, $ldap_dn, $ldap_pass)){

        $filter ="(uid=".$userPOST->username.")";
        $result = ldap_search($ldap_con, "dc=example,dc=com", $filter) or exit("can't search");
        $entries = ldap_get_entries($ldap_con, $result);
        
        $stmt = $connection->prepare('SELECT [id], [user], [role_id], [servico_id] FROM [login] WHERE [user]=:username');
        $stmt->bindParam(':username', $userPOST->username,  PDO::PARAM_STR, 25);
        if($stmt->execute()){
            $users = $stmt->fetchAll();
            if(sizeOf($users) > 0){
                echo json_encode($users[0]);
            } else {
                $stmt = $connection->prepare('INSERT INTO [login] ([user], [pass], [role_id], [servico_id]) VALUES (:username, :password, :role_id, :servico_id)'); 
                $stmt->bindParam(':username', $userPOST->username);
                $stmt->bindParam(':password', $userPOST->password);
                $stmt->bindParam(':role_id', -1);
                $stmt->bindParam(':servico_id', NULL);
               
                if($stmt->execute()){
                    $retireveUser = intval($connection->lastInsertId());
                    $stmt = $connection->prepare('SELECT [id], [user], [role_id], [servico_id] FROM [login] WHERE [id] = :id'); 
                    $stmt->bindParam(':id', $retireveUser);
                    if($stmt->execute()){
                     $users = $stmt->fetchAll();
                     echo json_encode($users[0]);
                    }
                }else{
                    echo json_encode('error');        
                }
            }
        } else {
            echo json_encode('error');
        }
    } else {
        $stmt = $connection->prepare('SELECT * FROM [login] WHERE [user] = :username');
        $stmt->bindParam(':username',$userPOST->username);
        if($stmt->execute()){
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(sizeOf($users) > 0){
                $user = $users[0];
                if($user['pass'] == $userPOST->password){
                    echo json_encode($user);
                } else {
                    echo json_encode('error_pass');
                }
            } else {
                echo json_encode('no_user');    
            }
        } else {
            echo json_encode('error');
        }
    }



    