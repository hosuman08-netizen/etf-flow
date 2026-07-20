
(function(){
  var K='etf_v1';
  var SHARE_BASE='https://hosuman08-netizen.github.io/etf-flow/';
  function load(){try{return JSON.parse(localStorage.getItem(K)||'{"notes":[]}');}catch(e){return{notes:[]};}}
  function save(s){localStorage.setItem(K,JSON.stringify(s));}
  function dayKey(off){var d=new Date();d.setDate(d.getDate()+(off||0));return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function kId(){try{var id=localStorage.getItem('etf_k_id');if(!id){id='f'+Math.random().toString(36).slice(2,8);localStorage.setItem('etf_k_id',id);}return id;}catch(e){return 'share';}}
  function shareUrl(){return SHARE_BASE+'?utm_source=share&utm_medium=app&ref='+encodeURIComponent(kId());}
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('etf_streak')||'{}');
      if(!st||typeof st!=='object')st={last:null,count:0};
      var t=dayKey(0); if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last&&st.last!==y&&st.last===y2&&(st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1; st.last=t;
      localStorage.setItem('etf_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  var s=load(); var root=document.getElementById('app');
  function render(){
    var st=JSON.parse(localStorage.getItem('etf_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    root.innerHTML='<div class="card" style="font-size:12px;color:#67e8f9">교육용 메모. 매수 추천 아님 · 투명 금융</div>'
      +'<div class="card"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span></div>'
      +'<div class="card"><input id="t" placeholder="티커 예: QQQ"/><textarea id="n" rows="3" placeholder="오늘 관찰 (유출입, 뉴스…)"></textarea><button id="add">메모 추가</button></div>'
      +'<div class="card" id="list"></div>'
      +'<div class="card" id="moneyPipe" style="text-align:center;font-size:12px">'
      +'<div style="color:#67e8f9;font-weight:700;margin-bottom:6px">💎 투명 금융 크로스</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/cost-basis/?utm_source=etf&utm_medium=pipe">🧮 Cost Basis</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/fund-card/?utm_source=etf&utm_medium=pipe">📋 Fund Card</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=etf&utm_medium=pipe">🎮 Arcade</a></div>'
      +'<button id="shareNotes" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#1c1826;color:#ece8f1">메모 요약 공유</button>';
    if(!s.notes.length){
      document.getElementById('list').innerHTML='<span class="sub">메모 없음 — 티커부터 적어봐<br><button id="emptySample" style="margin-top:8px">예시 QQQ 관찰</button></span>';
      var es=document.getElementById('emptySample');
      if(es) es.onclick=function(){s.notes.push({t:'QQQ',n:'교육용 샘플 메모',ts:Date.now()});save(s);bumpStreak();render();try{legionTrack('activate',{sample:1})}catch(e){}};
    }else{
      document.getElementById('list').innerHTML=s.notes.slice().reverse().slice(0,12).map(function(x){
        return '<div style="padding:8px 0;border-bottom:1px solid #2a2438"><b>'+x.t+'</b><div class="sub">'+new Date(x.ts).toLocaleString()+'</div><div>'+x.n+'</div></div>';
      }).join('');
    }
    document.getElementById('shareNotes').onclick=function(){
      var text=s.notes.slice(0,5).map(function(x){return x.t+': '+x.n}).join(' | ')||'empty';
      text+='\n'+shareUrl()+'\n교육용 · 매수추천 아님';
      if(navigator.share)navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{})}catch(e){}
    };
    document.getElementById('add').onclick=function(){
      s.notes.push({t:document.getElementById('t').value||'ETF',n:document.getElementById('n').value||'',ts:Date.now()});
      save(s);bumpStreak();render();try{legionTrack('activate',{})}catch(e){} try{legionTrack('money_pipe_shown',{app:'etf'})}catch(e){}
    };
  }
  try{var q=new URLSearchParams(location.search||'');var ref=q.get('ref');if(ref&&ref!=='share'&&ref!==kId()&&!localStorage.getItem('etf_k_from')){localStorage.setItem('etf_k_from',ref);try{legionTrack('k_link',{from:ref})}catch(e){}}}catch(e){}
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
