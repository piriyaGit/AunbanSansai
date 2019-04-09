<?php
  include ('../../config/database.php');
  $mysqli = connect();


  $infor_namethai = $_POST['infor_namethai'];
  $infor_nameeng = $_POST['infor_nameeng'];
  $infor_initials = $_POST['infor_initials'];
  $infor_important = $_POST['infor_important'];
  $infor_history = $_POST['infor_history'];
  $infor_another = $_POST['infor_another'];
  $infor_tel= $_POST['infor_tel'];
  $infor_mail = $_POST['infor_mail'];

  $sql=" UPDATE tb_information
         SET infor_namethai='".$infor_namethai."',
            infor_nameeng='".$infor_nameeng."',
            infor_initials='".$infor_initials."',
            infor_important='".$infor_important."',
            infor_history='".$infor_history."',
            infor_another='".$infor_another."',
            infor_tel='".$infor_tel."',
            infor_mail='".$infor_mail."' ";

    $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);

    if ($_FILES['infor_logo']['name']!=null) {
      $filename = explode('.',$_FILES['infor_logo']['name']);
      $filetype = end($filename);
      $rename = $user_teacherID.$user_IDCard.'.'.$filetype;
      // print_r($_FILES);
      $filetemp = $_FILES['infor_logo']['tmp_name'];
      $path = "../../img/";
      move_uploaded_file($filetemp,$path.$rename);
      $sqlimg="UPDATE tb_information SET infor_logo='".$rename."' ";
      $mysqli->query($sqlimg) or die("SQL Error: <br>".$sqlimg."<br>".$mysqli->error);
    }

    if ($_FILES['infor_header']['name']!=null) {
      $filename = explode('.',$_FILES['infor_header']['name']);
      $filetype = end($filename);
      $rename = $user_teacherID.$user_IDCard.'.'.$filetype;
      // print_r($_FILES);
      $filetemp = $_FILES['infor_header']['tmp_name'];
      $path = "../../img/";
      move_uploaded_file($filetemp,$path.$rename);
      $sqlimg="UPDATE tb_information SET infor_header='".$rename."' ";
      $mysqli->query($sqlimg) or die("SQL Error: <br>".$sqlimg."<br>".$mysqli->error);
    }

    if ($_FILES['infor_background']['name']!=null) {
      $filename = explode('.',$_FILES['infor_background']['name']);
      $filetype = end($filename);
      $rename = $user_teacherID.$user_IDCard.'.'.$filetype;
      // print_r($_FILES);
      $filetemp = $_FILES['infor_background']['tmp_name'];
      $path = "../../img/";
      move_uploaded_file($filetemp,$path.$rename);
      $sqlimg="UPDATE tb_information SET infor_background='".$rename."' ";
      $mysqli->query($sqlimg) or die("SQL Error: <br>".$sqlimg."<br>".$mysqli->error);
    }


      if($mysqli){
          echo "<script type='text/javascript'>";
          echo "alert('แก้ไขข้อมูลเรียบร้อยแล้ว');";
          echo "window.location='../../main.php?page=website'";
          echo "</script>";
      }else{
        echo "<script type='text/javascript'>";
        echo "alert('แก้ไขข้อมูลไม่สำเร็จ');";
        echo "</script>";
      }
 ?>
