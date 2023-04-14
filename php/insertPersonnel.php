<?php

ini_set('display_errors', 'on');
error_reporting(E_ALL);

header('content-type: application/json; charset=UTF=8');


include('conn.php');

if(isset($_POST['firstName']) && isset($_POST['lastName'])  && isset($_POST['jobTitle'])
&& isset($_POST['email']) && isset($_POST['departmentID']) 
) {
    

    $firstName=$_POST['firstName'];
    $lastName=$_POST['lastName'];
    $jobTitle=$_POST['jobTitle'];
    $email=$_POST['email'];
    $departmentID=$_POST['departmentID'];

    $query = "INSERT INTO `personnel`(`firstName`, `lastName`, `jobTitle`, `email`, `departmentID`) VALUES (?, ?, ?, ?, ?)";
    if (!$query) {
        printf("Error: %s\n", mysqli_error($con));
    }
    $stmt= mysqli_prepare($con, $query );
    mysqli_stmt_bind_param($stmt, "ssssi", $firstName, $lastName, $jobTitle, $email, $departmentID);

    if($stmt){
        $result=  mysqli_stmt_execute($stmt);
       

        if($result){
            $data=[
                'success'=>true,
                'message'=>'Personnel Added Successfully'
            ];
            echo json_encode($data);
            mysqli_stmt_close($stmt);
            mysqli_close($con);
           
            exit;
        } else{
            $data=[
                'success'=>false,
                'message'=>'Personnel Adding Failed'
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