
module.exports = {
  name: 'Git Kanban Enhanced Self Hosted',
  version: '0.0.2',
  description: 'Kanban extensions for self hosted github, gitlab, bitbucket, and gitea',
  author: "http://github.com/lastlink",
  manifest_version: 2,
  icons: { '16': 'icons/16.png', '128': 'icons/128.png' },
  homepage_url: "https://github.com/funktechno/git-kanban-enhanced-chrome-extension",
  permissions: [
    '<all_urls>',
    '*://*/*',
    'activeTab',
    'tabs',
    'cookies',
    'background',
    'contextMenus',
    'unlimitedStorage',
    'storage',
    'notifications',
    'identity',
    'identity.email'
  ],
  browser_action: {
    default_title: 'title',
    default_popup: 'pages/popup.html'
  },
  background: {
    persistent: false,
    page: 'pages/background.html'
  },
  devtools_page: 'pages/devtools.html',
  options_page: 'pages/options.html',
  content_scripts: [{
    js: [ 'js/inject.js' ],
    run_at: 'document_end',
    matches: ['<all_urls>'],
    all_frames: true
  }],
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: [ 'panel.html', 'js/content.js' ]
}