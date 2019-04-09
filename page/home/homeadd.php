<?php
    include ('../../config/database.php');
    $mysqli = connect();
    $id=$_GET['id'];
    $home_name = $_POST['home_name'];

    $sql=" UPDATE tb_home
           SET home_name='".$home_name."'
           WHERE id='".$id."'  ";
     $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);

     if ($_FILES['home_pic']['name']!=null) {
       $filename = explode('.',$_FILES['home_pic']['name']);
       $filetype = end($filename);
       $rename = $id.$id.'.'.$filetype;
       // print_r($_FILES);
       $filetemp = $_FILES['home_pic']['tmp_name'];
       $path = "../../img/";
       move_uploaded_file($filetemp,$path.$rename);
       $sqlimg="UPDATE tb_home SET home_pic='".$rename."' WHERE id='".$id."' ";
       $mysqli->query($sqlimg) or die("SQL Error: <br>".$sqlimg."<br>".$mysqli->error);
     }


       if($mysqli){
           echo "<script type='text/javascript'>";
           echo "alert('แก้ไขข้อมูลเรียบร้อยแล้ว');";
           echo "window.location='../../main.php?page=home'";
           echo "</script>";
       }else{
         echo "<script type='text/javascript'>";
         echo "alert('แก้ไขข้อมูลไม่สำเร็จ');";
         echo "</script>";
       }
 ?>
