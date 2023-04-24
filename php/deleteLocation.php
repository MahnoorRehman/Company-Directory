<?php

ini_set("display errors", "on");
error_reporting(E_ALL);
header('Content-Type:application.json; charset=UTF-8');

include('conn.php');
$query="DELETE FROM `location` WHERE `id`=?";

$stmt= mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "i", $_REQUEST['id']);
if($stmt){
    mysqli_stmt_execute($stmt);
    if(mysqli_affected_rows($con)>0){
        $data=[
            'success'=>true,
            'message'=>'Location Deleted successfully'
        ];
        mysqli_stmt_close($stmt);
        mysqli_close($con);   
        echo json_encode($data);
        exit;
    } else{
        $data=[
            'success'=>false,
            'message'=>'Location Deleting Failed'
        ];
        mysqli_stmt_close($stmt);
        mysqli_close($con);   
        echo json_encode($data);
        exit;
    } 
    
} else{
    $data=[
        'success'=>false,
        'message'=>'Please Fill all Fields'
    ];
    echo json_encode($data);
}




?>