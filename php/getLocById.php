<?php

ini_set('display_errors', 'on');
error_reporting(E_ALL);
header('Content-Type: application/json; charset=UTF-8');

include('conn.php');

$query="SELECT `id`,`name` FROM `location` WHERE `id`=?";

$stmt=mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt,"i", $_REQUEST['id']);
$info=[];
if($stmt){
    mysqli_stmt_execute($stmt);
    $result= mysqli_stmt_get_result($stmt);
    if($result===false){
        $data=[
            'success'=> false,
            'message'=> 'No data Available',
            'data'=>$info
        ];
        mysqli_stmt_close($stmt);
        mysqli_close($con);   
        echo json_encode($data);
        exit;
     
     } else{
         while($row=mysqli_fetch_assoc($result)){
            array_push($info, $row);
         }

         $data=[
            'success'=> true,
            'message'=> 'Data Fetch Successful',
            'data'=>$info
         ];
         mysqli_stmt_close($stmt);
         mysqli_close($con);
         echo json_encode($info);
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