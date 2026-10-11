/* =========================================================
   Eventli pricing: every fee figure and the calculator maths.
   Competitor rates checked October 2026. RECHECK BEFORE LAUNCH.
   Assumptions: organiser absorbs fees, one ticket per order, UK cards.
   ========================================================= */
(function (root) {
  var PRICING = {
    checkedOn: "October 2026",
    stripe: { pct: 0.015, fixed: 0.2 },        // Stripe UK standard cards
    eventli: { pct: 0.03, fixed: 0.1 },
    plus: { monthly: 29, yearly: 249 },
    eventbrite: { pct: 0.0695, fixed: 0.59 },  // card processing included
    luma: { pct: 0.05 },                       // + Stripe
    lumaPlus: { monthly: 47 },                 // approx, from $59/mo billed annually; + Stripe
    ticketTailor: { fixedExVat: 0.6, vatRate: 0.2 } // pay as you sell; + Stripe
  };

  function money(v) {
    return "£" + v.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calculateFees(priceIn, ticketsIn, plan) {
    var price = Math.max(0, isFinite(priceIn) ? priceIn : 0);
    var tickets = Math.max(0, Math.round(isFinite(ticketsIn) ? ticketsIn : 0));
    var paid = price > 0;
    var stripe = paid ? price * PRICING.stripe.pct + PRICING.stripe.fixed : 0;
    var platform = paid ? price * PRICING.eventli.pct + PRICING.eventli.fixed : 0;

    var eventli;
    if (plan === "founding") eventli = { key: "eventli", name: "Eventli (founding)", per: stripe, fixed: 0, basis: "0% Eventli fee + Stripe" };
    else if (plan === "plus") eventli = { key: "eventli", name: "Eventli Plus", per: stripe, fixed: paid ? PRICING.plus.monthly : 0, basis: "0% fee + Stripe + £29/mo" };
    else eventli = { key: "eventli", name: "Eventli", per: platform + stripe, fixed: 0, basis: "3% + 10p + Stripe" };

    var tt = PRICING.ticketTailor.fixedExVat * (1 + PRICING.ticketTailor.vatRate);
    var defs = [
      eventli,
      { key: "eventbrite", name: "Eventbrite", per: paid ? price * PRICING.eventbrite.pct + PRICING.eventbrite.fixed : 0, fixed: 0, basis: "6.95% + 59p" },
      { key: "luma", name: "Luma (free plan)", per: paid ? price * PRICING.luma.pct + stripe : 0, fixed: 0, basis: "5% + Stripe" },
      { key: "tt", name: "Ticket Tailor", per: paid ? tt + stripe : 0, fixed: 0, basis: "60p + VAT + Stripe" }
    ];
    if (plan === "plus") {
      defs.push({ key: "lumaplus", name: "Luma Plus", per: stripe, fixed: paid ? PRICING.lumaPlus.monthly : 0, basis: "0% fee + Stripe + ~£47/mo" });
    }

    var totals = defs.map(function (d) { return d.per * tickets + d.fixed; });
    var min = Math.min.apply(null, totals);
    var eTotal = totals[0];
    var rows = defs.map(function (d, i) {
      return {
        key: d.key, name: d.name, basis: d.basis, total: totals[i],
        perTicket: tickets > 0 ? totals[i] / tickets : 0,
        isEventli: i === 0,
        cheapest: paid && Math.abs(totals[i] - min) < 0.005,
        diffVsEventli: totals[i] - eTotal
      };
    });

    var verdict;
    if (!paid) {
      verdict = "Free events cost nothing on Eventli, with no cap on tickets.";
    } else {
      var cheapest = rows.filter(function (r) { return r.cheapest; })[0];
      verdict = rows[0].cheapest
        ? "At this price, Eventli is the cheapest option here."
        : "At this price " + cheapest.name + " comes out cheaper on fees alone. Eventli's edge is the community: the WhatsApp event chat, seeing who's going, and attendees who come back.";
      if (plan === "plus") {
        var stdTotal = (platform + stripe) * tickets;
        if (eTotal < stdTotal) verdict += " Plus saves you " + money(stdTotal - eTotal) + " this month compared with the standard plan.";
        else verdict += " At this volume the standard plan is cheaper. Plus pays for itself from about " + Math.ceil(PRICING.plus.monthly / platform) + " tickets a month at this price.";
      }
      if (plan === "founding") verdict += " Founding rate applies for your first six months, then your pricing is locked for 24 months.";
    }

    return { rows: rows, paid: paid, tickets: tickets, price: price, savingVsEventbrite: Math.max(0, totals[1] - eTotal), verdict: verdict };
  }

  var api = { PRICING: PRICING, money: money, calculateFees: calculateFees };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.EventliPricing = api;
})(this);
