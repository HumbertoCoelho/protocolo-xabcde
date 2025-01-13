import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente
load_dotenv()

def initialize_firebase():
    """Inicializa a conexão com o Firebase"""
    # Modo offline para desenvolvimento
    return None

# Estrutura das coleções no Firestore
COLLECTIONS = {
    'avaliacoes': {
        'fields': [
            'timestamp',
            'paciente_id',
            'profissional_id',
            'via_aerea',
            'respiracao',
            'circulacao',
            'neurologico',
            'exposicao',
            'notas'
        ]
    },
    'pacientes': {
        'fields': [
            'nome',
            'id_documento',
            'data_nascimento',
            'historico_medico',
            'alergias',
            'medicacoes'
        ]
    },
    'alertas': {
        'fields': [
            'tipo',
            'descricao',
            'gravidade',
            'solucoes',
            'referencias'
        ]
    }
}

def create_collections(db):
    """Cria as coleções iniciais no Firestore"""
    try:
        for collection_name, schema in COLLECTIONS.items():
            # Verifica se já existem documentos na coleção
            docs = db.collection(collection_name).limit(1).get()
            if not docs:
                # Cria um documento exemplo
                db.collection(collection_name).document('exemplo').set({
                    field: None for field in schema['fields']
                })
        return True
    except Exception as e:
        print(f"Erro ao criar coleções: {e}")
        return False

def get_collection_schema(collection_name):
    """Retorna o schema de uma coleção específica"""
    return COLLECTIONS.get(collection_name, {})
