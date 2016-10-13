<?php
/**
 * @filename config.php
 * @author Abhishek Kumar
**/

define('IS_AT_HOME', false);

define('DB_HOST','127.0.0.1');
define('DB_USER','root');
(IS_AT_HOME) ? define('DB_PASS','987654321') : define('DB_PASS','HCL@kaW8');
define('DB_SCHEMA','doc');

?>