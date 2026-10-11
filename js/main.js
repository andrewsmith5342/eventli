/* Eventli landing page interactions: audience switch and fee calculator.
   The FAQ uses native <details> elements, so it needs no script. */
(function () {
  "use strict";

  /* ---------- Audience switch ---------- */
  var switchBtns = document.querySelectorAll("[data-audience-btn]");
  var panels = document.querySelectorAll("[data-audience]");
  switchBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("data-audience-btn");
      switchBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-audience") !== target; });
    });
  });

  /* ---------- Fee calculator ---------- */
  var P = window.EventliPricing;
  var priceInput = document.getElementById("calc-price");
  var ticketsInput = document.getElementById("calc-tickets");
  if (!P || !priceInput || !ticketsInput) return;

  var ticketsOut = document.getElementById("calc-tickets-out");
  var rowsEl = document.getElementById("calc-rows");
  var titleEl = document.getElementById("calc-title");
  var verdictEl = document.getElementById("calc-verdict");
  var headLabel = document.getElementById("calc-headline-label");
  var headValue = document.getElementById("calc-headline-value");
  var planBtns = document.querySelectorAll("[data-plan]");
  var plan = "standard";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function render() {
    var r = P.calculateFees(parseFloat(priceInput.value) || 0, Number(ticketsInput.value), plan);
    var max = Math.max.apply(null, r.rows.map(function (x) { return x.total; }).concat([0.0001]));

    ticketsOut.textContent = r.tickets;
    titleEl.textContent = "Total fees for " + r.tickets + " tickets at " + P.money(r.price);
    headLabel.textContent = r.paid ? "You keep vs Eventbrite" : "Free event?";
    headValue.textContent = r.paid ? P.money(r.savingVsEventbrite) : "£0 in fees";
    verdictEl.textContent = r.verdict;

    rowsEl.textContent = "";
    r.rows.forEach(function (row) {
      var item = el("li", "fee-row" + (row.isEventli ? " fee-row--eventli" : ""));

      var top = el("div", "fee-row__top");
      var name = el("span", "fee-row__name", row.name);
      if (row.cheapest) name.appendChild(el("span", "tag tag--good", "Cheapest"));
      top.appendChild(name);
      top.appendChild(el("span", "fee-row__total", P.money(row.total)));

      var bar = el("span", "bar");
      var fill = el("span", "bar__fill");
      fill.style.width = r.paid ? Math.max(2, (row.total / max) * 100) + "%" : "0%";
      bar.appendChild(fill);

      var bottom = el("div", "fee-row__bottom");
      bottom.appendChild(el("span", null, P.money(row.perTicket) + " per ticket, " + row.basis));
      if (!row.isEventli && r.paid) {
        var d = row.diffVsEventli, txt, mod = "";
        if (d > 0.005) { txt = P.money(d) + " more than Eventli"; mod = " fee-row__diff--more"; }
        else if (d < -0.005) { txt = P.money(-d) + " less than Eventli"; mod = " fee-row__diff--less"; }
        else txt = "Same as Eventli";
        bottom.appendChild(el("span", "fee-row__diff" + mod, txt));
      }

      item.appendChild(top);
      item.appendChild(bar);
      item.appendChild(bottom);
      rowsEl.appendChild(item);
    });
  }

  planBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      plan = btn.getAttribute("data-plan");
      planBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      render();
    });
  });
  priceInput.addEventListener("input", render);
  ticketsInput.addEventListener("input", render);
  render();
})();
