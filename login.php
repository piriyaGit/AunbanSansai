<?php
  session_start();


  include ('config/database.php');
  include ('class/sansai.class.php');
  $mysqli=connect();

  $fuc=new System();
  $row = $fuc->showData();

  if (@$_SESSION['user_username']!=null && @$_SESSION['user_username']!='') {
    ?>
    <script language="javascript"> location.href="main.php?page=user";</script>
    <?php
    }

  if(isset($_POST['loginBtn'])){
    $sqluser= "SELECT * FROM tb_user WHERE '".$_POST['user_username']."'=user_username AND '".$_POST['user_password']."'=user_password";
           global $mysqli;
    $objuser = array(); //สร้างตัวแปรให้เก็นในรุปแบบของ array
    $resuser = $mysqli->query($sqluser) or die("SQL Error: <br>".$sqluser."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้
    $rowuser = mysqli_fetch_array($resuser);
    // echo "1234";
    if (!empty($rowuser)) { //ใช้ตรวจค่าว่าง
         $_SESSION['user_username'] = $rowuser['user_username'] ;
         $_SESSION['user_fname'] = $rowuser['user_fname'] ;
        header('location: main.php?page=user');
        // echo "534564156";
    }
    else {
      echo "<script> alert('กรุณาตรวจสอบ Username และ Password'); </script>";
      // header('Refresh:0; login.php');
    }



  }

?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title><?=$row['infor_namethai'];?></title>
     <link rel="icon" href="img/<?=$row['infor_logo'];?>">
     <link href="asset/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
     <link href="asset/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
     <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">

     <link href="asset/vendor/magnific-popup/magnific-popup.css" rel="stylesheet">
     <link href="asset/css/creative.css" rel="stylesheet">

    <style >
    html,body{
      background-image: url('img/<?=$row['infor_background'];?>');
      background-repeat: no-repeat;
      -webkit-background-size: cover;
      -moz-background-size: cover;
      -o-background-size: cover;
      background-size: cover;
      }
     .len{
       margin-top:30px;
       background-color: rgba(240, 244, 244, 0.5);
     }
     .spainfont1{
       font-family: TH SarabunPSK;
       font-size: 60px;
     }
     .spainfont2{
       font-family: TH SarabunPSK;
       font-size: 28px;

     }
     .spainfont4{
       font-family: TH SarabunPSK;
       font-size: 28px;
       color: #FFF;
     }
     .spainfont3{
       font-family: TH SarabunPSK;
       font-size: 25px;
     }
   </style>

  </head>
  <body>
        <div class="container">
          <div class="row ">
            <div class="col-md-12">
                <div class="card card-body" style="background-color: rgba(244, 244, 244, 0.8); margin-top :12%" >
                      <div class="row " >
                        <div class="col-md-12">
                          <br><br><br><br><br>
                          <div class="row">
                            <div class="col-md-6">
                              <div class="row">
                                  <div class="col-md-12">
                                    <div class="bigs">
                                      <center>
                                      <a href="index.php">  <img src="img/login.png" width="70%" height="aut" id="Image2" alt="ตราสถาบันที่"></a>
                                      </center>
                                    </div>
                                  </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                              <div class="col-md-12">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="spainfont1">
                                          <center><b>USER</b> LOGIN</center>
                                        </div>
                                    </div>
                                </div>
                                <br>
                                <form  action="login.php" target="_self" method="post">
                                  <div class="row">
                                    <div class="col-md-3">
                                        <div class="spainfont2">
                                          <b>Username </b>
                                        </div>
                                    </div>
                                    <div class="col-md-9">
                                        <input type="text" name="user_username" id="user_username" placeholder="กรอกชื่อผู้ใช้งาน" class="form-control" required autofocus>
                                    </div>
                                  </div>
                                  <br>
                                  <div class="row">
                                    <div class="col-md-3">
                                      <div class="spainfont2">
                                        <b>Password </b>
                                      </div>
                                    </div>
                                    <div class="col-md-9">
                                        <input type="password" name="user_password" id="user_password" placeholder="กรอกรหัสผ่าน" class="form-control" required>
                                    </div>
                                  </div>
                                  <br>
                                  <div class="row">
                                    <div class="col-md-6">
                                      <button type="submit" value="click_login" id="loginBtn" name="loginBtn" class="form-control btn btn-success spainfont2">login</button>

                                    </div>
                                    <div class="col-md-6">
                                      <input type="reset" value="reset" class="form-control btn btn-danger spainfont2">
                                    </div>
                                  </div>
                                </form>

                              </div>
                            </div>
                          </div>
                          <br><br><br><br>
                          <div class="row">
                            <div class="col-md-12 text-center">
                              Copyright &copy; 2018 | <a href="https://www.facebook.com/Piriya.Thamsat">Piriya'Studio</a>.</strong> All rights reserved.
                            </div>
                          </div>


                      </div>
                  </div>
                </div>
            </div>
        </div>
      </div>

      <script src="asset/vendor/jquery/jquery.min.js"></script>
      <script src="asset/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="asset/vendor/jquery-easing/jquery.easing.min.js"></script>
      <script src="asset/vendor/scrollreveal/scrollreveal.min.js"></script>
      <script src="asset/vendor/magnific-popup/jquery.magnific-popup.min.js"></script>
      <script src="asset/js/creative.min.js"></script>

  </body>
</html>
