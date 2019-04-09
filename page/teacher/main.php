<?php
  $fuc=new System();
  $res = $fuc->showUser();
  // print_r($res);
?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">ข้อมูลครู</h3>
            </div>

            <div class="box-body">
              <div class="row" >
                <div class="col-md-12" align="center">
                  <?php include('add_form.php'); ?>
                </div>
              </div>
              <table id="example1" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>รหัสประจำตัวบุคลากร</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ตำแหน่ง</th>
                  <th>เบอร์โทร</th>
                  <th>วันที่เริ่มทำงาน</th>
                  <th>ดูข้อมูล</th>
                </tr>
                </thead>
                <tbody>
                  <?php
                     foreach ($res as $show){

                     ?>
                   <tr>
                     <td> <?=$show['user_teacherID']?></td>
                     <td><?=$show['user_fname']?> <?=$show['user_lname']?></td>
                     <td><?=$show['user2_rank']?></td>
                     <td><?=$show['user_tel']?></td>
                     <td><?=DBThaiLongDate($show['user2_start'])?></td>
                     <td class="text-center"><a href="main.php?page=view_from&id=<?=$show['id']?>"> <input type="button"  class="btn btn-primary" value="ดูข้อมูล"></a></td>
                     <?php //include('edit_form.php'); ?>
                   </tr>
              <?php  } ?>
              </tbody>
              </table>
            </div>
          </div>
        </div>
  </div>
</section>
