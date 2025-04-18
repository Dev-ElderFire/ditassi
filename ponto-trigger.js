
document.addEventListener('DOMContentLoaded', () => {
  // Cria um botão flutuante só pra testar
  const btn = document.createElement('button');
  btn.innerText = 'Bater ponto';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.zIndex = '9999';
  btn.style.padding = '10px';
  btn.style.backgroundColor = '#008000';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.cursor = 'pointer';

  btn.addEventListener('click', async () => {
    // Get the logged in user from localStorage if available
    let userId = null;
    try {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        userId = user.id;
      }
    } catch (e) {
      console.error("Error getting user from localStorage:", e);
    }
    
    // If not logged in, prompt for ID
    if (!userId) {
      userId = prompt('Digite o ID do usuário:');
    }
    
    const horario = new Date().toISOString();

    try {
      const res = await fetch('/api/bater-ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, horario }),
      });

      const data = await res.json();
      alert(data.message || 'Ponto registrado!');
    } catch (e) {
      alert('Erro ao bater ponto: ' + e.message);
    }
  });

  document.body.appendChild(btn);
});
