<?php
ini_set("display_errors", "on");
error_reporting(E_ALL);
header('Content-Type:application/json; charset=UTF-8');

include('conn.php');

$searchTerm = "%" . $_REQUEST["searchTerm"] . "%";

$query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email,
            d.name as department, l.name as location
            FROM personnel p
            LEFT JOIN department d ON (p.departmentID = d.id)
            LEFT JOIN location l ON (d.locationID = l.id)
            WHERE (p.firstName LIKE ? OR p.lastName LIKE ?)";

$stmt = mysqli_prepare($con, $query);
mysqli_stmt_bind_param($stmt, "ss", $searchTerm, $searchTerm);

if ($stmt) {
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if ($result) {
        $data = array();
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($data, $row);
        }
        $response = array(
            'success' => true,
            'message' => 'Data Fetch Successful',
            'data' => $data
        );
    } else {
        $response = array(
            'success' => false,
            'message' => 'No data Available',
            'data' => array()
        );
    }
    mysqli_stmt_close($stmt);
    mysqli_close($con);
    echo json_encode($response);
    exit;
} else {
    $response = array(
        'success' => false,
        'message' => 'An error occurred while executing the query.',
        'data' => array()
    );
    echo json_encode($response);
    exit;
}
?>
