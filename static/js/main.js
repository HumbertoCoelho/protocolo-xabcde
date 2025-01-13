document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profissionalId = document.getElementById('profissionalId').value;
    const pacienteId = document.getElementById('pacienteId').value;
    
    // Armazena os IDs na sessionStorage
    sessionStorage.setItem('profissionalId', profissionalId);
    sessionStorage.setItem('pacienteId', pacienteId);
    
    // Redireciona para a página do protocolo
    window.location.href = '/protocolo';
});
