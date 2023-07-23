<?php

session_start();

echo file_get_contents("../../user_tfidf_files/".$_SESSION["teacher_account"].".txt");

?>