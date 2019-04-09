<?php
  $mysqli=connect();
  $fuc=new System();
  $rom= $fuc->showImage();
 ?>
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  กรอกข้อมูลอาการที่ซ่อม
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">กรอกข้อมูลอาการที่ซ่อม</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  <form method="post" action="page/it/add.php"  enctype="multipart/form-data">
      <div class="modal-body">
        <table class="table table-bordered table-hover">
          <tr>
            <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อผู้แจ้ง</b></td>
            <td width="1%;"></td>
            <td style="font-size: 17px;" ><input type="text" name="itfix_name" class="form-control" value="<?=$name_data['user_fname']?> <?=$name_data['user_lname']?> "readonly></td>
          </tr>
          <tr>
            <td width="15%;" style="font-size: 17px;" class="text-right"><b>ตำแหน่ง</b></td>
            <td width="1%;"></td>
            <td style="font-size: 17px;" ><input type="text" name="itfix_position" class="form-control" value="<?=$name_data['user2_rank']?> "readonly></td>
          </tr>
          <tr>
            <td width="15%;" style="font-size: 17px;" class="text-right"><b>อาคาร</b></td>
            <td width="1%;"></td>
            <td style="font-size: 17px;" >
              <select class="form-control" name="itfix_room">
     					 <option value=" ">อาคาร :</option>
               <?php
                  foreach ($rom as $room){

                  ?>
     					     <option value="<?=$room['home_name']?>"><?=$room['home_name']?></option>
                <?php  } ?>
     				 </select>
            </td>
          </tr>
          <tr>
            <td width="15%;" style="font-size: 17px;" class="text-right"><b>อาการที่แจ้ง</b></td>
            <td width="1%;"></td>
            <td style="font-size: 17px;" ><textarea name="itfix_symptom" class="form-control" placeholder="กรอกอาการ" required></textarea></td>
          </tr>
          <tr>
            <td width="15%;" style="font-size: 17px;" class="text-right"><b>วันที่</b></td>
            <td width="1%;"></td>
            <td style="font-size: 17px;" > <input type="date" name="itfix_date" class="form-control" required></td>
          </tr>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">ยกเลิก</button>
        <button type="submit" name="Submit" class="btn btn-primary">เพิ่ม</button>
      </div>
  </form>
    </div>
  </div>
</div>
