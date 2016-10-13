<?php

class AddNewTransaction {

    private $query, $responder;

    function __construct () {
        $this->responder = new Responder();
    }

    public function process ($YourName, $MaterialExchanged, $ActionPerformed, $OtherPersonName) {

        $query = Templator::fitIn("INSERT INTO Transaction (YourName,MaterialExchanged,ActionPerformed,OtherPersonName,Timestamp) VALUES ('[0]','[1]','[2]','[3]','[4]')", 
            array(
                Utility::escape($YourName), 
                Utility::escape($MaterialExchanged), 
                Utility::escape($ActionPerformed), 
                Utility::escape($OtherPersonName),
                date("Y-m-d H:i:s")
            )
        );

        $result = Bridge::query($query, false);

        if(isset($result['failure'])) {
            $this->responder->failure($result['failure']);
        } else if($result['success']) { 
            if(isset($result['insert_id'])) {
                $this->responder->success('Your entries are successfully recorded.');
            } else {
                $this->responder->failure('Submission failed! Please try again.');
            }
        }

        return $this->responder->get();
    }
}

?>