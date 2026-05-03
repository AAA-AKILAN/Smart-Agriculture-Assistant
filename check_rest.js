(async function() {
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAuOjsPqMn4iey-xK9ZryCOfQJOi64vQlg");
  const data = await r.json();
  console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
})();
