<?php


ini_set("display_errors","on");
error_reporting(E_ALL);

header('content-type: application/json; charset=UTF=8');

include('conn.php');


$query='SELECT p.firstName, p.lastName, p.jobTitle, p.email, d.name as department, l.name as location 
        from personnel p LEFT JOIN department d ON (d.Id=p.departmentId)
        LEFT JOIN location l ON(l.ID=d.locationID) 
        ORDER BY p.lastName, p.firstName, d.name, l.name';

$result=mysqli_query($con, $query);

if($result===false){
  
   mysqli_close($con);
   $info=[];

   echo json_encode($info);

} else{
    $info=[];

    while($row=mysqli_fetch_assoc($result)){
       array_push($info, $row);
    }
    mysqli_close($con);

    echo json_encode($info);
}




?>