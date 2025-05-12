<?php
// Allow CORS for local testing
header('Access-Control-Allow-Origin: *'); // or use 'http://localhost:8000' for tighter control
header('Content-Type: application/json');

// Check if the 'query' parameter exists
if (!isset($_GET['query']) || empty(trim($_GET['query']))) {
    echo json_encode(['error' => 'No query provided.']);
    exit;
}

// Sanitize the input
$query = trim($_GET['query']);

// Database connection details
$host = 'localhost';
$db   = 'lgbtqplusproject';
$user = 'root';
$pass = '';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Prepare and execute insert query to log the search
$stmt = $conn->prepare("INSERT INTO archive_search_log (query, search_time) VALUES (?, NOW())");
$stmt->bind_param("s", $query);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Search logged successfully.']);
} else {
    echo json_encode(['error' => 'Failed to log search.']);
}

$stmt->close();
$conn->close();
?>
