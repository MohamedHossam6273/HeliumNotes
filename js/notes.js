document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveNote');
  const processBtn = document.getElementById('processNotes');
  const title = document.getElementById('noteTitle');
  const body = document.getElementById('noteBody');
  const notesList = document.getElementById('notesList');
  const output = document.getElementById('aiOutput');

  function renderNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notesList.innerHTML = '';
    notes.forEach((n, i) => {
      const div = document.createElement('div');
      div.textContent = n.title + ': ' + n.body;
      notesList.appendChild(div);
    });
  }
  renderNotes();

  saveBtn.onclick = () => {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push({ title: title.value, body: body.value });
    localStorage.setItem('notes', JSON.stringify(notes));
    title.value = ''; body.value = '';
    renderNotes();
  };

  processBtn.onclick = async () => {
    const key = localStorage.getItem('openrouter_api_key');
    if (!key) { alert('ضع مفتاح OpenRouter في الإعدادات أولاً'); return; }
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const text = notes.map(n => n.title + ': ' + n.body).join('\n');
    const prompt = 'حلل هذه الملاحظات: ' + text + '\nثم اعطيني خطة عملية ونقاط أنماط سلوك واضحة باللغة العربية.';

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const j = await res.json();
    output.textContent = j.choices?.[0]?.message?.content || 'خطأ';
  };
});