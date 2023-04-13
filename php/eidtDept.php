<?php

ini_set('display errors', 'on');
error_reporting(E_ALL);

header('content-type:application/json; charset=UTF-8');

include('conn.php');

$id=$_POST['id'];
$name=$_POST['name'];
$locationID=$_POST['locationID'];

$query= "UPDATE `department` SET `name`=?,`locationID`=? WHERE `id`=?";
$stmt= mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "sii", $name, $locationID,  $id);


if($stmt){
    $result=mysqli_stmt_execute($stmt);


    if($result){
        $data=[
            'success'=>true,
            'message'=>'Department Updated Successfully'
        ];
        echo json_encode($data);
        mysqli_stmt_close($stmt);
        mysqli_close($con);
       
        exit;
    } else{
        $data=[
            'success'=>false,
            'message'=>'Department Updation Failed'
        ];
        echo json_encode($data);
        mysqli_stmt_close($stmt);
        mysqli_close($con);
       
        exit;
    }

}else{
 $data=[
        'success'=>false,
        'message'=>'Please Fill all Fields'
    ];
    echo json_encode($data);
}


?>