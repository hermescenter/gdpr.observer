---
title: "Homepage"
meta_title: "GDPR observer"
description: "In support of European Institutions and DPOs"
intro_image: "images/illustrations/eu_map.svg"
intro_image_absolute: true
intro_image_hide_on_mobile: true
---

#### It is a free software-based **infrastructure**.

---

#### It **supports many observatories** to ensure that Member State institutions are **GDPR**-compliant.

---

#### **Focus on:** web-trackers, informed consent, transport security, cloud location, cookies, and more.

<script type="text/javascript">

function handleClick(doc, twolcc, href) {

  doc.addEventListener('click', function(e) {
    console.log(e.originalTarget.id)
    if (e.originalTarget.attributes.getNamedItem("style")) {
      let value =  e.originalTarget.attributes.getNamedItem("style").nodeValue
      let index = value.indexOf("fill:")
      let index_2 = value.indexOf(";", index)

      value = value.substr(index +5, index_2-5 )

      if ( value == "#f24088" || value == " rgb(242, 64, 136)") {
        location.href = href ? href : window.location + "campaign/" + e.originalTarget.id;
      }
    }
  });
}

function styleCountry(doc, country) {
  doc.addEventListener('mouseover', function(e) {
    if (e.originalTarget.attributes.getNamedItem("style")) {
      let value =  e.originalTarget.attributes.getNamedItem("style").nodeValue
      let index = value.indexOf("fill:")
      let index_2 = value.indexOf(";", index)

      value = value.substr(index +5, index_2-5 )

      if ( value == "#f24088" || value == " rgb(242, 64, 136)") {
        e.originalTarget.style.cursor = "pointer"
      }
    }
  })
}

function debug(doc, country) {
  console.log("cccscscdsmpcmsodp");
  debugger;
}

window.onload = function () {
  let elem = document.getElementById('map')
  const doc = elem.getSVGDocument(); // that's the inner document
  handleClick(doc);
  styleCountry(doc);
  debug(doc);
};

</script>
