<?php

class Templator {
    
    public static function fitIn ($template, $arglist) {
        $output = $template;
        for ($i = 0, $len = count($arglist); $i < $len; $i++) {
            $tag = "[" . $i . "]";
            $output = str_replace($tag, $arglist[$i], $output);
        }
        return $output;
    }

    public static function fixIn ($template, $hashtable) {
        $output = $template;
        foreach ($hashtable as $key => $value) {
            $tag = "[" . $key . "]";
            $output = str_replace($tag, $value, $output);
        }
        return $output;
    }

}

?>