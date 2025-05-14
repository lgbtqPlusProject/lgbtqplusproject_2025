<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// DB config — update as needed
$host = "localhost";
$dbname = "lgbtqplusproject";
$username = "root";
$password = "";

try {
    // Read raw input and decode JSON
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data || !isset($data['email'])) {
        echo json_encode(["status" => "error", "message" => "No email provided or invalid JSON."]);
        exit;
    }

    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);

    if (!$email) {
        echo json_encode(["status" => "error", "message" => "Invalid email."]);
        exit;
    }

    // Connect to DB
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Save email
    $stmt = $conn->prepare("INSERT IGNORE INTO notify_me_emails (email) VALUES (:email)");
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    echo json_encode(["status" => "success", "message" => "Email recorded."]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

