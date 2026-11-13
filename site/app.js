// Renders the leaderboard from data.json (written by scripts/build.mjs). No dependencies.
(function () {
  "use strict";

  var REPO = "https://github.com/devankit01/llm-repo-frontend";
  var state = { domain: "health", sortKey: "rating", sortDir: -1, q: "", lic: "all", med: false, demo: false, open: null };
  var data = null;
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Deterministic made-up scores, used only when the visitor turns on the demo preview.
  function demoResult(model) {
    var h = 0;
    for (var i = 0; i < model.id.length; i++) h = (h * 31 + model.id.charCodeAt(i)) >>> 0;
    function next() { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; }
    var scores = {};
    rated().forEach(function (e) { scores[e.id] = { score: Math.round((42 + next() * 50) * 10) / 10, n: 100 }; });
    return { demo: true, scores: scores, speed: { tokens_per_second: Math.round(18 + next() * 60) } };
  }

  function rated() { return data.evals.filter(function (e) { return e.domain === "health" && e.rated; }); }
  function resultFor(model) { return data.results[model.id] || (state.demo ? demoResult(model) : null); }

  function ratingOf(result) {
    if (!result) return null;
    var ids = rated().map(function (e) { return e.id; });
    var have = ids.filter(function (id) { return result.scores[id]; });
    if (have.length < ids.length) return null;
    var sum = have.reduce(function (a, id) { return a + result.scores[id].score; }, 0);
    return Math.round((sum / ids.length) * 10) / 10;
  }

  function gradeOf(rating) {
    var g = data.rating.grades;
    for (var i = 0; i < g.length; i++) if (rating >= g[i].min) return g[i].grade;
    return g[g.length - 1].grade;
  }

  function rows() {
    var q = state.q.trim().toLowerCase();
    var list = data.models
      .filter(function (m) {
        if (state.lic !== "all" && m.license_type !== state.lic) return false;
        if (state.med && !m.medical_tuned) return false;
        return !q || (m.name + " " + m.developer + " " + m.ollama).toLowerCase().indexOf(q) !== -1;
      })
      .map(function (m) {
        var r = resultFor(m);
        return { model: m, result: r, rating: ratingOf(r) };
      });

    function value(row) {
      var k = state.sortKey;
      if (k === "rating") return row.rating;
      if (k === "name") return row.model.name.toLowerCase();
      if (k === "size") return row.model.params_b;
      if (k === "speed") return row.result && row.result.speed ? row.result.speed.tokens_per_second : null;
      return row.result && row.result.scores[k] ? row.result.scores[k].score : null;
    }
    list.sort(function (a, b) {
      var x = value(a), y = value(b);
      if (x == null && y == null) return a.model.name.localeCompare(b.model.name);
      if (x == null) return 1; // models without a value always go last
      if (y == null) return -1;
      if (x < y) return -state.sortDir;
      if (x > y) return state.sortDir;
      return a.model.name.localeCompare(b.model.name);
    });
    return list;
  }

  function scoreCell(s) {
    if (!s) return '<td class="none" title="Not run yet">–</td>';
    return '<td class="score" style="--w:' + s.score + '%" title="' + s.n + ' samples">' + s.score.toFixed(1) + "<i></i></td>";
  }

  function header(key, label, title) {
    var active = state.sortKey === key;
    var sort = active ? ' aria-sort="' + (state.sortDir < 0 ? "descending" : "ascending") + '"' : "";
    return "<th" + sort + (title ? ' title="' + esc(title) + '"' : "") + '><button data-sort="' + key + '">' +
      esc(label) + (active ? (state.sortDir < 0 ? " ↓" : " ↑") : "") + "</button></th>";
  }

  function detail(row, cols) {
    var m = row.model, r = row.result;
    var run;
    if (r && !r.demo) {
      run = "<div><dt>Run</dt><dd>" + esc(r.run_date) + ", " + r.samples_per_eval + " samples per eval, seed " + esc(r.seed) + "</dd></div>" +
        "<div><dt>Hardware</dt><dd>" + esc(r.hardware) + "</dd></div>" +
        "<div><dt>Submitted by</dt><dd>" + esc(r.submitted_by) + "</dd></div>";
    } else {
      run = "<div><dt>" + (r ? "Demo scores shown" : "No results yet") + "</dt><dd>Run it yourself: <code>python evals/run_eval.py --model " +
        esc(m.id) + "</code></dd></div>";
    }
    return '<tr class="detail"><td colspan="' + cols + '"><dl>' +
      "<div><dt>Pull with Ollama</dt><dd><code>ollama pull " + esc(m.ollama) + "</code></dd></div>" +
      "<div><dt>Licence</dt><dd>" + esc(m.license) + " (" + esc(m.license_type.replace("-", " ")) + ")</dd></div>" +
      (m.hf ? '<div><dt>Model card</dt><dd><a href="https://huggingface.co/' + esc(m.hf) + '" target="_blank" rel="noopener">' + esc(m.hf) + "</a></dd></div>" : "") +
      run + "</dl></td></tr>";
  }

  function renderTable() {
    var evals = rated();
    var cols = 6 + evals.length;
    var head = "<thead><tr><th>#</th>" + header("name", "Model") + header("size", "Size") +
      header("rating", "Health rating", data.rating.method) +
      evals.map(function (e) { return header(e.id, e.short, e.name + ": " + e.metric); }).join("") +
      header("speed", "Tok/s", "Generated tokens per second. Depends on hardware.") + "</tr></thead>";

    var list = rows();
    var body = list.map(function (row, i) {
      var m = row.model, r = row.result;
      var rating = row.rating == null
        ? '<td class="none" title="Needs all seven scored evals">–</td>'
        : '<td class="rating">' + row.rating.toFixed(1) + '<span class="grade g-' + gradeOf(row.rating) + '">' + gradeOf(row.rating) + "</span></td>";
      var open = state.open === m.id;
      return '<tr class="row" data-id="' + esc(m.id) + '" tabindex="0" aria-expanded="' + open + '">' +
        '<td class="rank">' + (row.rating == null ? "–" : i + 1) + "</td>" +
        '<td class="model"><b>' + esc(m.name) + (m.medical_tuned ? '<span class="tag">medical</span>' : "") + "</b><span>" + esc(m.developer) + "</span></td>" +
        "<td>" + m.params_b + "B</td>" + rating +
        evals.map(function (e) { return scoreCell(r && r.scores[e.id]); }).join("") +
        (r && r.speed ? "<td>" + r.speed.tokens_per_second + "</td>" : '<td class="none">–</td>') +
        "</tr>" + (open ? detail(row, cols) : "");
    }).join("");

    if (!list.length) body = '<tr><td class="empty" colspan="' + cols + '">No models match these filters.</td></tr>';
    $("table").innerHTML = head + "<tbody>" + body + "</tbody>";
  }

  function renderNotice() {
    var measured = Object.keys(data.results).length;
    var html = "";
    if (state.domain !== "health") { $("notice").innerHTML = ""; return; }
    if (state.demo) {
      html = '<div class="notice demo" role="status"><p><strong>Demo scores.</strong> These numbers are generated to show how the board looks. ' +
        "They are not measurements and say nothing about any model.</p><button data-demo>Hide demo scores</button></div>";
    } else if (measured < data.models.length) {
      var missing = data.models.length - measured;
      html = '<div class="notice" role="status"><p><strong>' +
        (measured ? missing + " of " + data.models.length + " models have not been run yet." : "No model has been run yet.") +
        "</strong> Scores appear when someone runs the evals and sends the results file. " +
        '<a href="#add">How to run them</a>.</p><button data-demo>Preview with demo scores</button></div>';
    }
    $("notice").innerHTML = html;
  }

  function evalCard(e) {
    var d = e.dataset;
    var dataset = !d ? "Not chosen yet"
      : d.hf ? '<a href="https://huggingface.co/datasets/' + esc(d.hf) + '" target="_blank" rel="noopener">' + esc(d.name) + "</a>"
      : esc(d.name);
    var example = e.example
      ? "<details><summary>See an example</summary>" +
        '<p class="label">Asked</p><pre>' + esc(e.example.prompt) + "</pre>" +
        '<p class="label">Expected</p><pre>' + esc(e.example.expected) + "</pre>" +
        '<p class="how">' + esc(e.scoring) + "</p></details>"
      : '<details><summary>How it is scored</summary><p class="how">' + esc(e.scoring) + "</p></details>";
    return '<article class="card"><h3>' + esc(e.name) +
      (e.domain === "health" && !e.rated ? '<span class="planned">not in rating</span>' : "") +
      (e.domain !== "health" ? '<span class="planned">planned</span>' : "") + "</h3>" +
      "<p>" + esc(e.measures) + "</p>" +
      '<dl class="meta"><dt>Data</dt><dd>' + dataset + "</dd>" +
      (d ? "<dt>Licence</dt><dd>" + esc(d.license) + "</dd>" : "") +
      "<dt>Metric</dt><dd>" + esc(e.metric) + "</dd></dl>" + example + "</article>";
  }

  function renderDomain() {
    var health = state.domain === "health";
    $("health-view").hidden = !health;
    $("security-view").hidden = health;
    $("domains").innerHTML = data.domains.map(function (d) {
      return '<button role="tab" aria-selected="' + (d.id === state.domain) + '" data-domain="' + esc(d.id) + '">' + esc(d.name) +
        (d.status !== "active" ? '<span class="soon">planned</span>' : "") + "</button>";
    }).join("");
    if (!health) {
      var planned = data.evals.filter(function (e) { return e.domain === state.domain; });
      $("security-view").innerHTML = '<div class="notice"><p><strong>Security evals are planned, not scored yet.</strong> ' +
        "These are the evals being drafted. Each needs an openly licensed dataset before it can be added. " +
        '<a href="' + REPO + '/issues" target="_blank" rel="noopener">Suggest one in an issue</a>.</p></div>' +
        '<div class="cards">' + planned.map(evalCard).join("") + "</div>";
    }
    renderNotice();
  }

  function renderStatic() {
    var health = data.evals.filter(function (e) { return e.domain === "health"; });
    $("eval-cards").innerHTML = health.map(evalCard).join("");
    var datasets = {};
    health.forEach(function (e) { if (e.dataset && e.dataset.hf) datasets[e.dataset.hf] = 1; });
    $("counts").innerHTML = [
      [data.models.length, "open models listed"],
      [Object.keys(data.results).length, "with measured results"],
      [rated().length, "scored health evals"],
      [Object.keys(datasets).length, "open datasets"],
    ].map(function (c) { return "<div><dt>" + c[0] + "</dt><dd>" + c[1] + "</dd></div>"; }).join("");
    $("rating-note").textContent = "Health rating: " + data.rating.method + " Grades: " +
      data.rating.grades.map(function (g) { return g.grade + " from " + g.min; }).join(", ") +
      ". Click a row for details, or a column heading to sort.";
    $("built").textContent = "Data built " + data.built_at;
  }

  function toggleRow(id) { state.open = state.open === id ? null : id; renderTable(); }

  function bind() {
    $("q").addEventListener("input", function (e) { state.q = e.target.value; renderTable(); });
    $("lic").addEventListener("change", function (e) { state.lic = e.target.value; renderTable(); });
    $("med").addEventListener("change", function (e) { state.med = e.target.checked; renderTable(); });
    $("table").addEventListener("click", function (e) {
      var sort = e.target.closest("[data-sort]");
      if (sort) {
        var key = sort.getAttribute("data-sort");
        if (state.sortKey === key) state.sortDir = -state.sortDir;
        else { state.sortKey = key; state.sortDir = key === "name" ? 1 : -1; }
        return renderTable();
      }
      if (e.target.closest("a")) return;
      var row = e.target.closest("tr.row");
      if (row) toggleRow(row.getAttribute("data-id"));
    });
    $("table").addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("tr.row")) {
        e.preventDefault();
        var id = e.target.getAttribute("data-id");
        toggleRow(id);
        var again = document.querySelector('tr.row[data-id="' + id + '"]');
        if (again) again.focus();
      }
    });
    $("domains").addEventListener("click", function (e) {
      var b = e.target.closest("[data-domain]");
      if (b) { state.domain = b.getAttribute("data-domain"); renderDomain(); }
    });
    $("notice").addEventListener("click", function (e) {
      if (e.target.closest("[data-demo]")) { state.demo = !state.demo; renderNotice(); renderTable(); }
    });
    $("theme").addEventListener("click", function () {
      var root = document.documentElement;
      var now = root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = now === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (err) {}
    });
  }

  fetch("data.json")
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (json) { data = json; bind(); renderStatic(); renderDomain(); renderTable(); })
    .catch(function (err) {
      $("notice").innerHTML = '<div class="notice"><p><strong>Could not load the data.</strong> Run <code>npm start</code> from the repo root so the site is served with data.json. (' +
        esc(err.message) + ")</p></div>";
    });
})();
