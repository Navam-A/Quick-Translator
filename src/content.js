import { API_KEY, VOICE_ID } from "./config.js";

async function speechFunction(translatedTxt) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: translatedTxt,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}

document.addEventListener("mouseup", async (e) => {
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText) return;

  // Remove any old popups before creating a new one
  document.getElementById("translatePopUp")?.remove();
  document.getElementById("translatedPopUp")?.remove();
  document.getElementById("speakBtn")?.remove();

  // CREATE TRANSLATE POPUP
  let popUP = document.createElement("div");
  popUP.id = "translatePopUp";
  popUP.innerText = "Translate?";
  Object.assign(popUP.style, {
    position: "absolute",
    left: e.pageX + "px",
    top: e.pageY + "px",
    background: "#443f3fff",
    color: "#fff",
    border: "1px solid #ccc",
    padding: "4px 8px",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: "9999",
  });

  popUP.onclick = async (event) => {
    event.stopPropagation();

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        selectedText
      )}&langpair=en|mr`
    );

    const data = await response.json();
    console.log(data);

    popUP.remove();

    const res = document.createElement("div");
    res.id = "translatedPopUp";
    res.innerText = data.responseData.translatedText;
    Object.assign(res.style, {
      position: "absolute",
      left: e.pageX + "px",
      top: e.pageY + "px",
      background: "#443f3fff",
      color: "#fff",
      border: "1px solid #ccc",
      padding: "4px 8px",
      borderRadius: "5px",
      cursor: "pointer",
      zIndex: "9999",
    });

    res.onclick = (event) => {
      event.stopPropagation();
      res.remove();
    };

    // Append the translated text before for measuring its width
    document.body.appendChild(res);

    let speakBtn = document.createElement("div");
    speakBtn.id = "speakBtn";
    speakBtn.innerText = "Speak🔊";
    Object.assign(speakBtn.style, {
      position: "absolute",
      left: e.pageX + res.offsetWidth + 10 + "px",
      top: e.pageY + "px",
      background: "#443f3fff",
      color: "#fff",
      border: "1px solid #ccc",
      padding: "4px 8px",
      borderRadius: "5px",
      cursor: "pointer",
      zIndex: "9999",
    });

    speakBtn.onclick = async (event) => {
      event.stopPropagation();
      speakBtn.innerText = "🔊 Speaking...";
      await speechFunction(data.responseData.translatedText);
      setTimeout(() => speakBtn.remove(), 3000);
    };

    // Auto remove translation after 5 sec
    setTimeout(() => {
      res.remove();
      speakBtn.remove();
    }, 5000);

    document.body.appendChild(speakBtn);
  };

  document.body.appendChild(popUP);
});

document.addEventListener("mousedown", (e) => {
  let translatePopUp = document.getElementById("translatePopUp");
  let translatedPopUp = document.getElementById("translatedPopUp");
  let speakBtn = document.getElementById("speakBtn");

  if (
    translatePopUp?.contains(e.target) ||
    translatedPopUp?.contains(e.target) ||
    speakBtn?.contains(e.target)
  ) {
    return;
  }

  translatePopUp?.remove();
  translatedPopUp?.remove();
  speakBtn?.remove();
});
