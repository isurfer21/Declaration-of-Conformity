<?php

class ListAllTransactions {

    private $query, $responder;

    function __construct () {
        $this->responder = new Responder();
    }

    public function process () {

        $query = "SELECT Id,YourName,MaterialExchanged,ActionPerformed,OtherPersonName,Timestamp FROM Transaction";
        $result = Bridge::query($query, true); 

        if(isset($result['failure'])) {
            $this->responder->failure($result['failure']);
        } else if($result['success']) {
            if ($result['num_rows'] > 0) { 
                array_pop($result['success']);
                $this->responder->success($result['success']);
            } else {
                $this->responder->failure('No records found.');
            }
        }

        return $this->responder->get();
    }
}

?>