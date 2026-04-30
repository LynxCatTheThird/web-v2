(function () {
  window.renderers.push(() => {
    const input = document.getElementById("crypto");
    const content = document.getElementById("crypto-content");
    if (!input || !content) return;

    input.addEventListener("input", () => {
      let value = input.value;
      let { encrypted, shasum } = input.dataset;
      try {
        let decrypted = CryptoJS.AES.decrypt(encrypted, value).toString(
          CryptoJS.enc.Utf8,
        );
        if (CryptoJS.SHA256(decrypted).toString() === shasum) {
          input.classList.remove("failure");
          input.classList.add("success");
          input.disabled = true;
          content.innerHTML = decrypted;
          content.classList.remove("fade-hidden");
          window.renderers.forEach((fn) => fn());
        } else {
          input.classList.add("failure");
          input.classList.remove("success");
        }
      } catch {
        input.classList.add("failure");
        input.classList.remove("success");
      }
    });
  });
})();
