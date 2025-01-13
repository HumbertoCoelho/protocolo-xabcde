from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, 
                           QPushButton, QLabel, QFrame, QScrollArea,
                           QTextEdit, QCheckBox)
from PyQt6.QtCore import Qt, pyqtSignal

class ProtocolStep(QWidget):
    avaliacao_changed = pyqtSignal(dict)  # Sinal para mudanças na avaliação
    
    def __init__(self, title, items, parent=None):
        super().__init__(parent)
        self.items = items
        self.avaliacao = {}
        self.setup_ui(title, items)
        
    def setup_ui(self, title, items):
        layout = QVBoxLayout(self)
        
        # Título
        title_label = QLabel(title)
        title_label.setStyleSheet("font-size: 24px; font-weight: bold;")
        layout.addWidget(title_label)
        
        # Área de rolagem para os itens
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        content = QWidget()
        content_layout = QVBoxLayout(content)
        
        # Adiciona os itens
        for item in items:
            item_widget = self.create_item_widget(item)
            content_layout.addWidget(item_widget)
            
        # Área de notas
        notes_frame = QFrame()
        notes_layout = QVBoxLayout(notes_frame)
        notes_layout.addWidget(QLabel("Notas e Observações:"))
        self.notes_edit = QTextEdit()
        notes_layout.addWidget(self.notes_edit)
        
        content_layout.addWidget(notes_frame)
        content_layout.addStretch()
        scroll.setWidget(content)
        layout.addWidget(scroll)
        
    def create_item_widget(self, item):
        frame = QFrame()
        frame.setFrameStyle(QFrame.Shape.StyledPanel)
        layout = QVBoxLayout(frame)
        
        # Título do item com checkbox
        header_layout = QHBoxLayout()
        checkbox = QCheckBox(item['title'])
        checkbox.stateChanged.connect(lambda state, item=item: self.update_avaliacao(item['title'], state))
        header_layout.addWidget(checkbox)
        layout.addLayout(header_layout)
        
        # Descrição
        if 'description' in item:
            desc = QLabel(item['description'])
            desc.setWordWrap(True)
            layout.addWidget(desc)
            
        # Alertas
        if 'alerts' in item:
            alerts_layout = QVBoxLayout()
            for alert in item['alerts']:
                alert_widget = self.create_alert_widget(alert)
                alerts_layout.addWidget(alert_widget)
            layout.addLayout(alerts_layout)
            
        return frame
        
    def create_alert_widget(self, alert):
        widget = QFrame()
        widget.setStyleSheet("background-color: #ffebee; border-radius: 5px;")
        layout = QHBoxLayout(widget)
        
        # Ícone de alerta
        icon = QLabel("⚠")
        layout.addWidget(icon)
        
        # Texto do alerta
        text = QLabel(alert)
        text.setWordWrap(True)
        layout.addWidget(text)
        
        # Botão de ação
        action_btn = QPushButton("Ver Soluções")
        action_btn.clicked.connect(lambda: self.show_solutions(alert))
        layout.addWidget(action_btn)
        
        return widget
        
    def update_avaliacao(self, item_title, state):
        """Atualiza o estado da avaliação quando um item é marcado/desmarcado"""
        self.avaliacao[item_title] = bool(state)
        self.avaliacao['notas'] = self.notes_edit.toPlainText()
        self.avaliacao_changed.emit(self.avaliacao)
        
    def show_solutions(self, alert):
        """Mostra as soluções para um alerta específico"""
        # Implementar diálogo com soluções
        pass

class AlertWidget(QFrame):
    def __init__(self, title, message, severity="info", parent=None):
        super().__init__(parent)
        self.setup_ui(title, message, severity)
        
    def setup_ui(self, title, message, severity):
        layout = QVBoxLayout(self)
        
        # Define o estilo baseado na severidade
        colors = {
            "info": "#e3f2fd",
            "warning": "#fff3e0",
            "danger": "#ffebee"
        }
        self.setStyleSheet(f"background-color: {colors.get(severity, '#ffffff')}; border-radius: 5px;")
        
        # Título
        title_label = QLabel(title)
        title_label.setStyleSheet("font-weight: bold;")
        layout.addWidget(title_label)
        
        # Mensagem
        message_label = QLabel(message)
        message_label.setWordWrap(True)
        layout.addWidget(message_label)
        
        # Botões de ação
        if severity in ["warning", "danger"]:
            action_layout = QHBoxLayout()
            action_btn = QPushButton("Ver Soluções")
            action_layout.addStretch()
            action_layout.addWidget(action_btn)
            layout.addLayout(action_layout)
