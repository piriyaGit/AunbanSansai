<?php
  $fuc=new System();
  $srom = $fuc->showclassroom();
?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">จัดการข้อมูลห้องเรียน</h3>
            </div>

            <div class="box-body">
              <div class="row" >
                <div class="col-md-12" align="center">

                </div>
              </div>
              <table id="example1" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>ชื่อห้อง</th>
                  <th>ครูประจำชั้น</th>
                  <th>จำนวนนักเรียน</th>
                  <th>แก้ไข</th>
                </tr>
                </thead>
                <tbody>
                  <?php
                     foreach ($srom as $showroom){

                  ?>
                   <tr>
                     <td><?=$showroom['cr_name'];?></td>
                     <td><?=$showroom['home_name'];?></td>
                      <td><?=$showroom['home_name'];?></td>
                     <td class="text-center"><a href="main.php?page=edit_form&&id=<?=$show['id']?>">แก้ไข</a></td>
                   </tr>
              <?php  } ?>
              </tbody>
              </table>
            </div>
          </div>
        </div>
  </div>
</section>
