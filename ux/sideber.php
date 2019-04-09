<?php
  $page=$_GET['page'];
  if ($page=='user') { $active_user='active'; }
  if ($page=='website') { $active_website='active'; }
  if ($page=='student') { $active_student='active'; }
  if ($page=='teacher') { $active_teacher='active'; }
  if ($page=='working') { $active_working='active'; }
  if ($page=='it') { $active_it='active'; }
  if ($page=='program') { $active_program='active'; }
  if ($page=='data') { $active_data='active'; }
  if ($page=='building') { $active_building='active'; }
  if ($page=='room') { $active_room='active'; }
  if ($page=='home') { $active_home='active'; }

?>
    <aside class="main-sidebar">
      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">
        <!-- Sidebar user panel -->
        <div class="user-panel">
          <div class="pull-left image">
            <img src="img/<?=$name_data['user_img']?>" class="img-circle" alt="User Image"> <!-- รอดึงใน Database -->
          </div>
          <div class="pull-left info">
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?=$name_data['user_fname']?>&nbsp;<?=$name_data['user_lname']?></p>  <!-- รอดึงใน Database -->
              <form  action="logout.php" target="_self" method="post">
					     &nbsp;&nbsp;&nbsp;&nbsp;<input type="submit" name="logoutBtn" value="ออกจากระบบ" class="btn btn-danger ">
				    </form>

          </div>
        </div>
<br>
        <ul class="sidebar-menu" data-widget="tree">
            <li class="header">ส่วนจัดการระบบ</li>
                    <li class="<?=$active_user?>">
                      <a href="main.php?page=user">
                        <i class="fa fa-user"></i> <span>ข้อมูลผู้ใช้งาน</span>
                      </a>
                    </li>

                    <li class="<?=$active_website?>" style="<?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">
                      <a href="main.php?page=website">
                        <i class="fa fa-edit"></i> <span>จัดการหน้าเว็บ</span>
                      </a>
                    </li>

              <li class="header">ส่วนจัดการข้อมูลนักเรียน</li>
                  <li class="<?=$active_student?>">
                    <a href="main.php?page=student">
                      <i class="fa fa-user-circle-o"></i> <span>ข้อมูลนักเรียน</span>
                    </a>
                  </li>
                  <!-- <li class="<?=$active_room?>">
                    <a href="main.php?page=room">
                      <i class="fa fa-address-book"></i> <span>ข้อมูลห้องเรียน</span>
                    </a>
                  </li> -->

              <li class="header">ส่วนจัดการข้อมูลครู</li>
                  <li class="<?=$active_teacher?>">
                    <a href="main.php?page=teacher">
                      <i class="fa fa-user-circle"></i> <span>ข้อมูลครู</span>
                    </a>
                  </li>
                  <!-- <li class="<?=$active_working?>">
                    <a href="main.php?page=working">
                      <i class="fa fa-calendar"></i> <span>ตารางบันทึกเวลามาทำงาน</span>
                    </a>
                  </li> -->


            <li class="header">ส่วนแจ้งงาน</li>
                    <li class="<?=$active_it?>">
                      <a href="main.php?page=it">
                        <i class="fa fa-wrench"></i> <span>แจ้งงาน</span>
                      </a>
                    </li>
                    <!-- <li class="<?=$active_program?>">
                      <a href="main.php?page=program">
                        <i class="fa fa-cogs"></i> <span>แจ้งติดตั้งโปรแกรม</span>
                      </a>
                    </li>
                    <li class="<?=$active_data?>">
                      <a href="main.php?page=data">
                        <i class="fa fa-desktop"></i> <span>ฐานข้อมูลครุภัณฑ์</span>
                      </a>
                    </li> -->



            <li class="header" style="<?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">ส่วนงานอาคาร</li>
                  <li class="<?=$active_home?>" style="<?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'display:none;' : ''; ?>">
                        <a href="main.php?page=home">
                          <i class="fa fa-building"></i> <span>จัดการอาคาร</span>
                        </a>
                  </li>
                  <!-- <li class="<?=$active_building?>">
                        <a href="main.php?page=building">
                          <i class="fa fa-home"></i> <span>แจ้งงานอาคาร</span>
                        </a>
                  </li> -->



      </ul>
      </section>
      <!-- /.sidebar -->
    </aside>
