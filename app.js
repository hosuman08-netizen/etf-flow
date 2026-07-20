
(function(){
  var K='etf_v1';
  var FLOW_SAMPLE=[{t:'QQQ',f:'+1.2B'},{t:'SPY',f:'+800M'},{t:'IWM',f:'-120M'},{t:'EEM',f:'+90M'}];
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
  function weekNotes(){
    var cut=Date.now()-7*864e5;
    return (s.notes||[]).filter(function(x){return (x.ts||0)>=cut;}).length;
  }
  function todayNotes(){
    var t0=new Date(); t0.setHours(0,0,0,0);
    return (s.notes||[]).filter(function(x){return (x.ts||0)>=t0.getTime();}).length;
  }
  function favs(){try{return JSON.parse(localStorage.getItem('etf_favs')||'[]');}catch(e){return[];}}
  function saveFavs(f){try{localStorage.setItem('etf_favs',JSON.stringify(f.slice(0,8)));}catch(e){}}
  function render(){
    // seed day-variation on sample (still fictional/edu)
    var day=new Date().getDate();
    var flow=FLOW_SAMPLE.map(function(x,i){
      var sign=(i+day)%3===0?'-':'+';
      var n=Math.abs(80+((day*17+i*31)%900));
      var unit=n>500?'B':'M';
      var v=unit==='B'?(n/100).toFixed(1)+'B':n+'M';
      return {t:x.t,f:sign+v};
    });
    var flowHtml=flow.map(function(x){return '<span class="chip" data-tk="'+x.t+'" style="cursor:pointer">'+x.t+' '+x.f+'</span>';}).join(' ');
    var st=JSON.parse(localStorage.getItem('etf_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    var wn=weekNotes();
    var tn=todayNotes();
    var fv=favs();
    root.innerHTML='<div class="card"><div class="sub">교육용 샘플 플로우(가상·일별 시드) · 메모 '+(s.notes||[]).length+'건 · 오늘 '+tn+' · 7일 '+wn+'</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'+flowHtml+'</div>'
      +(fv.length?'<div class="sub" style="margin-top:8px">핀: '+fv.map(function(t){return '<span class="chip" data-fav="'+t+'" style="cursor:pointer">★ '+t+'</span>';}).join(' ')+'</div>':'')
      +'</div>'+'<div class="card" style="font-size:12px;color:#67e8f9">교육용 메모. 매수 추천 아님 · 투명 금융</div>'
      +'<div class="card"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span> <span class="chip">오늘 <b>'+tn+'</b></span> <span class="chip">7일 메모 <b>'+wn+'</b></span></div>'
      +'<div class="card"><input id="t" placeholder="티커 예: QQQ"/><textarea id="n" rows="3" placeholder="오늘 관찰 (유출입, 뉴스…)"></textarea>'
      +'<div class="row" style="margin-top:6px"><button id="add">메모 추가</button><button class="sec" id="pinTk">★ 티커 핀</button></div></div>'
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
      document.getElementById('list').innerHTML=s.notes.slice().reverse().slice(0,12).map(function(x,idx){
        var real=s.notes.length-1-idx;
        return '<div style="padding:8px 0;border-bottom:1px solid #2a2438"><b>'+x.t+'</b> <button class="sec" data-del="'+real+'" style="float:right;padding:4px 8px;font-size:11px">삭제</button><div class="sub">'+new Date(x.ts).toLocaleString()+'</div><div>'+x.n+'</div></div>';
      }).join('');
      Array.prototype.forEach.call(document.querySelectorAll('[data-del]'),function(b){
        b.onclick=function(){s.notes.splice(+b.getAttribute('data-del'),1);save(s);render();};
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-tk]'),function(ch){
      ch.onclick=function(){document.getElementById('t').value=ch.getAttribute('data-tk');document.getElementById('n').focus();};
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-fav]'),function(ch){
      ch.onclick=function(){document.getElementById('t').value=ch.getAttribute('data-fav');document.getElementById('n').focus();};
    });
    document.getElementById('pinTk').onclick=function(){
      var t=(document.getElementById('t').value||'').trim().toUpperCase();
      if(!t)return;
      var f=favs(); if(f.indexOf(t)<0) f.unshift(t); saveFavs(f); render();
      try{legionTrack('pin',{t:t})}catch(e){}
    };
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
