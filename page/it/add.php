<?php
      include ('../../config/database.php');
      $mysqli = connect();


	   $itfix_name= $_POST['itfix_name'];
     $itfix_position = $_POST['itfix_position'];
  	 $itfix_symptom = $_POST['itfix_symptom'];
	   $itfix_date = $_POST['itfix_date'];
     $itfix_room = $_POST['itfix_room'];
     $itfix_status = "รอดำเนินการ";


    $sql = "INSERT INTO tb_itfix(itfix_name,itfix_position,itfix_symptom,itfix_date,itfix_room,itfix_status)
    VALUES('$itfix_name','$itfix_position','$itfix_symptom','$itfix_date','$itfix_room','$itfix_status')";

    $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);


    $Token = "XXV3e1LVVN4ecb1AWoNagBAJIQ6KUmwwIoVLeVykO2q";
    $message = "ได้รับแจ้งจาก : $itfix_name  สถานที่ : $itfix_room  อาการ :$itfix_symptom ";
    line_notify($Token, $message);
    function line_notify($Token, $message)
    {
        $lineapi = $Token; // token key
        $mms =  trim($message); // ข้อความที่ต้องการส่ง
        date_default_timezone_set("Asia/Bangkok");
        $chOne = curl_init();
        curl_setopt( $chOne, CURLOPT_URL, "https://notify-api.line.me/api/notify");
        // SSL USE
        curl_setopt( $chOne, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt( $chOne, CURLOPT_SSL_VERIFYPEER, 0);
        //POST
        curl_setopt( $chOne, CURLOPT_POST, 1);
        curl_setopt( $chOne, CURLOPT_POSTFIELDS, "message=$mms");
        curl_setopt( $chOne, CURLOPT_FOLLOWLOCATION, 1);
        $headers = array( 'Content-type: application/x-www-form-urlencoded', 'Authorization: Bearer '.$lineapi.'', );
        curl_setopt($chOne, CURLOPT_HTTPHEADER, $headers);
        curl_setopt( $chOne, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec( $chOne );
        //Check error
        if(curl_error($chOne))
        {
            echo 'error:' . curl_error($chOne);
        }
        else {
            $result_ = json_decode($result, true);
            echo "status : ".$result_['status']; echo "message : ". $result_['message'];
        }
        curl_close( $chOne );
    }


        if($mysqli){
            echo "<script type='text/javascript'>";
            echo "alert('เพิ่มข้อมูลเรียบร้อยแล้ว');";
            echo "window.location='../../main.php?page=it'";
            echo "</script>";
        }else{
          echo "<script type='text/javascript'>";
          echo "alert('เพิ่มข้อมูลไม่สำเร็จ');";
          echo "</script>";
        }

    ?>
