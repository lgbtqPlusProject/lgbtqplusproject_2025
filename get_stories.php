<?php
$host = "localhost";
$user = "root";  // or your GoDaddy MySQL username
$pass = "";      // your password here
$dbname = "lgbtqplusproject";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT name, location, story, savedDateTime FROM coming_out_stories ORDER BY savedDateTime DESC";
$result = $conn->query($sql);

$stories = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $stories[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($stories);
?>
