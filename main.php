<?php
  error_reporting(E_ALL & ~E_NOTICE);
  session_start();



  $page=$_GET['page'];

  include ('config/database.php');
  include ('class/date.class.php');
  include ('class/sansai.class.php');
  $mysqli=connect();


  if (@$_SESSION['user_username']!=null || @$_SESSION['user_username']!='') {
    $select_data = "SELECT * FROM tb_user
    LEFT JOIN tb_user2 ON tb_user2.user2_id=tb_user.id
    WHERE user_username='".@$_SESSION['user_username']."'";
    $q_name = mysqli_query($mysqli,$select_data);
    $name_data = mysqli_fetch_array($q_name);
  }

  isset($_POST['logoutBtn']) ? $logoutBtn = $_POST['logoutBtn'] : $logoutBtn = '';
  if ($logoutBtn == 'logoutBtn') {
        @session_unset();
  }

  if (@$_SESSION['user_username']==null && @$_SESSION['user_username']=='') {
    ?>
    <script language="javascript"> location.href="login.php";</script>
    <?php
    }
  ?>
 <!DOCTYPE html>
 <html lang="en" dir="ltr">
   <head>
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta charset="utf-8">
     <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
     <link rel="stylesheet" href="asset/bower_components/bootstrap/dist/css/bootstrap.min.css">
     <link rel="stylesheet" href="asset/bower_components/font-awesome/css/font-awesome.min.css">
     <link rel="stylesheet" href="asset/bower_components/Ionicons/css/ionicons.min.css">
     <link rel="stylesheet" href="asset/dist/css/AdminLTE.css">
     <link rel="stylesheet" href="asset/dist/css/skins/_all-skins.css">
     <link rel="stylesheet" href="asset/bower_components/morris.js/morris.css">
     <link rel="stylesheet" href="asset/bower_components/jvectormap/jquery-jvectormap.css">
     <link rel="stylesheet" href="asset/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css">
     <link rel="stylesheet" href="asset/bower_components/bootstrap-daterangepicker/daterangepicker.css">
     <link rel="stylesheet" href="asset/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css">
     <link href="https://fonts.googleapis.com/css?family=Kanit" rel="stylesheet">
     <link rel="stylesheet" href="asset/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
     <script src="asset/bower_components/jquery/dist/jquery.min.js"></script>
     <script src="asset/bower_components/jquery-ui/jquery-ui.min.js"></script>
     <script>
       $.widget.bridge('uibutton', $.ui.button);
     </script>
     <script src="asset/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
     <script src="asset/bower_components/raphael/raphael.min.js"></script>
     <script src="asset/bower_components/morris.js/morris.min.js"></script>
     <script src="asset/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js"></script>
     <script src="asset/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
     <script src="asset/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
     <script src="asset/bower_components/jquery-knob/dist/jquery.knob.min.js"></script>
     <script src="asset/bower_components/moment/min/moment.min.js"></script>
     <script src="asset/bower_components/bootstrap-daterangepicker/daterangepicker.js"></script>
     <script src="asset/bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>
     <script src="asset/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
     <script src="asset/bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
     <script src="asset/bower_components/fastclick/lib/fastclick.js"></script>
     <script src="asset/dist/js/adminlte.min.js"></script>
     <script src="asset/dist/js/pages/dashboard.js"></script>
     <script src="asset/dist/js/demo.js"></script>
     <script src="asset/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
     <script src="asset/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
     <script>
       $(function () {
         $('#example1').DataTable()
         $('#example2').DataTable({
           'paging'      : true,
           'lengthChange': false,
           'searching'   : false,
           'ordering'    : true,
           'info'        : true,
           'autoWidth'   : false
         })
       })
     </script>
     <title>ระบบจัดการฐานข้อมูลโรงเรียนอนุบาลสันทราย</title>
     <link rel="icon" href="img/login.png">

   </head>
   <body class="hold-transition skin-yellow sidebar-mini">
      <div class="wrapper">
        <?php
          include ('ux/header.php');
          include ('ux/sideber.php');
        ?>
        <div class="content-wrapper">

          <?php
              if (isset($page)){
                 if ($page=='user') { include ('page/user/main.php'); }
                 if ($page=='website') { include ('page/website/main.php'); }
                 if ($page=='student') { include ('page/student/main.php'); }
                 if ($page=='teacher') { include ('page/teacher/main.php'); }
                 if ($page=='working') { include ('page/working/main.php'); }
                 if ($page=='it') { include ('page/it/main.php'); }
                 if ($page=='room') { include ('page/room/main.php'); }
                 if ($page=='program') { include ('page/program/main.php'); }
                 if ($page=='data') { include ('page/data/main.php'); }
                 if ($page=='building') { include ('page/building/main.php'); }
                 if ($page=='home') { include ('page/home/main.php'); }
                 if ($page=='edit_form') { include ('page/teacher/edit_form.php'); }
                 if ($page=='view_from') { include ('page/teacher/view_from.php'); }
                 if ($page=='edit') { include ('page/it/edit.php'); }
                 if ($page=='homeedit') { include ('page/home/homeedit.php'); }
                 if ($page=='del') { include ('page/home/del.php'); }
                 if ($page=='editweb') { include ('page/website/editweb.php'); }
                 if ($page=='adduser') { include ('page/user/adduser.php'); }
                 if ($page=='viewstudent') { include ('page/student/viewstudent.php'); }
                 if ($page=='editstudent') { include ('page/student/editstudent.php'); }

              }else{
                include ('index.php');
              }

          ?>

        </div>
        <?php
          include ('ux/footer.php');
        ?>
      </div>
   </body>
 </html>
