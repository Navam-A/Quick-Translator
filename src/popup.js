document.getElementById("btn").addEventListener("click", async () => {
  const text = document.getElementById("text").value;
  if (!text) return;

  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${text}&langpair=en|hi`
  );
  const data = await res.json();
  document.getElementById("output").innerText =
    "Translation: " + data.responseData.translatedText;
});
