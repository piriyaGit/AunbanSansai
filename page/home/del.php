<?php
  error_reporting(0);
  include ("../../config/database.php");
  $mysqli = connect();
  $id = $_GET['id'];

  $sql="DELETE FROM tb_home WHERE id='".$id."'";

  $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

  if($mysqli){
      echo "<script type='text/javascript'>";
      echo "alert('แก้ไขข้อมูลเรียบร้อยแล้ว');";
      // echo "window.location='../../main.php?page=home'";
      echo "window.location.href='http://localhost/anubansansai/main.php?page=home'";
      echo "</script>";
  }else{
    echo "<script type='text/javascript'>";
    echo "alert('แก้ไขข้อมูลไม่สำเร็จ');";
    echo "</script>";
  }
 ?>
