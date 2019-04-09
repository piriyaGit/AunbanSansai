<?php
  $fuc=new System();
  $itfix = $fuc->showItfix();
  // print_r($res);
?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">แจ้งงาน</h3>
            </div>

            <div class="box-body">
              <div class="row" >
                <div class="col-md-12" align="center">
                    <?php include('insert.php'); ?>
                </div>
              </div>
              <table id="example1" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>ชื่อ-นามสกุลผู้แจ้ง</th>
                  <th>ตำแหน่ง</th>
                  <th>อาการที่แจ้ง</th>
                  <th>วันที่แจ้ง</th>
                  <th>สถานะ</th>
                </tr>
                </thead>
                <tbody>
                  <?php
                     foreach ($itfix as $showitfix){

                     ?>
                  <tr>
                    <td><?=$showitfix['itfix_name']?></td>
                    <td><?=$showitfix['itfix_position']?></td>
                    <td><?=$showitfix['itfix_symptom']?></td>
                    <td><?=DBThaiLongDate($showitfix['itfix_date'])?></td>
                    <td class="text-center"><a href="main.php?page=edit&id=<?=$showitfix['id']?>"><input type="button"  class="btn btn-primary" value="<?=$showitfix['itfix_status']?>" <?php echo $name_data['user2_rankcheak'] != 'Developers' ? 'disabled' : ''; ?>></a></td>
                    <td></td>
                  </tr>
                  <?php  } ?>
              </tbody>
              </table>
            </div>
          </div>
        </div>
  </div>
</section>
