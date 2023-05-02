<?php

ini_set("display_errors", "on");
error_reporting(E_ALL);
header('Content-Type:application.json; charset=UTF-8');

include('conn.php');
$query="DELETE FROM `department` WHERE `id`=?";

$stmt= mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "i", $_REQUEST['id']);
if($stmt){
    mysqli_stmt_execute($stmt);
    if(mysqli_affected_rows($con)>0){
        $data=[
            'success'=>true,
            'message'=>'Department Deleted successfully'
        ];
        mysqli_stmt_close($stmt);
        mysqli_close($con);   
        echo json_encode($data);
        exit;
    } else{
        $data=[
            'success'=>false,
            'message'=>'Department Deleting Failed'
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