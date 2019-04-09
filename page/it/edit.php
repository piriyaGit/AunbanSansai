<?php
  $id=$_REQUEST['id'];
  $sql = "SELECT * FROM tb_itfix WHERE id= '$id'";
  $res = $mysqli->query($sql) or die("SQL Error: <br>".$sql."<br>".$mysqli->error);  //การเก็บตัวแปรที่ใช้
  $showinfix = mysqli_fetch_array($res);
  extract($showinfix);

 ?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">แก้ไขข้อมูลส่วนตัวครู</h3>
            </div>
            <div class="box-body">

       <form method="post" action="page/it/itupdate.php?id=<?=$id?>"  enctype="multipart/form-data">
		            <table class="table table-bordered">
		              <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อ-นามสกุลผู้แจ้ง</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="itfix_name" class="form-control" value="<?=$showinfix['itfix_name']?>" readonly></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>ตำแหน่ง</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="itfix_position" class="form-control" value="<?=$showinfix['itfix_position']?>"  readonly></td>
		              </tr>
                  <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>อาการที่แจ้ง</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="itfix_symptom" class="form-control" value="<?=$showinfix['itfix_symptom']?>" readonly></td>
										<td width="15%;" style="font-size: 17px;" class="text-right"><b>วันที่แจ้ง</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><input type="text" name="itfix_date" class="form-control" value="<?=DBThaiLongDate($showinfix['itfix_date'])?>"  readonly></td>
		              </tr>
                  <tr>
		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>วิธีการแก้ไข</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" ><textarea name="itfix_method" class="form-control" value="กรอกวิธีแก้ไข"><?=$showinfix['itfix_method']?></textarea></td>
                    <td width="15%;" style="font-size: 17px;" class="text-right"><b>สถานะ</b></td>
		                  <td width="2%;"></td>
		                <td width="33%;" style="font-size: 17px;" >
                      <select class="form-control" name="itfix_status" >
             					 <option <?php if ($showinfix['itfix_status'] =='รอดำเนินการ') echo 'selected';?>>รอดำเนินการ</option>
             					 <option <?php if ($showinfix['itfix_status'] =='สำเร็จ') echo 'selected';?>>สำเร็จ</option>
             				 </select>
                    <br> <button type="submit" name="Submit" class="btn btn-primary">ยืนยัน</button>
                    </td>
		              </tr>


		            </table>
  	 	</form>
            <br>
        </div>
  </div>
</section>
