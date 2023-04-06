<?php


ini_set('display_errors', 'on');
error_reporting(E_ALL);

header('content-type:application/json; charset=UTF=8');


include('conn.php');

$query='SELECT * FROM location';

$stmt= mysqli_prepare($con, $query);
$dataList=[];

if($stmt){
    mysqli_stmt_execute($stmt);
    $result=mysqli_stmt_get_result($stmt);
    if($result===false){
        $data=[
            'success'=> false,
            'message'=> 'No Location Available',
            'data'=>$info
        ];
        mysqli_stmt_close($stmt);
        mysqli_close($con);
        echo json_encode($data);
        exit;

    }else{
        while($row=mysqli_fetch_assoc($result)){
           array_push($dataList, $row);
        }
        $data=[
            'success'=> true,
            'message'=> 'Data Fetch Successful',
            
         ];
         mysqli_stmt_close($stmt);
         mysqli_close($con);
         echo json_encode($dataList);
         exit;
    }
}



?>