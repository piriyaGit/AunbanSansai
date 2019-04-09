<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">ข้อมูลผู้ใช้งาน</h3>
            </div>

            <div class="box-body">
              <div class="row" style="background-color:#FFF7FA;">
                <div class="col-md-12" align="center">
                  <?php include('add_form.php'); ?>
                </div>
              </div>

              <table id="example1" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>สถานศึกษา</th>
                  <th>ฝ่าย</th>
                  <th>วันที่เริ่มฝึกงาน</th>
                </tr>
                </thead>
                <tbody>
                  <?php
                  $i=0;

                      foreach ($res as $list) {
                        $i++;

                   ?>
                   <!-- การวนลูปเเพื่อแสดงผลลัพธ์ -->
                   <tr>
                     <td><?=$i?></td>
                     <td><?=$list['its_name']?></td>
                     <td><?=$list['univer_name']?></td>
                     <td><?=$list['dept_name']?></td>
                     <td><?=DBThaiShortDate($list['its_start'])?></td>
                   </tr>
                 <?php } ?>
              </tbody>

              </table>
            </div>
          </div>
        </div>
  </div>
</section>
