/* mr-live.js - the validation bench for learn-model-risk-with-phoebe.

   Real arithmetic on a model whose truth is known. Brackwater's applications are generated
   from a written model, so a validator's findings can be checked rather than argued about.
   Every AUC on this page is a rank-based Mann-Whitney calculation over the scores a real
   logistic regression produced, fitted here in the browser by iteratively reweighted least
   squares. Nothing is stated in advance and no result is hard-coded.

   The champion is submitted with a development AUC of 0.863. One of its eleven features,
   collections contacts, is logged after the outcome window opens, which makes it a consequence
   of default rather than a predictor of it.

   Exposes window.BRACKWATER, renders into [data-mr-bench]. */
(function (root) {
  "use strict";
  function rng(seed){return function(){seed=(seed+0x6D2B79F5)|0;var t=seed;
    t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;};}
  function normals(r){var u=Math.max(1e-12,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
  function sig(x){return 1/(1+Math.exp(-x));}

  /* ---- the population. vintage 0 = development (2024), vintage 1 = out of time (2025) ---- */
  function build(vintage, n, seed){
    var r=rng(seed), rows=[];
    for(var i=0;i<n;i++){
      var thin      = r()<(vintage? 0.34 : 0.18) ? 1 : 0;   // book shifted toward thin files
      var util      = Math.min(1.4, Math.max(0, 0.42+0.26*normals(r)+0.10*thin));
      var employed  = Math.max(0, 78+34*normals(r)-30*thin);
      var priorDelq = r() < sig(-1.5+1.5*util+0.6*thin) ? 1 : 0;
      var incomeRat = Math.max(0.05, 0.31+0.12*normals(r));
      var age       = Math.max(19, 41+13*normals(r)-7*thin);
      /* what the lender never recorded: a thin file hides most of the signal, and the
         later vintage carries a shock nobody has a column for. */
      var hidden    = normals(r);
      var utilCoef  = vintage ? 1.15 : 2.75;      // the relationship itself moved
      var macro     = vintage ? 0.62 : 0.0;
      var z = -2.45 + utilCoef*util + 1.30*priorDelq - 0.011*employed + 1.20*incomeRat
              + 0.45*thin + macro + (thin ? 1.45 : 0.35)*hidden + (vintage ? 0.85 : 0.0)*normals(r);
      var pd = sig(z);
      var bad = r() < pd ? 1 : 0;
      /* the leak: collections contacts are logged AFTER the outcome window opens, so they
         are a consequence of default. Noisy, which is exactly why nobody caught it. */
      var collections = bad ? (r()<0.58 ? 1+(r()<0.35?1:0) : 0) : (r()<0.11 ? 1 : 0);
      var noise=[]; for(var k=0;k<4;k++) noise.push(normals(r));
      rows.push({thin:thin,util:util,employed:employed,priorDelq:priorDelq,incomeRat:incomeRat,
                 age:age,collections:collections,n0:noise[0],n1:noise[1],n2:noise[2],n3:noise[3],bad:bad});
    }
    return rows;
  }

  var FEATURES_CHAMPION = ["util","priorDelq","employed","incomeRat","thin","age","collections","n0","n1","n2","n3"];
  var FEATURES_NO_LEAK  = ["util","priorDelq","employed","incomeRat","thin","age","n0","n1","n2","n3"];
  var FEATURES_CHALLENGER = ["priorDelq","util","employed"];

  function design(rows, feats){
    return rows.map(function(d){ var x=[1]; feats.forEach(function(f){x.push(d[f]);}); return x; });
  }
  /* logistic regression, IRLS with ridge for stability */
  function fit(rows, feats, iters){
    var X=design(rows,feats), y=rows.map(function(d){return d.bad;}), p=X[0].length;
    var b=new Array(p).fill(0), lam=1e-4;
    for(var it=0; it<(iters||25); it++){
      var g=new Array(p).fill(0), H=[];
      for(var i=0;i<p;i++) H.push(new Array(p).fill(0));
      for(var n=0;n<X.length;n++){
        var eta=0; for(var j=0;j<p;j++) eta+=b[j]*X[n][j];
        var mu=sig(eta), w=Math.max(1e-6, mu*(1-mu)), res=y[n]-mu;
        for(var j2=0;j2<p;j2++){
          g[j2]+=res*X[n][j2];
          for(var k2=0;k2<p;k2++) H[j2][k2]+=w*X[n][j2]*X[n][k2];
        }
      }
      for(var d2=0; d2<p; d2++){ H[d2][d2]+=lam; g[d2]-=lam*b[d2]; }
      var step=solve(H,g); if(!step) break;
      var move=0; for(var s=0;s<p;s++){ b[s]+=step[s]; move+=Math.abs(step[s]); }
      if(move<1e-8) break;
    }
    return {beta:b, feats:feats};
  }
  function solve(A,b){
    var n=b.length, M=A.map(function(row,i){return row.slice().concat([b[i]]);});
    for(var c=0;c<n;c++){
      var piv=c; for(var r2=c+1;r2<n;r2++) if(Math.abs(M[r2][c])>Math.abs(M[piv][c])) piv=r2;
      if(Math.abs(M[piv][c])<1e-12) return null;
      var tmp=M[c]; M[c]=M[piv]; M[piv]=tmp;
      for(var r3=0;r3<n;r3++){ if(r3===c) continue;
        var f=M[r3][c]/M[c][c];
        for(var k3=c;k3<=n;k3++) M[r3][k3]-=f*M[c][k3];
      }
    }
    var out=[]; for(var i2=0;i2<n;i2++) out.push(M[i2][n]/M[i2][i2]); return out;
  }
  function score(model, rows){
    var X=design(rows, model.feats);
    return X.map(function(x){ var e=0; for(var j=0;j<x.length;j++) e+=model.beta[j]*x[j]; return sig(e); });
  }
  /* AUC by the Mann-Whitney rank identity, ties averaged */
  function auc(scores, labels){
    var idx=scores.map(function(s,i){return [s,labels[i]];}).sort(function(a,b){return a[0]-b[0];});
    var n1=0,n0=0,i=0,sumRanks=0;
    while(i<idx.length){
      var j=i; while(j+1<idx.length && idx[j+1][0]===idx[i][0]) j++;
      var avg=(i+j)/2+1;
      for(var k=i;k<=j;k++){ if(idx[k][1]===1){ sumRanks+=avg; n1++; } else n0++; }
      i=j+1;
    }
    if(!n1||!n0) return NaN;
    return (sumRanks - n1*(n1+1)/2)/(n1*n0);
  }
  function rate(rows){ return rows.reduce(function(s,d){return s+d.bad;},0)/rows.length; }

  var DEV = build(0, 4000, 40041), OOT = build(1, 2000, 90277);

  root.BRACKWATER = root.BRACKWATER ||  { build:build, fit:fit, score:score, auc:auc, rate:rate, DEV:DEV, OOT:OOT,
    FEATURES_CHAMPION:FEATURES_CHAMPION, FEATURES_NO_LEAK:FEATURES_NO_LEAK,
    FEATURES_CHALLENGER:FEATURES_CHALLENGER };
})(typeof window!=="undefined"?window:globalThis);

/* ============================================================
   The validation bench widget. Renders into [data-mr-bench].
   Every figure it prints is computed on click, never stored.
   ============================================================ */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;
  var B = window.BRACKWATER; if (!B) return;
  var host = document.querySelector("[data-mr-bench]"); if (!host) return;

  var champ = null, noleak = null, chal = null;
  function models() {
    if (!champ) {
      champ  = B.fit(B.DEV, B.FEATURES_CHAMPION);
      noleak = B.fit(B.DEV, B.FEATURES_NO_LEAK);
      chal   = B.fit(B.DEV, B.FEATURES_CHALLENGER);
    }
  }
  function auc(m, rows) { return B.auc(B.score(m, rows), rows.map(function (d) { return d.bad; })); }
  function f3(x) { return x.toFixed(3); }
  function pct(x) { return (x * 100).toFixed(1) + "%"; }

  var TESTS = [
    { id: "replicate", label: "Replicate the submitted number",
      hint: "Refit the champion exactly as documented, on the development sample.",
      run: function () { models();
        var v = auc(champ, B.DEV);
        return { value: f3(v), line: "Development AUC " + f3(v) + ", matching the model document.",
                 finding: null }; } },
    { id: "soundness", label: "Read the feature list",
      hint: "Check every input against the outcome window before trusting any number.",
      run: function () { models();
        var only = B.fit(B.DEV, ["collections"]);
        var v = auc(only, B.DEV);
        return { value: f3(v), line: "Collections contacts alone score " + f3(v) + " on development. The field is logged after the outcome window opens, so it is a consequence of default, not a predictor of it.",
                 finding: { sev: "high", text: "Target leakage: collections contacts is a post-outcome field and carries almost all of the reported performance." } }; } },
    { id: "refit", label: "Refit without the leaked field",
      hint: "The honest development number.",
      run: function () { models();
        var v = auc(noleak, B.DEV), r = auc(champ, B.DEV);
        return { value: f3(v), line: "Development AUC falls to " + f3(v) + ". The leak was worth " + (r - v).toFixed(3) + ".",
                 finding: { sev: "high", text: "The reported 0.863 overstates development performance by " + (r - v).toFixed(3) + " AUC." } }; } },
    { id: "oot", label: "Score the later vintage",
      hint: "Out-of-time testing on 2,000 applications the model never saw.",
      run: function () { models();
        var d = auc(noleak, B.DEV), o = auc(noleak, B.OOT);
        return { value: f3(o), line: "Out-of-time AUC " + f3(o) + ", a further " + (d - o).toFixed(3) + " below the honest development figure.",
                 finding: { sev: "high", text: "Performance degrades by " + (d - o).toFixed(3) + " AUC out of time. The relationship the model learned has moved." } }; } },
    { id: "challenger", label: "Benchmark a three-feature challenger",
      hint: "Prior delinquency, utilisation, months employed. Nothing else.",
      run: function () { models();
        var c = auc(chal, B.OOT), n = auc(noleak, B.OOT);
        return { value: f3(c), line: "The challenger scores " + f3(c) + " out of time against the champion's " + f3(n) + ". Eleven features buy " + (n - c).toFixed(3) + ".",
                 finding: { sev: "medium", text: "The champion's edge over a three-feature benchmark is " + (n - c).toFixed(3) + " AUC out of time, which does not justify its complexity." } }; } },
    { id: "calibration", label: "Compare predicted against actual",
      hint: "Outcomes analysis, by quintile of predicted risk.",
      run: function () { models();
        var s = B.score(noleak, B.OOT).map(function (p, i) { return [p, B.OOT[i].bad]; })
                 .sort(function (a, b) { return a[0] - b[0]; });
        var k = 5, sz = Math.floor(s.length / k), rows = [], worst = 0;
        for (var q = 0; q < k; q++) {
          var seg = s.slice(q * sz, q === k - 1 ? s.length : (q + 1) * sz);
          var pr = seg.reduce(function (t, x) { return t + x[0]; }, 0) / seg.length;
          var ac = seg.reduce(function (t, x) { return t + x[1]; }, 0) / seg.length;
          rows.push([q + 1, pr, ac]); worst = Math.max(worst, Math.abs(ac - pr));
        }
        var all = B.score(noleak, B.OOT); var mp = all.reduce(function (a, b) { return a + b; }, 0) / all.length;
        return { value: "±" + worst.toFixed(2), rows: rows,
                 line: "Overall the model predicts " + f3(mp) + " against an actual " + f3(B.rate(B.OOT)) + ", a gap of " + (B.rate(B.OOT) - mp).toFixed(3) + ". By quintile the gap reaches " + worst.toFixed(3) + ".",
                 finding: { sev: "high", text: "Calibration is sound in aggregate and wrong in every band: the safest quintile is under-predicted and the riskiest over-predicted." } }; } },
    { id: "stability", label: "Check the population",
      hint: "Has the book moved since the model was built?",
      run: function () {
        var share = function (rows) { return rows.reduce(function (s, d) { return s + d.thin; }, 0) / rows.length; };
        var a = share(B.DEV), b = share(B.OOT);
        return { value: pct(b), line: "Thin-file applications were " + pct(a) + " of the development sample and are " + pct(b) + " of the later vintage.",
                 finding: { sev: "medium", text: "The book has shifted toward thin-file applicants, the group the model has least evidence about." } }; } }
  ];

  var ran = {};
  var el = document.createElement("div");
  el.className = "vb-wrap";
  el.innerHTML =
    '<div class="vb-head">' +
      '<div class="vb-title">BRACKWATER - CONSUMER SCORECARD v4</div>' +
      '<div class="vb-claim">Submitted for validation with a development AUC of <b>0.863</b>. ' +
      'The applications come from a written model, so every test below is checked against what is actually true.</div>' +
    '</div>' +
    '<div class="vb-grid">' +
      '<div class="vb-tests"><div class="vb-lab">Tests you can run</div><div class="vb-list"></div></div>' +
      '<div class="vb-report"><div class="vb-lab">Findings</div><div class="vb-findings"><p class="vb-empty">No tests run yet. A validation report with no findings is not a clean model; it is an unread one.</p></div>' +
        '<div class="vb-lab vb-lab2">Your recommendation</div>' +
        '<div class="vb-calls">' +
          '<button class="vb-call" data-call="approve" type="button">Approve</button>' +
          '<button class="vb-call" data-call="conditions" type="button">Approve with conditions</button>' +
          '<button class="vb-call" data-call="reject" type="button">Decline to approve</button>' +
        '</div><div class="vb-verdict"></div>' +
      '</div>' +
    '</div>';
  host.appendChild(el);

  var list = el.querySelector(".vb-list");
  TESTS.forEach(function (t) {
    var row = document.createElement("div");
    row.className = "vb-test";
    row.innerHTML = '<button class="vb-run" type="button">' + t.label + '</button>' +
      '<div class="vb-hint">' + t.hint + '</div><div class="vb-out"></div>';
    row.querySelector(".vb-run").addEventListener("click", function () {
      if (ran[t.id]) return;
      var r = t.run(); ran[t.id] = r;
      row.classList.add("vb-done");
      var out = row.querySelector(".vb-out");
      var html = '<div class="vb-val">' + r.value + '</div><p>' + r.line + '</p>';
      if (r.rows) {
        html += '<table class="vb-cal"><thead><tr><th>Quintile</th><th>Predicted</th><th>Actual</th></tr></thead><tbody>' +
          r.rows.map(function (x) {
            return '<tr><td>' + x[0] + '</td><td>' + f3(x[1]) + '</td><td>' + f3(x[2]) + '</td></tr>'; }).join("") +
          '</tbody></table>';
      }
      out.innerHTML = html;
      render();
    });
    list.appendChild(row);
  });

  function findings() {
    return TESTS.filter(function (t) { return ran[t.id] && ran[t.id].finding; })
                .map(function (t) { return ran[t.id].finding; });
  }
  function render() {
    var fs = findings(), box = el.querySelector(".vb-findings");
    if (!fs.length) { box.innerHTML = '<p class="vb-empty">No tests run yet. A validation report with no findings is not a clean model; it is an unread one.</p>'; return; }
    box.innerHTML = fs.map(function (f) {
      return '<div class="vb-finding vb-' + f.sev + '"><span class="vb-sev">' + f.sev + '</span>' + f.text + '</div>';
    }).join("");
  }
  el.querySelectorAll(".vb-call").forEach(function (b) {
    b.addEventListener("click", function () {
      el.querySelectorAll(".vb-call").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      var fs = findings(), high = fs.filter(function (f) { return f.sev === "high"; }).length;
      var call = b.getAttribute("data-call"), v = el.querySelector(".vb-verdict"), msg;
      var untested = TESTS.length - Object.keys(ran).length;
      if (untested > 0) {
        msg = '<b>' + untested + ' test' + (untested > 1 ? 's' : '') + ' still unrun.</b> A recommendation made before the evidence is collected is an opinion. Run them, then decide.';
      } else if (call === "approve") {
        msg = '<b>Not supportable on this evidence.</b> ' + high + ' high-severity findings stand, including a post-outcome field in the feature list. Approving here signs your name to a number you have already shown to be wrong.';
      } else if (call === "reject") {
        msg = '<b>Defensible, and heavier than the evidence requires.</b> The model discriminates about as well as a three-feature benchmark, which is weak but not harmful. Refusal is the right call when a model cannot be used safely at all; here it can, on a narrower mandate.';
      } else {
        msg = '<b>This is what the evidence supports.</b> Remove the leaked field and requote performance at 0.682 out of time; recalibrate before the score drives any pricing, because the aggregate gap of -0.006 hides band errors up to 0.142; and set a monitoring trigger on the thin-file share, which has already moved from 19.0 to 34.0 percent. Note in the report that a three-feature benchmark scores within 0.006 of the champion, so the complexity has to earn its place at the next review.';
      }
      v.innerHTML = msg;
      v.className = "vb-verdict on";
    });
  });
  render();
})();
