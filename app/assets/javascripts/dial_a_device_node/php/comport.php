<?php

include "php_serial.class.php";
header ('Content-type: text/json');

header ('Pragma: no-cache');
header ('Cache-Control: max-age=0');

$ser_port = "/dev/ttyUSB0";
if (array_key_exists("port", $_GET)) $ser_port = $_GET["port"];

$ser_baud = "9600";
if (array_key_exists("baudrate", $_GET)) $ser_baud = $_GET["baudrate"];

$ser_parity = "none";
if (array_key_exists("parity", $_GET)) $ser_parity = $_GET["parity"];

$ser_stopbits = "1";
if (array_key_exists("stopbits", $_GET)) $ser_stopbits = $_GET["stopbits"];

$ser_readcount = "128";
if (array_key_exists("readcount", $_GET)) $ser_readcount = $_GET["readcount"];

$ser_request = "pP";
if (array_key_exists("request", $_GET)) $ser_request = $_GET["request"];


$serial = new phpSerial;
$serial->deviceSet($ser_port);
$serial->confBaudRate($ser_baud);
$serial->confParity($ser_parity);
$serial->confCharacterLength(8);
$serial->confStopBits($ser_stopbits);
$serial->deviceOpen();

$serial->sendMessage($ser_request . chr(13));
echo "{";
echo "\"request\":\"" . $ser_request . "\", ";
echo "\"port\":\"" . $ser_port . "\", ";
echo "\"baudrate\":\"" . $ser_baud . "\", ";
echo "\"parity\":\"" . $ser_parity . "\", ";
echo "\"stopbits\":\"" . $ser_stopbits . "\", ";
echo "\"response\":\"";
$res = $serial->readPort($ser_readcount);
$res = str_replace (chr(13), "", $res);
echo $res;
echo "\"}";
$serial->deviceClose();
?>
