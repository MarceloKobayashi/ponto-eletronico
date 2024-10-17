# Sistema de Cadastro de Ponto Eletrônico

## Tela Inicial:
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
