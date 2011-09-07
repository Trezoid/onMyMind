<?php
$args = "".$_SERVER['REQUEST_URI'];
$splitArgs = explode("?", $args);
$wantReq = $splitArgs[1];
    $extra = $splitArgs[2];
    $more = $splitArgs[3];


    if($wantReq == "getLatestThoughts")
    {
        loadLatestThoughts();
    }
    if($wantReq == "voteUpThought")
    {
        voteUp($extra);
    }
    
    if($wantReq == "voteDownThought")
    {
        voteDown($extra);
    }
    
    if($wantReq == "highestID")
    {
        getHighestID();
    }
    
    if($wantReq == "addThought")
    {
        addThought($extra, $more);
    }
    
    function loadLatestThoughts()
    {
        $connectURL = "SELECT thoughtID, thought, votes FROM thoughts WHERE `votes` >= 0 && (`votes` - (`daysSinceThought` - 10))";
        $connection = dbConnect($connectURL, "true");
			$row = $connection;
		echo $connection;
    }
    
    function addThought($extra, $more)
    {
        $connectURL = "INSERT INTO `onmymind`.`thoughts` (`thoughtID` ,`thought` ,`votes` ,`daysSinceThought`)VALUES ('".$extra."', '".$more."', '0', '0')";
        $error = dbConnect($connectURL, "false");
    }
    
    function getHighestID()
    {
        $connectURL = "SELECT MAX(thoughtID) FROM thoughts";
        $connection = dbConnect($connectURL, "true");
        $row = (int)$connection + 0;
        
		echo $row;
    }
    
    function voteUp($thoughtID)
    {

        $voteURL = "SELECT votes FROM thoughts WHERE thoughtID = ".$thoughtID."";
        $voteCon = dbConnect($voteURL, "true");
        $voteCon = (int)$voteCon + 1;
        $connectURL = " UPDATE `onmymind`.`thoughts` SET `votes` = '".$voteCon."' WHERE `thoughts`.`thoughtID` =".$thoughtID."";
        $error = dbConnect($connectURL, "false");
        echo $error;
    }
    
    function voteDown($thoughtID)
    {
        $voteURL = "SELECT votes FROM thoughts WHERE thoughtID = ".$thoughtID."";
        $voteCon = dbConnect($voteURL, "true");
        $voteCon = (int)$voteCon - 1;
        $connectURL = " UPDATE `onmymind`.`thoughts` SET `votes` = '".$voteCon."' WHERE `thoughts`.`thoughtID` =".$thoughtID."";
        $error = dbConnect($connectURL, "false");
        echo $error;
    }

function dbConnect($query, $return)
{       
    // set database server access variables:
    $host = ;
    $user = ;
    $pass = ;
    $db = ;
    
    // open connection
    $connection = mysql_connect($host, $user, $pass) or die ("Unable to connect!");
    
    // select database
    mysql_select_db($db) or die ("Unable to select database!");
    
    // create query
    // execute query
    $result = mysql_query($query) or die ("Error in query: $query. ".mysql_error());
    
    if($return == "true")
    {
        $table = "";
        while ($row = mysql_fetch_array($result, MYSQL_NUM))
        {  
            $table = $table . $row[0] . "|" . $row[1] . "|" . $row[2] . "?";
        }
    }
     
    // close connection
    mysql_close($connection); 
    return $table;
    
}
	
	
?>



