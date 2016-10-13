<?php

class Utility {
	
	public static function escape($value) {
	    /*$return = '';
	    for($i = 0; $i < strlen($value); ++$i) {
	        $char = $value[$i];
	        $ord = ord($char);
	        if($char !== "'" && $char !== "\"" && $char !== '\\' && $ord >= 32 && $ord <= 126)
	            $return .= $char;
	        else
	            $return .= '\\x' . dechex($ord);
	    }
	    return $return;*/
	    return addslashes($value);
	}

	public static function getUrl($url, $params) {	
		if($params != NULL) {
			$url = $url.'?'.http_build_query($params, '', '&');
		}
		$ch = curl_init();   
		curl_setopt($ch, CURLOPT_URL, $url);    
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);    
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);    
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		if(IS_PROXY_NETWORK) {
			curl_setopt($ch, CURLOPT_PROXY, PROXY_HOST);
			curl_setopt($ch, CURLOPT_PROXYPORT, PROXY_PORT); 
			curl_setopt($ch, CURLOPT_PROXYUSERPWD, PROXY_USERPASS);
		} 
		$response = array(
			'result' => curl_exec($ch),	
			'log' => curl_getinfo($ch)
		);  
		curl_close($ch);    
		return $response;
	}

	public static function postUrl($url, $fields) {
		$post_field_string = http_build_query($fields, '', '&');		
		$ch = curl_init();		
		curl_setopt($ch, CURLOPT_URL, $url);	
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);	
		if(IS_PROXY_NETWORK) {
			curl_setopt($ch, CURLOPT_PROXY, PROXY_HOST);
			curl_setopt($ch, CURLOPT_PROXYPORT, PROXY_PORT); 
			curl_setopt($ch, CURLOPT_PROXYUSERPWD, PROXY_USERPASS);
		} 
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);		
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post_field_string);		
		curl_setopt($ch, CURLOPT_POST, true);		
		$response = array(
			'result' => curl_exec($ch),	
			'log' => curl_getinfo($ch)
		);
		curl_close ($ch);		
		return $response;
	}

	public static function mailIt($email, $mailTitle, $mailContent, $mailContentHtml) {
		$mail = new PHPMailer;

        $mail->SMTPDebug = 3;                                   // Enable verbose debug output

        $mail->isSMTP();                                        // Set mailer to use SMTP
        $mail->Host = 'smtp-mail.outlook.com';                  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                                 // Enable SMTP authentication
        $mail->Username = 'devhac.trenzynr@outlook.com';        // SMTP username
        $mail->Password = '******';                        		// SMTP password
        $mail->SMTPSecure = 'tls';                              // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 587;                                      // TCP port to connect to

        $mail->setFrom('devhac.trenzynr@outlook.com', 'Crat');
        $mail->addAddress($email);
        $mail->addReplyTo('devhac.trenzynr@outlook.com', 'Crat');

        $mail->isHTML(true);                                    // Set email format to HTML

        $mail->Subject = $mailTitle;
        $mail->Body    = $mailContentHtml;
        $mail->AltBody = $mailContent;

		$output = array();
		if(!$mail->send()) {
			$output['failure'] = $mail->ErrorInfo;
        } else {
            $output['success'] = $data;
        }

		return $output;
	}

	public static function truncate ($str, $max) {
        $len = strlen($str);
        return ($len > $max) ? substr($str, 0, $max).'...' : substr($str, 0, $len);
    }

}

?>