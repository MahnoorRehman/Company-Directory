<?php


ini_set("display_errors", "on");
error_reporting(E_ALL);
header('Content-Type:application.json; charset=UTF-8');

include('conn.php');

$deptId = $_POST['deptId'];
$query='SELECT COUNT(id) AS personnelCount FROM personnel WHERE departmentId = ?';
$stmt = mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, 'i', $deptId);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_assoc($result);

$personnelCount = $row['personnelCount'];

if ($personnelCount > 0) {
    $response = array(
        'success' => false,
        'message' => 'This department cannot be deleted because it has associated personnel records.',
    );
} else {
    $response = array(
        'success' => true,
        'message' => 'This department can be safely deleted.',
    );
}

mysqli_stmt_close($stmt);
mysqli_close($con);

echo json_encode($response);
?>
