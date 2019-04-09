<?php
  include ('config/database.php');
  include ('class/sansai.class.php');

  $mysqli=connect();

  $fuc=new System();
  $row = $fuc->showData();
  $print = $fuc->showData2();
  $sImg = $fuc->showImage();

  $sql="SELECT * FROM tb_user
        LEFT JOIN tb_user2 ON tb_user2.user2_id=tb_user.id
        WHERE tb_user2.user2_rankcheak	= 'Manager' ";
    // echo $sql;
  $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้
  while ($data = $res->fetch_assoc()) {
    $sur[] = $data;
  }
  extract($sur);
?>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title><?=$row['infor_namethai'];?></title>
    <link rel="icon" href="img/<?=$row['infor_logo'];?>">
    <link href="asset/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="asset/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">

    <link href="asset/vendor/magnific-popup/magnific-popup.css" rel="stylesheet">
    <link href="asset/css/creative.css" rel="stylesheet">
  </head>

  <body id="page-top">
    <?php  ?>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
      <div style=" background-image: url('img/<?=$row['infor_header'];?>');"></div>
      <div class="container">
        <a class="navbar-brand js-scroll-trigger" href="#page-top"><?=$row['infor_nameeng'];?></a>
        <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link js-scroll-trigger" href="#about">History</a>
            </li>
            <li class="nav-item">
              <a class="nav-link js-scroll-trigger" href="#services">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link js-scroll-trigger" href="#portfolio">Building</a>
            </li>
            <li class="nav-item">
              <a class="nav-link js-scroll-trigger" href="#Teacher">Manager</a>
            </li>
            <li class="nav-item">
              <a class="nav-link js-scroll-trigger" href="#contact">Contact</a>
            </li>
            <li class="nav-item">
              <a class="nav-link js-scroll-trigger" href="login.php">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header class="masthead text-center text-white d-flex" style="background-image: url('img/<?=$row['infor_header'];?>'); ">
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <h1 class="text-uppercase">
              <strong><?=$row['infor_namethai'];?><br><?=$row['infor_nameeng'];?> </strong>
            </h1>
            <hr>
          </div>
          <div class="col-lg-8 mx-auto">
            <p class="text-faded mb-5"><?=$row['infor_important'];?></p>
            <a class="btn btn-primary btn-xl js-scroll-trigger" href="#about">ประวัติสถาบัน</a>
          </div>
        </div>
      </div>
    </header>

    <section class="bg-primary" id="about">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="section-heading text-white">ประวัติสถาบัน</h2>
            <hr class="light my-4">
            <p class="text-faded mb-4"><?=$row['infor_history'];?> </p>
            <a class="btn btn-light btn-xl js-scroll-trigger" href="#services">เกี่ยวกับสถาบัน</a>
          </div>
        </div>
      </div>
    </section>

    <section id="services">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-center">
            <h2 class="section-heading">เกี่ยวกับสถาบัน</h2>
            <hr class="my-4">
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">

          <?php
             foreach ($print as $printf){

          ?>
          <div class="col-lg-4 col-md-6 text-center">
            <div class="service-box mt-5 mx-auto">
              <img src="img/<?=$printf['newinfor_img'];?>" width="100%">
              <br><br>
              <h3 class="mb-4"><?=$printf['newinfor_header'];?></h3>
              <p class="text-muted mb-0" style=" text-align: justify;"><?=$printf['newinfor_text'];?></p>
            </div>
          </div>
          <?php } ?>

        </div>
      </div>
    </section>




    <section class="p-0" id="portfolio">
      <div class="container-fluid p-0">
        <div class="row no-gutters popup-gallery">
          <?php
             foreach ($sImg as $showimg){

          ?>
          <div class="col-lg-4 col-sm-6">
            <a class="portfolio-box" href="img/<?=$showimg['home_pic'];?>">
              <img class="img-fluid" src="img/<?=$showimg['home_pic'];?>" alt="">
              <div class="portfolio-box-caption">
                <div class="portfolio-box-caption-content">
                  <div class="project-category text-faded">
                    อาคารสถานที่
                  </div>
                  <div class="project-name">
                    <?=$showimg['home_name'];?>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <?php } ?>
        </div>
      </div>
    </section>

    <section class="bg-dark text-white" id="Teacher">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-center">
            <h2 class="section-heading">ผู้บริหาร</h2>
            <hr class="my-4">
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <?php
             foreach ($sur as $showuser){
          ?>
          <div class="col-lg-4 col-md-6 text-center">
            <div class="service-box mt-5 mx-auto">
              <img src="img/<?=$showuser['user_img'];?>" width="100%">
              <br><br>
              <h3 class="mb-4"><?=$showuser['user_fname'];?> <?=$showuser['user_lname'];?></h3>
            </div>
          </div>
          <?php }  ?>

        </div>
      </div>
    </section>


    <section id="contact">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="section-heading">ติดต่อ</h2>
            <hr class="my-4">
            <p class="mb-5"><?=$row['infor_another'];?></p>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-4 ml-auto text-center">
            <i class="fa fa-phone fa-3x mb-3 sr-contact"></i>
            <p><?=$row['infor_tel'];?></p>
          </div>
          <div class="col-lg-4 mr-auto text-center">
            <i class="fa fa-envelope-o fa-3x mb-3 sr-contact"></i>
            <p>
              <a href="mailto:<?=$row['infor_mail'];?>"><?=$row['infor_mail'];?></a>
            </p>
          </div>
        </div>
      </div>
    </section>

    <script src="asset/vendor/jquery/jquery.min.js"></script>
    <script src="asset/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="asset/vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="asset/vendor/scrollreveal/scrollreveal.min.js"></script>
    <script src="asset/vendor/magnific-popup/jquery.magnific-popup.min.js"></script>
    <script src="asset/js/creative.min.js"></script>

  </body>

</html>
