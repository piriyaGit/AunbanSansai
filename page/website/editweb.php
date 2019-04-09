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
              <form method="post" action="page/website/addweb.php"  enctype="multipart/form-data">
		            <table class="table table-bordered">
      		            <tr>
      		                <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อโรงเรียนภาษาไทย</b></td>
      		                  <td width="2%;"></td>
      		                <td  style="font-size: 17px;" ><input type="text" name="infor_namethai" class="form-control" value="<?=$row['infor_namethai']?>" required></td>
      		            </tr>
                      <tr>
                         <td width="15%;" style="font-size: 17px;" class="text-right"><b>ชื่อโรงเรียนภาษาอังกฤษ</b></td>
                           <td width="2%;"></td>
                         <td  style="font-size: 17px;" ><input type="text" name="infor_nameeng" class="form-control" value="<?=$row['infor_nameeng']?>" required></td>
                      </tr>
                      <tr>
                        <td width="15%;" style="font-size: 17px;" class="text-right"><b>ตัวย่อ</b></td>
                          <td width="2%;"></td>
                        <td  style="font-size: 17px;" ><input type="text" name="infor_initials" class="form-control" value="<?=$row['infor_initials']?>" required></td>
                      </tr>
                      <tr>
                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>โลโก้สถาบัน</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" ><input type="file" name="infor_logo" class="form-control" value="img/<?=$row['infor_logo']?>" ></td>
                     </tr>
                     <tr>
                      <td width="15%;" style="font-size: 17px;" class="text-right"><b>คำเปรย</b></td>
                        <td width="2%;"></td>
                      <td  style="font-size: 17px;" ><textarea name="infor_important" class="form-control"required ><?=$row['infor_important']?></textarea> </td>
                     </tr>
                     <tr>
                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>รูปปก</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" ><input type="file" name="infor_header" class="form-control" value="img/<?=$row['infor_header']?>" ></td>
                     </tr>
                     <tr>
                      <td width="15%;" style="font-size: 17px;" class="text-right"><b>รูปพื้นหลัง</b></td>
                        <td width="2%;"></td>
                      <td  style="font-size: 17px;" ><input type="file" name="infor_background" class="form-control" value="img/<?=$row['infor_background']?>" ></td>
                     </tr>
                     <tr>
                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>ประวัติ</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" ><textarea name="infor_history" row="8" class="form-control" required><?=$row['infor_history']?></textarea></td>
                     </tr>
                     <tr>

                       <td width="15%;" style="font-size: 17px;" class="text-right"><b>ที่ตั้ง</b></td>
                         <td width="2%;"></td>
                       <td  style="font-size: 17px;" >
                         <textarea name="infor_another" class="form-control"required ><?=$row['infor_another']?></textarea></td>
                     </tr>
                     <tr>
                      <td width="15%;" style="font-size: 17px;" class="text-right"><b>เบอร์โทร</b></td>
                        <td width="2%;"></td>
                      <td  style="font-size: 17px;" ><input type="text" name="infor_tel" class="form-control" value="<?=$row['infor_tel']?>"required ></td>
                    </tr>
                    <tr>
                     <td width="15%;" style="font-size: 17px;" class="text-right"><b>อีเมลล์</b></td>
                       <td width="2%;"></td>
                     <td  style="font-size: 17px;" ><input type="text" name="infor_mail" class="form-control" value="<?=$row['infor_mail']?>" required><br>
                       <button type="submit" name="Submit" class="btn btn-primary">ยืนยัน</button>
                     </td>
                   </tr>
		            </table>
              </from>
            <br>
        </div>
  </div>
</section>
