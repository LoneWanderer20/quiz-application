
<?php
$val1 = @$_GET["val1"];
$val2 = @$_GET["val2"];
	
if(isset($val1) && isset($val2)) {
    $sql = "SELECT question, answer FROM quiz_app_table WHERE module = '".$val1."' AND question_number = '".$val2."'";
    $servername = "localhost";
    $username = "root";
    $dbName = "user_database";	
    $connection = mysqli_connect($servername, $username, "", $dbName);
	
    if($connection === false) {
        die("ERROR: connection attempt failed " . mysqli_connect_error());
    } 
	
    $query = mysqli_query($connection, $sql) or die(mysqli_error($connection));
	
    $responseArray = mysqli_fetch_all($query, MYSQLI_NUM);
	
    $queryResponse = json_encode($responseArray);
		
    if(isset($queryResponse)) {
        echo $queryResponse;
    } 
    mysqli_free_result($query);
	
    mysqli_close($connection);	
} 
?>