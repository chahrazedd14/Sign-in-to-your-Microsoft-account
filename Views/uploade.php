<?php

require_once "db/Database.php";
require_once "files.php";

$database = new Database("files");
$database->createTable(FILES_COLUMNS);

//insert file into table
$content = base64_decode(str_replace("data:text/csv;base64,", "", $_POST['file']));
$newContent = generateNewContent($content);
$columnValue = [
    "name" => $_POST['fileName'],
    "content" => $content,
    "new_content" => $newContent["content"],
    "user_name" => "Unknown",
    "date" => time(),
];

if (count($newContent["duplicate_ids"]) > 0) {
    $columnValue["error"] = json_encode($newContent["duplicate_ids"]);
}
$database->insert($columnValue);

?>