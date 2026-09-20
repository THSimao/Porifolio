(function enhancePortfolio() {
  'use strict';

  var motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var previousGeometry = {};
  var transitionTimer = {};
  var mobileScreen = window.matchMedia('(max-width: 760px)');
  function hideMobileWindows(exceptId) {
    if (!mobileScreen.matches) return;
    Object.keys(winState).forEach(function (id) {
      if (id === exceptId) return;
      clearTransition(id);
      var item = winElement(id);
      item.classList.remove('visible', 'is-focused', 'app-opening');
      if (winState[id].open) winState[id].minimized = true;
    });
    updateTaskbar();
  }
  document.querySelector('.mobile-home').addEventListener('click', function () {
    hideMobileWindows();
    document.activeElement?.blur();
  });
  var dockLabels = {neofetch: 'User', skills: 'Habilidades', tools: 'Terminal', projects: 'Projetos', education: 'Currículo', contact: 'Contato'};
  Object.keys(dockLabels).forEach(function (id) {
    var button = document.getElementById('dock-' + id);
    button.setAttribute('aria-label', dockLabels[id]);
    var label = document.createElement('span');
    label.className = 'mobile-dock-label';
    label.textContent = dockLabels[id];
    button.appendChild(label);
  });
  function updateMobileViewport() {
    var viewport = window.visualViewport;
    document.documentElement.style.setProperty('--viewport-height', (viewport ? viewport.height : window.innerHeight) + 'px');
    document.body.classList.toggle('mobile-keyboard', mobileScreen.matches && !!viewport && window.innerHeight - viewport.height > 120 && document.activeElement.matches('input, textarea'));
  }
  window.visualViewport?.addEventListener('resize', updateMobileViewport);
  window.addEventListener('resize', updateMobileViewport);
  document.addEventListener('focusin', updateMobileViewport);
  document.addEventListener('focusout', function () { window.setTimeout(updateMobileViewport, 100); });
  mobileScreen.addEventListener('change', function () {
    if (mobileScreen.matches) {
      var visible = Array.from(document.querySelectorAll('.win.visible')).sort(function (a, b) { return Number(b.style.zIndex) - Number(a.style.zIndex); });
      hideMobileWindows(visible[0]?.id.replace('win-', ''));
    }
    updateMobileViewport();
  });
  updateMobileViewport();
  function syncMobileAccessibility() {
    document.getElementById('desktop-icons').inert = mobileScreen.matches && !!document.querySelector('.win.visible');
  }
  new MutationObserver(syncMobileAccessibility).observe(document.getElementById('win-layer'), { subtree: true, attributes: true, attributeFilter: ['class'] });
  mobileScreen.addEventListener('change', syncMobileAccessibility);
  var githubProjects = [
    {
      name: 'Landing-Page-SpayZone',
      title: 'SpayZone — Gaming Setup',
      description: 'Landing page temática para uma experiência de gaming setup.',
      language: 'HTML',
      updated: '05 ago 2026',
      repo: 'https://github.com/THSimao/Landing-Page-SpayZone',
      demo: 'https://thsimao.github.io/Landing-Page-SpayZone/'
    },
    {
      name: 'SpayZone1',
      title: 'SpayZone',
      description: 'Página inicial do projeto SpayZone, publicada no GitHub Pages.',
      language: 'HTML',
      updated: '01 jul 2026',
      repo: 'https://github.com/THSimao/SpayZone1',
      demo: 'https://thsimao.github.io/SpayZone1/'
    },
    {
      name: 'Reprodu-o-de-Site---DISPLAY-FLEX',
      title: 'Reprodução com Flexbox',
      description: 'Exercício de reprodução de layout usando HTML e CSS Flexbox.',
      language: 'HTML',
      updated: '23 mai 2026',
      repo: 'https://github.com/THSimao/Reprodu-o-de-Site---DISPLAY-FLEX',
      demo: null
    },
    {
      name: 'ROOFTOP_FELIX',
      title: 'RoofTop Felix',
      description: 'Projeto web RoofTop Felix desenvolvido e publicado em HTML.',
      language: 'HTML',
      updated: '20 abr 2026',
      repo: 'https://github.com/THSimao/ROOFTOP_FELIX',
      demo: 'https://thsimao.github.io/ROOFTOP_FELIX/'
    },
    {
      name: 'Tabela-Periodica',
      title: 'Tabela Periódica',
      description: 'Tabela periódica construída como projeto visual para a web.',
      language: 'HTML',
      updated: '17 mar 2026',
      repo: 'https://github.com/THSimao/Tabela-Periodica',
      demo: 'https://thsimao.github.io/Tabela-Periodica/'
    }
  ];

  function projectIcon(index) {
    var icons = [
      '<path d="M4 5.5h6l2 2H20v11H4z"/><path d="M4 9h16"/>',
      '<path d="M7 4h10l3 3v13H4V7z"/><path d="M8 12h8M8 16h5"/>',
      '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-10-2 12"/>',
      '<path d="M4 18V7l8-4 8 4v11l-8 3z"/><path d="m4 7 8 5 8-5M12 12v9"/>',
      '<path d="M5 4h14v16H5z"/><path d="M9 4v16m5-16v16M5 9h14m-14 6h14"/>'
    ];
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[index % icons.length] + '</svg>';
  }

  function renderGitHubProjects() {
    var list = document.getElementById('fm-list');
    if (!list) return;
    list.innerHTML = githubProjects.map(function (project, index) {
      var demo = project.demo
        ? '<a class="project-action primary" href="' + project.demo + '" target="_blank" rel="noopener noreferrer">Abrir projeto <span>↗</span></a>'
        : '<span class="project-action disabled" title="Este projeto não possui demonstração publicada">Sem demo</span>';
      return '<article class="github-project-card" tabindex="0">' +
        '<div class="project-card-top">' +
          '<div class="project-icon">' + projectIcon(index) + '</div>' +
          '<span class="project-menu" aria-hidden="true">•••</span>' +
        '</div>' +
        '<div class="project-card-copy">' +
          '<p class="project-folder">~/GitHub/' + project.name + '</p>' +
          '<h3>' + project.title + '</h3>' +
          '<p>' + project.description + '</p>' +
        '</div>' +
        '<div class="project-meta"><span><i></i>' + project.language + '</span><span>Atualizado em ' + project.updated + '</span></div>' +
        '<div class="project-actions">' + demo +
          '<a class="project-action" href="' + project.repo + '" target="_blank" rel="noopener noreferrer">Código <span>⌘</span></a>' +
        '</div>' +
      '</article>';
    }).join('');

    list.querySelectorAll('.github-project-card').forEach(function (card) {
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          card.querySelector('.project-action.primary, .project-action:not(.disabled)')?.click();
        }
      });
    });
  }

  renderGitHubProjects();

  function winElement(id) {
    return document.getElementById('win-' + id);
  }

  function clearTransition(id) {
    window.clearTimeout(transitionTimer[id]);
    var win = winElement(id);
    if (win) win.classList.remove('is-closing', 'is-minimizing');
  }

  window.openWin = function openWinEnhanced(id) {
    var win = winElement(id);
    var state = winState[id];
    if (!win || !state) return;

    hideMobileWindows(id);
    clearTransition(id);
    topZ += 1;
    win.style.zIndex = topZ;
    win.classList.add('visible', 'is-focused');
    state.open = true;
    state.minimized = false;

    var dockButton = document.getElementById('dock-' + id);
    if (dockButton) {
      dockButton.classList.add('open', 'launching');
      window.setTimeout(function () { dockButton.classList.remove('launching'); }, motionOK ? 520 : 10);
    }
    win.classList.remove('app-opening');
    void win.offsetWidth;
    win.classList.add('app-opening');
    window.setTimeout(function () { win.classList.remove('app-opening'); }, motionOK ? 520 : 10);
    updateTaskbar();

    if (id === 'neofetch') {
      window.setTimeout(function () {
        var art = document.getElementById('nf-art');
        var info = document.getElementById('nf-info');
        if (art) art.style.opacity = '1';
        if (info) info.style.opacity = '1';
      }, 140);
    }
    if (id === 'skills') window.setTimeout(animateSkills, 360);
  };

  window.closeWin = function closeWinEnhanced(id) {
    var win = winElement(id);
    var state = winState[id];
    if (!win || !state) return;

    clearTransition(id);
    win.classList.add('is-closing');
    state.open = false;
    state.minimized = false;
    var dockButton = document.getElementById('dock-' + id);
    if (dockButton) dockButton.classList.remove('open');
    updateTaskbar();

    transitionTimer[id] = window.setTimeout(function () {
      win.classList.remove('visible', 'is-closing', 'is-focused');
    }, motionOK ? 430 : 10);
  };

  window.minWin = function minWinEnhanced(id) {
    var win = winElement(id);
    var state = winState[id];
    if (!win || !state) return;

    clearTransition(id);
    win.classList.add('is-minimizing');
    state.open = true;
    state.minimized = true;
    updateTaskbar();

    transitionTimer[id] = window.setTimeout(function () {
      win.classList.remove('visible', 'is-minimizing', 'is-focused');
    }, motionOK ? 440 : 10);
  };

  window.focusWin = function focusWinEnhanced(id) {
    topZ += 1;
    document.querySelectorAll('.win').forEach(function (item) {
      item.classList.remove('is-focused');
    });
    var win = winElement(id);
    if (win) {
      win.style.zIndex = topZ;
      win.classList.add('is-focused');
    }
  };

  function toggleMaximize(id) {
    if (mobileScreen.matches) return;
    var win = winElement(id);
    if (!win) return;

    if (!win.classList.contains('maximized')) {
      previousGeometry[id] = {
        left: win.style.left,
        top: win.style.top,
        width: win.style.width,
        height: win.style.height
      };
      win.classList.add('maximized');
    } else {
      win.classList.remove('maximized');
      var geometry = previousGeometry[id];
      if (geometry) {
        win.style.left = geometry.left;
        win.style.top = geometry.top;
        win.style.width = geometry.width;
        win.style.height = geometry.height;
      }
    }
    focusWin(id);
  }

  document.querySelectorAll('.win-bar').forEach(function (bar) {
    var id = bar.getAttribute('data-win');
    var maxButton = bar.querySelector('.wbtn-max');
    if (maxButton) {
      maxButton.addEventListener('click', function (event) {
        event.stopPropagation();
        toggleMaximize(id);
      });
    }
    bar.addEventListener('dblclick', function (event) {
      if (!event.target.closest('.wbtn')) toggleMaximize(id);
    });
  });

  document.querySelectorAll('.desk-icon').forEach(function (icon) {
    icon.addEventListener('click', function (event) {
      if (mobileScreen.matches && event.detail <= 1) icon.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });
    icon.tabIndex = 0;
    icon.setAttribute('role', 'button');
    icon.setAttribute('aria-label', 'Abrir ' + (icon.querySelector('.di-lbl')?.textContent || 'aplicativo'));
    icon.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        icon.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey && event.altKey && event.key.toLowerCase() === 't') || (event.metaKey && event.key.toLowerCase() === 't')) {
      event.preventDefault();
      openWin('neofetch');
      return;
    }
    if (event.key === '/' && !event.target.matches('input, textarea')) {
      event.preventDefault();
      setKaliMenu(true);
      document.getElementById('kali-search-input')?.focus();
      return;
    }
    if (event.key !== 'Escape') return;
    if (document.getElementById('kali-menu')?.classList.contains('open')) {
      setKaliMenu(false);
      return;
    }
    var visible = Array.from(document.querySelectorAll('.win.visible'))
      .sort(function (a, b) { return Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0); });
    if (visible[0]) closeWin(visible[0].id.replace('win-', ''));
  });

  var resizeFrame;
  window.addEventListener('resize', function () {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      document.querySelectorAll('.win.visible:not(.maximized)').forEach(function (win) {
        var layer = document.getElementById('win-layer').getBoundingClientRect();
        var maxLeft = Math.max(8, layer.width - win.offsetWidth - 8);
        var maxTop = Math.max(8, layer.height - win.offsetHeight - 8);
        win.style.left = Math.min(Math.max(8, win.offsetLeft), maxLeft) + 'px';
        win.style.top = Math.min(Math.max(8, win.offsetTop), maxTop) + 'px';
      });
    });
  });

  document.querySelectorAll('.fm-nav').forEach(function (button) {
    button.setAttribute('aria-label', button.textContent === '←' ? 'Voltar' : button.textContent === '→' ? 'Avançar' : 'Pasta acima');
    button.addEventListener('click', function () {
      var status = document.getElementById('fm-status-l');
      if (status) {
        status.textContent = 'Você já está em /home/arthur/GitHub';
        window.setTimeout(function () { status.textContent = '5 projetos sincronizados'; }, 1800);
      }
    });
  });

  window.submitContact = async function submitContactEnhanced(event) {
    event.preventDefault();
    var form = event.currentTarget;
    var status = document.getElementById('cf-status');
    var submit = document.getElementById('cf-submit');
    var label = submit && submit.querySelector('.cf-btn-label');
    var endpoint = form.getAttribute('action') || '';

    function showContactStatus(message, type) {
      if (!status) return;
      status.hidden = false;
      status.className = 'cf-status ' + type;
      status.textContent = message;
    }

    if (!endpoint || endpoint.indexOf('SEU_FORM_ID') !== -1) {
      showContactStatus('[-] Formspree ainda não foi conectado. Adicione o ID público do formulário.', 'is-error');
      return;
    }

    if (submit) submit.disabled = true;
    if (label) label.textContent = './enviando...';
    showContactStatus('[*] Enviando mensagem com segurança...', 'is-loading');

    try {
      var response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('Falha no envio');

      form.reset();
      showContactStatus('[+] Mensagem enviada. Responderei pelo e-mail informado.', 'is-success');
    } catch (error) {
      showContactStatus('[-] Não foi possível enviar agora. Tente novamente ou use o e-mail acima.', 'is-error');
    } finally {
      if (submit) submit.disabled = false;
      if (label) label.textContent = './enviar_mensagem';
    }
  };

  var kaliMenu = document.getElementById('kali-menu');
  var kaliMenuTrigger = document.getElementById('kali-menu-trigger');
  var kaliSearch = document.getElementById('kali-search-input');
  var activeKaliCategory = 'all';

  function setKaliMenu(open) {
    if (!kaliMenu || !kaliMenuTrigger) return;
    kaliMenu.classList.toggle('open', open);
    kaliMenu.setAttribute('aria-hidden', String(!open));
    kaliMenuTrigger.setAttribute('aria-expanded', String(open));
    if (!open && kaliSearch) {
      kaliSearch.value = '';
      filterKaliApps();
    }
  }

  function filterKaliApps() {
    var query = kaliSearch ? kaliSearch.value.trim().toLocaleLowerCase('pt-BR') : '';
    document.querySelectorAll('#kali-app-list [data-category]').forEach(function (button) {
      var categoryMatch = activeKaliCategory === 'all' || button.dataset.category === activeKaliCategory;
      var searchMatch = !query || button.textContent.toLocaleLowerCase('pt-BR').includes(query);
      button.hidden = !(categoryMatch && searchMatch);
    });
  }

  kaliMenuTrigger?.addEventListener('click', function (event) {
    event.stopPropagation();
    setKaliMenu(!kaliMenu.classList.contains('open'));
  });

  document.getElementById('kali-menu-close')?.addEventListener('click', function () {
    setKaliMenu(false);
    kaliMenuTrigger?.focus();
  });

  kaliSearch?.addEventListener('input', filterKaliApps);

  document.querySelectorAll('[data-kali-filter]').forEach(function (button) {
    button.addEventListener('click', function () {
      activeKaliCategory = button.dataset.kaliFilter;
      document.querySelectorAll('[data-kali-filter]').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      if (kaliSearch) kaliSearch.value = '';
      filterKaliApps();
    });
  });

  document.querySelectorAll('#kali-app-list [data-category]').forEach(function (button) {
    button.addEventListener('click', function () {
      var category = button.dataset.category;
      setKaliMenu(false);
      openWin('tools');

    });
  });

  document.addEventListener('click', function (event) {
    if (!kaliMenu?.classList.contains('open')) return;
    if (!kaliMenu.contains(event.target) && !kaliMenuTrigger.contains(event.target)) setKaliMenu(false);
  });

  document.querySelectorAll('.workspace-switcher button').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('.workspace-switcher button').forEach(function (item) { item.classList.remove('active'); });
      button.classList.add('active');
      document.body.classList.remove('workspace-shift');
      void document.body.offsetWidth;
      document.body.classList.add('workspace-shift');
      window.setTimeout(function () { document.body.classList.remove('workspace-shift'); }, motionOK ? 360 : 10);
    });
  });

  var contextMenu = document.getElementById('ctx');
  document.addEventListener('contextmenu', function () {
    window.requestAnimationFrame(function () {
      if (!contextMenu || contextMenu.style.display !== 'block') return;
      var rect = contextMenu.getBoundingClientRect();
      contextMenu.style.left = Math.min(parseFloat(contextMenu.style.left), window.innerWidth - rect.width - 8) + 'px';
      contextMenu.style.top = Math.min(parseFloat(contextMenu.style.top), window.innerHeight - rect.height - 8) + 'px';
    });
  });
})();
