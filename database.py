from datetime import datetime
import json
import os

class Database:
    def __init__(self):
        self.data = {
            'avaliacoes': [],
            'pacientes': [],
            'alertas': []
        }
        self.load_data()
        
    def load_data(self):
        """Carrega dados do arquivo local"""
        try:
            if os.path.exists('data.json'):
                with open('data.json', 'r') as f:
                    self.data = json.load(f)
        except Exception as e:
            print(f"Erro ao carregar dados: {e}")
            
    def save_data(self):
        """Salva dados em arquivo local"""
        try:
            with open('data.json', 'w') as f:
                json.dump(self.data, f, indent=2)
        except Exception as e:
            print(f"Erro ao salvar dados: {e}")
            
    def salvar_avaliacao(self, dados_avaliacao):
        """Salva uma nova avaliação"""
        try:
            dados_avaliacao['id'] = str(len(self.data['avaliacoes']) + 1)
            dados_avaliacao['timestamp'] = datetime.now().isoformat()
            self.data['avaliacoes'].append(dados_avaliacao)
            self.save_data()
            return dados_avaliacao['id']
        except Exception as e:
            print(f"Erro ao salvar avaliação: {e}")
            return None
            
    def buscar_avaliacoes_paciente(self, paciente_id):
        """Busca todas as avaliações de um paciente"""
        try:
            return [a for a in self.data['avaliacoes'] if a['paciente_id'] == paciente_id]
        except Exception as e:
            print(f"Erro ao buscar avaliações: {e}")
            return []
            
    def salvar_paciente(self, dados_paciente):
        """Cadastra um novo paciente"""
        try:
            dados_paciente['id'] = str(len(self.data['pacientes']) + 1)
            self.data['pacientes'].append(dados_paciente)
            self.save_data()
            return dados_paciente['id']
        except Exception as e:
            print(f"Erro ao salvar paciente: {e}")
            return None
            
    def buscar_paciente(self, paciente_id):
        """Busca os dados de um paciente específico"""
        try:
            for paciente in self.data['pacientes']:
                if paciente['id'] == paciente_id:
                    return paciente
            return None
        except Exception as e:
            print(f"Erro ao buscar paciente: {e}")
            return None
            
    def atualizar_paciente(self, paciente_id, dados):
        """Atualiza os dados de um paciente"""
        try:
            for paciente in self.data['pacientes']:
                if paciente['id'] == paciente_id:
                    paciente.update(dados)
                    self.save_data()
                    return True
            return False
        except Exception as e:
            print(f"Erro ao atualizar paciente: {e}")
            return False
            
    def buscar_alertas(self, tipo=None):
        """Busca alertas cadastrados no sistema"""
        try:
            if tipo:
                return [a for a in self.data['alertas'] if a['tipo'] == tipo]
            return self.data['alertas']
        except Exception as e:
            print(f"Erro ao buscar alertas: {e}")
            return []
            
    def salvar_alerta(self, dados_alerta):
        """Cadastra um novo alerta no sistema"""
        try:
            dados_alerta['id'] = str(len(self.data['alertas']) + 1)
            self.data['alertas'].append(dados_alerta)
            self.save_data()
            return dados_alerta['id']
        except Exception as e:
            print(f"Erro ao salvar alerta: {e}")
            return None
