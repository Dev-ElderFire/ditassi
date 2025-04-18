
document.addEventListener('DOMContentLoaded', () => {
  // Create floating button for testing
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
  
  // Try to sync any pending records when the page loads
  syncPendingRecords();

  btn.addEventListener('click', async () => {
    // Get logged in user from localStorage
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
    
    if (!userId) {
      userId = prompt('Digite o ID do usuário:');
      if (!userId) {
        alert('É necessário informar um ID de usuário para registrar o ponto.');
        return;
      }
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

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      alert(data.message || 'Ponto registrado!');
    } catch (e) {
      console.error('Error submitting time record:', e);
      alert('Erro ao bater ponto: ' + e.message);
      
      // Save locally if online sync fails
      saveOfflineRecord(userId, horario, type, device, location);
    }
  });

  document.body.appendChild(btn);
});

// Function to save offline record
function saveOfflineRecord(userId, timestamp, type, device, location) {
  try {
    // Generate a UUID if possible
    let id;
    if (window.crypto && window.crypto.randomUUID) {
      id = window.crypto.randomUUID();
    } else {
      id = Date.now().toString(); // Fallback for older browsers
    }
    
    const offlineRecord = {
      id,
      userId,
      timestamp,
      type,
      device,
      location,
      synced: false
    };
    
    const pendingRecordsJson = localStorage.getItem('pending_time_records');
    const pendingRecords = pendingRecordsJson ? JSON.parse(pendingRecordsJson) : [];
    pendingRecords.push(offlineRecord);
    localStorage.setItem('pending_time_records', JSON.stringify(pendingRecords));
    alert('Ponto salvo localmente. Será sincronizado quando houver conexão.');
  } catch (e) {
    console.error('Error saving record locally:', e);
    alert('Erro ao salvar localmente: ' + e.message);
  }
}

// Function to sync pending records
async function syncPendingRecords() {
  try {
    const pendingRecordsJson = localStorage.getItem('pending_time_records');
    if (!pendingRecordsJson) return;
    
    const pendingRecords = JSON.parse(pendingRecordsJson);
    if (!pendingRecords || pendingRecords.length === 0) return;
    
    console.log(`Attempting to sync ${pendingRecords.length} pending records...`);
    
    const recordsToKeep = [];
    
    for (const record of pendingRecords) {
      if (record.synced) continue;
      
      try {
        const res = await fetch('/api/bater-ponto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: record.userId,
            horario: record.timestamp,
            type: record.type,
            device: record.device,
            location: record.location,
            offline_id: record.id
          }),
        });
        
        if (res.ok) {
          record.synced = true;
          console.log(`Record ${record.id} synced successfully`);
        } else {
          recordsToKeep.push(record);
          console.warn(`Failed to sync record ${record.id}`);
        }
      } catch (e) {
        console.error(`Error syncing record ${record.id}:`, e);
        recordsToKeep.push(record);
      }
    }
    
    if (recordsToKeep.length > 0) {
      localStorage.setItem('pending_time_records', JSON.stringify(recordsToKeep));
      console.log(`${recordsToKeep.length} records still pending sync`);
    } else {
      localStorage.removeItem('pending_time_records');
      console.log('All records synced successfully');
    }
  } catch (e) {
    console.error('Error syncing pending records:', e);
  }
}

// Attempt to sync records when online status changes
window.addEventListener('online', () => {
  console.log('Network connection restored. Attempting to sync...');
  syncPendingRecords();
});
