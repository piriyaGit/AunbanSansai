<?php
      include ('../../config/database.php');
      $mysqli = connect();


	   $stu_studentID = $_POST['stu_studentID'];
     $stu_IDCard = $_POST['stu_IDCard'];
  	 $stu_fname = $_POST['stu_fname'];
	   $stu_lname = $_POST['stu_lname'];
	   $stu_nname = $_POST['stu_nname'];
		 $stu_address = $_POST['stu_address'];
     $stu_sex = $_POST['stu_sex'];
     $stu_lood = $_POST['stu_lood'];
	   $stu_birdthday = $_POST['stu_birdthday'];
     $stu_room = $_POST['stu_room'];
     $stu_study = $_POST['stu_study'];
     $stu_fatername = $_POST['stu_fatername'];
     $stu_fatertel = $_POST['stu_fatertel'];
     $stu_matername = $_POST['stu_matername'];
     $stu_matertel = $_POST['stu_matertel'];
     $stu_tea = $_POST['stu_tea'];
     $stu_parentname = $_POST['stu_parentname'];
     $stu_parenttel = $_POST['stu_parenttel'];


    if ($_FILES['stu_img']['name']!=null) {
      $filename = explode('.',$_FILES['stu_img']['name']);
      $filetype = end($filename);
      $rename = $stu_studentID.$stu_IDCard.'.'.$filetype;
      // print_r($_FILES);
      $filetemp = $_FILES['stu_img']['tmp_name'];
      $path = "../../img/";

      if(move_uploaded_file($filetemp,$path.$rename)){
        $sql = "INSERT INTO tb_student(stu_studentID,stu_IDCard,stu_fname,stu_lname,stu_nname,stu_address,stu_sex,stu_lood,stu_birdthday,stu_room,stu_study,stu_fatername,stu_fatertel,stu_matername,stu_matertel,stu_tea,stu_parentname,stu_parenttel,stu_img)
        VALUES('$stu_studentID','$stu_IDCard','$stu_fname','$stu_lname','$stu_nname','$stu_address','$stu_sex','$stu_lood','$stu_birdthday','$stu_room','$stu_study','$stu_fatername','$stu_fatertel','$stu_matername','$stu_matertel','$stu_tea','$stu_parentname','$stu_parenttel','$rename')";

        $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);



        if($mysqli){
              echo "<script type='text/javascript'>";
              echo "alert('เพิ่มข้อมูลเรียบร้อยแล้ว');";
              echo "window.location='../../main.php?page=student'";
              echo "</script>";
          }else{
            echo "<script type='text/javascript'>";
            echo "alert('เพิ่มข้อมูลไม่สำเร็จ');";
            echo "</script>";
          }
      }
      else{
        echo "<script type='text/javascript'>";
        echo "alert('อัพโหลดไฟล์ไฟล์ภาพไม่สำเร็จ');";
        echo "window.location='../../main.php?page=student'";
        echo "</script>";
      }
    }
    else {
       echo "<script type='text/javascript'>";
       echo "alert('ทำงานผิดพลาด : กรุณาดูแนบไฟล์รูปภาพเท่านั้น');";
       echo "window.location='../../main.php?page=student'";
       echo "</script>";
    }



    ?>
