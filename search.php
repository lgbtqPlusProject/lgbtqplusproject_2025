<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database credentials
$host = "localhost";  // or 127.0.0.1 if needed
$user = "root";
$password = "";
$database = "lgbtqplusproject";

// Connect to MySQL
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get query parameter
$query = isset($_GET['query']) ? $conn->real_escape_string($_GET['query']) : '';

if (empty($query)) {
    echo json_encode(["error" => "No search query provided"]);
    exit();
}

// Build SQL query
$sql = "SELECT * FROM historical_figures_events WHERE name LIKE ? OR description LIKE ? OR location LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%{$query}%";
$stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);

$stmt->execute();
$result = $stmt->get_result();

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode($rows);

$stmt->close();
$conn->close();
?>

