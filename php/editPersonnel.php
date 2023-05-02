<?php

ini_set('display_errors', 'on');
error_reporting(E_ALL);

header('content-type:application/json; charset=UTF-8');

include('conn.php');

$id=$_POST['id'];
$firstName=$_POST['firstName'];
$lastName=$_POST['lastName'];
$jobTitle=$_POST['jobTitle'];
$email=$_POST['email'];
$departmentID=$_POST['departmentID'];

$query= "UPDATE `personnel` SET `firstName`=?,`lastName`=?,`jobTitle`=?,`email`=?,`departmentID`=? WHERE `id`=?";
$stmt= mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "ssssii", $firstName, $lastName, $jobTitle, $email, $departmentID, $id);


if($stmt){
    $result=mysqli_stmt_execute($stmt);
    if($result){
        $data=[
            'success'=>true,
            'message'=>'Personnel Updated Successfully'
        ];
        echo json_encode($data);
        mysqli_stmt_close($stmt);
        mysqli_close($con);
       
        exit;
    } else{
        $data=[
            'success'=>false,
            'message'=>'Personnel Updation Failed'
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