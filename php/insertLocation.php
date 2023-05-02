<?php
ini_set("display_errors", "on");
error_reporting(E_ALL);

header('content-type: application/json; charset=UTF=8');

include("conn.php");

if(isset($_POST['name']) ){

    $name=$_POST['name'];
    $query= "INSERT INTO `location`( `name`) VALUES (?) ";

    $stmt= mysqli_prepare($con, $query);
    mysqli_stmt_bind_param($stmt, 's', $name );
    if($stmt){
        $result=  mysqli_stmt_execute($stmt);

        if($result){
            $data=[
                'success'=>true,
                'message'=>'Location Added Successfully'
            ];
            echo json_encode($data);
            mysqli_stmt_close($stmt);
            mysqli_close($con);
           
            
        } else{
            $data=[
                'success'=>false,
                'message'=>'Location Adding Failed'
            ];
            echo json_encode($data);
            mysqli_stmt_close($stmt);
            mysqli_close($con);
        }
    }

} else{
    $data=[
        'success'=>false,
        'message'=>'Please Fill all Fields'
    ];
    echo json_encode($data);
}


?>