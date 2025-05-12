<?php
$conn = new mysqli('localhost', 'root', '', 'lgbtqplusproject');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$result = $conn->query("SELECT * FROM coming_out_stories");
while ($row = $result->fetch_assoc()) {
    echo "<pre>" . print_r($row, true) . "</pre>";
}
$conn->close();
?>
