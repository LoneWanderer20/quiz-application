<?php
$name;
$password;
$response;
	
if(isset($_POST["username"])) {
    $name = testInput($_POST["username"]);
}
if(isset($_POST["password"])) {
    $password = testInput($_POST["password"]);
}

if(isset($name) && isset($password)) {
	
	if(empty($_POST["username"])) {
		$response = "1";
	} else {
		if(!preg_match("/^[a-zA-Z ]*$/", $name)) {
			$response = "2";
		}
	}
	
	if(empty($_POST["password"])) {
		$response = "3";
	} else {
		if(strlen($_POST["password"]) < 8) {
			$response = "4";
		}
		if(!preg_match("#[0-9]+#", $password)) {
			$response = "4";
		}
		if(!preg_match("#[A-Z]+#", $password)) {
			$response = "4";
		}
		if(!preg_match("#[a-z]+#", $password)) {
			$response = "4";
		}
	}	
}

function testInput($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}

if(isset($name) && isset($password)) {

    $servername = "localhost";
    $username = "root";
    $dbName = "user_database";
    $connection = mysqli_connect($servername, $username, "", $dbName);	
		
    $nameQuery = mysqli_query($connection, "SELECT * FROM user_info WHERE username='".$name."'");
    $nameCount = mysqli_num_rows($nameQuery);
    $passwordQuery = mysqli_query($connection, "SELECT * FROM user_info WHERE password='".$password."'");
    $passwordCount = mysqli_num_rows($passwordQuery);
    if($nameCount === 0) {
	    $response = "5";
    } else if($passwordCount === 0) {
	    $response = "6";
    } else {
	    $activatedQuery = mysqli_query($connection, "SELECT * FROM user_info WHERE username='".$name."' AND password='".$password."' AND activated='0' ");
		$activatedCount = mysqli_num_rows($activatedQuery);
	    if($activatedCount > 0) {
			$sql = "SELECT * FROM quiz_user_table WHERE username='".$name."'";
			if($result = mysqli_query($connection, $sql)) {
			    $row = mysqli_fetch_row($result);
			    $response = json_encode($row);
			}
	    } else {
			$response = "7";
	    }	
	    mysqli_close($connection);
    }
}

echo $response;

?>