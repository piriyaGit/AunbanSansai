<?php
  class System {
    function showData(){
      $sql="SELECT * FROM tb_information";
             global $mysqli;  //เรียกใช้ ตัวแปร $mysqli ในไฟล์ database.php
      $obj = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
      $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

      while ($data = $res->fetch_assoc()) {
        $obj = $data;
      }
      return $obj;
    }

    function showItfix(){
      $sql="SELECT * FROM tb_itfix ORDER BY id DESC";
             global $mysqli;  //เรียกใช้ ตัวแปร $mysqli ในไฟล์ database.php
      $obj = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
      $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

      while ($data = $res->fetch_assoc()) {
        $obj[] = $data;
      }
      return $obj;
    }

    function showData2(){
      $sql="SELECT * FROM tb_newinfor";
             global $mysqli;  //เรียกใช้ ตัวแปร $mysqli ในไฟล์ database.php
      $obj = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
      $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

      while ($data = $res->fetch_assoc()) {
        $obj[] = $data;
      }
      return $obj;
    }

    function showImage(){
      $sql="SELECT * FROM tb_home";
             global $mysqli;  //เรียกใช้ ตัวแปร $mysqli ในไฟล์ database.php
      $obj = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
      $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

      while ($data = $res->fetch_assoc()) {
        $obj[] = $data;
      }
      return $obj;
    }

    function showclassroom(){
      $sql="SELECT * FROM tb_classroom ";
             global $mysqli;  //เรียกใช้ ตัวแปร $mysqli ในไฟล์ database.php
      $obj = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
      $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

      while ($data = $res->fetch_assoc()) {
        $obj[] = $data;
      }
      return $obj;
    }

    function showUser(){
      $sql="SELECT * FROM tb_user
            LEFT JOIN tb_user2 ON tb_user2.user2_id=tb_user.id  ";

             global $mysqli;  //เรียกใช้ ตัวแปร $mysqli ในไฟล์ database.php
      $obj = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
      $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

      while ($data = $res->fetch_assoc()) {
        $obj[] = $data;
      }
      return $obj;
    }

    function showStudent(){
      $sql="SELECT * FROM tb_student ";
             global $mysqli;  //เรียกใช้ ตัวแปร $mysqli ในไฟล์ database.php
      $obj = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
      $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้

      while ($data = $res->fetch_assoc()) {
        $obj[] = $data;
      }
      return $obj;
    }
    }
 ?>
