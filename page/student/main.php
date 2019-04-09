<?php
  $fuc=new System();
  $sstd = $fuc->showStudent();
  // print_r($res);
?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">

              <h3 class="box-title">ข้อมูลนักเรียน</h3>
            </div>

            <div class="box-body">
              <div class="row" >
                <div class="col-md-12" align="center">
                  <?php include('addstudent.php'); ?>
                </div>
              </div>
              <table id="example1" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>รหัสประจำตัวนักเรียน</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ห้อง</th>
                  <th>ครูประจำชั้น</th>
                  <th>ชื่อผู้ปกครอง</th>
                  <th>เบอร์โทรผู้ปกครอง</th>
                  <th>แก้ไข</th>
                </tr>
                </thead>
                <tbody>
                  <?php
                     foreach ($sstd as $showStu){

                     ?>
                   <tr>
                     <td><?=$showStu['stu_studentID']?></td>
                     <td><?=$showStu['stu_fname']?> <?=$showStu['stu_lname']?></td>
                     <td><?=$showStu['stu_room']?></td>
                     <td><?=$showStu['stu_tea']?></td>
                     <td><?=$showStu['stu_parentname']?></td>
                     <td><?=$showStu['stu_parenttel']?></td>
                     <td class="text-center"><a href="main.php?page=viewstudent&id=<?=$showStu['id']?>"> <input type="button"  class="btn btn-primary" value="ดูข้อมูล"></a></td>

                   </tr>
                <?php  } ?>
              </tbody>
              </table>
            </div>
          </div>
        </div>
  </div>
</section>
