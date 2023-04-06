<?php


ini_set("display_errors","on");
error_reporting(E_ALL);

header('content-type: application/json; charset=UTF=8');

include('conn.php');


$query='SELECT p.firstName, p.lastName, p.jobTitle, p.email, d.name as department, l.name as location 
        from personnel p LEFT JOIN department d ON (d.Id=p.departmentId)
        LEFT JOIN location l ON(l.ID=d.locationID) 
        ORDER BY p.lastName, p.firstName, d.name, l.name';


$stmt= mysqli_prepare($con, $query);
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
} 



?>