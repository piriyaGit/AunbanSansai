<?php
  include ('../../config/database.php');
  $mysqli = connect();


  $user_teacherID = $_POST['user_teacherID'];
  $user_IDCard = $_POST['user_IDCard'];
  $user_fname = $_POST['user_fname'];
  $user_lname = $_POST['user_lname'];
  $user_nname = $_POST['user_nname'];
  $user_sex = $_POST['user_sex'];
  $user_tel= $_POST['user_tel'];
  $user_address = $_POST['user_address'];
  $user_username = $_POST['user_username'];
  $user_password = $_POST['user_password'];
  $user_lood = $_POST['user_lood'];
  $user_birdthday = $_POST['user_birdthday'];
  $user_email = $_POST['user_email'];
  $user_fan = $_POST['user_fan'];

  $user2_rank = $_POST['user2_rank'];
  $user2_rankcheak = $_POST['user2_rankcheak'];
  $user2_start = $_POST['user2_start'];
  $user2_room = $_POST['user2_room'];
  $user2_working = $_POST['user2_working'];
  $user2_spouse = $_POST['user2_spouse'];
  $user2_telspouse = $_POST['user2_telspouse'];
  $user2_child = $_POST['user2_child'];

  $sql=" UPDATE tb_user
         SET user_teacherID='".$user_teacherID."',
            user_IDCard='".$user_IDCard."',
            user_fname='".$user_fname."',
            user_lname='".$user_lname."',
            user_nname='".$user_nname."',
            user_sex='".$user_sex."',
            user_tel='".$user_tel."',
            user_address='".$user_address."',
            user_username='".$user_username."',
            user_password='".$user_password."',
            user_lood='".$user_lood."',
            user_birdthday='".$user_birdthday."',
            user_email='".$user_email."',
            user_fan='".$user_fan."' ";

  $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);

  $sql2=" UPDATE tb_user2
         SET user2_rank='".$user2_rank."',
            user2_rankcheak='".$user2_rankcheak."',
            user2_start='".$user2_start."',
            user2_room='".$user2_room."',
            user2_working='".$user2_working."',
            user2_spouse='".$user2_spouse."',
            user2_telspouse='".$user2_telspouse."',
            user2_child='".$user2_child."'  ";

  $mysqli->query($sql2) or die("SQL Error: <br>".$sql2."<br>".$mysqli->error);

  if ($_FILES['user_img']['name']!=null) {
    $filename = explode('.',$_FILES['user_img']['name']);
    $filetype = end($filename);
    $rename = $user_teacherID.$user_IDCard.'.'.$filetype;
    // print_r($_FILES);
    $filetemp = $_FILES['user_img']['tmp_name'];
    $path = "../../img/";
    move_uploaded_file($filetemp,$path.$rename);
    $sqlimg="UPDATE tb_user SET user_img='".$rename."' ";
    $mysqli->query($sqlimg) or die("SQL Error: <br>".$sqlimg."<br>".$mysqli->error);
  }


      if($mysqli){
          echo "<script type='text/javascript'>";
          echo "alert('แก้ไขข้อมูลเรียบร้อยแล้ว');";
          echo "window.location='../../main.php?page=user'";
          echo "</script>";
      }else{
        echo "<script type='text/javascript'>";
        echo "alert('แก้ไขข้อมูลไม่สำเร็จ');";
        echo "</script>";
      }
 ?>
