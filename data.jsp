<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.gold169.ask_answer.util.JsonUtil"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.net.URL"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.net.MalformedURLException"%>
<%@page import="java.io.IOException"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

 <%
  
   
   Date da=new Date();
   
   SimpleDateFormat sdf=new SimpleDateFormat("HH:mm:ss");
   
   SimpleDateFormat sdff=new SimpleDateFormat("yyyy-MM-dd");
   
   SimpleDateFormat sdffs=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
   
   String hour=sdf.format(da);
   
   String day=sdff.format(da);
   
   //当前时间之前的9小时
   
   long times=9*60*60*1000;
   
   long qianTime=da.getTime()-times;
   
   String beforeTime= sdffs.format(new Date(qianTime));
   
   beforeTime=beforeTime.replace(" ","%20");
   
   String urls="http://m.169gold.com/app/jsonServ?version=1.0&code=100015&chan_id=11&starttime="+beforeTime+"&endtime="+day+"%20"+hour+"&rowCount=10000";
   String str="";
   StringBuffer temp = new StringBuffer();  
   try  
   {  
           URL url = new URL(urls);  
           BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream(),"UTF-8"));  
           
           String strr="";
           int c = 0; 
           while ((c = in.read()) != -1) {  
        	   temp.append((char) c);  
          } 
           
         //  System.out.println(temp.toString());
           in.close();  
   }  
   catch(MalformedURLException e){
 	  
   }  
   catch(IOException e) {
 	  
   }
   
   
 %>
 <%=temp.toString()%>