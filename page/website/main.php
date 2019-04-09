<?php
  $fuc=new System();
  $row = $fuc->showData();
?>
<section class="content-header">
  <div class="row">
        <div class="col-xs-12">
          <div class="box">
            <div class="box-header">
              <h3 class="box-title">ข้อมูลหน้าเว็บไซต์</h3>
            </div>
            <div class="box-body">
		            <table class="table table-bordered">
      		            <tr>
      		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อโรงเรียนภาษาไทย</b></td>
      		                  <td width="2%;"></td>
      		                <td  style="font-size: 17px;" ><input type="text" name="infor_namethai" class="form-control" value="<?=$row['infor_namethai']?>" readonly></td>
      		            </tr>
                      <tr>
                         <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อโรงเรียนภาษาอังกฤษ</b></td>
                           <td width="2%;"></td>
                         <td  style="font-size: 17px;" ><input type="text" name="infor_nameeng" class="form-control" value="<?=$row['infor_nameeng']?>" readonly></td>
                      </tr>
                      <tr>
                        <td width="15%;" style="font-size: 17px;" class="text-right"><b>ตัวย่อ</b></td>
                          <td width="2%;"></td>
                        <td  style="font-size: 17px;" ><input type="text" name="infor_initials" class="form-control" value="<?=$row['infor_initials']?>" readonly></td>
                      </tr>
                      <tr>
                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>โลโก้สถาบัน</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" ><img src="img/<?=$row['infor_logo']?>" alt="" width="20%" readonly></td>
                     </tr>
                     <tr>
                      <td width="15%;" style="font-size: 17px;" class="text-right"><b>คำเปรย</b></td>
                        <td width="2%;"></td>
                      <td  style="font-size: 17px;" ><textarea name="infor_important" class="form-control" readonly><?=$row['infor_important']?></textarea> </td>
                     </tr>
                     <tr>
                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>รูปปก</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" ><img src="img/<?=$row['infor_header']?>" alt="" width="20%" readonly></td>
                     </tr>
                     <tr>
                      <td width="15%;" style="font-size: 17px;" class="text-right"><b>รูปพื้นหลัง</b></td>
                        <td width="2%;"></td>
                      <td  style="font-size: 17px;" ><img src="img/<?=$row['infor_background']?>" alt="" width="20%" readonly></td>
                     </tr>
                     <tr>
                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>ประวัติ</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" ><textarea name="infor_history" row="8" class="form-control" readonly><?=$row['infor_history']?></textarea></td>
                     </tr>
                     <tr>

                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>ที่ตั้ง</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" >
                         <textarea name="infor_another" class="form-control" readonly><?=$row['infor_another']?></textarea></td>
                     </tr>
                     <tr>
                      <td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทร</b></td>
                        <td width="2%;"></td>
                      <td  style="font-size: 17px;" ><input type="text" name="infor_tel" class="form-control" value="<?=$row['infor_tel']?>" readonly></td>
                    </tr>
                    <tr>
                     <td width="15%;" style="font-size: 17px;" class="text-right"><b>อีเมลล์</b></td>
                       <td width="2%;"></td>
                     <td  style="font-size: 17px;" ><input type="text" name="infor_mail" class="form-control" value="<?=$row['infor_mail']?>" readonly><br>
                       <a href="main.php?page=editweb"> <input type="button"  class="btn btn-primary" value="แก้ไขข้อมูล"></a>
                     </td>
                   </tr>
		            </table>
            <br>
        </div>
  </div>
</section>
