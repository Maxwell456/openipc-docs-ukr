---
title: OpenFPV — Документація OpenIPC українською мовою
hide:
  - navigation
  - toc
---

<div class="hero" markdown="1">

<!-- Ad Banner (above the title) -->
<div id="ad-banner-wrap" onclick="document.getElementById('ad-modal').style.display='flex'" class="ad-banner">
  <!-- TO INSERT IMAGE: replace the div below with: <img src="images/banner.png" alt="Ad"> -->
  <div class="ad-banner__placeholder">
    <div style="font-size:1.1rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Тут може бути ваша реклама</div>
    <div style="font-size:0.75rem;opacity:0.7;margin-top:4px;">Натисніть для замовлення</div>
  </div>
</div>

# OpenIPC FPV — документація та підтримка українською {: .hero__title }

<div class="hero__description" markdown="1">

OpenIPC — це відкрита платформа, яка перетворює IP-камери на цифрові FPV-системи.<br>
Цей проект створено спільнотою — відкритий, гнучкий і постійно оновлюється.

</div>

<div class="hero__buttons" markdown="1">

[🚀 Швидкий старт](quick-start/){ .md-button .md-button--primary }
[Налаштування дрону](drone/){ .md-button }
[Оновлення](update/){ .md-button }
[<img src="images/icon-firmware.png" style="width:25px; height:25px; vertical-align: middle; margin-right: 6px;" alt="Firmware"> Прошивки](https://github.com/OpenIPC/builder/releases/tag/latest){ .md-button target="_blank" }
[<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 6px;"><path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.28 3.438 9.747 8.205 11.325.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.832 2.81 1.303 3.495.997.108-.776.42-1.303.762-1.602-2.665-.303-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.51 11.51 0 0 1 3.003-.404c1.02.005 2.048.137 3.004.404 2.29-1.553 3.296-1.23 3.296-1.23.654 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.624-5.475 5.92.43.37.823 1.096.823 2.21v3.285c0 .32.216.694.825.576C20.565 22.244 24 17.777 24 12.5 24 5.87 12 .5z"/></svg> GitHub](https://github.com/OpenIPC){ .md-button target="_blank" }

</div>

<div class="hero__note" markdown="1">

⚠️ Цей сайт створений українською спільнотою користувачів OpenIPC і не є офіційним ресурсом.

</div>

</div>

<!-- Ad Modal -->
<div id="ad-modal" style="display:none;position:fixed;z-index:99999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);align-items:center;justify-content:center;">
  <div style="background:#1e293b;color:#f8fafc;padding:2rem;border-radius:16px;width:90%;max-width:480px;position:relative;box-shadow:0 25px 60px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);">
    <span id="ad-modal-close" style="position:absolute;top:1rem;right:1.2rem;font-size:1.5rem;cursor:pointer;color:#94a3b8;line-height:1;">&times;</span>
    <h2 style="margin:0 0 1.5rem;font-size:1.4rem;color:#3b82f6;border:none;">Замовити рекламу</h2>
    <div id="ad-status" style="display:none;padding:0.75rem;border-radius:8px;margin-bottom:1rem;font-size:0.9rem;"></div>
    <form id="ad-contact-form" style="display:flex;flex-direction:column;gap:1rem;">
      <!-- Honeypot — прихований від людей, але боти його заповнюють -->
      <input type="checkbox" name="botcheck" style="display:none;" tabindex="-1" autocomplete="off">
      <input type="text" id="ad-name" placeholder="Ваше ім'я" required style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:0.75rem;color:#f8fafc;font-family:inherit;font-size:0.9rem;outline:none;">
      <input type="email" id="ad-email" placeholder="Ваш емейл" required style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:0.75rem;color:#f8fafc;font-family:inherit;font-size:0.9rem;outline:none;">
      <textarea id="ad-message" placeholder="Ваше повідомлення" required rows="4" style="background:#0f172a;border:1px solid #334155;border-radius:8px;padding:0.75rem;color:#f8fafc;font-family:inherit;font-size:0.9rem;outline:none;resize:vertical;"></textarea>
      <button id="ad-submit-btn" type="button" onclick="sendAdEmail()" style="background:#3b82f6;color:#fff;border:none;padding:0.8rem;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;">Відправити</button>
    </form>
  </div>
</div>

<script>
(function(){
  var modal=document.getElementById('ad-modal');
  document.getElementById('ad-modal-close').onclick=function(){modal.style.display='none';};
  window.addEventListener('click',function(e){if(e.target===modal)modal.style.display='none';});
})();

function sendAdEmail(){
  var botcheck=document.querySelector('[name="botcheck"]');
  if(botcheck && botcheck.checked) return;

  var name=(document.getElementById('ad-name').value||'').trim();
  var email=(document.getElementById('ad-email').value||'').trim();
  var message=(document.getElementById('ad-message').value||'').trim();
  var status=document.getElementById('ad-status');
  var btn=document.getElementById('ad-submit-btn');

  if(!name||!email||!message){
    status.innerText='Будь ласка, заповніть всі поля.';
    status.style.cssText='display:block;padding:0.75rem;border-radius:8px;background:rgba(239,68,68,0.15);color:#f87171;font-size:0.9rem;margin-bottom:1rem;';
    return;
  }

  btn.disabled=true; btn.innerText='Надсилається...'; status.style.display='none';

  fetch('https://form.openfpv.workers.dev',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({
      access_key:'58a53acb-8863-4ffe-8eb0-4b51eb6e9322',
      subject:'Замовлення реклами від '+name,
      name:name,
      email:email,
      message:message,
      botcheck: botcheck ? botcheck.checked : false
    })
  })
  .then(function(r){return r.json();})
  .then(function(d){
    if(d.success){
      status.innerText='✅ Листа надіслано! Ми зв\'яжемось з вами найближчим часом.';
      status.style.cssText='display:block;padding:0.75rem;border-radius:8px;background:rgba(34,197,94,0.15);color:#4ade80;font-size:0.9rem;margin-bottom:1rem;';
      document.getElementById('ad-contact-form').reset();
      setTimeout(function(){document.getElementById('ad-modal').style.display='none';status.style.display='none';},3500);
    } else {
      throw new Error(d.message||'Error');
    }
  })
  .catch(function(err){
    status.innerText='❌ Помилка надсилання. Спробуйте ще раз або напишіть на openfpv.com.ua@gmail.com';
    status.style.cssText='display:block;padding:0.75rem;border-radius:8px;background:rgba(239,68,68,0.15);color:#f87171;font-size:0.9rem;margin-bottom:1rem;';
  })
  .finally(function(){btn.disabled=false;btn.innerText='Відправити';});
}
</script>