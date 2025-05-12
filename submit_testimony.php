<?php
// Allow CORS for specified domains
$allowed_origins = [
    'https://www.lgbtqplusproject.org',
    'https://lgbtqplusproject.org'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    header("Access-Control-Allow-Origin: https://www.lgbtqplusproject.org");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Redirect to thank you page if the request is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Database connection
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "lgbtqplusproject";

    // Sanitize form inputs
    $name     = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email    = htmlspecialchars(trim($_POST['email'] ?? ''));
    $location = htmlspecialchars(trim($_POST['location'] ?? ''));
    $story    = htmlspecialchars(trim($_POST['story'] ?? ''));

    // Basic validation
    if (empty($name) || empty($email) || empty($location) || empty($story)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please fill in all required fields.'
        ]);
        exit();
    }

    // Connect to DB
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed.'
        ]);
        exit();
    }

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO coming_out_stories (name, email, location, story) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $location, $story);

    if ($stmt->execute()) {
        // Redirect to thank you page
        header("Location: thank_you.html");
        exit();
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $stmt->error
        ]);
    }

    // Clean up
    $stmt->close();
    $conn->close();
} else {
    http_response_code(405); // Method not allowed
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit();
}
?>
