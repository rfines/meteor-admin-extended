this.AdminController = RouteController.extend({
  layoutTemplate: 'AdminLayout',
  waitOn: function() {
    var customSubscriptions;
    customSubscriptions = _.reduce(typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections : void 0, function(subscriptions, collection) {
      if (collection.countSubscription) {
        subscriptions.push(collection.countSubscription());
      }
      return subscriptions;
    }, []);
    return _.union([Meteor.subscribe('adminUsers'), Meteor.subscribe('adminUser'), Meteor.subscribe('adminCollectionsCount')], customSubscriptions);
  },
  onBeforeAction: function() {
    Session.set('adminSuccess', null);
    Session.set('adminError', null);
    Session.set('admin_title', '');
    Session.set('admin_subtitle', '');
    Session.set('admin_collection_page', null);
    Session.set('admin_collection_name', null);
    Session.set('admin_id', null);
    Session.set('admin_doc', null);
    if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      Meteor.call('adminCheckAdmin');
      if (typeof (typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.nonAdminRedirectRoute : void 0) === 'string') {
        Router.go(AdminConfig.nonAdminRedirectRoute);
      }
    }
    return this.next();
  }
});

Router.route("adminDashboard", {
  path: "/admin",
  template: "AdminDashboard",
  controller: "AdminController",
  action: function() {
    return this.render();
  },
  onAfterAction: function() {
    Session.set('admin_title', 'Dashboard');
    Session.set('admin_collection_name', '');
    return Session.set('admin_collection_page', '');
  }
});

Router.route("adminDashboardUsersView", {
  path: "/admin/Users",
  template: "AdminDashboardView",
  controller: "AdminController",
  action: function() {
    return this.render();
  },
  data: function() {
    return {
      admin_table: AdminTables.Users
    };
  },
  onAfterAction: function() {
    Session.set('admin_title', 'Users');
    Session.set('admin_subtitle', 'View');
    return Session.set('admin_collection_name', 'Users');
  }
});

Router.route("adminDashboardUsersNew", {
  path: "/admin/Users/new",
  template: "AdminDashboardUsersNew",
  controller: 'AdminController',
  action: function() {
    return this.render();
  },
  onAfterAction: function() {
    Session.set('admin_title', 'Users');
    Session.set('admin_subtitle', 'Create new user');
    Session.set('admin_collection_page', 'New');
    return Session.set('admin_collection_name', 'Users');
  }
});

Router.route("adminDashboardUsersEdit", {
  path: "/admin/Users/:_id/edit",
  template: "AdminDashboardUsersEdit",
  controller: "AdminController",
  data: function() {
    return {
      user: Meteor.users.find(this.params._id).fetch(),
      roles: Roles.getRolesForUser(this.params._id),
      otherRoles: _.difference(_.map(Meteor.roles.find().fetch(), function(role) {
        return role.name;
      }), Roles.getRolesForUser(this.params._id))
    };
  },
  action: function() {
    return this.render();
  },
  onAfterAction: function() {
    Session.set('admin_title', 'Users');
    Session.set('admin_subtitle', 'Edit user ' + this.params._id);
    Session.set('admin_collection_page', 'edit');
    Session.set('admin_collection_name', 'Users');
    Session.set('admin_id', this.params._id);
    return Session.set('admin_doc', Meteor.users.findOne({
      _id: this.params._id
    }));
  }
});
