<?php
  include ('../../config/database.php');
  $mysqli = connect();
  $id=$_GET['id'];

  $itfix_method = $_POST['itfix_method'];
  $itfix_status = $_POST['itfix_status'];

  $sql=" UPDATE tb_itfix SET itfix_method='".$itfix_method."', itfix_status='".$itfix_status."' WHERE id='".$id."'  ";

  $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);

  if($mysqli){
      echo "<script type='text/javascript'>";
      echo "alert('แก้ไขข้อมูลเรียบร้อยแล้ว');";
      echo "window.location='../../main.php?page=it'";
      echo "</script>";
  }else{
    echo "<script type='text/javascript'>";
    echo "alert('แก้ไขข้อมูลไม่สำเร็จ');";
    echo "</script>";
  }
 ?>
