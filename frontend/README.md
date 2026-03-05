# Sistema de Cadastro de Ponto Eletrônico
- Sistema para bater ponto em determinado momento, podendo alterar a data e a hora para um momento anterior ao atual.

## Tela Inicial
- Exibe o dia da semana, a data e a hora, sendo atualizados a cada segundo.
- Exibe também um botão para bater ponto, que abre um dialog:
  - **Data e Hora**: Exibe a data atual e a hora atual com botões 'Editar' ao seus lados, que servem para modificar tais campos para um momento no passado.
  - **Observação**: Campo para adicionar uma observação.
  - **Anexo**: Campo para adicionar um arquivo de até 10KB, apenas no formato `.txt`.
  - **Tipo de Ponto**: Select com quatro opções:
    - Entrada
    - Intervalo
    - Volta Intervalo
    - Saída
  - **Botão 'Registrar Ponto'**: Ao clicar, coleta todas as informações dos campos e registra um objeto no `localStorage` com os seguintes atributos:
    - **Data**: Data do ponto registrado.
    - **Hora**: Hora do ponto registrado.
    - **Localização**: Localização do usuário, com latitude e longitude.
    - **Id**: Identificador do ponto, gerado automaticamente e aleatoriamente.
    - **Tipo do Ponto**: Tipo selecionado (Entrada, Intervalo, Volta Intervalo, Saída).
    - **Observação**: Texto inserido pelo usuário, caso haja.
    - **Arquivo**: Nome do arquivo carregado.
    - **noPassado**: Verifica se a hora foi alterada antes de salvar o ponto.
    - **editado**: Verifica se o registro foi editado após sua criação.
  - **Último registro**: Mostra qual foi o último ponto registrado, com sua data, hora e tipo.

- Exibe também um botão para abrir o relatório/histórico de registros, que redireciona o usuário para outra página.

## Tela de Relatório
- Botão para voltar à tela inicial.
- Título da página: Relatório de Registro de Pontos.
- **Tipos de Registro**: Quatro tipos de registro separados por cor:
    - **Normal**: Preto
    - **Com Observação**: Azul
    - **Ponto no Passado**: Laranja
    - **Registro Editado**: Verde
- **Botões para Filtrar**:
    - **Todos**: Mostra todos os registros de ponto do localStorage.
    - **Última Semana**: Mostra os registros dos últimos 7 dias.
    - **Último Mês**: Mostra os registros dos últimos 30 dias.

- Exibe os registros separados por dia, dos mais recentes aos mais antigos. Dentro de cada dia, ordena os registros por tipo e, em seguida, por hora de forma crescente.
- Cada registro tem uma barra colorida que representa o tipo. Se o registro tiver mais de um tipo, a barra fica colorida com a cor dos tipos.

- **Botão de Editar**: Cada registro possui um botão que abre um dialog que mostra sua informação da(o):
    - **Data**: Não é possível alterar a data de um registro de ponto.
    - **Hora**: Só é possível alterar para um momento no passado da hora do registro.
    - **Observação**: Possível alterar.
    - **Arquivo**: Possível alterar seguindo as mesmas regras para registrar ponto.
    - **Tipo**: Possível alterar para qualquer tipo.
    - **Botão para Salvar**: Ao clicar, coleta as informações do dialog e salva no registro de mesmo id no localStorage.

- **Botão de Excluir**: Sem funcionalidade, apenas mostra um alerta falando que não é possível excluir tal registro.












