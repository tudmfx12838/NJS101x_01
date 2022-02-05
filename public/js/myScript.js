if(document.getElementById("leaveTime")){
    document.getElementById("leaveTime").addEventListener("change", () => {
      document.getElementById("timeConvert").innerHTML = document.getElementById("leaveTime").value/8;
    });
}