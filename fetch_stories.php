<?php
header('Content-Type: application/json');
set_time_limit(5); // prevent infinite loading

$host = 'localhost';
$username = 'root';
$password = ''; // or 'root' depending on your setup
$dbname = 'lgbtqplusproject';

$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Run the query
$sql = "SELECT name, email, location, story FROM coming_out_stories";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(['error' => 'Query failed: ' . $conn->error]);
    exit;
}

$stories = [];
while ($row = $result->fetch_assoc()) {
    $stories[] = $row;
}

echo json_encode($stories);
$conn->close();
?>
