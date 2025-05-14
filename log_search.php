<?php
header('Content-Type: application/json');

if (!isset($_GET['query'])) {
    echo json_encode(['success' => false, 'error' => 'No query provided']);
    exit;
}

$searchQuery = $_GET['query'];

// Connect to your local database
$host = 'localhost';
$db = 'lgbtqplusproject';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

// Prepare statement to prevent SQL injection
$stmt = $conn->prepare("INSERT INTO search_logs (query, timestamp) VALUES (?, NOW())");
$stmt->bind_param("s", $searchQuery);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
