document.addEventListener("DOMContentLoaded", function () {
    let lastSelection = "";
  
    // Зберігаємо останнє виділення
    document.addEventListener("selectionchange", () => {
      const text = window.getSelection().toString().trim();
      if (text) lastSelection = text;
    });
  
    const banner = document.createElement("div");
    banner.id = "report-feedback";
  
    // Стилі контейнера
    Object.assign(banner.style, {
      position: "fixed",
      bottom: "20px",
      right: "15px",
      zIndex: "9999",
      fontFamily: "system-ui, sans-serif",
      opacity: "0",
      transform: "translateY(20px)",
      transition: "all 0.4s ease",
      pointerEvents: "none",
      maxWidth: "90vw"
    });
  
    const box = document.createElement("div");
    Object.assign(box.style, {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      backgroundColor: "#212121",
      color: "#fff",
      border: "2px solid #00e0b2",
      borderRadius: "14px",
      boxShadow: "0 4px 16px rgba(0, 224, 178, 0.25)",
      cursor: "pointer",
      fontSize: "14px",
      wordBreak: "break-word",
      flexWrap: "wrap"
    });
  
    const text = document.createElement("span");
    text.innerHTML = 'Знайшли помилку? <strong>Натисніть тут</strong>';
  
    box.appendChild(text);
    banner.appendChild(box);
    document.body.appendChild(banner);
  
    // Плавна поява
    setTimeout(() => {
      banner.style.opacity = "1";
      banner.style.transform = "translateY(0)";
      banner.style.pointerEvents = "auto";
    }, 500);
  
    // Hover-ефект
    box.addEventListener("mouseover", () => {
      box.style.backgroundColor = "#2c2c2c";
      box.style.borderColor = "#00ffd5";
    });
  
    box.addEventListener("mouseout", () => {
      box.style.backgroundColor = "#212121";
      box.style.borderColor = "#00e0b2";
    });
  
    // Клік з перевіркою виділення
    box.addEventListener("click", () => {
      const selectedText = lastSelection.trim();
      const pageUrl = window.location.href;
  
      if (!selectedText) {
        alert("Спочатку виділіть текст, у якому ви помітили помилку.");
        return;
      }
  
      const issueTitle = encodeURIComponent("Помилка в документації");
      const issueBody = encodeURIComponent(
        `**Виділений текст:**\n\n> ${selectedText}\n\n**URL сторінки:** ${pageUrl}`
      );
  
      const url = `https://github.com/Maxwell456/openipc-docs-ukr/issues/new?title=${issueTitle}&body=${issueBody}`;
      window.open(url, "_blank");
    });
  });
  