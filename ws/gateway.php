<?php
/**
 * @filename service.php
 * @author Abhishek Kumar
**/

include 'config.php';
include 'enzinak/bridge/Bridge.php';

$query = (!isset($_REQUEST['q']))? NULL : $_REQUEST['q'];
$type = (!isset($_REQUEST['t']))? 0 : $_REQUEST['t'];

$output = Bridge::query($query, ($type == 1));

print json_encode($output);
 
?>
