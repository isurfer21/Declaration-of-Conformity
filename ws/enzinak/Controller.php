<?php

class Controller {
    private $request, $callback, $command, $payload, $authkey, $payloader, $session, $responder;

    function __construct () {
        $this->payloader = new Payloader();
        $this->session = new Session();
        $this->responder = new Responder();

        date_default_timezone_set('Asia/Calcutta');
    }

    private function getRequestedProperty ($prop) {
        return (!isset($this->request[$prop])) ? NULL : $this->request[$prop];
    }

    private function getPackagedResponse ($stuff) {
        return (!empty($this->callback)) ? $this->callback.'('.$stuff.')' : $stuff;
    }

    private function getPayloadValidated ($traits=NULL) { 
        if (isset($traits)) {
            $output = $this->payloader->defined($this->payload); 
            if (empty($output)) { 
                $output = $this->payloader->verify($this->payload, $traits); 
                if (empty($output)) {
                    return NULL;
                }
            }
        } else {
            $output = $traits;
        }
        return $output;
    }

    private function getSessionAndPayloadValidated ($traits=NULL) {
        $output = $this->session->valid($this->authkey);
        if (empty($output)) {
            $output = (isset($traits)) ? $this->getPayloadValidated($traits) : $output;
        }
        return $output;
    }

    public function process ($dataObj) {
        $o;
        if (isset($dataObj)) {
            $this->request = $dataObj; //Logger.log(request);
            $this->callback = $this->getRequestedProperty('callback');
            $this->command = $this->getRequestedProperty('cmd');
            $this->payload = json_decode($this->getRequestedProperty('pl'), true);
            $this->authkey = $this->getRequestedProperty('ak');

            switch ($this->command) {
                case 'addNewTransaction':
                    $o = $this->getPayloadValidated('YourName, MaterialExchanged, ActionPerformed, OtherPersonName');
                    if (empty($o)) {
                        $addNewTransaction = new AddNewTransaction();
                        $o = $addNewTransaction->process($this->payload['YourName'], $this->payload['MaterialExchanged'], $this->payload['ActionPerformed'], $this->payload['OtherPersonName']);
                    }
                    break;
                case 'listAllTransactions':
                    $o = $this->getPayloadValidated();
                    if (empty($o)) {
                        $listAllTransactions = new ListAllTransactions();
                        $o = $listAllTransactions->process();
                    }
                    break;
                default:
                    $this->responder->failure('Command is missing.');
                    $o = $this->responder->get();
            }
        } else {
            $this->responder->failure('Parameters are missing.');
            $o = $this->responder->get();
        }

        $material = json_encode(array(
            "command" => (isset($this->command)) ? $this->command : 'undefined',
            "status" => ($o['status']) ? 'success' : 'failure',
            "response" => $o['response']
        ));

        return $this->getPackagedResponse($material);
    }
}

?>