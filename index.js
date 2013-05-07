
var failydata=null;
//建立数据操作类
var DataModel=function(){
      
	  this.datas=Model.create();
       
      this.datas.attributes=["id","pinzhong","zuixin","zhangdie","zhangdiefu","gengxintime","nowdate"];

}
var guolvPinzhong='欧元/美元';
DataModel.prototype={
        
		initDatas:function(){
	
			 for(var i in failydata.waihuilist){
		         
		         var datai=failydata.waihuilist[i];
		
		         var data=this.datas.init(datai);
		         
		         data.save();
		   }
		    // 存储所有数据对象
		
			this.records=this.datas.records;
         },
        //得到属性为zuixin的最大值
        getZuixinBigest:function(){
             var zuixinBigest=null;
             var index=0;
             for(var i in this.records){
                 
               var pinzhong=this.records[i].pinzhong;
               if(pinzhong==guolvPinzhong){
	                 if(index==0){
	                     
	                     zuixinBigest=parseFloat(this.records[i].zuixin);
	                 }else{
	                    
	                 	if(parseFloat(this.records[i].zuixin)>zuixinBigest){
	                 		zuixinBigest=parseFloat(this.records[i].zuixin);
	                 	}

	                 }
	                 index++;
                }
                 
             }
             return zuixinBigest;
        },
        //得到最小值
        getZuixinSmallest:function(){
        	var zuixinSmallest=null;
             var index=0;
             for(var i in this.records){
                 
               var pinzhong=this.records[i].pinzhong;
               if(pinzhong==guolvPinzhong){
	                 if(index==0){
	                     
	                     zuixinSmallest=parseFloat(this.records[i].zuixin);
	                 }else{
	                    
	                 	if(parseFloat(this.records[i].zuixin)<zuixinSmallest){
	                 		zuixinSmallest=parseFloat(this.records[i].zuixin);
	                 	}

	                 }
	                 index++;
                }
               
             }
             return zuixinSmallest;
        },
        //过滤出美元指数的所有数据
        getMyzsRecords:function(){
               
              this.myzs=[];
        	  for(var i in this.records){

        	  	  var pinzhong=this.records[i].pinzhong;

        	  	  if(pinzhong==guolvPinzhong){
                       this.myzs.push(this.records[i].attributes());
        	  	  }
        	  }
             
        	  return this.myzs;
        },
        //拿到时间最小的那条数据
        getFirstTime:function(){
        	 var length=this.myzs.length;
        	 var index=0;
        	 for(var i in this.myzs){
        		 
        		 if(index==(length-1)){
        			 return this.myzs[i].nowdate;
        		 } 
        		 index++;
        		
        	 }
        	 return null; 
        	 
        },
        //绑定事件
        bind:function(ev,callback){
              this.datas.bind(ev,callback);
        },
        //触发事件
        trigger:function(ev,args){

        	 this.datas.trigger(ev,args);

        }
        
}




var drawTool=function(){
	  
	  this.cxt=document.getElementById("canvas").getContext("2d");
      this.dataUtil=new DataModel();
}


drawTool.prototype={
		initDatas:function(){
				 //初始化数据
				 this.dataUtil.initDatas();
				 this.dataUtil.getMyzsRecords();
        },
	//画X，y轴的方法
	     drawXy:function(){
    
		      var  dTool=this.cxt;
		      dTool.strokeStyle="";
		      //移动原点，至XY的交汇中心
		      dTool.translate(50,350);
		      //画x轴，长度为480 
			  dTool.moveTo(0,0);
			  dTool.lineTo(550,0);
			  dTool.stroke();
		      //画y轴，长度为
			  dTool.moveTo(0,0);
			  dTool.lineTo(0,-320);
			  
			  
			  
			  dTool.stroke();
		},
	     //画x轴刻度
	     drawXK:function(){
			   
			 var FirstTime=this.dataUtil.getFirstTime();
			
			 var hour=parseInt(FirstTime.substring(11,13));
             
             var min=parseInt(FirstTime.substring(14,16));
             
		     //假设1px为1分钟的时间, 
			  var  dTool=this.cxt;
			  //首先移到第一个小时显示的地方
			  var firtX=60-min;
			  
			  dTool.moveTo(firtX,0); 
			  dTool.lineTo(firtX,-10); 
			  dTool.fillText(hour+1,firtX,13);
			  for(var i=1;i<=8;i++){
			  	//画刻度
				dTool.moveTo(firtX+60*i,0);
			    dTool.lineTo(firtX+60*i,-10);
			   
		        //写刻度名称
			    dTool.fillText(hour+i+1,firtX+60*i,13);
			  }
			  
			  
			  
			  
			   dTool.stroke();

        },
         //画y轴刻度
         drawYK:function(){
        	
            
        	var zuixinBigest=this.dataUtil.getZuixinBigest();//得到zuixin的最大

              var zuixinSmallest=this.dataUtil.getZuixinSmallest();//得到zuixin的最小
              
              var FakeK=(zuixinBigest-zuixinSmallest)/4;
              
              this.fakeYk=FakeK;
              this.ZuixinSmallY=zuixinSmallest;
              this.ZuixinBigestY=zuixinBigest;

              var RealK=300/4;

              var  dTool=this.cxt;

              for(var i=0;i<=4;i++){
                   
                   //画刻度
				  	dTool.moveTo(0,-i*RealK);
				    dTool.lineTo(10,-i*RealK);
				    
			        //写刻度名称
			        var name=(zuixinSmallest+i*FakeK).toFixed(4);
			        dTool.fillText(name,-40,-i*RealK);
              }
              dTool.stroke();

         },
         //画出所有的点，并连接成曲线
         drawPic:function(){
                
                 var myzs=this.dataUtil.myzs;
                 var  dTool=this.cxt;
                 dTool.beginPath();
                 dTool.strokeStyle = "rgb(45,97,153)";//  
                 dTool.fillStyle="rgb(164,209,228)";
                 var index=0;
                 var length=myzs.length;
                 console.log(length);
                 var firstX=null;
                 var endX=null;
                 var FirstTime=this.dataUtil.getFirstTime();
     			
    			 var Firsthour=parseInt(FirstTime.substring(11,13));
                 
                 var Firstmin=parseInt(FirstTime.substring(14,16));
                 var FirstAllMin=Firsthour*60+Firstmin;
                for(var i in myzs){
                    
                    var time=myzs[i].nowdate;
                   
                    //根据当前时间计算时间点在x轴的位置

                    var hour=parseInt(time.substring(11,13));
                    
                    var min=parseInt(time.substring(14,16));
                   // console.log(hour+":"+min);
                    //当前x元素在x轴占有几个单元格.
                    
                    var unitXCm=hour*60+min-FirstAllMin;
                    
                    //当前x元素在x轴的实际x,设定1px为1分钟
                    var dotX=unitXCm;
                    //y轴每个单元格的长度
                    var realUnity=Math.round(300/((this.fakeYk.toFixed(4))*10000*4));
                    
                    //当前
                    var zuixin=(myzs[i].zuixin-this.ZuixinSmallY)*10000;
                    
                    var dotY=Math.round(-(realUnity*zuixin));
                    
                  //  console.log(dotX+","+dotY);
                    //画连线
				  	if(index==0){
				  		dTool.strokeStyle = "rgb(164,209,228)";
				  		dTool.moveTo(dotX,0);
				  		firstX=dotX;
				  		dTool.lineTo(dotX,dotY);
				  		dTool.stroke();
				  	}else {
				  		dTool.strokeStyle = "rgb(45,97,153)";
				  		dTool.lineTo(dotX,dotY);
				  		
				  	}
				  	if(index==(length-1)){
				  		endX=dotX;
				  	}
                    index++;
                    
                }
                dTool.lineTo(endX,0);
                dTool.lineTo(firstX,0);
                dTool.closePath();
                dTool.fill();
                dTool.stroke();


         }
}


var drawpicTool=new drawTool(); 
var data=drawpicTool.dataUtil;
//控制器
(function(){ 
    //定义domload事件 
    var domLoad=function(){
    	 drawpicTool.initDatas();
    	 
         drawpicTool.drawXy();
    
         drawpicTool.drawXK();
    
         drawpicTool.drawYK();
    
         drawpicTool.drawPic();
   
    }
    //定义鼠标悬浮事件 
    var mouseover=function(x){
        
        var xx=x[0];
        
        var yu=x[1];
         
       
        
        var FirstTime=drawpicTool.dataUtil.getFirstTime();
			
		var Firsthour=parseInt(FirstTime.substring(11,13));
        
        var Firstmin=parseInt(FirstTime.substring(14,16));
        
        var FirstAllMin=Firsthour*60+Firstmin;
        
        
         
        //x轴上,定义1px为1分钟的距离;
        
        var unitXcm=1;
         
        //计算当前x坐标,代表的分钟数
        
        var unitCount=xx+FirstAllMin;

        //12个单元格为一个小时

        var hour=parseInt(unitCount/60);//得到几个小时

        var hourStr=hour;
        
        if(hour<10){
          hourStr="0"+hour;
        }
        //剩余分钟为1分钟一个单元格

        var leaveCount=unitCount-60*hour;
        
        var min=leaveCount*1;
        
        var minStr=min;
        if(min<10){
          minStr="0"+min;
        }

      
         
        var records=data.getMyzsRecords();

        for(var i in records){

        	var time=records[i].nowdate;

            var zuixin=records[i].zuixin;
            
            var hours=parseInt(time.substring(11,13));
                    
            var mins=parseInt(time.substring(14,16));

            if((hours==hour)&&(mins==min)){

            	   // console.log(zuixin);

                    //y轴每个单元格的长度
                    
                    var realUnity=Math.round(300/((drawpicTool.fakeYk.toFixed(4))*10000*4));
                    
                    //当前
                    var zuixinY=(zuixin-drawpicTool.ZuixinSmallY)*10000;
                    
                    var dotY=Math.round((realUnity*zuixinY));
                    //2为误差距离

                    var margin_top=320-dotY-2;
                   // console.log(dotY);
                    var left=50+xx;

                    $(".ySolid").css("margin-left",left);
                    
                    $(".yNum").css("margin-left",left);
                    $(".yNum").html(hourStr+":"+minStr);
                    $(".xSolid").css("margin-top",margin_top);
                    $(".xNum").css("margin-top",margin_top);
                    $(".xNum").html(zuixin);

            }

        }

    }
    


    //绑定鼠标悬浮事件 
    data.bind("mouseOver",mouseover);
    //绑定DOmload事件
    data.bind("DomLoad",domLoad);


})();

var return0=function(str){
	
	if(str<10){
		return "0"+str;
	}else{
		return str;
	}
}

//执行主函数
$(function(){
                $(".xSolid").hide();
            	$(".ySolid").hide();
            	$(".yNum").hide();
            	$(".xNum").hide();
            	
            	
            	//定义从现在9个小时内的数据
            	
            	var date=new Date();
            	var year1=date.getFullYear();
            	var month1=date.getMonth()+1;
            	var day1=date.getDate();
            	var hour1=date.getHours();
            	var min1=date.getMinutes();
            	var sec1=date.getSeconds();
            	var nowTime=date.getMilliseconds();
            	var times=9*60*60*1000;
            	
            	var startTime=nowTime-times;
            	var date2=new Date();
            	date2.setMilliseconds(startTime);
            	
            	var year2=date2.getFullYear();
            	var month2=date2.getMonth()+1;
            	var day2=date2.getDate();
            	var hour2=date2.getHours();
            	var min2=date2.getMinutes();
            	var sec2=date2.getSeconds();
            	
            	var endTime=(year1+"-"+return0(month1)+"-"+return0(day1)+"%20"+return0(hour1)+":"+return0(min1)+":"+return0(sec1));
            	var beforeTime=(year2+"-"+return0(month2)+"-"+return0(day2)+"%20"+return0(hour2)+":"+return0(min2)+":"+return0(sec2));
            	
            	var url="http://www.169gold.com//app/jsonServ?version=1.0&code=100015&chan_id=11&starttime="+beforeTime+"&endtime="+endTime+"&rowCount=10000";
            	
            	//console.log(url);
            	//var url="data.jsp";
            	$.get(url,function(datas){
            	   
            	   failydata=eval('('+datas+')');
            	   
            	   data.trigger("DomLoad");
            	   
            	   
            	});
  //定义手机触屏事件
            	Touchy.stopWindowBounce();

    			var touchMe = document.getElementById('canvas');

    			
    			Touchy(touchMe, true, function (hand, finger) {
    				finger.on('start', touchstart);
    				finger.on('move' , touchstart);
    				finger.on('end'  , touchstart);
    			});
            	
            	
      function touchstart(e){
    	//这里css的margin-top为100，margin-left 为300；
          
          var top=100+50;
         
          var left=300+50;
          
          var xCan=event.pageX-left;           
         
          var yCan=event.pageY-top;
          //alert(xCan+""+yCan);
          if(xCan>0&&xCan<540&&yCan>0&&yCan<320){
          	var x=[];
          	x.push(xCan);
          	yCan=320-yCan;
          	
          	x.push(yCan);
          	$(".ySolid").show();
          	$(".xSolid").show();
          	$(".yNum").show();
          	$(".xNum").show();
              data.trigger("mouseOver",x);   

          }else{
          	//隐藏y轴
          	$(".xSolid").hide();
          	$(".ySolid").hide();
          	$(".yNum").hide();
          	$(".xNum").hide();
          }
      }
            	
            	
     $("canvas").mousemove(function(e) { 
           //这里css的margin-top为100，margin-left 为300；
            
            var top=100+50;
           
            var left=300+50;
            
            var xCan=event.pageX-left;           
           
            var yCan=event.pageY-top;

            if(xCan>0&&xCan<540&&yCan>0&&yCan<320){
            	var x=[];
            	x.push(xCan);
            	yCan=320-yCan;
            	
            	x.push(yCan);
            	$(".ySolid").show();
            	$(".xSolid").show();
            	$(".yNum").show();
            	$(".xNum").show();
                data.trigger("mouseOver",x);   

            }else{
            	//隐藏y轴
            	$(".xSolid").hide();
            	$(".ySolid").hide();
            	$(".yNum").hide();
            	$(".xNum").hide();
            }

		}); 

});

