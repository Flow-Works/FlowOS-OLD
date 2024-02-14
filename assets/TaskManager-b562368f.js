const l="/FlowOS/assets/utilities-system-monitor-125f7e39.svg",c={config:{name:"Task Manager",type:"process",icon:l,targetVer:"1.0.0-indev.0"},run:async n=>{const e=await n.loadLibrary("lib/WindowManager").then(d=>d.createWindow({title:"Task Manager",icon:l,width:600,height:200},n)),t=await n.loadLibrary("lib/HTML");e.content.style.display="flex",e.content.style.flexDirection="column",e.content.style.gap="10px",e.content.style.padding="10px",e.content.style.background="var(--base)",new t("style").html(`tbody tr:hover {
        background: var(--surface-1);
        border-radius: 10px;
      }

      tr:first-child td:first-child { border-top-left-radius: 10px; }
      tr:first-child td:last-child { border-top-right-radius: 10px; }

      tr:last-child td:first-child { border-bottom-left-radius: 10px; }
      tr:last-child td:last-child { border-bottom-right-radius: 10px; }
      
      table, table td, table th {
        border: none!important;
        border-collapse:collapse;
      }`).appendTo(e.content);const r=new t("table").style({width:"100%"}).appendTo(e.content),o=()=>{const{processList:d}=n.kernel;r.html(""),new t("thead").appendTo(r).append(new t("tr").style({padding:"5px","border-radius":"10px"}).appendMany(new t("th").style({"text-align":"center",width:"10%"}).text("PID"),new t("th").style({"text-align":"left",width:"45%"}).text("Process Name"),new t("th").style({"text-align":"left",width:"45%"}).text("Session Token")));const i=new t("tbody").appendTo(r);for(const a of d)new t("tr").style({padding:"5px","border-radius":"10px"}).appendTo(i).appendMany(new t("td").style({"text-align":"center"}).text(a.pid.toString()),new t("td").style({"text-align":"left"}).text(a.name),new t("td").style({"text-align":"left"}).text(a.token)).on("click",()=>{n.killProcess(a.pid).catch(s=>console.error(s))})};o(),document.addEventListener("update_process",()=>o())}};export{c as default};
