<?php
if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
  // For PHP 5.3.0 or above
	echo json_encode(array("post"=>print_r($_POST, true), "files"=>print_r($_FILES, true)), JSON_HEX_TAG);
}elseif (version_compare(PHP_VERSION, '5.2.0', '>=')){
	// For PHP 5.2.0 or above
	echo str_replace(
		array("<", ">"),
		array("\\u003C", "\\u003E"),
		json_encode(array("post"=>print_r($_POST, true), "files"=>print_r($_FILES, true)))
	);
}
?>
