from database import Database
from datetime import datetime

class AvaliacaoManager:
    def __init__(self):
        self.db = Database()
        self.avaliacao_atual = {
            'timestamp': None,
            'paciente_id': None,
            'profissional_id': None,
            'via_aerea': {},
            'respiracao': {},
            'circulacao': {},
            'neurologico': {},
            'exposicao': {},
            'notas': ''
        }
        
    def iniciar_avaliacao(self, paciente_id, profissional_id):
        """Inicia uma nova avaliação"""
        self.avaliacao_atual = {
            'timestamp': datetime.now(),
            'paciente_id': paciente_id,
            'profissional_id': profissional_id,
            'via_aerea': {},
            'respiracao': {},
            'circulacao': {},
            'neurologico': {},
            'exposicao': {},
            'notas': ''
        }
        
    def atualizar_etapa(self, etapa, dados):
        """Atualiza os dados de uma etapa específica"""
        if etapa in self.avaliacao_atual:
            self.avaliacao_atual[etapa] = dados
            return True
        return False
        
    def adicionar_nota(self, nota):
        """Adiciona uma nota à avaliação"""
        self.avaliacao_atual['notas'] += f"{datetime.now().strftime('%H:%M:%S')} - {nota}\\n"
        
    def salvar_avaliacao(self):
        """Salva a avaliação atual no banco de dados"""
        if not self.avaliacao_atual['paciente_id']:
            raise ValueError("Paciente não identificado")
            
        return self.db.salvar_avaliacao(self.avaliacao_atual)
        
    def buscar_avaliacoes_paciente(self, paciente_id):
        """Busca o histórico de avaliações do paciente"""
        return self.db.buscar_avaliacoes_paciente(paciente_id)
        
    def buscar_alertas_etapa(self, etapa):
        """Busca alertas relacionados a uma etapa específica"""
        return self.db.buscar_alertas(tipo=etapa)
