<?php
/**
 * @filename Bridge.php
 * @author Abhishek Kumar
**/

class Bridge 
{
	public static function query($iQuery, $iReturn)
	{
		$output = array();
		
		if($connection = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_SCHEMA)) {
			if($result = mysqli_query($connection, $iQuery)) {
				if($iReturn) {
					$output['num_rows'] = mysqli_num_rows($result);
					while ($data[] = mysqli_fetch_array($result, MYSQL_ASSOC));
					mysqli_free_result($result);
					$output['success'] = $data;
				} else {
					$output['affected_rows'] = mysqli_affected_rows($connection);
					$output['insert_id'] = mysqli_insert_id($connection);
					$output['success'] = $result;
				}
				mysqli_close($connection);    
			} else {
				$output['failure'] = mysqli_error($connection);  
			}
		} else {
			$output['failure'] = mysqli_error($connection);
		}
		return $output;
	}
}

?>