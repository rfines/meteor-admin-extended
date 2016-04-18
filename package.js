Package.describe({
  name: "robfines:meteor-admin-extended",
  summary: "A complete admin dashboard solution",
  version: "1.0.6",
  git: "https://github.com/rfines/meteor-admin-extended.git"
});

Package.on_use(function(api){

  both = ['client','server']

  api.versionsFrom('METEOR@1.1.0.3');
  api.use(
    ['iron:router@1.0.9',
    'underscore',
    'reactive-var',
    'check',
    'aldeed:collection2@2.5.0',
    'aldeed:autoform@4.2.2',
    'aldeed:template-extension@3.4.3',
    'alanning:roles@1.2.13',
    'raix:handlebar-helpers@0.2.5',
    'reywood:publish-composite@1.4.2',
    'momentjs:moment@2.10.6',
    'aldeed:tabular@1.4.0',
    'meteorhacks:unblock@1.1.0',
    'zimme:active-route@2.3.2',
    'mfactory:admin-lte@0.0.2'
    ],
    both);

  api.use(['less@1.0.0 || 2.5.0','session','jquery','templating'],'client')

  api.use(['email'],'server')

  api.add_files([
    'lib/both/AdminDashboard.js',
    'lib/both/router.js',
    'lib/both/utils.js',
    'lib/both/startup.js',
    'lib/both/collections.js'
    ], both);

  api.add_files([
    'lib/client/html/admin_templates.html',
    'lib/client/html/admin_widgets.html',
    'lib/client/html/admin_layouts.html',
    'lib/client/html/admin_sidebar.html',
    'lib/client/html/admin_header.html',
    'lib/client/css/admin-custom.less',
    'lib/client/js/admin_layout.js',
    'lib/client/js/helpers.js',
    'lib/client/js/templates.js',
    'lib/client/js/events.js',
    'lib/client/js/slim_scroll.js',
    'lib/client/js/autoForm.js'
    ], 'client');

  api.add_files([
    'lib/server/publish.js',
    'lib/server/methods.js'
    ], 'server');

  api.export('AdminDashboard',both)
});

