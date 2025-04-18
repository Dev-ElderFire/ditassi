
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
    const type = 'check-in';
    const device = 'web';
    
    // Get current location if available
    let location = null;
    try {
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
      }
    } catch (e) {
      console.warn("Error getting location:", e);
    }

    try {
      const res = await fetch('/api/bater-ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          horario,
          type,
          device,
          location
        }),
      });

      const data = await res.json();
      alert(data.message || 'Ponto registrado!');
    } catch (e) {
      alert('Erro ao bater ponto: ' + e.message);
      
      // Tenta salvar localmente se falhar online
      const offlineRecord = {
        id: Date.now().toString(),
        userId: userId,
        timestamp: horario,
        type: type,
        device: device,
        location: location
      };
      
      try {
        const pendingRecordsJson = localStorage.getItem('pending_time_records');
        const pendingRecords = pendingRecordsJson ? JSON.parse(pendingRecordsJson) : [];
        pendingRecords.push(offlineRecord);
        localStorage.setItem('pending_time_records', JSON.stringify(pendingRecords));
        alert('Ponto salvo localmente. Será sincronizado quando houver conexão.');
      } catch (e) {
        alert('Erro ao salvar localmente: ' + e.message);
      }
    }
  });

  document.body.appendChild(btn);
});
