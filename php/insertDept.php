<?php



ini_set("display_errors", "on");
error_reporting(E_ALL);

header('content-type: application/json; charset=UTF=8');

include("conn.php");

if(isset($_POST['name']) && isset($_POST['locationID'])){



    $name=$_POST['name'];
    $locationID=$_POST['locationID'];


    $query= "INSERT INTO `department`( `name`, `locationID`) VALUES (?,?) ";

    $stmt= mysqli_prepare($con, $query);
    mysqli_stmt_bind_param($stmt, 'si', $name, $locationID );
    if($stmt){
        $result=  mysqli_stmt_execute($stmt);
       

        if($result){
            $data=[
                'success'=>true,
                'message'=>'Department Added Successfully'
            ];
            echo json_encode($data);
            mysqli_stmt_close($stmt);
            mysqli_close($con);
           
            exit;
        } else{
            $data=[
                'success'=>false,
                'message'=>'Department Adding Failed'
            ];
            echo json_encode($data);
            mysqli_stmt_close($stmt);
            mysqli_close($con);
           
            exit;
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