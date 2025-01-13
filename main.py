import sys
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                           QHBoxLayout, QPushButton, QLabel, QStackedWidget,
                           QLineEdit, QMessageBox, QDialog, QFormLayout)
from PyQt6.QtCore import Qt
from qt_material import apply_stylesheet
from components import ProtocolStep, AlertWidget
from protocol_data import PROTOCOL_DATA
from avaliacao_manager import AvaliacaoManager
from database import Database

class LoginDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
        
    def setup_ui(self):
        self.setWindowTitle("Login")
        layout = QFormLayout(self)
        
        self.id_input = QLineEdit()
        layout.addRow("ID Profissional:", self.id_input)
        
        self.paciente_input = QLineEdit()
        layout.addRow("ID Paciente:", self.paciente_input)
        
        btn = QPushButton("Iniciar Avaliação")
        btn.clicked.connect(self.accept)
        layout.addWidget(btn)
        
    def get_ids(self):
        return self.id_input.text(), self.paciente_input.text()

class ProtocoloXABCDE(QMainWindow):
    def __init__(self):
        super().__init__()
        self.avaliacao_manager = AvaliacaoManager()
        self.db = Database()
        self.setup_ui()
        self.show_login()
        
    def setup_ui(self):
        self.setWindowTitle("Protocolo XABCDE")
        self.setMinimumSize(1024, 768)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        layout = QHBoxLayout(central_widget)
        
        # Menu lateral
        sidebar = QWidget()
        sidebar.setMaximumWidth(200)
        sidebar_layout = QVBoxLayout(sidebar)
        
        # Botões do menu
        self.create_menu_buttons(sidebar_layout)
        
        # Área principal de conteúdo
        self.content_area = QStackedWidget()
        
        layout.addWidget(sidebar)
        layout.addWidget(self.content_area)
        
        # Cria as páginas do protocolo
        self.create_protocol_pages()
        
    def show_login(self):
        dialog = LoginDialog(self)
        if dialog.exec():
            prof_id, pac_id = dialog.get_ids()
            if prof_id and pac_id:
                self.avaliacao_manager.iniciar_avaliacao(pac_id, prof_id)
                self.load_patient_data(pac_id)
            else:
                QMessageBox.warning(self, "Erro", "Por favor, preencha todos os campos")
                self.show_login()
                
    def load_patient_data(self, paciente_id):
        """Carrega os dados do paciente"""
        paciente = self.db.buscar_paciente(paciente_id)
        if paciente:
            self.setWindowTitle(f"Protocolo XABCDE - Paciente: {paciente.get('nome', 'Não identificado')}")
        
    def create_menu_buttons(self, layout):
        buttons = [
            ("Via Aérea (A)", self.show_via_aerea),
            ("Respiração (B)", self.show_respiracao),
            ("Circulação (C)", self.show_circulacao),
            ("Neurológico (D)", self.show_neurologica),
            ("Exposição (E)", self.show_exposicao),
            ("Histórico", self.show_historico),
            ("Salvar Avaliação", self.salvar_avaliacao)
        ]
        
        for text, callback in buttons:
            btn = QPushButton(text)
            btn.setMinimumHeight(50)
            btn.clicked.connect(callback)
            layout.addWidget(btn)
            
        layout.addStretch()
        
    def create_protocol_pages(self):
        # Página Via Aérea (A)
        self.via_aerea_page = ProtocolStep("Via Aérea (A)", PROTOCOL_DATA["via_aerea"]["items"])
        self.content_area.addWidget(self.via_aerea_page)
        
        # Página Respiração (B)
        self.respiracao_page = ProtocolStep("Respiração (B)", PROTOCOL_DATA["respiracao"]["items"])
        self.content_area.addWidget(self.respiracao_page)
        
        # Página Circulação (C)
        self.circulacao_page = ProtocolStep("Circulação (C)", PROTOCOL_DATA["circulacao"]["items"])
        self.content_area.addWidget(self.circulacao_page)
        
    def show_via_aerea(self):
        self.content_area.setCurrentWidget(self.via_aerea_page)
        alertas = self.avaliacao_manager.buscar_alertas_etapa('via_aerea')
        self.atualizar_alertas(alertas)
        
    def show_respiracao(self):
        self.content_area.setCurrentWidget(self.respiracao_page)
        alertas = self.avaliacao_manager.buscar_alertas_etapa('respiracao')
        self.atualizar_alertas(alertas)
        
    def show_circulacao(self):
        self.content_area.setCurrentWidget(self.circulacao_page)
        alertas = self.avaliacao_manager.buscar_alertas_etapa('circulacao')
        self.atualizar_alertas(alertas)
        
    def show_neurologica(self):
        # Implementar
        pass
        
    def show_exposicao(self):
        # Implementar
        pass
        
    def show_historico(self):
        if self.avaliacao_manager.avaliacao_atual['paciente_id']:
            avaliacoes = self.avaliacao_manager.buscar_avaliacoes_paciente(
                self.avaliacao_manager.avaliacao_atual['paciente_id']
            )
            # Implementar exibição do histórico
            
    def salvar_avaliacao(self):
        try:
            avaliacao_id = self.avaliacao_manager.salvar_avaliacao()
            if avaliacao_id:
                QMessageBox.information(self, "Sucesso", "Avaliação salva com sucesso!")
            else:
                QMessageBox.warning(self, "Erro", "Erro ao salvar avaliação")
        except ValueError as e:
            QMessageBox.warning(self, "Erro", str(e))
            
    def atualizar_alertas(self, alertas):
        # Implementar atualização visual dos alertas
        pass

def main():
    app = QApplication(sys.argv)
    
    # Aplica o tema material design
    apply_stylesheet(app, theme='dark_teal.xml')
    
    window = ProtocoloXABCDE()
    window.show()
    
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
