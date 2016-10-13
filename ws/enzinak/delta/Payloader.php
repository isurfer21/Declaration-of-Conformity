<?php

class Payloader {
    
    private $responder;

    function __construct () {
        $this->responder = new Responder();
    }

    public function defined ($pkg) {
        if (empty($pkg)) {
            $this->responder.failure("Payload is missing.");
            return $this->responder->get();
        }
        return NULL;
    }

    public function verify ($pkg, $attr) {
        if (gettype($attr) == 'string') {
            $list = explode(', ', $attr);
        } else if (gettype($attr) == 'array') {
            $list = $attr;
        }
        for ($i = 0, $len = count($list); $i < $len; $i++) {
            if ( !property_exists((object) $pkg, $list[$i]) ) {
                $this->responder->failure( Templator::fitIn("'[0]' is missing in payload.", array($list[$i])) );
                return $this->responder->get();
            }
        }
        return NULL;
    }
}

?>