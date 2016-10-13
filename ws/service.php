<?php
/**
 * @filename service.php
 * @author Abhishek Kumar
**/

include 'config.php';

include 'enzinak/bridge/Bridge.php';

include 'enzinak/delta/Utility.php';
include 'enzinak/delta/Templator.php';
include 'enzinak/delta/Responder.php';
include 'enzinak/delta/Session.php';
include 'enzinak/delta/Payloader.php';

include 'enzinak/modules/AddNewTransaction.php';
include 'enzinak/modules/ListAllTransactions.php';

include 'enzinak/Controller.php';

$controller = new Controller();
print $controller->process($_REQUEST);
 
?>
