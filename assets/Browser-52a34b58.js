const l="/FlowOS/assets/web-browser-8b47647b.svg",d={config:{name:"Browser",type:"process",icon:l,targetVer:"1.0.0-indev.0"},run:async i=>{const t=await i.loadLibrary("lib/WindowManager").then(o=>o.createWindow({title:"Browser",icon:l,width:500,height:700},i)),c=await i.loadLibrary("lib/XOR");t.content.style.height="100%",t.content.style.display="flex",t.content.style.flexDirection="column",t.content.innerHTML=`
      <div style="display: flex;padding: 10px;gap: 10px;">
        <div id="tabs-container" style="display: flex;gap: 10px;"></div>
        <button class="add">+</button>
      </div>
      <div class="tools" style="display:flex;gap:10px;align-items:center;">
        <i class='back material-symbols-rounded'>arrow_back</i>
        <i class='forward material-symbols-rounded'>arrow_forward</i>
        <i class='refresh material-symbols-rounded'>refresh</i>
        <input class="inp" style="border-radius: 15px;flex: 1;background: var(--base);border:none;padding: 0px 16px;height: 30px;">
        <i class='toggle material-symbols-rounded'>toggle_on</i>
        <i class='fullscreen material-symbols-rounded'>fullscreen</i>
      </div>
      <div id="content-container"></div>
      <style>
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        #content-container {
          flex: 1;
          background: white;
        }
        .add {
          border: none;
          background: transparent;
        }
        #tabs-container > div {
          padding: 5px 10px;
        }
        .active {
          background: var(--surface-0);
          border-radius: 10px!important;
        }

        .tools {
          background: var(--surface-0);
          padding: 10px;
        }
      </style>
    `;class a{active=!1;proxy=!0;header=document.createElement("div");iframe=document.createElement("iframe");constructor(e){this.iframe.src=`/service/${c.encode(e)}`,this.iframe.style.display="none",this.header.innerHTML=`
          <span class="title">Tab</span>
          <span class="close">&times;</sp>
        `}toggle(){if(this.proxy=!this.proxy,!this.proxy){this===n.activeTab&&(t.content.querySelector(".toggle").innerHTML="toggle_off"),this.header.querySelector(".title").innerText="Tab",this.iframe.src=t.content.querySelector("input")?.value;return}this===n.activeTab&&(t.content.querySelector(".toggle").innerHTML="toggle_on"),this.iframe.src=`/service/${c.encode(t.content.querySelector("input")?.value??"")}`}}class s{tabs=[];tabHistory=[];activeTab;addTab(e){this.tabs.push(e),this.setActiveTab(e),e.header.querySelector(".title").onclick=()=>this.setActiveTab(e),e.header.querySelector(".close").onclick=()=>this.closeTab(e),t.content.querySelector("#content-container")?.appendChild(e.iframe),t.content.querySelector("#tabs-container")?.appendChild(e.header),e.iframe.onload=()=>{e.header.querySelector(".title").textContent=e.iframe.contentDocument?.title??"Tab",e.iframe.contentDocument?.title===""&&(e.header.querySelector(".title").textContent="Tab"),e===this.activeTab&&(t.content.querySelector(".inp").value=c.decode(e.iframe.contentWindow.location.href.split("/service/")[1]))}}closeTab(e){if(e.header.remove(),e.iframe.remove(),e.active){const r=t.content.querySelector("#tabs-container")?.lastElementChild;r!==void 0?(r?.querySelector(".title")).click():this.addTab(new a("https://google.com"))}}setActiveTab(e){if(this.tabs.forEach(r=>{r.active&&(r.active=!1,r.iframe.style.display="none",r.header.classList.remove("active"))}),e.proxy){try{t.content.querySelector(".inp").value=c.decode(e.iframe.contentWindow.location.href.split("/service/")[1])}catch{t.content.querySelector(".inp").value="about:blank"}t.content.querySelector(".toggle").innerHTML="toggle_on"}else{e.header.querySelector(".title").textContent="Tab";try{t.content.querySelector(".inp").value=e.iframe.contentWindow.location.href}catch{t.content.querySelector(".inp").value="about:blank"}t.content.querySelector(".toggle").innerHTML="toggle_off"}e.active=!0,e.iframe.style.display="block",e.header.classList.add("active"),this.activeTab=e,this.tabHistory.push(e)}}const n=new s;t.content.querySelector(".inp")?.addEventListener("keydown",o=>{o.key==="Enter"&&(n.activeTab.iframe.src=n.activeTab.proxy?`/service/${c.encode(t.content.querySelector(".inp").value)}`:t.content.querySelector(".inp").value)}),t.content.querySelector("button").onclick=()=>{n.addTab(new a("https://google.com"))},t.content.querySelector(".refresh").onclick=()=>{n.activeTab.iframe.contentWindow?.location.reload()},t.content.querySelector(".back").onclick=()=>{n.activeTab.iframe.contentWindow?.history.back()},t.content.querySelector(".forward").onclick=()=>{n.activeTab.iframe.contentWindow?.history.forward()},t.content.querySelector(".toggle").onclick=()=>{n.activeTab.toggle()},t.content.onfullscreenchange=()=>{t.content.querySelector(".fullscreen").innerHTML=document.fullscreenElement!==null?"fullscreen_exit":"fullscreen"},t.content.querySelector(".fullscreen").onclick=async()=>{document.fullscreenElement===null?await t.content.requestFullscreen().catch(o=>console.error):await document.exitFullscreen().catch(o=>console.error)},n.addTab(new a("https://google.com"))}};export{d as default};
