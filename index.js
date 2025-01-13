import { Capacitor } from '@capacitor/core';

// Inicializa o app
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se está rodando em ambiente nativo
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        // Configurações específicas para ambiente mobile
        document.body.classList.add('mobile-app');
        
        // Ajusta o viewport para mobile
        const viewport = document.querySelector('meta[name=viewport]');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    const form = document.getElementById('protocolForm');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const resultContent = document.getElementById('resultContent');
    const toast = document.getElementById('toast');
    const offlineStatus = document.querySelector('.offline-status');

    // Verificar status de conexão
    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineStatus.style.display = 'none';
        } else {
            offlineStatus.style.display = 'block';
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Mostrar toast notification
    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }

    // Gerar recomendações baseadas nas avaliações
    function generateRecommendations(data) {
        let recommendations = [];

        // X - Hemorragia
        if (data.hemorrhageStatus === 'sim') {
            recommendations.push('PRIORIDADE: Controle imediato da hemorragia exsanguinante!');
            recommendations.push('- Aplicar pressão direta');
            recommendations.push('- Considerar uso de torniquete se apropriado');
            recommendations.push('- Avaliar necessidade de hemoderivados');
        }

        // A - Via Aérea
        switch (data.airwayStatus) {
            case 'parcial':
                recommendations.push('Via Aérea: Necessita intervenção!');
                recommendations.push('- Considerar manobras de desobstrução');
                recommendations.push('- Preparar para possível via aérea definitiva');
                break;
            case 'obstruida':
                recommendations.push('EMERGÊNCIA: Via aérea obstruída!');
                recommendations.push('- Estabelecer via aérea definitiva imediatamente');
                recommendations.push('- Preparar para cricotireoidostomia se necessário');
                break;
        }

        // B - Respiração
        switch (data.breathingStatus) {
            case 'dificuldade':
                recommendations.push('Respiração: Suporte ventilatório necessário');
                recommendations.push('- Administrar O2 suplementar');
                recommendations.push('- Monitorar saturação de O2');
                break;
            case 'ausente':
                recommendations.push('EMERGÊNCIA: Iniciar ventilação imediatamente!');
                recommendations.push('- Ventilar com BVM');
                recommendations.push('- Preparar para intubação');
                break;
        }

        // C - Circulação
        switch (data.circulationStatus) {
            case 'alterada':
                recommendations.push('Circulação: Necessita intervenção!');
                recommendations.push('- Estabelecer acesso venoso');
                recommendations.push('- Iniciar reposição volêmica');
                break;
            case 'ausente':
                recommendations.push('EMERGÊNCIA: Iniciar RCP imediatamente!');
                recommendations.push('- Seguir protocolo de PCR');
                recommendations.push('- Preparar desfibrilador');
                break;
        }

        // D - Neurológico
        switch (data.neuroStatus) {
            case 'verbal':
                recommendations.push('Estado Neurológico: Alterado - responde ao estímulo verbal');
                recommendations.push('- Monitorar nível de consciência');
                break;
            case 'dor':
                recommendations.push('Estado Neurológico: Alterado - responde apenas à dor');
                recommendations.push('- Considerar proteção de via aérea');
                recommendations.push('- Avaliar necessidade de TC');
                break;
            case 'inconsciente':
                recommendations.push('EMERGÊNCIA: Paciente inconsciente!');
                recommendations.push('- Proteger via aérea imediatamente');
                recommendations.push('- Avaliar pupilas e reflexos');
                break;
        }

        return recommendations;
    }

    // Manipular envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mostrar loading
        loading.style.display = 'block';
        result.style.display = 'none';

        // Coletar dados do formulário
        const formData = {
            patientName: document.getElementById('patientName').value,
            age: document.getElementById('age').value,
            hemorrhageStatus: document.getElementById('hemorrhageStatus').value,
            airwayStatus: document.getElementById('airwayStatus').value,
            breathingStatus: document.getElementById('breathingStatus').value,
            circulationStatus: document.getElementById('circulationStatus').value,
            neuroStatus: document.getElementById('neuroStatus').value,
            exposureNotes: document.getElementById('exposureNotes').value
        };

        // Simular processamento
        setTimeout(() => {
            const recommendations = generateRecommendations(formData);
            
            // Criar resultado HTML
            const currentDate = new Date().toLocaleString();
            const resultHTML = `
                <div class="patient-info">
                    <p><strong>Paciente:</strong> ${formData.patientName}</p>
                    <p><strong>Idade:</strong> ${formData.age} anos</p>
                    <p><strong>Data/Hora:</strong> ${currentDate}</p>
                </div>
                <div class="assessment">
                    <h4>Avaliação XABCDE:</h4>
                    <p><strong>X (Hemorragia):</strong> ${formData.hemorrhageStatus}</p>
                    <p><strong>A (Via Aérea):</strong> ${formData.airwayStatus}</p>
                    <p><strong>B (Respiração):</strong> ${formData.breathingStatus}</p>
                    <p><strong>C (Circulação):</strong> ${formData.circulationStatus}</p>
                    <p><strong>D (Neurológico):</strong> ${formData.neuroStatus}</p>
                    <p><strong>E (Exposição):</strong> ${formData.exposureNotes || 'Sem observações'}</p>
                </div>
                <div class="recommendations">
                    <h4>Recomendações:</h4>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            `;

            // Mostrar resultado
            resultContent.innerHTML = resultHTML;
            loading.style.display = 'none';
            result.style.display = 'block';
            
            // Salvar no localStorage
            try {
                const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
                savedAssessments.push({
                    timestamp: currentDate,
                    data: formData,
                    recommendations
                });
                localStorage.setItem('assessments', JSON.stringify(savedAssessments));
            } catch (error) {
                console.error('Erro ao salvar avaliação:', error);
                showToast('Erro ao salvar avaliação localmente');
            }

        }, 1000);
    });

    // Carregar dados salvos do localStorage
    try {
        const savedAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
        if (savedAssessments.length > 0) {
            showToast(`${savedAssessments.length} avaliações anteriores disponíveis offline`);
        }
    } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
    }
});
