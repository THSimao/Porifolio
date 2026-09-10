(function () {
  'use strict';
  var root = document.getElementById('kali-lab');
  if (!root) return;
  root.innerHTML = `
    <nav class="lab-nav" aria-label="Atividades do laboratório">
      <button type="button" data-panel="terminal" aria-pressed="true" aria-controls="lab-terminal">01 Terminal</button>
      <button type="button" data-panel="nmap" aria-pressed="false" aria-controls="lab-nmap">02 Nmap simulado</button>
    </nav>
    <section id="lab-terminal" class="lab-panel" aria-label="Terminal educativo">
      <p class="lab-description">Explore o portfólio por comandos. Digite <code>help</code> para começar.</p>
      <div id="lab-output" class="lab-console" role="log" aria-label="Saída do terminal" aria-live="polite"></div>
      <form id="lab-command-form" class="lab-command"><label for="lab-command">arthur@kali:~ $</label><input id="lab-command" autocomplete="off" spellcheck="false" maxlength="160" aria-label="Comando do terminal" placeholder="help"><button>Executar</button></form>
      <p class="lab-note">Terminal de demonstração: não executa comandos no computador.</p>
    </section>
    <section id="lab-nmap" class="lab-panel" aria-label="Nmap simulado" hidden>
      <div class="lab-section-title"><h3>Reconhecimento de uma máquina fictícia</h3><span class="lab-badge">SIMULAÇÃO</span></div>
      <p class="lab-description">Alvo fixo: <code>lab.local</code>. Os resultados abaixo são exemplos preparados para estudo.</p>
      <button id="lab-scan" type="button" class="lab-primary">Iniciar simulação</button>
      <p id="lab-scan-status" role="status" class="lab-note">Pronto para começar.</p>
      <pre id="lab-scan-output" class="lab-console" aria-label="Resultado simulado">$ nmap lab.local\nAguardando simulação…</pre>
      <div class="lab-explanation" id="lab-scan-explanation" hidden><h4>Como interpretar</h4><p><strong>22 / SSH:</strong> acesso remoto. <strong>80 / HTTP:</strong> serviço web. <strong>443 / HTTPS:</strong> serviço web com TLS.</p><p>“open” indica um serviço aceitando conexões neste exemplo; não prova uma vulnerabilidade. “closed” indica que não há um serviço escutando naquela porta.</p></div>
    </section>
`;

  root.querySelectorAll('[data-panel]').forEach(function (button) {
    button.addEventListener('click', function () {
      root.querySelectorAll('[data-panel]').forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
      root.querySelectorAll('.lab-panel').forEach(function (panel) { panel.hidden = panel.id !== 'lab-' + button.dataset.panel; });
      if (button.dataset.panel === 'terminal') document.getElementById('lab-command').focus();
    });
  });
  var output = document.getElementById('lab-output');
  function print(text) {
    var line = document.createElement('p');
    line.textContent = text;
    output.appendChild(line);
    while (output.children.length > 80) output.firstElementChild.remove();
    output.scrollTop = output.scrollHeight;
  }
  print('Kali Portfolio Lab\nAmbiente educativo local. Digite help.');
  var history = [], cursor = 0;
  var input = document.getElementById('lab-command');
  input.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    cursor = Math.max(0, Math.min(history.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)));
    input.value = history[cursor] || '';
  });
  document.getElementById('lab-command-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var command = input.value.trim();
    if (!command) return;
    history.push(command); if (history.length > 50) history.shift(); cursor = history.length;
    input.value = ''; print('$ ' + command);
    switch (command.toLowerCase()) {
      case 'help': print('help      Lista os comandos\nwhoami    Sobre Arthur\nskills    Exibe habilidades\nprojects  Abre os projetos\nclear     Limpa o terminal\nUse ↑ e ↓ para navegar pelo histórico.'); break;
      case 'whoami': print('Arthur Félix Campos Simão\nEstudante de TI · COTEMIG\nInfraestrutura, redes e suporte técnico.'); break;
      case 'skills': print(window.SKILLS.map(function (skill) { return '• ' + skill.name; }).join('\n')); break;
      case 'projects': print('Abrindo os projetos do portfólio…'); window.openWin('projects'); break;
      case 'clear': output.replaceChildren(); break;
      default: print('Comando não disponível nesta demonstração. Digite help.');
    }
  });
  var scan = document.getElementById('lab-scan');
  scan.addEventListener('click', function () {
    if (scan.disabled) return;
    scan.disabled = true;
    document.getElementById('lab-scan-explanation').hidden = true;
    document.getElementById('lab-scan-status').textContent = 'Reproduzindo exemplo local…';
    document.getElementById('lab-scan-output').textContent = '$ nmap lab.local\n[SIMULAÇÃO] Preparando resultados fictícios…';
    window.setTimeout(function () {
      document.getElementById('lab-scan-output').textContent = '$ nmap lab.local\n[SIMULAÇÃO — nenhum pacote enviado]\n\nPORT      STATE   SERVICE\n22/tcp    open    ssh\n80/tcp    open    http\n443/tcp   open    https\n3306/tcp  closed  mysql\n\nExemplo concluído: 1 máquina fictícia.';
      document.getElementById('lab-scan-status').textContent = 'Simulação concluída. Nenhuma conexão foi realizada.';
      document.getElementById('lab-scan-explanation').hidden = false;
      scan.disabled = false; scan.textContent = 'Repetir simulação';
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1100);
  });
})();
