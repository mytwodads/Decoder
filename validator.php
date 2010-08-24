<?php 

//error_reporting(E_ALL ^ E_NOTICE); 
//ini_set('display_errors', 1);

require "functions.php";
require "offset.php";

$scriptName = $_SERVER['PHP_SELF']; 
$hashtagName = "h";
$hashtagValue = $_GET[$hashtagName];

$hashKey = arrayze($offset); //turns the word of the day into an offset array
$hashtag = arrayze($hashtagValue); //turns the inputted hashtag into an ascii character code array

for ($i = 0; $i < count($hashtag); $i++) { //applies offset and encrypt function to the hashtag array
	$encryptor = $functions[$hashKey[$i%count($hashKey)]];
	$hashtag[$i] = ($hashtag[$i] + $encryptor)%96 + 32;
}
echo(reString($hashtag));

//UTILITY FUNCTIONS

//Takes a string and breaks it into an array of ascii decimal character codes
function arrayze($aString) {
	$textArray = str_split($aString);
	for ($i = 0; $i < count($textArray); $i++) {
		$textArray[$i] = ord($textArray[$i]);
	}
	return $textArray;
}

//Takes an array of ascii decimal character codes and returns a string
function reString($anArray) {
	for ($i = 0; $i < count($anArray); $i++) {
		$anArray[$i] = chr($anArray[$i]);
	}
	$reStrung = implode($anArray);
	return $reStrung;
}

?>
