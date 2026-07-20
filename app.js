(function(){
  var KEY='etf_notes';
  var el=document.getElementById('tool');
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
  function render(){
    var rows=load();
    el.innerHTML='<input id="name" placeholder="티커/이름 (예: BTC ETF)"/><input id="flow" placeholder="메모: 유입/유출/관찰"/><button id="add">보드에 추가</button><div id="list" style="margin-top:10px"></div>';
    document.getElementById('list').innerHTML=rows.slice().reverse().map(function(r){return '<div style="padding:8px;border:1px solid #2a2438;border-radius:8px;margin:6px 0"><b>'+r.name+'</b><br><span style="color:#8a8398;font-size:13px">'+r.flow+'</span></div>'}).join('')||'<span style="color:#8a8398">메모 없음</span>';
    document.getElementById('add').onclick=function(){
      var n=document.getElementById('name').value.trim(), f=document.getElementById('flow').value.trim();
      if(!n)return; var rows=load(); rows.push({name:n,flow:f,t:Date.now()}); localStorage.setItem(KEY,JSON.stringify(rows.slice(-50))); render();
      try{legionTrack('activate',{})}catch(e){}
    };
  }
  render(); try{legionTrack('session_start',{})}catch(e){}
})();
