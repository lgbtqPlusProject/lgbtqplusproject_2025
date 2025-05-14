<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$host = 'localhost';
$db = 'lgbtqplusproject';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$query = isset($_GET['query']) ? $conn->real_escape_string($_GET['query']) : '';

if (!$query) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT name, years_relevant, location, description
        FROM historical_figures_events
        WHERE name LIKE '%$query%'
           OR years_relevant LIKE '%$query%'
           OR location LIKE '%$query%'
           OR description LIKE '%$query%'";

$result = $conn->query($sql);

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);
$conn->close();
