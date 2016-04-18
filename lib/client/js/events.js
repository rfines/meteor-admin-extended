Template.AdminLayout.events({
  'click .btn-delete': function(e, t) {
    var _id;
    _id = $(e.target).attr('doc');
    if (Session.equals('admin_collection_name', 'Users')) {
      Session.set('admin_id', _id);
      return Session.set('admin_doc', Meteor.users.findOne(_id));
    } else {
      Session.set('admin_id', parseID(_id));
      return Session.set('admin_doc', adminCollectionObject(Session.get('admin_collection_name')).findOne(parseID(_id)));
    }
  }
});

Template.AdminDeleteModal.events({
  'click #confirm-delete': function() {
    var _id, collection;
    collection = Session.get('admin_collection_name');
    _id = Session.get('admin_id');
    return Meteor.call('adminRemoveDoc', collection, _id, function(e, r) {
      return $('#admin-delete-modal').modal('hide');
    });
  }
});

Template.AdminDashboardUsersEdit.events({
  'click .btn-add-role': function(e, t) {
    console.log('adding user');
    return Meteor.call('adminAddUserToRole', $(e.target).attr('user'), $(e.target).attr('role'));
  },
  'click .btn-remove-role': function(e, t) {
    console.log('removing user');
    return Meteor.call('adminRemoveUserToRole', $(e.target).attr('user'), $(e.target).attr('role'));
  }
});

Template.AdminHeader.events({
  'click .btn-sign-out': function() {
    return Meteor.logout(function() {
      return Router.go((typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.logoutRedirect : void 0) || '/');
    });
  }
});
