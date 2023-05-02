<?php



ini_set("display_errors", "on");
error_reporting(E_ALL);
header('Content-Type:application.json; charset=UTF-8');

include('conn.php');


$locationId = $_POST['locationId'];
$query= 'SELECT COUNT(id) AS deptCount FROM department WHERE locationId = ?';

$stmt = mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, 'i', $locationId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_assoc($result);

$deptCount = $row['deptCount'];

if ($deptCount > 0) {
    $response = array(
        'success' => false,
        'message' => 'This location cannot be deleted because it has associated department records.',
    );
} else {
    $response = array(
        'success' => true,
        'message' => 'This location can be safely deleted.',
    );
}

mysqli_stmt_close($stmt);
mysqli_close($con);

echo json_encode($response);

?>
