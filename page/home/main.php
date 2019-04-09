<?php
  $fuc=new System();
  $res = $fuc->showUser();
  $sImg = $fuc->showImage();
?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">จัดการข้อมูลอาคาร</h3>
            </div>

            <div class="box-body">
              <div class="row" >
                <div class="col-md-12" align="center">
                  <?php include('addhome.php'); ?>
                </div>
              </div>
              <table id="example1" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>รูปภาพ</th>
                  <th>ชื่ออาคาร</th>
                  <th>แก้ไข</th>
                  <th>ลบ</th>
                </tr>
                </thead>
                <tbody>
                  <?php
                     foreach ($sImg as $showimg){

                  ?>
                   <tr>
                     <td width="30%" class="text-center"><img src="img/<?=$showimg['home_pic'];?>" alt="<?=$showimg['home_name'];?>" width="50%"></td>
                     <td><?=$showimg['home_name'];?></td>
                     <td class="text-center"><a href="main.php?page=homeedit&&id=<?=$showimg['id']?>">แก้ไข</a></td>
                     <td class="text-center"><a href="main.php?page=del&&id=<?=$showimg['id']?>">ลบ</a></td>

                   </tr>
              <?php  } ?>
              </tbody>
              </table>
            </div>
          </div>
        </div>
  </div>
</section>
