document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('apiKeyInput');
  const save = document.getElementById('saveKey');
  input.value = localStorage.getItem('openrouter_api_key') || '';
  save.onclick = () => {
    localStorage.setItem('openrouter_api_key', input.value);
    alert('تم الحفظ');
  };
});