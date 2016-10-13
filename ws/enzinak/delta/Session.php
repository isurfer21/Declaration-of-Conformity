<?php

class Session {
    private $responder;
    private $duration = 3600000;

    function __construct () {
        $this->responder = new Responder();
    }

    public function create ($email) {
        $timestamp = date("Y-m-d H:i:s");
        return base64_encode( json_encode( array($email, $timestamp) ) );
    }

    public function extract ($authkey) {
        $blob = base64_decode($authkey); 
        return json_decode($blob);
    }

    public function valid ($authkey) {
        if ($authkey != NULL) {
        	$date = new DateTime();
            $now = $date->getTimestamp();
            $key = $this->extract($authkey);
            $session = strtotime($key[1]) + $this->duration;
            if ($session < $now) {
                $this->responder->failure("Session expired!");
                return $this->responder->get();
            }
        } else {
            $this->responder->failure("Invalid session!");
            return $this->responder->get();
        }
        return NULL;
    }
}

?>