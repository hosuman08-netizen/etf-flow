
(function(){
  var K='etf_v1';
  function load(){try{return JSON.parse(localStorage.getItem(K)||'{"notes":[]}');}catch(e){return{notes:[]};}}
  function save(s){localStorage.setItem(K,JSON.stringify(s));}
  var s=load(); var root=document.getElementById('app');
  function render(){
    root.innerHTML='<div class="card" style="font-size:12px;color:#67e8f9">교육용 메모. 매수 추천 아님.</div>'
      +'<div class="card"><input id="t" placeholder="티커 예: QQQ"/><textarea id="n" rows="3" placeholder="오늘 관찰 (유출입, 뉴스…)"></textarea><button id="add">메모 추가</button></div>'
      +'<div class="card" id="list"></div>';
    document.getElementById('list').innerHTML=s.notes.slice().reverse().slice(0,12).map(function(x){
      return '<div style="padding:8px 0;border-bottom:1px solid #2a2438"><b>'+x.t+'</b><div class="sub">'+new Date(x.ts).toLocaleString()+'</div><div>'+x.n+'</div></div>';
    }).join('')||'<span class="sub">메모 없음</span>';
    document.getElementById('add').onclick=function(){
      s.notes.push({t:document.getElementById('t').value||'ETF',n:document.getElementById('n').value||'',ts:Date.now()});
      save(s);render();try{legionTrack('activate',{})}catch(e){}
    };
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
