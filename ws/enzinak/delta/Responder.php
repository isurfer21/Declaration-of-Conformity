<?php

class Responder {
    
    private $o = array(
    		'status' => NULL,
    		'response' => NULL
    	);
    
    private function assign($key, $val) {
        $this->o[$key] = $val;
    }

    public function set ($status, $response) {
        $this->assign('status', $status);
        $this->assign('response', $response);
    }

    public function get () {
        return $this->o;
    }

    public function success ($response) {
        $this->set(true, $response);
    }

    public function failure ($response) {
        $this->set(false, $response);
    }
}

?>