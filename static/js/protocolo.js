// Carrega os dados do paciente
async function carregarPaciente() {
    const pacienteId = sessionStorage.getItem('pacienteId');
    try {
        const response = await fetch(`/api/pacientes/${pacienteId}`);
        const paciente = await response.json();
        
        if (paciente.error) {
            document.getElementById('pacienteInfo').innerHTML = 'Paciente não encontrado';
            return;
        }
        
        document.getElementById('pacienteInfo').innerHTML = `
            <strong>Paciente:</strong> ${paciente.nome}<br>
            <small>ID: ${paciente.id_documento}</small>
        `;
    } catch (error) {
        console.error('Erro ao carregar paciente:', error);
    }
}

// Carrega os alertas para uma seção específica
async function carregarAlertas(tipo) {
    try {
        const response = await fetch(`/api/alertas?tipo=${tipo}`);
        const alertas = await response.json();
        
        return alertas.map(alerta => `
            <div class="alert-card ${alerta.gravidade}">
                <div class="card-body">
                    <h5 class="card-title">${alerta.descricao}</h5>
                    <div class="card-text">
                        <strong>Soluções:</strong>
                        <ul>
                            ${alerta.solucoes.map(solucao => `<li>${solucao}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar alertas:', error);
        return '';
    }
}

// Salva a avaliação
async function salvarAvaliacao() {
    const profissionalId = sessionStorage.getItem('profissionalId');
    const pacienteId = sessionStorage.getItem('pacienteId');
    
    const avaliacao = {
        profissional_id: profissionalId,
        paciente_id: pacienteId,
        timestamp: new Date().toISOString(),
        via_aerea: {
            notas: document.querySelector('textarea[data-section="viaAerea"]').value,
            checklist: getChecklistValues('viaAerea')
        },
        respiracao: {
            notas: document.querySelector('textarea[data-section="respiracao"]').value,
            checklist: getChecklistValues('respiracao')
        },
        circulacao: {
            notas: document.querySelector('textarea[data-section="circulacao"]').value,
            checklist: getChecklistValues('circulacao')
        }
    };
    
    try {
        const response = await fetch('/api/avaliacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(avaliacao)
        });
        
        const result = await response.json();
        
        if (result.id) {
            alert('Avaliação salva com sucesso!');
        } else {
            alert('Erro ao salvar avaliação');
        }
    } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
        alert('Erro ao salvar avaliação');
    }
}

// Retorna os valores marcados no checklist de uma seção
function getChecklistValues(section) {
    const checklist = document.querySelectorAll(`#${section}Checklist input[type="checkbox"]`);
    const values = {};
    checklist.forEach(item => {
        values[item.id] = item.checked;
    });
    return values;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarPaciente();
    
    // Carrega os alertas para cada seção
    ['viaAerea', 'respiracao', 'circulacao'].forEach(async (section) => {
        const alertasHtml = await carregarAlertas(section);
        document.getElementById(`${section}Checklist`).innerHTML = alertasHtml;
    });
    
    // Configura o botão de salvar
    document.getElementById('salvarAvaliacao').addEventListener('click', salvarAvaliacao);
});
